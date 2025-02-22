"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[60],{2036:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>a,metadata:()=>r,toc:()=>d});var t=n(4848),i=n(8453);const a={sidebar_position:3},o="Task States",r={id:"guides/states",title:"Task States",description:"The state management feature in your configuration allows you to track the execution status of tasks and actions by defining a name for each task and action. This feature provides a way to check and control the flow of your operations based on the execution results.",source:"@site/docs/guides/states.md",sourceDirName:"guides",slug:"/guides/states",permalink:"/integrate/docs/guides/states",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Conditional Tasks",permalink:"/integrate/docs/guides/when"},next:{title:"Task Types",permalink:"/integrate/docs/category/task-types"}},c={},d=[{value:"State Variables",id:"state-variables",level:2},{value:"Usage Example",id:"usage-example",level:2}];function l(e){const s={code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.h1,{id:"task-states",children:"Task States"}),"\n",(0,t.jsxs)(s.p,{children:["The state management feature in your configuration allows you to track the execution status of tasks and actions by defining a ",(0,t.jsx)(s.code,{children:"name"})," for each task and action. This feature provides a way to check and control the flow of your operations based on the execution results."]}),"\n",(0,t.jsx)(s.h2,{id:"state-variables",children:"State Variables"}),"\n",(0,t.jsxs)(s.p,{children:["For each task or action, the following state variables are automatically set based on its execution, where ",(0,t.jsx)(s.code,{children:"<name>"})," is the name you provide to the task or action:"]}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.code,{children:"<name>"}),": This variable holds the current state of the task or action and can have one of the following values:"]}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.code,{children:"progress"}),": The task or action is currently running. (This state is primarily for internal tracking and may not be useful in most cases.)"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.code,{children:"skipped"}),": The task or action did not meet the ",(0,t.jsx)(s.code,{children:"when"})," condition and was skipped."]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.code,{children:"done"}),": The task or action completed successfully."]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.code,{children:"error"}),": The task or action resulted in an error."]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.code,{children:"<name>.error"}),": This variable is a boolean and is set to ",(0,t.jsx)(s.code,{children:"true"})," if the task or action resulted in an error. It is set to ",(0,t.jsx)(s.code,{children:"false"})," if the task was skipped or completed successfully."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.code,{children:"<name>.reason"}),": This variable contains the reason of error or skip."]}),"\n",(0,t.jsx)(s.p,{children:"Error reason contains the thrown error message."}),"\n",(0,t.jsx)(s.p,{children:"Skip reason has one of the following values:"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.code,{children:"search"}),": The searched value was not found."]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.code,{children:"prepend.ifNotPresent"}),": Prepend was skipped because ",(0,t.jsx)(s.code,{children:"ifNotPresent"})," was present in context."]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.code,{children:"prepend.exists"}),": Prepend was skipped because the code was already existed in context."]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.code,{children:"append.ifNotPresent"}),": Append was skipped because ",(0,t.jsx)(s.code,{children:"ifNotPresent"})," was present in context."]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.code,{children:"append.exists"}),": Append was skipped because the code was already existed in context."]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.code,{children:"replace.ifNotPresent"}),": Replace was skipped because ",(0,t.jsx)(s.code,{children:"ifNotPresent"})," was present in context."]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.code,{children:"replace.exists"}),": Replace was skipped because the code was already existed in context."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(s.h2,{id:"usage-example",children:"Usage Example"}),"\n",(0,t.jsx)(s.p,{children:"Here's an example of how to use task and action states:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-yaml",children:"steps:\n  - task: fs\n    name: fs_google\n    label: Importing google-services.json\n    when:\n      platform: android\n    actions:\n      - copyFile: google-services.json\n        destination: android/app/google-services.json\n\n  - task: build_gradle\n    when:\n      fs_google: done\n"})}),"\n",(0,t.jsxs)(s.p,{children:["In this example, we have two tasks. The first task, ",(0,t.jsx)(s.code,{children:"fs_google"}),", has a name assigned to it. The second task, ",(0,t.jsx)(s.code,{children:"build_gradle"}),", uses the ",(0,t.jsx)(s.code,{children:"when"})," condition to check the state of the ",(0,t.jsx)(s.code,{children:"fs_google"})," task. It will only execute when the ",(0,t.jsx)(s.code,{children:"fs_google"})," task is in the ",(0,t.jsx)(s.code,{children:"done"})," state (completed successfully)."]})]})}function h(e={}){const{wrapper:s}={...(0,i.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},8453:(e,s,n)=>{n.d(s,{R:()=>o,x:()=>r});var t=n(6540);const i={},a=t.createContext(i);function o(e){const s=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function r(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),t.createElement(a.Provider,{value:s},e.children)}}}]);