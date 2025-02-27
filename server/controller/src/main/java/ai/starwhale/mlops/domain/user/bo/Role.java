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

package ai.starwhale.mlops.domain.user.bo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Role implements GrantedAuthority {

    private Long id;

    private String roleName;

    private String roleCode;

    @Override
    public String getAuthority() {
        return getRoleCode();
    }

    public static final String NAME_OWNER = "Owner";

    public static final String CODE_OWNER = "OWNER";

    public static final String NAME_MAINTAINER = "Maintainer";

    public static final String CODE_MAINTAINER = "MAINTAINER";

    public static final String NAME_GUEST = "Guest";

    public static final String CODE_GUEST = "GUEST";

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o instanceof Role) {
            return getAuthority().equals(((Role) o).getAuthority());
        }
        return false;
    }
}
