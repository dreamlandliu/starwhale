"use strict";(self.webpackChunkstarwhale_docs=self.webpackChunkstarwhale_docs||[]).push([[263],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return c}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=r.createContext({}),m=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=m(e.components);return r.createElement(u.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,u=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),s=m(n),c=a,k=s["".concat(u,".").concat(c)]||s[c]||d[c]||i;return n?r.createElement(k,l(l({ref:t},p),{},{components:n})):r.createElement(k,l({ref:t},p))}));function c(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,l=new Array(i);l[0]=s;var o={};for(var u in t)hasOwnProperty.call(t,u)&&(o[u]=t[u]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var m=2;m<i;m++)l[m]=n[m];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},8825:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return l},default:function(){return d},frontMatter:function(){return i},metadata:function(){return o},toc:function(){return m}});var r=n(3117),a=(n(7294),n(3905));const i={title:"Runtime"},l=void 0,o={unversionedId:"guides/runtime",id:"guides/runtime",title:"Runtime",description:"What is Starwhale Runtime?",source:"@site/docs/guides/runtime.md",sourceDirName:"guides",slug:"/guides/runtime",permalink:"/docs/guides/runtime",draft:!1,editUrl:"https://github.com/star-whale/starwhale/tree/main/docs/docs/guides/runtime.md",tags:[],version:"current",frontMatter:{title:"Runtime"},sidebar:"mainSidebar",previous:{title:"Dataset",permalink:"/docs/guides/dataset"},next:{title:"Model",permalink:"/docs/guides/model"}},u={},m=[{value:"What is Starwhale Runtime?",id:"what-is-starwhale-runtime",level:2},{value:"RECOMMENDED Workflow",id:"recommended-workflow",level:2},{value:"1. Preparing",id:"1-preparing",level:3},{value:"2. Building and Sharing",id:"2-building-and-sharing",level:3},{value:"3. Using Pre-defined Runtime",id:"3-using-pre-defined-runtime",level:3},{value:"runtime.yaml Definition",id:"runtimeyaml-definition",level:2}],p={toc:m};function d(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"what-is-starwhale-runtime"},"What is Starwhale Runtime?"),(0,a.kt)("p",null,"Python is the first-class language in ML/DL. So that a standard and easy-to-use python runtime environment is critical. Starwhale Runtime tries to provide an out-of-the-box runtime management tool that includes:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"a ",(0,a.kt)("inlineCode",{parentName:"li"},"runtime.yaml")," file"),(0,a.kt)("li",{parentName:"ul"},"some commands to finish the runtime workflow"),(0,a.kt)("li",{parentName:"ul"},"a bundle file with the ",(0,a.kt)("inlineCode",{parentName:"li"},".swrt")," extension"),(0,a.kt)("li",{parentName:"ul"},"runtime stored in the standalone and cloud instance")),(0,a.kt)("p",null,"When we use Starwhale Runtime, we can gain some DevOps abilities:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"versioning"),(0,a.kt)("li",{parentName:"ul"},"shareable"),(0,a.kt)("li",{parentName:"ul"},"reproducible"),(0,a.kt)("li",{parentName:"ul"},"system-independent")),(0,a.kt)("h2",{id:"recommended-workflow"},"RECOMMENDED Workflow"),(0,a.kt)("h3",{id:"1-preparing"},"1. Preparing"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Step1: Create a runtime: ",(0,a.kt)("inlineCode",{parentName:"li"},"swcli runtime create --mode <venv|conda> --name <runtime name> --python <python version> WORKDIR")),(0,a.kt)("li",{parentName:"ul"},"Step2: Activate this runtime: ",(0,a.kt)("inlineCode",{parentName:"li"},"swcli runtime activate WORKDIR")),(0,a.kt)("li",{parentName:"ul"},"Step3: Install python requirements by ",(0,a.kt)("inlineCode",{parentName:"li"},"pip install")," or ",(0,a.kt)("inlineCode",{parentName:"li"},"conda install"),"."),(0,a.kt)("li",{parentName:"ul"},"Step4: Test python environment: evaluate models, build datasets, or run some python scripts.")),(0,a.kt)("h3",{id:"2-building-and-sharing"},"2. Building and Sharing"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Step1: Build a runtime: ",(0,a.kt)("inlineCode",{parentName:"li"},"swcli runtime build WORKDIR")),(0,a.kt)("li",{parentName:"ul"},"Step2: Run with runtime: ",(0,a.kt)("inlineCode",{parentName:"li"},"swcli job create --model mnist/version/latest --runtime pytorch-mnist/version/latest --dataset mnist/version/latest"),"."),(0,a.kt)("li",{parentName:"ul"},"Step3: Copy a runtime to the cloud instance: ",(0,a.kt)("inlineCode",{parentName:"li"},"swcli runtime copy pytorch-mnist-env/version/latest http://<host>:<port>/project/self"),".")),(0,a.kt)("h3",{id:"3-using-pre-defined-runtime"},"3. Using Pre-defined Runtime"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Step1: Copy a runtime to the standalone instance: ",(0,a.kt)("inlineCode",{parentName:"li"},"swcli runtime copy http://<host>:<port>/project/self/runtime/pytorch-mnist-env/version/latest local/project/self")),(0,a.kt)("li",{parentName:"ul"},"Step2: Restore runtime for development: ",(0,a.kt)("inlineCode",{parentName:"li"},"swcli runtime restore mnist/version/latest"),"."),(0,a.kt)("li",{parentName:"ul"},"Step3: Run with runtime, same as Phase2-3.")),(0,a.kt)("h2",{id:"runtimeyaml-definition"},"runtime.yaml Definition"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},"Field"),(0,a.kt)("th",{parentName:"tr",align:null},"Description"),(0,a.kt)("th",{parentName:"tr",align:null},"Required"),(0,a.kt)("th",{parentName:"tr",align:null},"Default Value"),(0,a.kt)("th",{parentName:"tr",align:null},"Example"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"mode"),(0,a.kt)("td",{parentName:"tr",align:null},"environment mode, venv or conda"),(0,a.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"venv")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"venv"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"name"),(0,a.kt)("td",{parentName:"tr",align:null},"runtime name"),(0,a.kt)("td",{parentName:"tr",align:null},"\u2705"),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},'""')),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"pytorch-mnist"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"pip_req"),(0,a.kt)("td",{parentName:"tr",align:null},"the path of requirements.txt"),(0,a.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"requirements.txt")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"requirements.txt"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"python_version"),(0,a.kt)("td",{parentName:"tr",align:null},"python version, format is major:minor"),(0,a.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"3.8")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"3.9"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"starwhale_version"),(0,a.kt)("td",{parentName:"tr",align:null},"starwhale python package version"),(0,a.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},'""')),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"0.2.0b20"))))),(0,a.kt)("p",null,"Example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},"mode: venv\nname: pytorch-mnist\npip_req: requirements.txt\npython_version: '3.8'\nstarwhale_version: '0.2.0b20'\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"swcli runtime create")," command creates a ",(0,a.kt)("inlineCode",{parentName:"li"},"runtime.yaml")," in the working dir, which is a RECOMMENDED method."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"swcli")," uses ",(0,a.kt)("inlineCode",{parentName:"li"},"starwhale_version")," version to render the docker image.")))}d.isMDXComponent=!0}}]);