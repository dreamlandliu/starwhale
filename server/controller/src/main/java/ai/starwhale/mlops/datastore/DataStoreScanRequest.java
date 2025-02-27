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

package ai.starwhale.mlops.datastore;

import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataStoreScanRequest {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TableInfo {

        private String tableName;
        // timestamp in milliseconds, used to filter out the data that is older than the timestamp for this table
        private long timestamp;
        private String columnPrefix;
        private Map<String, String> columns;
        private boolean keepNone;
    }

    private List<TableInfo> tables;
    // timestamp in milliseconds, used to filter out the data that is older than the timestamp for all tables
    private long timestamp;
    private String start;
    private String startType;
    @Builder.Default
    private boolean startInclusive = true;
    private String end;
    private String endType;
    private boolean endInclusive;
    @Builder.Default
    private int limit = -1;
    private boolean keepNone;
    private boolean rawResult;
    private boolean ignoreNonExistingTable;
    private boolean encodeWithType;
}
