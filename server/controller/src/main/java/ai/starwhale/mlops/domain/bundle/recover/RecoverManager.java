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

package ai.starwhale.mlops.domain.bundle.recover;

import ai.starwhale.mlops.domain.bundle.base.BundleEntity;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class RecoverManager {

    private final RecoverAccessor recoverAccessor;

    private RecoverManager(RecoverAccessor recoverAccessor) {
        this.recoverAccessor = recoverAccessor;
    }

    public static RecoverManager create(RecoverAccessor recoverAccessor) {
        return new RecoverManager(recoverAccessor);
    }

    public Boolean recoverBundle(Long projectId, Long bundleId) throws RecoverException {
        BundleEntity entity = recoverAccessor.findDeletedBundleById(bundleId);
        if (entity == null) {
            throw new RecoverException(String.format("Recover error. Bundle can not be found by id [%s]. ", bundleId));
        }
        String name = entity.getName();

        // Check for duplicate names
        if (recoverAccessor.findByNameForUpdate(name, projectId) != null) {
            throw new RecoverException(String.format("Recover error. Model %s already exists.", name));
        }

        Boolean res = recoverAccessor.recover(bundleId);
        log.info("Bundle has been recovered. Name={}", name);
        return res;
    }
}
