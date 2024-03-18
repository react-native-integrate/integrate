"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9001],{3394:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>t,metadata:()=>a,toc:()=>d});var s=i(4848),o=i(8453);const t={sidebar_position:2},r="Conditional Tasks and Actions",a={id:"for-developers/guides/when",title:"Conditional Tasks and Actions",description:"The when field of tasks and actions in your configuration allows you to specify conditions under which a particular task or action should be executed. It provides flexibility in controlling the flow of the integration based on variables and their values.",source:"@site/docs/for-developers/guides/when.md",sourceDirName:"for-developers/guides",slug:"/for-developers/guides/when",permalink:"/integrate/docs/for-developers/guides/when",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Variables",permalink:"/integrate/docs/for-developers/guides/variables"},next:{title:"Task and Action States",permalink:"/integrate/docs/for-developers/guides/states"}},l={},d=[{value:"Syntax",id:"syntax",level:2},{value:"Examples",id:"examples",level:2}];function c(e){const n={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",strong:"strong",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"conditional-tasks-and-actions",children:"Conditional Tasks and Actions"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"when"})," field of tasks and actions in your configuration allows you to specify conditions under which a particular task or action should be executed. It provides flexibility in controlling the flow of the integration based on variables and their values."]}),"\n",(0,s.jsx)(n.h2,{id:"syntax",children:"Syntax"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"when"})," field is an object that uses MongoDB-like query notation. It can contain simple key-value pairs or more complex queries."]}),"\n",(0,s.jsx)(n.h2,{id:"examples",children:"Examples"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"1.  Simple Key-Value Check:"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"when:\n  platform: android\n"})}),"\n",(0,s.jsx)(n.p,{children:"In this example, the associated task will only execute if the 'platform' variable is set to 'android'."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"2.  Complex Query:"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"when:\n  $and:\n    - platform: android\n    - environment: production\n"})}),"\n",(0,s.jsx)(n.p,{children:"This example demonstrates a more complex query. The task will execute only if both 'platform' is 'android' and 'environment' is 'production'."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"3.  Logical Operators:"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"when:\n  $or:\n    - platform: android\n    - platform: ios\n"})}),"\n",(0,s.jsx)(n.p,{children:"Here, the task will execute if either 'platform' is 'android' or 'ios'."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"4.  Array Membership Check:"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"when:\n  platform:\n    $in:\n      - android\n      - ios\n"})}),"\n",(0,s.jsxs)(n.p,{children:["This query checks if 'platform' is in the list ",(0,s.jsx)(n.code,{children:"['android', 'ios']"}),". If it matches, the task will execute."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"5.  Combining Conditions:"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"when:\n  $and:\n    - $or:\n        - platform: android\n        - platform: ios\n    - environment: development\n"})}),"\n",(0,s.jsx)(n.p,{children:"In this example, the task will execute if either 'platform' is 'android' or 'ios', and 'environment' is 'development'."})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>r,x:()=>a});var s=i(6540);const o={},t=s.createContext(o);function r(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);