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

package ai.starwhale.mlops.domain.dataset.upload;

import ai.starwhale.mlops.domain.dataset.bo.DatasetVersion;
import ai.starwhale.mlops.domain.dataset.upload.bo.DatasetVersionWithMeta;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class HotDatasetHolder {

    Map<Long, DatasetVersionWithMeta> datasetHolder;

    final DatasetVersionWithMetaConverter datasetVersionWithMetaConverter;

    public HotDatasetHolder(DatasetVersionWithMetaConverter datasetVersionWithMetaConverter) {
        this.datasetVersionWithMetaConverter = datasetVersionWithMetaConverter;
        this.datasetHolder = new ConcurrentHashMap<>();
    }

    public void manifest(DatasetVersion datasetVersion) {
        datasetHolder.put(datasetVersion.getId(),
                datasetVersionWithMetaConverter.from(datasetVersion));
    }

    public void cancel(Long datasetId) {
        datasetHolder.remove(datasetId);
    }

    public void end(Long datasetId) {
        datasetHolder.remove(datasetId);
    }

    public Optional<DatasetVersionWithMeta> of(Long id) {
        return Optional.ofNullable(datasetHolder.get(id));
    }

}
