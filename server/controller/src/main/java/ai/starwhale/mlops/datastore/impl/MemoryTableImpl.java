/*
 * Copyright 2022 Starwhale, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package ai.starwhale.mlops.datastore.impl;

import ai.starwhale.mlops.datastore.ColumnSchema;
import ai.starwhale.mlops.datastore.ColumnStatistics;
import ai.starwhale.mlops.datastore.ColumnType;
import ai.starwhale.mlops.datastore.MemoryTable;
import ai.starwhale.mlops.datastore.OrderByDesc;
import ai.starwhale.mlops.datastore.ParquetConfig;
import ai.starwhale.mlops.datastore.RecordResult;
import ai.starwhale.mlops.datastore.TableMeta;
import ai.starwhale.mlops.datastore.TableQueryFilter;
import ai.starwhale.mlops.datastore.TableSchema;
import ai.starwhale.mlops.datastore.TableSchemaDesc;
import ai.starwhale.mlops.datastore.Wal;
import ai.starwhale.mlops.datastore.WalManager;
import ai.starwhale.mlops.datastore.parquet.SwParquetReaderBuilder;
import ai.starwhale.mlops.datastore.parquet.SwParquetWriterBuilder;
import ai.starwhale.mlops.datastore.parquet.SwReadSupport;
import ai.starwhale.mlops.datastore.parquet.SwWriter;
import ai.starwhale.mlops.datastore.type.BaseValue;
import ai.starwhale.mlops.datastore.type.BoolValue;
import ai.starwhale.mlops.datastore.type.Float64Value;
import ai.starwhale.mlops.datastore.type.FloatValue;
import ai.starwhale.mlops.datastore.type.Int64Value;
import ai.starwhale.mlops.datastore.type.IntValue;
import ai.starwhale.mlops.datastore.type.StringValue;
import ai.starwhale.mlops.exception.SwProcessException;
import ai.starwhale.mlops.exception.SwProcessException.ErrorType;
import ai.starwhale.mlops.exception.SwValidationException;
import ai.starwhale.mlops.storage.StorageAccessService;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.util.JsonFormat;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
import java.util.TreeMap;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.hadoop.conf.Configuration;

@Slf4j
public class MemoryTableImpl implements MemoryTable {

    private static final String TIMESTAMP_COLUMN_NAME = "^";

    static final String DELETED_FLAG_COLUMN_NAME = "-";

    static final Pattern ATTRIBUTE_NAME_PATTERN = Pattern.compile("^[\\p{Alnum}_]+$");

    private final String tableName;

    private final WalManager walManager;
    private final StorageAccessService storageAccessService;
    private final String dataPathPrefix;
    private final SimpleDateFormat dataPathSuffixFormat = new SimpleDateFormat("yyMMddHHmmss.SSS");
    private final ParquetConfig parquetConfig;

    @Getter
    private TableSchema schema = new TableSchema();

    private final Map<String, ColumnStatistics> statisticsMap = new HashMap<>();

    @Getter
    private long firstWalLogId = -1;

    private long lastWalLogId = -1;

    @Getter
    private long lastUpdateTime = 0;

    private final TreeMap<BaseValue, List<MemoryRecord>> recordMap = new TreeMap<>();

    private final Lock lock = new ReentrantLock();

    public MemoryTableImpl(String tableName,
            WalManager walManager,
            StorageAccessService storageAccessService,
            String dataPathPrefix,
            ParquetConfig parquetConfig) {
        this.tableName = tableName;
        this.walManager = walManager;
        this.storageAccessService = storageAccessService;
        this.parquetConfig = parquetConfig;
        this.dataPathPrefix = dataPathPrefix;
        this.dataPathSuffixFormat.setTimeZone(TimeZone.getTimeZone("GMT"));
        this.load();
    }

    private void load() {
        Set<String> paths;
        try {
            paths = this.storageAccessService.list(dataPathPrefix).collect(Collectors.toSet());
        } catch (IOException e) {
            throw new SwProcessException(ErrorType.DATASTORE, "failed to load " + this.tableName, e);
        }

        while (!paths.isEmpty()) {
            var path = paths.stream().max(Comparator.naturalOrder()).orElse(null);
            try {
                var conf = new Configuration();
                try (var reader = new SwParquetReaderBuilder(this.storageAccessService, path).withConf(conf).build()) {
                    for (; ; ) {
                        var record = reader.read();
                        if (this.schema.getKeyColumn() == null) {
                            this.schema = TableSchema.fromJsonString(conf.get(SwReadSupport.SCHEMA_KEY));
                            var metaBuilder = TableMeta.MetaData.newBuilder();
                            try {
                                JsonFormat.parser().merge(conf.get(SwReadSupport.META_DATA_KEY), metaBuilder);
                            } catch (InvalidProtocolBufferException e) {
                                throw new SwProcessException(ErrorType.DATASTORE, "failed to parse metadata", e);
                            }
                            var metadata = metaBuilder.build();
                            this.lastWalLogId = metadata.getLastWalLogId();
                            this.lastUpdateTime = metadata.getLastUpdateTime();
                        }
                        if (record == null) {
                            break;
                        }
                        var key = record.remove(this.schema.getKeyColumn());
                        var timestamp = (Int64Value) record.remove(TIMESTAMP_COLUMN_NAME);
                        var deletedFlag = (BoolValue) record.remove(DELETED_FLAG_COLUMN_NAME);
                        this.recordMap.computeIfAbsent(key, k -> new ArrayList<>())
                                .add(MemoryRecord.builder()
                                        .timestamp(timestamp.getValue())
                                        .deleted(deletedFlag.isValue())
                                        .values(record)
                                        .build());
                    }
                }
                break;
            } catch (SwValidationException e) {
                log.warn("fail to load table:{} with path:{}, because it is invalid, try to load previous file again.",
                        this.tableName, path);
                paths.remove(path);
            } catch (RuntimeException | IOException e) {
                throw new SwProcessException(ErrorType.DATASTORE, "failed to load " + this.tableName, e);
            }
        }

    }

    @Override
    public void save() throws IOException {
        String metadata;
        try {
            metadata = JsonFormat.printer().print(TableMeta.MetaData.newBuilder()
                    .setLastWalLogId(this.lastWalLogId)
                    .setLastUpdateTime(this.lastUpdateTime)
                    .build());
        } catch (InvalidProtocolBufferException e) {
            throw new SwProcessException(ErrorType.DATASTORE, "failed to print table meta", e);
        }
        var columnSchema = new HashMap<String, ColumnSchema>();
        int index = 0;
        for (var entry : new TreeMap<>(this.statisticsMap).entrySet()) {
            columnSchema.put(entry.getKey(), entry.getValue().createSchema(entry.getKey(), index++));
        }
        var timestampColumnSchema = new ColumnSchema(TIMESTAMP_COLUMN_NAME, index++);
        timestampColumnSchema.setType(ColumnType.INT64);
        var deletedFlagColumnSchema = new ColumnSchema(DELETED_FLAG_COLUMN_NAME, index);
        deletedFlagColumnSchema.setType(ColumnType.BOOL);
        columnSchema.put(TIMESTAMP_COLUMN_NAME, timestampColumnSchema);
        columnSchema.put(DELETED_FLAG_COLUMN_NAME, deletedFlagColumnSchema);

        try {
            SwWriter.writeWithBuilder(
                    new SwParquetWriterBuilder(this.storageAccessService,
                            columnSchema,
                            this.schema.toJsonString(),
                            metadata,
                            this.dataPathPrefix + this.dataPathSuffixFormat.format(new Date()),
                            this.parquetConfig),
                    this.recordMap.entrySet().stream()
                            .map(entry -> {
                                var list = new ArrayList<Map<String, BaseValue>>();
                                for (var record : entry.getValue()) {
                                    var recordMap = new HashMap<String, BaseValue>();
                                    if (record.getValues() != null) {
                                        recordMap.putAll(record.getValues());
                                    }
                                    recordMap.put(this.schema.getKeyColumn(), entry.getKey());
                                    recordMap.put(TIMESTAMP_COLUMN_NAME, new Int64Value(record.getTimestamp()));
                                    recordMap.put(DELETED_FLAG_COLUMN_NAME, BaseValue.valueOf(record.isDeleted()));
                                    list.add(recordMap);
                                }
                                return list;
                            }).flatMap(Collection::stream).iterator());
        } catch (Throwable e) {
            log.error("fail to save table:{}, error:{}", this.tableName, e.getMessage(), e);
            throw e;
        }
        this.firstWalLogId = -1;
    }

    @Override
    public void lock() {
        this.lock.lock();
    }

    @Override
    public void unlock() {
        this.lock.unlock();
    }

    @Override
    public void updateFromWal(Wal.WalEntry entry) {
        if (entry.getId() <= this.lastWalLogId) {
            return;
        }
        if (entry.hasTableSchema()) {
            this.schema.update(entry.getTableSchema());
        }
        var recordList = entry.getRecordsList();
        if (!recordList.isEmpty()) {
            this.insertRecords(entry.getTimestamp(),
                    recordList.stream()
                            .map(r -> WalRecordDecoder.decodeRecord(this.schema, r))
                            .collect(Collectors.toList()));
        }
        if (this.firstWalLogId < 0) {
            this.firstWalLogId = entry.getId();
        }
        this.lastWalLogId = entry.getId();
    }

    @Override
    public long update(TableSchemaDesc schema, @NonNull List<Map<String, Object>> records) {
        var decodedRecords = new ArrayList<Map<String, BaseValue>>();
        String keyColumn;
        if (schema.getKeyColumn() == null) {
            if (this.schema.getKeyColumn() == null) {
                throw new SwValidationException(SwValidationException.ValidSubject.DATASTORE,
                        "no key column in schema " + schema);
            }
            keyColumn = this.schema.getKeyColumn();
        } else {
            keyColumn = schema.getKeyColumn();
        }
        for (var record : records) {
            Map<String, BaseValue> decodedRecord;
            try {
                decodedRecord = RecordDecoder.decodeRecord(schema, record);
            } catch (Exception e) {
                throw new SwValidationException(SwValidationException.ValidSubject.DATASTORE,
                        "failed to decode record " + record, e);
            }
            var key = decodedRecord.get(keyColumn);
            if (key == null) {
                throw new SwValidationException(SwValidationException.ValidSubject.DATASTORE,
                        "no key column in record " + record);
            }
            if (key instanceof List || key instanceof Map) {
                throw new SwValidationException(SwValidationException.ValidSubject.DATASTORE,
                        "invalid key type " + key.getClass() + ". record: " + record);
            }
            decodedRecords.add(decodedRecord);
        }
        var timestamp = System.currentTimeMillis();
        var logEntryBuilder = Wal.WalEntry.newBuilder()
                .setEntryType(Wal.WalEntry.Type.UPDATE)
                .setTableName(this.tableName)
                .setTimestamp(timestamp);
        var logSchemaBuilder = this.schema.getDiff(schema);
        if (logSchemaBuilder != null) {
            logEntryBuilder.setTableSchema(logSchemaBuilder);
        }
        TableSchema recordSchema;
        if (logSchemaBuilder == null) {
            recordSchema = this.schema;
        } else {
            recordSchema = new TableSchema(this.schema);
            recordSchema.update(logSchemaBuilder.build());
        }
        for (var record : decodedRecords) {
            logEntryBuilder.addRecords(WalRecordEncoder.encodeRecord(recordSchema, record));
        }
        this.lastWalLogId = this.walManager.append(logEntryBuilder);
        if (this.firstWalLogId < 0) {
            this.firstWalLogId = this.lastWalLogId;
        }
        this.lastUpdateTime = System.currentTimeMillis();
        this.schema = recordSchema;
        if (!decodedRecords.isEmpty()) {
            this.insertRecords(timestamp, decodedRecords);
        }

        return timestamp;
    }

    private void insertRecords(long timestamp, List<Map<String, BaseValue>> records) {
        for (var record : records) {
            var newRecord = new HashMap<>(record);
            var key = newRecord.remove(this.schema.getKeyColumn());
            this.statisticsMap.computeIfAbsent(this.schema.getKeyColumn(), k -> new ColumnStatistics()).update(key);
            var deletedFlag = newRecord.remove(DELETED_FLAG_COLUMN_NAME) != null;
            var versions = this.recordMap.computeIfAbsent(key, k -> new ArrayList<>());
            if (deletedFlag) {
                if (versions.isEmpty() || !versions.get(versions.size() - 1).isDeleted()) {
                    versions.add(MemoryRecord.builder()
                            .timestamp(timestamp)
                            .deleted(true)
                            .build());
                }
            } else {
                var old = this.getRecordMap(key, versions, timestamp);
                for (var it = newRecord.entrySet().iterator(); it.hasNext(); ) {
                    var entry = it.next();
                    if (old.containsKey(entry.getKey())) {
                        var oldValue = old.get(entry.getKey());
                        if (BaseValue.compare(oldValue, entry.getValue()) == 0) {
                            it.remove();
                        }
                    }
                }
                if (versions.isEmpty() || !newRecord.isEmpty()) {
                    versions.add(MemoryRecord.builder()
                            .timestamp(timestamp)
                            .values(newRecord)
                            .build());
                }
                for (var entry : newRecord.entrySet()) {
                    this.statisticsMap.computeIfAbsent(entry.getKey(), k -> new ColumnStatistics())
                            .update(entry.getValue());
                }
            }
        }
    }

    private Map<String, BaseValue> getRecordMap(BaseValue key, List<MemoryRecord> versions, long timestamp) {
        var ret = new HashMap<String, BaseValue>();
        boolean deleted = false;
        boolean hasVersion = false;
        for (var record : versions) {
            if (record.getTimestamp() <= timestamp) {
                // record may be empty, use hasVersion to mark if there is a record
                hasVersion = true;
                if (record.isDeleted()) {
                    deleted = true;
                    ret.clear();
                } else {
                    deleted = false;
                    ret.putAll(record.getValues());
                }
            }
        }
        if (deleted) {
            ret.put(DELETED_FLAG_COLUMN_NAME, BoolValue.TRUE);
        }

        if (hasVersion) {
            ret.put(this.schema.getKeyColumn(), key);
        }
        return ret;
    }

    @Override
    public Iterator<RecordResult> query(
            long timestamp,
            @NonNull Map<String, String> columns,
            List<OrderByDesc> orderBy,
            TableQueryFilter filter,
            boolean keepNone,
            boolean rawResult) {
        if (this.schema.getKeyColumn() == null) {
            return Collections.emptyIterator();
        }
        if (orderBy != null) {
            for (var col : orderBy) {
                if (col == null) {
                    throw new SwValidationException(SwValidationException.ValidSubject.DATASTORE,
                            "order by column should not be null");
                }
                var colSchema = this.schema.getColumnSchemaByName(col.getColumnName());
                if (colSchema == null) {
                    throw new SwValidationException(SwValidationException.ValidSubject.DATASTORE,
                            "unknown orderBy column " + col);
                }
            }
        }
        if (filter != null) {
            this.checkFilter(filter);
        }
        var stream = this.recordMap.entrySet().stream()
                .map(entry -> this.getRecordMap(entry.getKey(), entry.getValue(), timestamp))
                .filter(record -> filter == null || this.match(filter, record));
        if (orderBy != null) {
            stream = stream.sorted((a, b) -> {
                for (var col : orderBy) {
                    var result = BaseValue.compare(
                            a.get(col.getColumnName()),
                            b.get(col.getColumnName()));
                    if (result != 0) {
                        if (col.isDescending()) {
                            return -result;
                        }
                        return result;
                    }
                }
                return 0;
            });
        }
        return stream.map(record -> this.toRecordResult(record, columns, keepNone)).iterator();
    }


    @Override
    public Iterator<RecordResult> scan(
            long timestamp,
            @NonNull Map<String, String> columns,
            String start,
            String startType,
            boolean startInclusive,
            String end,
            String endType,
            boolean endInclusive,
            boolean keepNone) {
        if (this.schema.getKeyColumn() == null) {
            return Collections.emptyIterator();
        }
        if (this.recordMap.isEmpty()) {
            return Collections.emptyIterator();
        }
        BaseValue startKey;
        BaseValue endKey;
        if (start == null) {
            startKey = this.recordMap.firstKey();
            startInclusive = true;
        } else {
            ColumnType startKeyType;
            if (startType == null) {
                startKeyType = this.schema.getColumnSchemaByName(this.schema.getKeyColumn()).getType();
            } else {
                try {
                    startKeyType = ColumnType.valueOf(startType);
                } catch (Exception e) {
                    throw new SwValidationException(SwValidationException.ValidSubject.DATASTORE,
                            "invalid startType " + startType, e);
                }
            }
            try {
                startKey = RecordDecoder.decodeScalar(startKeyType, start);
            } catch (Exception e) {
                throw new SwValidationException(SwValidationException.ValidSubject.DATASTORE,
                        "invalid start " + start, e);
            }
        }
        if (end == null) {
            endKey = this.recordMap.lastKey();
            endInclusive = true;
        } else {
            ColumnType endKeyType;
            if (endType == null) {
                endKeyType = this.schema.getColumnSchemaByName(this.schema.getKeyColumn()).getType();
            } else {
                try {
                    endKeyType = ColumnType.valueOf(endType);
                } catch (Exception e) {
                    throw new SwValidationException(SwValidationException.ValidSubject.DATASTORE,
                            "invalid endType " + endType, e);
                }
            }
            try {
                endKey = RecordDecoder.decodeScalar(endKeyType, end);
            } catch (Exception e) {
                throw new SwValidationException(SwValidationException.ValidSubject.DATASTORE,
                        "invalid end " + end, e);
            }
        }
        if (startKey.compareTo(endKey) > 0) {
            return Collections.emptyIterator();
        }
        var iterator = this.recordMap.subMap(startKey, startInclusive, endKey, endInclusive).entrySet().stream()
                .map(entry -> this.getRecordMap(entry.getKey(), entry.getValue(), timestamp))
                .filter(record -> !record.isEmpty())
                .iterator();
        return new Iterator<>() {

            @Override
            public boolean hasNext() {
                return iterator.hasNext();
            }

            @Override
            public RecordResult next() {
                return toRecordResult(iterator.next(), columns, keepNone);
            }
        };
    }

    private boolean match(TableQueryFilter filter, Map<String, BaseValue> record) {
        switch (filter.getOperator()) {
            case NOT:
                return !this.match((TableQueryFilter) filter.getOperands().get(0), record);
            case AND:
                for (Object operand : filter.getOperands()) {
                    if (!this.match((TableQueryFilter) operand, record)) {
                        return false;
                    }
                }
                return true;
            case OR:
                for (Object operand : filter.getOperands()) {
                    if (this.match((TableQueryFilter) operand, record)) {
                        return true;
                    }
                }
                return false;
            default:
                var v1 = this.getValue(filter.getOperands().get(0), record);
                var v2 = this.getValue(filter.getOperands().get(1), record);
                if (v1 instanceof StringValue || v2 instanceof StringValue) {
                    if (v1 instanceof StringValue) {
                        v1 = this.convertStringToOtherType((StringValue) v1, v2);
                    } else {
                        v2 = this.convertStringToOtherType((StringValue) v2, v1);
                    }
                }
                var result = BaseValue.compare(v1, v2);
                switch (filter.getOperator()) {
                    case EQUAL:
                        return result == 0;
                    case LESS:
                        return result < 0;
                    case LESS_EQUAL:
                        return result <= 0;
                    case GREATER:
                        return result > 0;
                    case GREATER_EQUAL:
                        return result >= 0;
                    default:
                        throw new IllegalArgumentException("Unexpected value: " + filter.getOperator());
                }
        }
    }

    private BaseValue convertStringToOtherType(StringValue value, BaseValue other) {
        var v = value.getValue();
        if (other instanceof BoolValue) {
            if (v.equalsIgnoreCase("true")) {
                return BoolValue.TRUE;
            }
            if (v.equalsIgnoreCase("false")) {
                return BoolValue.FALSE;
            }
        }
        try {
            if (other instanceof IntValue) {
                return new Int64Value(Long.parseLong(v));
            }
            if (other instanceof FloatValue) {
                return new Float64Value(Double.parseDouble(v));
            }
        } catch (NumberFormatException e) {
            // just ignore it
        }
        return value;

    }

    private BaseValue getValue(Object operand, Map<String, BaseValue> record) {
        if (operand instanceof TableQueryFilter.Column) {
            return record.get(((TableQueryFilter.Column) operand).getName());
        } else if (operand instanceof TableQueryFilter.Constant) {
            return BaseValue.valueOf(((TableQueryFilter.Constant) operand).getValue());
        } else {
            throw new IllegalArgumentException("invalid operand type " + operand.getClass());
        }
    }

    private void checkFilter(TableQueryFilter filter) {
        switch (filter.getOperator()) {
            case NOT:
            case AND:
            case OR:
                for (var op : filter.getOperands()) {
                    this.checkFilter((TableQueryFilter) op);
                }
                break;
            case EQUAL:
            case LESS:
            case LESS_EQUAL:
            case GREATER:
            case GREATER_EQUAL:
                break;
            default:
                throw new IllegalArgumentException("Unexpected operator: " + filter.getOperator());
        }
    }

    private RecordResult toRecordResult(Map<String, BaseValue> record,
            Map<String, String> columnMapping,
            boolean keepNone) {
        var key = record.get(this.schema.getKeyColumn());
        if (record.get(DELETED_FLAG_COLUMN_NAME) != null) {
            return new RecordResult(key, true, null);
        }
        var r = new HashMap<String, BaseValue>();
        for (var entry : columnMapping.entrySet()) {
            var column = entry.getKey();
            if (record.containsKey(column)) {
                var value = record.get(column);
                if (keepNone || value != null) {
                    r.put(entry.getValue(), value);
                }
            }
        }
        return new RecordResult(key, false, r);
    }
}
