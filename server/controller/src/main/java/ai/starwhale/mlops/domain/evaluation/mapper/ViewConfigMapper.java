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

package ai.starwhale.mlops.domain.evaluation.mapper;

import ai.starwhale.mlops.domain.evaluation.po.ViewConfigEntity;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface ViewConfigMapper {

    @Select("select id, config_name, project_id, owner_id, content, created_time, modified_time from view_config"
            + " where config_name = #{name}"
            + " and owner_id = #{userId}"
            + " and project_id = #{projectId}")
    ViewConfigEntity findViewConfig(@Param("userId") Long userId, @Param("projectId") Long projectId,
            @Param("name") String name);

    @Insert("replace  into view_config(config_name, project_id, owner_id, content)"
            + " values (#{configName}, #{projectId}, #{ownerId}, #{content})")
    int createViewConfig(ViewConfigEntity entity);
}
