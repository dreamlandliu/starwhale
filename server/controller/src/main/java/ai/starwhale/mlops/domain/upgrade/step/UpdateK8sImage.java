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

package ai.starwhale.mlops.domain.upgrade.step;

import ai.starwhale.mlops.domain.upgrade.UpgradeAccess;
import ai.starwhale.mlops.domain.upgrade.UpgradeService;
import ai.starwhale.mlops.domain.upgrade.bo.Upgrade;
import ai.starwhale.mlops.exception.SwProcessException;
import ai.starwhale.mlops.exception.SwProcessException.ErrorType;
import ai.starwhale.mlops.schedule.k8s.K8sClient;
import cn.hutool.json.JSONArray;
import io.kubernetes.client.custom.V1Patch;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.AppsV1Api;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Deployment;
import io.kubernetes.client.util.ClientBuilder;
import io.kubernetes.client.util.KubeConfig;
import io.kubernetes.client.util.PatchUtils;
import java.io.FileReader;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Order(2)
public class UpdateK8sImage extends UpgradeStepBase {

    private final K8sClient k8sClient;

    public UpdateK8sImage(UpgradeAccess upgradeAccess, K8sClient k8sClient) {
        super(upgradeAccess);
        this.k8sClient = k8sClient;
    }

    @Override
    protected void doStep(Upgrade upgrade) {
        log.info("Update image" + upgrade.toString());

        JSONArray patchJson = new JSONArray(List.of(
                Map.of(
                        "op", "replace",
                        "path", "/spec/template/spec/containers/0/image",
                        "value", Objects.requireNonNull(upgrade.getImage())
                )
        ));
        try {
            k8sClient.patchDeployment(
                    "controller",
                    new V1Patch(patchJson.toString()),
                    V1Patch.PATCH_FORMAT_JSON_PATCH);
        } catch (ApiException e) {
            throw new SwProcessException(ErrorType.K8S, "Update image error.", e);
        }
    }

    @Override
    public boolean isComplete() {
        try {
            return k8sClient.getNotReadyPods(UpgradeService.LABEL_CONTROLLER).isEmpty();
        } catch (ApiException e) {
            throw new SwProcessException(ErrorType.K8S, "Get pods error.", e);
        }
    }

    @Override
    protected String getTitle() {
        return "Update k8s image.";
    }

    @Override
    protected String getContent() {
        return "";
    }


    public static void main(String[] args) throws Exception {

        JSONArray patchJson = new JSONArray(List.of(
                Map.of(
                        "op", "replace",
                        "path", "/spec/template/spec/containers/0/image",
                        "value", "ghcr.io/star-whale/server:0.4.0"
                )
        ));

        String configPath = "\\\\wsl.localhost\\Ubuntu-20.04\\home\\liuyunxi\\.kube\\config";
        ApiClient client = ClientBuilder.kubeconfig(KubeConfig.loadKubeConfig(new FileReader(configPath))).build();
        Configuration.setDefaultApiClient(client);
        CoreV1Api coreV1Api = new CoreV1Api();
        AppsV1Api appsV1Api = new AppsV1Api();

        V1Deployment deployment = PatchUtils.patch(
                V1Deployment.class,
                () -> appsV1Api.patchNamespacedDeploymentCall(
                        "controller",
                        "liuyunxi",
                        new V1Patch(patchJson.toString()),
                        null, null, null, null, null, null),
                V1Patch.PATCH_FORMAT_JSON_PATCH,
                client);

        System.out.println(deployment);
//
//        V1NamespaceList list = coreV1Api.listNamespace(null, false, null, null, null, null, null, null, null,
//                false);
//
////        for (V1Namespace item : list.getItems()) {
////            System.out.println(item.getMetadata().getName());
////        }
//
//        String ns = "liuyunxi";
//        String labelSelector = "starwhale.ai/role=controller";
//        V1PodList pods = coreV1Api.listNamespacedPod(ns, null, null, null, null, labelSelector, null, null, null, 30,
//                null);
//
//        V1DeploymentList v1DeploymentList = appsV1Api.listNamespacedDeployment(ns, null, false, null, null,
//                labelSelector, null,
//                null, null, null, null);
//
//        for (V1Deployment item : v1DeploymentList.getItems()) {
//
//            System.out.println(item);
//        }

    }


}
