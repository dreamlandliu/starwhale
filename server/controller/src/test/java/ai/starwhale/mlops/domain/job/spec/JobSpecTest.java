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

package ai.starwhale.mlops.domain.job.spec;

import ai.starwhale.mlops.domain.runtime.RuntimeResource;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class JobSpecTest {

    static final String YAML = "default:\n"
            + "- cls_name: ''\n"
            + "  concurrency: 1\n"
            + "  job_name: default\n"
            + "  needs: []\n"
            + "  resources:\n"
            + "  - type: \"cpu\"\n"
            + "    request: 1\n"
            + "    limit: 1\n"
            + "  name: ppl\n"
            + "  task_num: 1\n"
            + "- cls_name: ''\n"
            + "  concurrency: 1\n"
            + "  job_name: default\n"
            + "  needs:\n"
            + "  - ppl\n"
            + "  resources:\n"
            + "  - type: \"cpu\"\n"
            + "    request: 1\n"
            + "    limit: 1\n"
            + "  name: cmp\n"
            + "  task_num: 1\n";

    static final String YAML1 = "- cls_name: ''\n"
            + "  concurrency: 1\n"
            + "  job_name: default\n"
            + "  needs: []\n"
            + "  resources:\n"
            + "  - type: \"cpu\"\n"
            + "    request: 1\n"
            + "    limit: 1\n"
            + "  name: ppl\n"
            + "  task_num: 1\n"
            + "- cls_name: ''\n"
            + "  concurrency: 1\n"
            + "  job_name: default\n"
            + "  needs:\n"
            + "  - ppl\n"
            + "  resources:\n"
            + "  - type: \"cpu\"\n"
            + "    request: 1\n"
            + "    limit: 1\n"
            + "  name: cmp\n"
            + "  task_num: 1\n";

    static final String YAML2 = "---\n"
            + "default:\n"
            + "- concurrency: 1\n"
            + "  needs: []\n"
            + "  resources:\n"
            + "  - type: \"cpu\"\n"
            + "    request: 1.0\n"
            + "    limit: 1.0\n"
            + "  job_name: \"default\"\n"
            + "  name: \"ppl\"\n"
            + "  task_num: 1\n"
            + "- concurrency: 1\n"
            + "  needs:\n"
            + "  - \"ppl\"\n"
            + "  resources:\n"
            + "  - type: \"cpu\"\n"
            + "    request: 1.0\n"
            + "    limit: 1.0\n"
            + "  job_name: \"default\"\n"
            + "  name: \"cmp\"\n"
            + "  task_num: 1\n";

    static final String YAML3 = "---\n"
            + "- concurrency: 1\n"
            + "  needs: []\n"
            + "  resources:\n"
            + "  - type: \"cpu\"\n"
            + "    request: 1.0\n"
            + "    limit: 1.0\n"
            + "  job_name: \"default\"\n"
            + "  name: \"ppl\"\n"
            + "  task_num: 1\n"
            + "- concurrency: 1\n"
            + "  needs:\n"
            + "  - \"ppl\"\n"
            + "  resources:\n"
            + "  - type: \"cpu\"\n"
            + "    request: 1.0\n"
            + "    limit: 1.0\n"
            + "  job_name: \"default\"\n"
            + "  name: \"cmp\"\n"
            + "  task_num: 1\n";

    private JobSpecParser jobSpecParser;

    @BeforeEach
    public void setUp() {
        jobSpecParser = new JobSpecParser();
    }

    @Test
    public void testReadFromYaml1() throws JsonProcessingException {
        validSteps(jobSpecParser.parseStepFromYaml(YAML));
        validSteps(jobSpecParser.parseStepFromYaml(YAML1));
        validSteps(jobSpecParser.parseStepFromYaml(YAML2));
        validSteps(jobSpecParser.parseStepFromYaml(YAML3));
    }

    private void validSteps(List<StepSpec> steps) {
        Assertions.assertEquals(2, steps.size());
        StepSpec pplStep = steps.get(0);
        Assertions.assertEquals(StepSpec.builder()
                .jobName("default")
                .needs(List.of())
                .resources(List.of(new RuntimeResource("cpu", 1f, 1f)))
                .name("ppl")
                .taskNum(1)
                .concurrency(1)
                .build(), pplStep);
        StepSpec cmpStep = steps.get(1);
        Assertions.assertEquals(StepSpec.builder()
                .jobName("default")
                .needs(List.of("ppl"))
                .resources(List.of(new RuntimeResource("cpu", 1f, 1f)))
                .name("cmp")
                .taskNum(1)
                .concurrency(1)
                .build(), cmpStep);
    }

    @Test
    public void testWriteToYaml() throws JsonProcessingException {
        Map<String, List<StepSpec>> map = Map.of("default", List.of(StepSpec.builder()
                .jobName("default")
                .needs(List.of())
                .resources(List.of(new RuntimeResource("cpu", 1f, 1f)))
                .name("ppl")
                .taskNum(1)
                .concurrency(1)
                .build(), StepSpec.builder()
                .jobName("default")
                .needs(List.of("ppl"))
                .resources(List.of(new RuntimeResource("cpu", 1f, 1f)))
                .name("cmp")
                .taskNum(1)
                .concurrency(1)
                .build()
        ));
        Assertions.assertEquals(YAML2, new YAMLMapper().writeValueAsString(map));
        Assertions.assertEquals(YAML3, new YAMLMapper().writeValueAsString(map.get("default")));
    }

}
