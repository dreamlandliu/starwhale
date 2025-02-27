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

package ai.starwhale.mlops.api.protocol.dataset.dataloader;

import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DataConsumptionRequest {
    private String sessionId;
    private String consumerId;
    /**
     * Whether serial under the same consumer
     */
    private boolean isSerial = false;

    private int batchSize;

    private String start;
    private boolean startInclusive = true;
    private String end;
    private boolean endInclusive;

    private List<DataIndexDesc> processedData;
}
