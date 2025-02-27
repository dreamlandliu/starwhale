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

package ai.starwhale.mlops.domain.dataset.converter;

import ai.starwhale.mlops.api.protocol.dataset.DatasetVersionVo;
import ai.starwhale.mlops.common.IdConverter;
import ai.starwhale.mlops.common.VersionAliasConverter;
import ai.starwhale.mlops.domain.dataset.po.DatasetVersionEntity;
import ai.starwhale.mlops.exception.ConvertException;
import org.springframework.stereotype.Component;

@Component
public class DatasetVersionVoConverter {

    private final IdConverter idConvertor;
    private final VersionAliasConverter versionAliasConvertor;

    public DatasetVersionVoConverter(IdConverter idConvertor,
            VersionAliasConverter versionAliasConvertor) {
        this.idConvertor = idConvertor;
        this.versionAliasConvertor = versionAliasConvertor;
    }

    public DatasetVersionVo convert(DatasetVersionEntity entity) throws ConvertException {
        return convert(entity, null);
    }

    public DatasetVersionVo convert(DatasetVersionEntity entity, DatasetVersionEntity latest)
            throws ConvertException {
        if (entity == null) {
            return null;
        }
        return DatasetVersionVo.builder()
                .id(idConvertor.convert(entity.getId()))
                .alias(versionAliasConvertor.convert(entity.getVersionOrder(), latest, entity))
                .name(entity.getVersionName())
                .tag(entity.getVersionTag())
                .meta(entity.getVersionMeta())
                .shared(entity.getShared())
                .createdTime(entity.getCreatedTime().getTime())
                .build();
    }

}
