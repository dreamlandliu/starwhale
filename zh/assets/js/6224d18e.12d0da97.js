"use strict";(self.webpackChunkstarwhale_docs=self.webpackChunkstarwhale_docs||[]).push([[2176],{3905:function(e,t,a){a.d(t,{Zo:function(){return m},kt:function(){return d}});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var p=n.createContext({}),s=function(e){var t=n.useContext(p),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},m=function(e){var t=s(e.components);return n.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,p=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),u=s(a),d=r,k=u["".concat(p,".").concat(d)]||u[d]||c[d]||l;return a?n.createElement(k,i(i({ref:t},m),{},{components:a})):n.createElement(k,i({ref:t},m))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,i=new Array(l);i[0]=u;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:r,i[1]=o;for(var s=2;s<l;s++)i[s]=a[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},959:function(e,t,a){a.r(t),a.d(t,{assets:function(){return p},contentTitle:function(){return i},default:function(){return c},frontMatter:function(){return l},metadata:function(){return o},toc:function(){return s}});var n=a(3117),r=(a(7294),a(3905));const l={title:"Standalone \u5feb\u901f\u4e0a\u624b"},i=void 0,o={unversionedId:"quickstart/standalone",id:"quickstart/standalone",title:"Standalone \u5feb\u901f\u4e0a\u624b",description:"\u672c\u6559\u7a0b\u4e5f\u63d0\u4f9bJupyter Notebook\u7248\u672c\uff0c\u53ef\u4ee5\u5728Colab Notebook\u4e2d\u5728\u7ebf\u4f53\u9a8c\u3002",source:"@site/i18n/zh/docusaurus-plugin-content-docs/current/quickstart/standalone.md",sourceDirName:"quickstart",slug:"/quickstart/standalone",permalink:"/zh/docs/quickstart/standalone",draft:!1,editUrl:"https://github.com/star-whale/starwhale/tree/main/docs/docs/quickstart/standalone.md",tags:[],version:"current",frontMatter:{title:"Standalone \u5feb\u901f\u4e0a\u624b"},sidebar:"mainSidebar",next:{title:"Cloud \u5feb\u901f\u4e0a\u624b",permalink:"/zh/docs/quickstart/on-premises"}},p={},s=[{value:"1. \u5b89\u88c5Starwhale CLI",id:"1-\u5b89\u88c5starwhale-cli",level:2},{value:"2. \u4e0b\u8f7d\u793a\u4f8b\u7a0b\u5e8f",id:"2-\u4e0b\u8f7d\u793a\u4f8b\u7a0b\u5e8f",level:2},{value:"3. \u6784\u5efaStarwhale Runtime\u8fd0\u884c\u73af\u5883",id:"3-\u6784\u5efastarwhale-runtime\u8fd0\u884c\u73af\u5883",level:2},{value:"4. \u6784\u5efaStarwhale Model\u6a21\u578b\u5305",id:"4-\u6784\u5efastarwhale-model\u6a21\u578b\u5305",level:2},{value:"5. \u6784\u5efaStarwhale Dataset\u6570\u636e\u96c6",id:"5-\u6784\u5efastarwhale-dataset\u6570\u636e\u96c6",level:2},{value:"6. \u8fd0\u884c\u6a21\u578b\u8bc4\u6d4b\u4efb\u52a1",id:"6-\u8fd0\u884c\u6a21\u578b\u8bc4\u6d4b\u4efb\u52a1",level:2}],m={toc:s};function c(e){let{components:t,...l}=e;return(0,r.kt)("wrapper",(0,n.Z)({},m,l,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"\u672c\u6559\u7a0b\u4e5f\u63d0\u4f9bJupyter Notebook\u7248\u672c\uff0c\u53ef\u4ee5\u5728",(0,r.kt)("a",{parentName:"strong",href:"https://colab.research.google.com/github/star-whale/starwhale/blob/main/example/notebooks/quickstart-standalone.ipynb"},"Colab Notebook"),"\u4e2d\u5728\u7ebf\u4f53\u9a8c\u3002")),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Core Workflow",src:a(8629).Z,width:"3036",height:"1741"})),(0,r.kt)("h2",{id:"1-\u5b89\u88c5starwhale-cli"},"1. \u5b89\u88c5Starwhale CLI"),(0,r.kt)("p",null,"Starwhale \u6709\u4e09\u79cd\u7c7b\u578b\u7684Instances\uff1aStandalone-\u5355\u673a\u3001On-Premises-\u79c1\u6709\u5316\u96c6\u7fa4\u3001Cloud Hosted-SaaS\u6258\u7ba1\u670d\u52a1\u3002Standalone\u662f\u6700\u7b80\u5355\u7684\u6a21\u5f0f\uff0c\u53ef\u4ee5\u4eceStandalone\u5f00\u542f\u4f60\u7684Starwhale MLOps\u4e4b\u65c5\u3002Starwhale Standalone \u662f\u7528Python3\u7f16\u5199\u7684\uff0c\u53ef\u4ee5\u901a\u8fc7pip\u547d\u4ee4\u5b89\u88c5\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"python3 -m pip install starwhale\n")),(0,r.kt)("admonition",{type:"note"},(0,r.kt)("p",{parentName:"admonition"},"\u4f7f\u7528 ",(0,r.kt)("inlineCode",{parentName:"p"},"--pre")," \u53c2\u6570\u53ef\u4ee5\u5b89\u88c5Preview\u7248\u672c\u7684Starwhale CLI\u3002")),(0,r.kt)("p",null,"\u7cfb\u7edf\u73af\u5883\u8981\u6c42\uff1a"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Python\uff1a3.7 ~ 3.11"),(0,r.kt)("li",{parentName:"ul"},"\u64cd\u4f5c\u7cfb\u7edf\uff1aLinux\u6216macOS")),(0,r.kt)("p",null,"\u63a8\u8350\u9605\u8bfb",(0,r.kt)("a",{parentName:"p",href:"/zh/docs/guides/install/standalone"},"Standalone \u5b89\u88c5\u5efa\u8bae"),"\u3002"),(0,r.kt)("h2",{id:"2-\u4e0b\u8f7d\u793a\u4f8b\u7a0b\u5e8f"},"2. \u4e0b\u8f7d\u793a\u4f8b\u7a0b\u5e8f"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/star-whale/starwhale.git\ncd starwhale\n")),(0,r.kt)("p",null,"\u6211\u4eec\u9009\u7528ML/DL\u9886\u57df\u7684HelloWorld\u7a0b\u5e8f-MNIST\u6765\u4ecb\u7ecd\u5982\u4f55\u4ece\u96f6\u5f00\u59cb\u6784\u5efa\u6570\u636e\u96c6\u3001\u6a21\u578b\u5305\u548c\u8fd0\u884c\u73af\u5883\uff0c\u5e76\u6700\u7ec8\u5b8c\u6210\u6a21\u578b\u8bc4\u6d4b\u3002\u63a5\u4e0b\u6765\u7684\u64cd\u4f5c\u90fd\u5728 ",(0,r.kt)("inlineCode",{parentName:"p"},"starwhale")," \u76ee\u5f55\u4e2d\u8fdb\u884c\u3002"),(0,r.kt)("h2",{id:"3-\u6784\u5efastarwhale-runtime\u8fd0\u884c\u73af\u5883"},"3. \u6784\u5efaStarwhale Runtime\u8fd0\u884c\u73af\u5883"),(0,r.kt)("p",null,"Runtime\u7684\u793a\u4f8b\u7a0b\u5e8f\u5728 ",(0,r.kt)("inlineCode",{parentName:"p"},"example/runtime/pytorch")," \u76ee\u5f55\u4e2d\u3002"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u6784\u5efaStarwhale Runtime\uff1a"),(0,r.kt)("admonition",{parentName:"li",type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"\u5f53\u9996\u6b21\u6784\u5efaStarwhale Runtime\u65f6\uff0c\u7531\u4e8e\u9700\u8981\u521b\u5efavenv\u6216conda\u9694\u79bb\u73af\u5883\uff0c\u5e76\u4e0b\u8f7d\u76f8\u5173\u7684Python\u4f9d\u8d56\uff0c\u547d\u4ee4\u6267\u884c\u9700\u8981\u82b1\u8d39\u4e00\u6bb5\u65f6\u95f4\u3002\u65f6\u95f4\u957f\u77ed\u53d6\u51b3\u4e0e\u6240\u5728\u673a\u5668\u7684\u7f51\u7edc\u60c5\u51b5\u548cruntime.yaml\u4e2dPython\u4f9d\u8d56\u7684\u6570\u91cf\u3002\u5efa\u8bae\u5408\u7406\u8bbe\u7f6e\u673a\u5668\u7684 ",(0,r.kt)("inlineCode",{parentName:"p"},"~/.pip/pip.conf")," \u6587\u4ef6\uff0c\u586b\u5199\u7f13\u5b58\u8def\u5f84\u548c\u9002\u5408\u5f53\u524d\u7f51\u7edc\u73af\u5883\u7684pypi mirror\u5730\u5740\u3002"),(0,r.kt)("p",{parentName:"admonition"},"\u5904\u4e8e\u4e2d\u56fd\u5927\u9646\u7f51\u7edc\u73af\u5883\u4e2d\u7684\u7528\u6237\uff0c\u53ef\u4ee5\u53c2\u8003\u5982\u4e0b\u914d\u7f6e\uff1a"),(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-conf"},"[global]\ncache-dir = ~/.cache/pip\nindex-url = https://mirrors.aliyun.com/pypi/simple/\nextra-index-url = https://pypi.doubanio.com/simple\n"))),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli runtime build example/runtime/pytorch\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u68c0\u67e5\u6784\u5efa\u597d\u7684Starwhale Runtime\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli runtime list\nswcli runtime info pytorch/version/latest\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u9884\u5148restore Starwhale Runtime(\u53ef\u9009):"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli runtime restore pytorch/version/latest\n")))),(0,r.kt)("h2",{id:"4-\u6784\u5efastarwhale-model\u6a21\u578b\u5305"},"4. \u6784\u5efaStarwhale Model\u6a21\u578b\u5305"),(0,r.kt)("p",null,"Model\u7684\u793a\u4f8b\u7a0b\u5e8f\u5728 ",(0,r.kt)("inlineCode",{parentName:"p"},"example/mnist")," \u76ee\u5f55\u4e2d\u3002"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u4e0b\u8f7d\u9884\u5148\u8bad\u7ec3\u597d\u7684\u6a21\u578b\u6587\u4ef6\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"cd example/mnist\nCN=1 make download-model\n# \u5bf9\u4e8e\u975e\u4e2d\u56fd\u5927\u9646\u7f51\u7edc\u73af\u5883\u7528\u6237\uff0c\u53ef\u4ee5\u53bb\u6389make\u547d\u4ee4\u524d\u7684 `CN=1` \u73af\u5883\u53d8\u91cf\n# make download-model\ncd -\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u4f7f\u7528Starwhale Runtime\u6765\u6784\u5efaStarwhale Model\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli model build example/mnist --runtime pytorch/version/latest\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u68c0\u67e5\u6784\u5efa\u597d\u7684Starwhale Runtime\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli model list\nswcli model info mnist/version/latest\n")))),(0,r.kt)("h2",{id:"5-\u6784\u5efastarwhale-dataset\u6570\u636e\u96c6"},"5. \u6784\u5efaStarwhale Dataset\u6570\u636e\u96c6"),(0,r.kt)("p",null,"Dataset\u7684\u793a\u4f8b\u7a0b\u5e8f\u5728 ",(0,r.kt)("inlineCode",{parentName:"p"},"example/mnist")," \u76ee\u5f55\u4e2d\u3002"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u4e0b\u8f7dMNIST\u539f\u59cb\u6570\u636e\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"cd example/mnist\nCN=1 make download-data\n# \u5bf9\u4e8e\u975e\u4e2d\u56fd\u5927\u9646\u7f51\u7edc\u73af\u5883\u7528\u6237\uff0c\u53ef\u4ee5\u53bb\u6389make\u547d\u4ee4\u524d\u7684 `CN=1` \u73af\u5883\u53d8\u91cf\n# make download-data\ncd -\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u6784\u5efaStarwhale Dataset\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli dataset build example/mnist --runtime pytorch/version/latest\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u68c0\u67e5\u6784\u5efa\u597d\u7684Starwhale Dataset\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli dataset list\nswcli dataset info mnist/version/latest\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u67e5\u770b\u6570\u636e\u96c6\u7684\u524d\u51e0\u6761\u6570\u636e\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli dataset head mnist/version/latest\n")))),(0,r.kt)("h2",{id:"6-\u8fd0\u884c\u6a21\u578b\u8bc4\u6d4b\u4efb\u52a1"},"6. \u8fd0\u884c\u6a21\u578b\u8bc4\u6d4b\u4efb\u52a1"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u8fd0\u884c\u6a21\u578b\u8bc4\u6d4b\u4efb\u52a1\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli eval run --model mnist/version/latest --dataset mnist/version/latest --runtime pytorch/version/latest\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u67e5\u770b\u6a21\u578b\u8bc4\u6d4b\u7ed3\u679c\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli eval list\nswcli eval info $(swcli eval list | grep mnist | grep success | awk '{print $1}' | head -n 1)\n")))),(0,r.kt)("p",null,"\ud83d\udc4f \u606d\u559c\uff0c\u76ee\u524d\u5df2\u7ecf\u5b8c\u6210\u4e86Starwhale Standalone\u7684\u57fa\u672c\u64cd\u4f5c\u4efb\u52a1\u3002"))}c.isMDXComponent=!0},8629:function(e,t,a){t.Z=a.p+"assets/images/standalone-core-workflow-270ac0f0cb5b20dbe5ccd11727e2620b.gif"}}]);