"use strict";(self.webpackChunkstarwhale_docs=self.webpackChunkstarwhale_docs||[]).push([[6504],{3905:function(e,t,a){a.d(t,{Zo:function(){return u},kt:function(){return m}});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),c=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},u=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),d=c(a),m=r,h=d["".concat(s,".").concat(m)]||d[m]||p[m]||l;return a?n.createElement(h,i(i({ref:t},u),{},{components:a})):n.createElement(h,i({ref:t},u))}));function m(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,i=new Array(l);i[0]=d;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:r,i[1]=o;for(var c=2;c<l;c++)i[c]=a[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},5628:function(e,t,a){a.r(t),a.d(t,{assets:function(){return s},contentTitle:function(){return i},default:function(){return p},frontMatter:function(){return l},metadata:function(){return o},toc:function(){return c}});var n=a(3117),r=(a(7294),a(3905));const l={title:"Cloud \u5feb\u901f\u4e0a\u624b"},i=void 0,o={unversionedId:"quickstart/on-premises",id:"quickstart/on-premises",title:"Cloud \u5feb\u901f\u4e0a\u624b",description:"\u5efa\u8bae\u5148\u9605\u8bfbStandalone\u5feb\u901f\u5165\u95e8\u3002",source:"@site/i18n/zh/docusaurus-plugin-content-docs/current/quickstart/on-premises.md",sourceDirName:"quickstart",slug:"/quickstart/on-premises",permalink:"/zh/docs/quickstart/on-premises",draft:!1,editUrl:"https://github.com/star-whale/starwhale/tree/main/docs/docs/quickstart/on-premises.md",tags:[],version:"current",frontMatter:{title:"Cloud \u5feb\u901f\u4e0a\u624b"},sidebar:"mainSidebar",previous:{title:"Standalone \u5feb\u901f\u4e0a\u624b",permalink:"/zh/docs/quickstart/standalone"},next:{title:"PyTorch Runtime\u7684\u6784\u5efa",permalink:"/zh/docs/tutorials/pytorch"}},s={},c=[{value:"1. \u5b89\u88c5\u79c1\u6709\u5316\u7248\u672c\u7684Starwhale Cloud\u670d\u52a1",id:"1-\u5b89\u88c5\u79c1\u6709\u5316\u7248\u672c\u7684starwhale-cloud\u670d\u52a1",level:2},{value:"1.1 \u524d\u7f6e\u6761\u4ef6",id:"11-\u524d\u7f6e\u6761\u4ef6",level:3},{value:"1.2 \u542f\u52a8Minikube",id:"12-\u542f\u52a8minikube",level:3},{value:"1.3 \u4f7f\u7528Helm\u5b89\u88c5Starwhale Cloud",id:"13-\u4f7f\u7528helm\u5b89\u88c5starwhale-cloud",level:3},{value:"2. \u53d1\u5e03Model/Runtime/Dataset\u5230Cloud Instance\u4e0a",id:"2-\u53d1\u5e03modelruntimedataset\u5230cloud-instance\u4e0a",level:2},{value:"2.1 \u767b\u9646Cloud Instance",id:"21-\u767b\u9646cloud-instance",level:3},{value:"2.2 \u53d1\u5e03\u5236\u54c1",id:"22-\u53d1\u5e03\u5236\u54c1",level:3},{value:"3. \u4f7f\u7528Starwhale Controller Web UI\u8fdb\u884c\u6a21\u578b\u8bc4\u6d4b",id:"3-\u4f7f\u7528starwhale-controller-web-ui\u8fdb\u884c\u6a21\u578b\u8bc4\u6d4b",level:2},{value:"3.1 \u5728Cloud Instance\u4e0a\u67e5\u770b\u5236\u54c1",id:"31-\u5728cloud-instance\u4e0a\u67e5\u770b\u5236\u54c1",level:3},{value:"3.2 \u521b\u5efa\u6a21\u578b\u8bc4\u6d4b\u4efb\u52a1",id:"32-\u521b\u5efa\u6a21\u578b\u8bc4\u6d4b\u4efb\u52a1",level:3}],u={toc:c};function p(e){let{components:t,...l}=e;return(0,r.kt)("wrapper",(0,n.Z)({},u,l,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"\u5efa\u8bae\u5148\u9605\u8bfb",(0,r.kt)("a",{parentName:"p",href:"/zh/docs/quickstart/standalone"},"Standalone\u5feb\u901f\u5165\u95e8"),"\u3002")),(0,r.kt)("h2",{id:"1-\u5b89\u88c5\u79c1\u6709\u5316\u7248\u672c\u7684starwhale-cloud\u670d\u52a1"},"1. \u5b89\u88c5\u79c1\u6709\u5316\u7248\u672c\u7684Starwhale Cloud\u670d\u52a1"),(0,r.kt)("p",null,"Starwhale Cloud \u6709\u4e24\u79cd\u5f62\u6001\uff0c\u4e00\u79cd\u662f\u79c1\u6709\u5316\u5230\u7528\u6237\u72ec\u7acb\u96c6\u7fa4\u7684On-Premises\u7248\u672c\uff0c\u53e6\u4e00\u79cd\u662fStarwhale\u6258\u7ba1\u7684Hosted-SaaS\u7248\u672c\u3002Starwhale Cloud \u662f\u9762\u5411\u4e91\u539f\u751f\u7684\uff0c\u5b8c\u5168\u7531Kubernetes\u6765\u6258\u7ba1\uff0c\u65e2\u652f\u6301\u6807\u51c6Kubernetes\u96c6\u7fa4\uff0c\u53c8\u652f\u6301MiniKube\u8fd9\u79cd\u5f00\u53d1\u8c03\u8bd5\u7528\u7684\u5355\u673aKubernetes\u670d\u52a1\u3002\u672c\u6587\u4ecb\u7ecd\u5982\u4f55\u5728\u5355\u673a\u73af\u5883\u4e0b\uff0c\u4f7f\u7528MiniKube\u5feb\u901f\u5b89\u88c5On-Premises\u7684Starwhale Cloud Instance\uff0c\u5e76\u4f53\u9a8c\u6a21\u578b\u8bc4\u6d4b\u5168\u6d41\u7a0b\u3002"),(0,r.kt)("h3",{id:"11-\u524d\u7f6e\u6761\u4ef6"},"1.1 \u524d\u7f6e\u6761\u4ef6"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://minikube.sigs.k8s.io/docs/start/"},"Minikube")," 1.25+"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://helm.sh/docs/intro/install/"},"Helm")," 3.2.0+")),(0,r.kt)("h3",{id:"12-\u542f\u52a8minikube"},"1.2 \u542f\u52a8Minikube"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"minikube start\n")),(0,r.kt)("p",null,"\u5bf9\u4e8e\u4e2d\u56fd\u5927\u9646\u7684\u7f51\u7edc\u73af\u5883\uff0c\u53ef\u4ee5\u5728minikube start\u547d\u4ee4\u4e2d\u589e\u52a0 ",(0,r.kt)("inlineCode",{parentName:"p"},"--image-mirror-country=cn --image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers")," \u53c2\u6570\u6765\u63d0\u5347\u955c\u50cf\u4e0b\u8f7d\u901f\u5ea6\u3002\u53e6\u5916\u5982\u679c\u672c\u673a\u6ca1\u6709 ",(0,r.kt)("inlineCode",{parentName:"p"},"kubectl")," \u547d\u4ee4\uff0c\u53ef\u4ee5\u4f7f\u7528 ",(0,r.kt)("inlineCode",{parentName:"p"},"minikube kubectl")," \u4ee3\u66ff\uff0c\u4e5f\u53ef\u4ee5\u91c7\u7528 ",(0,r.kt)("inlineCode",{parentName:"p"},'alias kubectl="minikube kubectl --"')," \u547d\u4ee4\uff0c\u5728\u5f53\u524d\u7ec8\u7aef\u4e2d\u63d0\u4f9b ",(0,r.kt)("inlineCode",{parentName:"p"},"kubectl")," \u547d\u4ee4\u7684alias\u3002"),(0,r.kt)("h3",{id:"13-\u4f7f\u7528helm\u5b89\u88c5starwhale-cloud"},"1.3 \u4f7f\u7528Helm\u5b89\u88c5Starwhale Cloud"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"helm repo add starwhale https://star-whale.github.io/charts\nhelm repo update\nexport SWNAME=starwhale SWNS=starwhale\nhelm upgrade --install $SWNAME starwhale/starwhale --namespace $SWNS --create-namespace --set minikube.enabled=true --set mysql.primary.persistence.storageClass=$SWNAME-mysql --set minio.persistence.storageClass=$SWNAME-minio --set image.registry=docker-registry.starwhale.cn --set minio.global.imageRegistry=docker-registry.starwhale.cn --set mysql.global.imageRegistry=docker-registry.starwhale.cn\n")),(0,r.kt)("p",null,"\u66f4\u8be6\u7ec6\u7684Helm Charts\u53c2\u6570\u914d\u7f6e\uff0c\u8bf7\u53c2\u8003",(0,r.kt)("a",{parentName:"p",href:"/zh/docs/guides/install/helm-charts"},"\u4f7f\u7528Helm\u5b89\u88c5Cloud Instance"),"\u6587\u6863\u3002\u5f53\u6210\u529f\u5b89\u88c5\u540e\uff0c\u4f1a\u6709\u7c7b\u4f3c\u5982\u4e0b\u4fe1\u606f\u8f93\u51fa\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"NAME: starwhale\nLAST DEPLOYED: Thu Jun 23 14:48:02 2022\nNAMESPACE: starwhale\nSTATUS: deployed\nREVISION: 1\nNOTES:\n******************************************\nChart Name: starwhale\nChart Version: 0.3.0\nApp Version: 0.3.0\nStarwhale Image:\n  - server: docker-registry.starwhale.cn/star-whale/server:0.3.0\n\n******************************************\nWeb Visit:\n  - starwhale controller: http://console.minikube.local\n  - minio admin: http://minio.pre.intra.starwhale.ai\n\nPort Forward Visist:\n  - starwhale controller:\n    - run: kubectl port-forward --namespace starwhale svc/starwhale-controller 8082:8082\n    - visit: http://localhost:8082\n  - minio admin:\n    - run: kubectl port-forward --namespace starwhale svc/starwhale-minio 9001:9001\n    - visit: http://localhost:9001\n  - mysql:\n    - run: kubectl port-forward --namespace starwhale svc/starwhale-mysql 3306:3306\n    - visit: mysql -h 127.0.0.1 -P 3306 -ustarwhale -pstarwhale\n\n******************************************\nLogin Info:\n- starwhale: u:starwhale, p:abcd1234\n- minio admin: u:minioadmin, p:minioadmin\n\n*_* Enjoy using Starwhale. *_*\n")),(0,r.kt)("p",null,"\u53ef\u4ee5\u68c0\u67e5starwhale namespace\u4e0b\u7684Pod\u662f\u5426\u90fd\u8fd0\u884c\u8d77\u6765\uff0c\u6b63\u5e38\u60c5\u51b5\u4f1a\u4ea7\u751f\u7c7b\u4f3c\u5982\u4e0b\u7684\u8f93\u51fa\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl get pods -n starwhale\n")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"left"},"NAME"),(0,r.kt)("th",{parentName:"tr",align:null},"READY"),(0,r.kt)("th",{parentName:"tr",align:null},"STATUS"),(0,r.kt)("th",{parentName:"tr",align:null},"RESTARTS"),(0,r.kt)("th",{parentName:"tr",align:null},"AGE"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},"starwhale-controller-7d864558bc-vxvb8"),(0,r.kt)("td",{parentName:"tr",align:null},"1/1"),(0,r.kt)("td",{parentName:"tr",align:null},"Running"),(0,r.kt)("td",{parentName:"tr",align:null},"0"),(0,r.kt)("td",{parentName:"tr",align:null},"1m")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},"starwhale-minio-7d45db75f6-7wq9b"),(0,r.kt)("td",{parentName:"tr",align:null},"1/1"),(0,r.kt)("td",{parentName:"tr",align:null},"Running"),(0,r.kt)("td",{parentName:"tr",align:null},"0"),(0,r.kt)("td",{parentName:"tr",align:null},"2m")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},"starwhale-mysql-0"),(0,r.kt)("td",{parentName:"tr",align:null},"1/1"),(0,r.kt)("td",{parentName:"tr",align:null},"Running"),(0,r.kt)("td",{parentName:"tr",align:null},"0"),(0,r.kt)("td",{parentName:"tr",align:null},"2m")))),(0,r.kt)("p",null,"\u53ef\u4ee5\u4f7f\u7528kubectl\u7684port-forward\u547d\u4ee4\uff0c\u5728\u5bbf\u4e3b\u673a\u6d4f\u89c8\u5668\u76f4\u63a5\u901a\u8fc78082\u7aef\u53e3\u8bbf\u95eeStarwhale Controller Web\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl port-forward --namespace starwhale svc/starwhale-controller 8082:8082\n")),(0,r.kt)("h2",{id:"2-\u53d1\u5e03modelruntimedataset\u5230cloud-instance\u4e0a"},"2. \u53d1\u5e03Model/Runtime/Dataset\u5230Cloud Instance\u4e0a"),(0,r.kt)("p",null,"\u6211\u4eec\u4f7f\u7528",(0,r.kt)("a",{parentName:"p",href:"/zh/docs/quickstart/standalone"},"Standalone \u5feb\u901f\u4e0a\u624b"),"\u6587\u6863\u4e2d\u6784\u5efa\u51fa\u6765\u7684Pytorch\u7684Starwhale Runtime\uff0cMNIST\u7684Starwhale Model\u548cStarwhale Dataset \u4f5c\u4e3a\u57fa\u7840\u5236\u54c1\uff0c\u5b8c\u6210\u5728Cloud Instance\u4e0a\u7684\u8bc4\u6d4b\u4efb\u52a1\u3002"),(0,r.kt)("h3",{id:"21-\u767b\u9646cloud-instance"},"2.1 \u767b\u9646Cloud Instance"),(0,r.kt)("p",null,"\u767b\u9646\u5730\u5740\u4e3a ",(0,r.kt)("inlineCode",{parentName:"p"},"http://localhost:8082")," \u7684Cloud Instance\uff0c\u5e76\u5c06\u5176\u547d\u540d\u4e3adev\u3002"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli instance login --username starwhale --password abcd1234 --alias dev http://localhost:8082\n")),(0,r.kt)("h3",{id:"22-\u53d1\u5e03\u5236\u54c1"},"2.2 \u53d1\u5e03\u5236\u54c1"),(0,r.kt)("p",null,"Starwhale Cloud Instance\u9996\u6b21\u542f\u52a8\u540e\uff0c\u4f1a\u9ed8\u8ba4\u521b\u5efa\u4e00\u4e2a\u540d\u79f0\u4e3a ",(0,r.kt)("inlineCode",{parentName:"p"},"starwhale")," \u7684project\u3002"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli model copy mnist/version/latest dev/project/starwhale\nswcli dataset copy mnist/version/latest dev/project/starwhale\nswcli runtime copy pytorch/version/latest dev/project/starwhale\n")),(0,r.kt)("h2",{id:"3-\u4f7f\u7528starwhale-controller-web-ui\u8fdb\u884c\u6a21\u578b\u8bc4\u6d4b"},"3. \u4f7f\u7528Starwhale Controller Web UI\u8fdb\u884c\u6a21\u578b\u8bc4\u6d4b"),(0,r.kt)("h3",{id:"31-\u5728cloud-instance\u4e0a\u67e5\u770b\u5236\u54c1"},"3.1 \u5728Cloud Instance\u4e0a\u67e5\u770b\u5236\u54c1"),(0,r.kt)("p",null,"\u5728Web\u6d4f\u89c8\u5668\u4e2d\u6253\u5f00 ",(0,r.kt)("a",{parentName:"p",href:"http://localhost:8082"},"http://localhost:8082")," \u5730\u5740\uff0c\u4f7f\u7528\u9ed8\u8ba4\u7528\u6237\u540d(starwhale)\u548c\u5bc6\u7801(abcd1234)\u767b\u9646\u3002\u8fdb\u5165 ",(0,r.kt)("inlineCode",{parentName:"p"},"starwhale")," project\u4e2d\uff0c\u53ef\u4ee5\u67e5\u770b\u53d1\u5e03\u7684Runtime\u3001Dataset\u548cModel\u3002"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"console-artifacts.gif",src:a(8380).Z,width:"2060",height:"1112"})),(0,r.kt)("h3",{id:"32-\u521b\u5efa\u6a21\u578b\u8bc4\u6d4b\u4efb\u52a1"},"3.2 \u521b\u5efa\u6a21\u578b\u8bc4\u6d4b\u4efb\u52a1"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"console-create-job.gif",src:a(7226).Z,width:"2116",height:"1147"})),(0,r.kt)("p",null,"\ud83d\udc4f \u606d\u559c\uff0c\u76ee\u524d\u5df2\u7ecf\u5b8c\u6210\u4e86Starwhale Cloud\u7684\u57fa\u672c\u64cd\u4f5c\u4efb\u52a1\u3002"))}p.isMDXComponent=!0},8380:function(e,t,a){t.Z=a.p+"assets/images/console-artifacts-fd7bf6e54d06dc37d234019e769031e6.gif"},7226:function(e,t,a){t.Z=a.p+"assets/images/console-create-job-b3f6012e26da81d411aa7624990a7087.gif"}}]);