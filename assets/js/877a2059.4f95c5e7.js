"use strict";(self.webpackChunkstarwhale_docs=self.webpackChunkstarwhale_docs||[]).push([[6445],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return m}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),p=c(n),m=r,h=p["".concat(l,".").concat(m)]||p[m]||u[m]||o;return n?a.createElement(h,i(i({ref:t},d),{},{components:n})):a.createElement(h,i({ref:t},d))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},2532:function(e,t,n){n.r(t),n.d(t,{assets:function(){return l},contentTitle:function(){return i},default:function(){return u},frontMatter:function(){return o},metadata:function(){return s},toc:function(){return c}});var a=n(3117),r=(n(7294),n(3905));const o={title:"Core Concepts"},i=void 0,s={unversionedId:"fundamentals/concepts",id:"fundamentals/concepts",title:"Core Concepts",description:"This document explains the main concepts in Starwhale.",source:"@site/docs/fundamentals/concepts.md",sourceDirName:"fundamentals",slug:"/fundamentals/concepts",permalink:"/docs/fundamentals/concepts",draft:!1,editUrl:"https://github.com/star-whale/starwhale/tree/main/docs/docs/fundamentals/concepts.md",tags:[],version:"current",frontMatter:{title:"Core Concepts"},sidebar:"mainSidebar",previous:{title:"Multi-Fiber Networks(MFNet) For UCF101",permalink:"/docs/tutorials/ucf101"},next:{title:"Platform Architecture",permalink:"/docs/fundamentals/arch"}},l={},c=[{value:"1. Instance",id:"1-instance",level:2},{value:"2. Project",id:"2-project",level:2},{value:"3. Model",id:"3-model",level:2},{value:"4. Runtime",id:"4-runtime",level:2},{value:"5. Dataset",id:"5-dataset",level:2},{value:"6. Version",id:"6-version",level:2},{value:"7. Job, Step, and Task",id:"7-job-step-and-task",level:2},{value:"8. Evaluation",id:"8-evaluation",level:2}],d={toc:c};function u(e){let{components:t,...o}=e;return(0,r.kt)("wrapper",(0,a.Z)({},d,o,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"This document explains the main concepts in Starwhale."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"concepts-org.jpg",src:n(7644).Z,width:"1394",height:"634"})),(0,r.kt)("h2",{id:"1-instance"},"1. Instance"),(0,r.kt)("p",null,"Each installation of Starwhale is called an instance, Cloud or Standalone:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Standalone Instance"),(0,r.kt)("li",{parentName:"ul"},"Cloud Instance",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"On-Premises"),(0,r.kt)("li",{parentName:"ul"},"Cloud Hosted")))),(0,r.kt)("p",null,"The standalone instance is the simplest form that requires only the Starwhale client (swcli). All data and metadata are stored locally on the client machine. All jobs and tasks are executed on the client machine as well. It is similar to git, which requires only a set of executable binaries."),(0,r.kt)("p",null,'The on-premises instance and hosted instance are both called cloud instances. We can call the on-premises instance "private cloud instance" and the hosted instance "public cloud instance". They both have a controller component and some optional agent components installed on one or more servers. The main difference is that on-premises instances are maintained by operation teams in different organizations, and hosted instances are maintained by the Starwhale team on the public cloud.'),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Starwhale tries to keep concepts consistent across different types of instances. In this way, people can easily exchange data and migrate between instances.")),(0,r.kt)("h2",{id:"2-project"},"2. Project"),(0,r.kt)("p",null,"Project is the basic unit for organizing different resources like models, datasets, etc.\nUsers may use projects for different purposes. For example, we can create a project for a data scientist team, a product line, or a specific model. Users usually work on one or more projects in their daily lives.\nEvery user in cloud instances has their personal project by default. Standalone instances also supports multi projects, ",(0,r.kt)("inlineCode",{parentName:"p"},"self")," project will be created automatically and configured as the default project."),(0,r.kt)("h2",{id:"3-model"},"3. Model"),(0,r.kt)("p",null,"Starwhale Model is the standard model format used in model delivery."),(0,r.kt)("p",null,"A Starwhale Model is a directory containing arbitrary files. It includes the model file generated by ML frameworks, the code file to run the model, the metadata file defined by Starwhale, and many other files."),(0,r.kt)("p",null,"A Starwhale Model can contain any information required to run the model, such as source codes, different model formats, etc. It can be stripped of redundant information to get a smaller package. The primary purpose of a stripped Starwhale Model Package is for delivery. Users may not want to show python inference code to the production team for security reasons or need a minimum deployable package on edge."),(0,r.kt)("h2",{id:"4-runtime"},"4. Runtime"),(0,r.kt)("p",null,'Starwhale Runtime describes software dependencies to "run" a model. It includes python libraries, native libraries, native binaries, etc.'),(0,r.kt)("p",null,"Stable software dependencies are essential for running a model. One reason is that installing dependencies is paining for most scientists. People spend days fighting with obscure error messages and finally become frustrated. Another reason is that deep learning natural networks are susceptible. A minuscule error in input may lead to a massive difference in output. Even different versions of a dependent library may impact model performance severely. Thus, it is essential to define the software runtime environment precisely."),(0,r.kt)("p",null,"Conda, Pip, and docker images are all solutions to define the software runtime environment. Starwhale Runtime supports all of them. Users can choose anyone they prefer.\nStarwhale provides the ability to synchronize runtimes on different machines and to switch between runtimes. Build once, use anywhere."),(0,r.kt)("h2",{id:"5-dataset"},"5. Dataset"),(0,r.kt)("p",null,"Starwhale organizes data into datasets."),(0,r.kt)("p",null,"Data usually have different storage formats and can be stored on distinct storage systems. Besides the original data, labels play a critical role in ML. Users usually label data from multiple perspectives and later use them in various models."),(0,r.kt)("p",null,"Starwhale dataset provides a unified description of how the data and labels are stored and organized. In this way, users can process data and labels quickly."),(0,r.kt)("p",null,"Starwhale Dataset is just a collection of arbitrary data. It is up to the user how to define a dataset."),(0,r.kt)("h2",{id:"6-version"},"6. Version"),(0,r.kt)("p",null,"Starwhale manages the history of Model, Dataset, and Runtime. Every update appends a new version to the history."),(0,r.kt)("p",null,"Versions are identified by version id generated automatically by Starwhale and are ordered by creation time."),(0,r.kt)("p",null,"Starwhale uses a linear history model. There is neither branch nor cycle in history."),(0,r.kt)("p",null,"History can not be rollback. When a version is to be reverted, Starwhale copies the version and appends it to the end of the history. However, versions in the history can be manually removed and recovered."),(0,r.kt)("h2",{id:"7-job-step-and-task"},"7. Job, Step, and Task"),(0,r.kt)("p",null,"A job is a set of programs to do specific work. A job consists of one or more steps, and each step consists of one or more tasks. Steps represent distinct stages of the work. They usually run with different codes. Tasks are replications of a step. Tasks in the same step always share the same program but run with separate data input."),(0,r.kt)("p",null,"Starwhale uses jobs to execute actions like model training, evaluation, and serving."),(0,r.kt)("h2",{id:"8-evaluation"},"8. Evaluation"),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Starwhale Evaluation")," manages the entire lifecycle of model evaluation which includes create job, distribute tasks and generate report etc."))}u.isMDXComponent=!0},7644:function(e,t,n){t.Z=n.p+"assets/images/concepts-org-2fa311f19e51c21807369e5e97e8dbaa.jpg"}}]);