"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6992],{9126:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>a,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>l,toc:()=>d});var i=n(4848),s=n(8453);const r={sidebar_position:1,title:"Configuration"},o="Configuration File (integrate.yml)",l={id:"for-developers/configuration",title:"Configuration",description:"The configuration file is where you define the overall structure of your integration process. It includes various sections and fields to customize and control the behavior of the integration process.",source:"@site/docs/for-developers/configuration.md",sourceDirName:"for-developers",slug:"/for-developers/configuration",permalink:"/integrate/docs/for-developers/configuration",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,title:"Configuration"},sidebar:"tutorialSidebar",previous:{title:"For Package Developers",permalink:"/integrate/docs/for-developers/"},next:{title:"Guides",permalink:"/integrate/docs/category/guides"}},a={},d=[{value:"Example:",id:"example",level:4},{value:"Example in production",id:"example-in-production",level:4}];function c(e){const t={a:"a",code:"code",h1:"h1",h4:"h4",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(t.h1,{id:"configuration-file-integrateyml",children:["Configuration File (",(0,i.jsx)(t.code,{children:"integrate.yml"}),")"]}),"\n",(0,i.jsx)(t.p,{children:"The configuration file is where you define the overall structure of your integration process. It includes various sections and fields to customize and control the behavior of the integration process."}),"\n",(0,i.jsxs)(t.table,{children:[(0,i.jsx)(t.thead,{children:(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,i.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,i.jsx)(t.th,{children:"Description"})]})}),(0,i.jsxs)(t.tbody,{children:[(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"env"}),(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"object"}),(0,i.jsxs)(t.td,{children:["Allows you to define variables that can be used throughout the configuration. These variables can hold values that you want to reuse in different parts of your tasks. Variables defined in ",(0,i.jsx)(t.code,{children:"env"})," can be referenced using the ",(0,i.jsx)(t.code,{children:"$[var_name]"})," convention."]})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"tasks"}),(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"array of objects, required"}),(0,i.jsxs)(t.td,{children:["This is where you define individual integration tasks and their properties. Each task should have a ",(0,i.jsx)(t.code,{children:"type"})," field that specifies the type of task to perform."]})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"preInfo"}),(0,i.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,i.jsx)(t.code,{children:"{title: string, message: string}"})]}),(0,i.jsx)(t.td,{children:"Allows you to display information or messages before the integration process."})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"postInfo"}),(0,i.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,i.jsx)(t.code,{children:"{title: string, message: string}"})]}),(0,i.jsx)(t.td,{children:"Allows you to display information or messages after the integration process."})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"minRNVersion"}),(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,i.jsx)(t.td,{children:"It is used to set the minimum React Native version supported for the integration of the package."})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"minVersion"}),(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,i.jsx)(t.td,{children:"It is used to set the minimum package version supported for the integration of the package."})]})]})]}),"\n",(0,i.jsx)(t.h4,{id:"example",children:"Example:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-yaml",children:'minRNVersion: 0.72\nminVersion: 1.4\nenv:\n  app_id: your_app_id\npreInfo: "Please make sure you have your API keys ready."\ntasks:\n  - type: app_delegate\n    label: "Integrate Firebase"\n    actions:\n      - prepend: "#import <Firebase.h>"\n      - block: "didFinishLaunchingWithOptions"\n        prepend: "[FIRApp configure];"\npostInfo:\n  title: "Integration Completed"\n  message: "The integration process has finished successfully."\n'})}),"\n",(0,i.jsx)(t.h4,{id:"example-in-production",children:"Example in production"}),"\n",(0,i.jsxs)(t.p,{children:["Check out the ",(0,i.jsx)(t.a,{href:"https://github.com/react-native-integrate/configs/blob/main/packages/1/a/b/%40react-native-firebase/app/integrate.yml",children:"configuration of @react-native-firebase/app"}),"  to see the usage in production."]})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>l});var i=n(6540);const s={},r=i.createContext(s);function o(e){const t=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),i.createElement(r.Provider,{value:t},e.children)}}}]);