"use strict";(self.webpackChunkstarwhale_docs=self.webpackChunkstarwhale_docs||[]).push([[176],{3905:function(e,t,a){a.d(t,{Zo:function(){return u},kt:function(){return d}});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),p=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},u=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),m=p(a),d=r,k=m["".concat(s,".").concat(d)]||m[d]||c[d]||l;return a?n.createElement(k,i(i({ref:t},u),{},{components:a})):n.createElement(k,i({ref:t},u))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,i=new Array(l);i[0]=m;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:r,i[1]=o;for(var p=2;p<l;p++)i[p]=a[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},959:function(e,t,a){a.r(t),a.d(t,{assets:function(){return s},contentTitle:function(){return i},default:function(){return c},frontMatter:function(){return l},metadata:function(){return o},toc:function(){return p}});var n=a(3117),r=(a(7294),a(3905));const l={title:"Standalone \u5feb\u901f\u4e0a\u624b"},i=void 0,o={unversionedId:"quickstart/standalone",id:"quickstart/standalone",title:"Standalone \u5feb\u901f\u4e0a\u624b",description:"Core Workflow",source:"@site/i18n/zh/docusaurus-plugin-content-docs/current/quickstart/standalone.md",sourceDirName:"quickstart",slug:"/quickstart/standalone",permalink:"/zh/docs/quickstart/standalone",draft:!1,editUrl:"https://github.com/star-whale/starwhale/tree/main/docs/docs/quickstart/standalone.md",tags:[],version:"current",frontMatter:{title:"Standalone \u5feb\u901f\u4e0a\u624b"},sidebar:"mainSidebar",next:{title:"Cloud \u5feb\u901f\u4e0a\u624b",permalink:"/zh/docs/quickstart/on-premises"}},s={},p=[{value:"1. \u5b89\u88c5Starwhale CLI",id:"1-\u5b89\u88c5starwhale-cli",level:2},{value:"2. \u4e0b\u8f7d\u793a\u4f8b\u7a0b\u5e8f",id:"2-\u4e0b\u8f7d\u793a\u4f8b\u7a0b\u5e8f",level:2},{value:"3. \u6784\u5efaStarwhale Runtime\u8fd0\u884c\u73af\u5883",id:"3-\u6784\u5efastarwhale-runtime\u8fd0\u884c\u73af\u5883",level:2},{value:"4. \u6784\u5efaStarwhale Model\u6a21\u578b\u5305",id:"4-\u6784\u5efastarwhale-model\u6a21\u578b\u5305",level:2},{value:"5. \u6784\u5efaStarwhale Dataset\u6570\u636e\u96c6",id:"5-\u6784\u5efastarwhale-dataset\u6570\u636e\u96c6",level:2},{value:"6. \u8fd0\u884c\u6a21\u578b\u8bc4\u6d4b\u4efb\u52a1",id:"6-\u8fd0\u884c\u6a21\u578b\u8bc4\u6d4b\u4efb\u52a1",level:2}],u={toc:p};function c(e){let{components:t,...l}=e;return(0,r.kt)("wrapper",(0,n.Z)({},u,l,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Core Workflow",src:a(8629).Z,width:"3036",height:"1741"})),(0,r.kt)("h2",{id:"1-\u5b89\u88c5starwhale-cli"},"1. \u5b89\u88c5Starwhale CLI"),(0,r.kt)("p",null,"Starwhale \u6709\u4e09\u79cd\u7c7b\u578b\u7684Instances\uff1aStandalone-\u5355\u673a\u3001On-Premises-\u79c1\u6709\u5316\u96c6\u7fa4\u3001Cloud Hosted-SaaS\u6258\u7ba1\u670d\u52a1\u3002Standalone\u662f\u6700\u7b80\u5355\u7684\u6a21\u5f0f\uff0c\u53ef\u4ee5\u4eceStandalone\u5f00\u542f\u4f60\u7684Starwhale MLOps\u4e4b\u65c5\u3002Starwhale Standalone \u662f\u7528Python3\u7f16\u5199\u7684\uff0c\u53ef\u4ee5\u901a\u8fc7pip\u547d\u4ee4\u5b89\u88c5\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"python3 -m pip install starwhale\n")),(0,r.kt)("admonition",{type:"note"},(0,r.kt)("p",{parentName:"admonition"},"\u4f7f\u7528 ",(0,r.kt)("inlineCode",{parentName:"p"},"--pre")," \u53c2\u6570\u53ef\u4ee5\u5b89\u88c5Preview\u7248\u672c\u7684Starwhale CLI\u3002")),(0,r.kt)("p",null,"\u7cfb\u7edf\u73af\u5883\u8981\u6c42\uff1a"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Python\uff1a3.7 ~ 3.10"),(0,r.kt)("li",{parentName:"ul"},"\u64cd\u4f5c\u7cfb\u7edf\uff1aLinux\u6216macOS")),(0,r.kt)("p",null,"\u63a8\u8350\u9605\u8bfb",(0,r.kt)("a",{parentName:"p",href:"/zh/docs/guides/install/standalone"},"Standalone \u5b89\u88c5\u5efa\u8bae"),"\u3002"),(0,r.kt)("h2",{id:"2-\u4e0b\u8f7d\u793a\u4f8b\u7a0b\u5e8f"},"2. \u4e0b\u8f7d\u793a\u4f8b\u7a0b\u5e8f"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/star-whale/starwhale.git\ncd starwhale\n")),(0,r.kt)("p",null,"\u5982\u679c\u672c\u673a\u73af\u5883\u4e2d\u4e4b\u524d\u6ca1\u6709\u5b89\u88c5\u8fc7",(0,r.kt)("a",{parentName:"p",href:"https://git-lfs.github.com/"},"git-lfs"),"\uff08\u547d\u4ee4\u4e3a",(0,r.kt)("inlineCode",{parentName:"p"},"git lfs install"),"\uff09\uff0c\u9700\u8981\u624b\u5de5\u4e0b\u8f7d\u8bad\u7ec3\u597d\u7684mnist.pt\u6587\u4ef6\u3002"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"wget https://media.githubusercontent.com/media/star-whale/starwhale/main/example/mnist/models/mnist_cnn.pt -O example/mnist/models/mnist_cnn.pt\n")),(0,r.kt)("p",null,"\u6211\u4eec\u9009\u7528ML/DL\u9886\u57df\u7684HelloWorld\u7a0b\u5e8f-MNIST\u6765\u4ecb\u7ecd\u5982\u4f55\u4ece\u96f6\u5f00\u59cb\u6784\u5efa\u6570\u636e\u96c6\u3001\u6a21\u578b\u5305\u548c\u8fd0\u884c\u73af\u5883\uff0c\u5e76\u6700\u7ec8\u5b8c\u6210\u6a21\u578b\u8bc4\u6d4b\u3002\u63a5\u4e0b\u6765\u7684\u64cd\u4f5c\u90fd\u5728 ",(0,r.kt)("inlineCode",{parentName:"p"},"starwhale")," \u76ee\u5f55\u4e2d\u8fdb\u884c\u3002"),(0,r.kt)("h2",{id:"3-\u6784\u5efastarwhale-runtime\u8fd0\u884c\u73af\u5883"},"3. \u6784\u5efaStarwhale Runtime\u8fd0\u884c\u73af\u5883"),(0,r.kt)("p",null,"Runtime\u7684\u793a\u4f8b\u7a0b\u5e8f\u5728 ",(0,r.kt)("inlineCode",{parentName:"p"},"example/runtime/pytorch")," \u76ee\u5f55\u4e2d\u3002"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u6784\u5efaStarwhale Runtime\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"cd example/runtime/pytorch\nswcli runtime build .\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u68c0\u67e5\u6784\u5efa\u597d\u7684Starwhale Runtime\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli runtime list\nswcli runtime info pytorch/version/latest\n")))),(0,r.kt)("h2",{id:"4-\u6784\u5efastarwhale-model\u6a21\u578b\u5305"},"4. \u6784\u5efaStarwhale Model\u6a21\u578b\u5305"),(0,r.kt)("p",null,"Model\u7684\u793a\u4f8b\u7a0b\u5e8f\u5728 ",(0,r.kt)("inlineCode",{parentName:"p"},"example/mnist")," \u76ee\u5f55\u4e2d\u3002"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u6784\u5efaStarwhale Model\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli model build .\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u68c0\u67e5\u6784\u5efa\u597d\u7684Starwhale Runtime\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli model list\nswcli model info mnist/version/latest\n")))),(0,r.kt)("h2",{id:"5-\u6784\u5efastarwhale-dataset\u6570\u636e\u96c6"},"5. \u6784\u5efaStarwhale Dataset\u6570\u636e\u96c6"),(0,r.kt)("p",null,"Dataset\u7684\u793a\u4f8b\u7a0b\u5e8f\u5728 ",(0,r.kt)("inlineCode",{parentName:"p"},"example/mnist")," \u76ee\u5f55\u4e2d\u3002"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u4e0b\u8f7dMNIST\u539f\u59cb\u6570\u636e\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"mkdir -p data && cd data\nwget http://yann.lecun.com/exdb/mnist/t10k-images-idx3-ubyte.gz\nwget http://yann.lecun.com/exdb/mnist/t10k-labels-idx1-ubyte.gz\ngzip -d *.gz\ncd ..\nls -lah data/*\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u6784\u5efaStarwhale Dataset\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli dataset build .\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u68c0\u67e5\u6784\u5efa\u597d\u7684Starwhale Dataset\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli dataset list\nswcli dataset info mnist/version/latest\n")))),(0,r.kt)("h2",{id:"6-\u8fd0\u884c\u6a21\u578b\u8bc4\u6d4b\u4efb\u52a1"},"6. \u8fd0\u884c\u6a21\u578b\u8bc4\u6d4b\u4efb\u52a1"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u8fd0\u884c\u6a21\u578b\u8bc4\u6d4b\u4efb\u52a1\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli -vvv eval run --model mnist/version/latest --dataset mnist/version/latest --runtime pytorch/version/latest\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u67e5\u770b\u6a21\u578b\u8bc4\u6d4b\u7ed3\u679c\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli eval list\nswcli eval info ${version}\n")))),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"Runtime\u9996\u6b21\u4f7f\u7528\u7684\u65f6\u5019\u4f1a\u521b\u5efa\u9694\u79bb\u7684python\u73af\u5883\u5e76\u5b89\u88c5\u4f9d\u8d56\uff0c\u53ef\u80fd\u4f1a\u7528\u65f6\u8f83\u957f\uff0c\u540c\u65f6\u5efa\u8bae\u5408\u7406\u8bbe\u7f6e ~/.pip/pip.conf \u6587\u4ef6\uff0c\u9009\u7528\u4e0b\u8f7d\u901f\u5ea6\u5feb\u7684pypi mirror\u5730\u5740\u3002")),(0,r.kt)("p",null,"\ud83d\udc4f \u606d\u559c\uff0c\u76ee\u524d\u5df2\u7ecf\u5b8c\u6210\u4e86Starwhale Standalone\u7684\u57fa\u672c\u64cd\u4f5c\u4efb\u52a1\u3002"))}c.isMDXComponent=!0},8629:function(e,t,a){t.Z=a.p+"assets/images/standalone-core-workflow-270ac0f0cb5b20dbe5ccd11727e2620b.gif"}}]);