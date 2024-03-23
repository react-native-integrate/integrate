"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[311],{4307:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>a,contentTitle:()=>l,default:()=>h,frontMatter:()=>r,metadata:()=>o,toc:()=>d});var i=s(4848),n=s(8453);const r={sidebar_position:3,title:"File System Operations"},l="File System Task Configuration (fs)",o={id:"for-developers/guides/task-types/other-tasks/fs",title:"File System Operations",description:"Copy other files into project",source:"@site/docs/for-developers/guides/task-types/other-tasks/fs.md",sourceDirName:"for-developers/guides/task-types/other-tasks",slug:"/for-developers/guides/task-types/other-tasks/fs",permalink:"/integrate/docs/for-developers/guides/task-types/other-tasks/fs",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,title:"File System Operations"},sidebar:"tutorialSidebar",previous:{title:".gitignore",permalink:"/integrate/docs/for-developers/guides/task-types/other-tasks/gitignore"},next:{title:"User Prompts",permalink:"/integrate/docs/for-developers/guides/task-types/other-tasks/prompts"}},a={},d=[{value:"Task Properties",id:"task-properties",level:2},{value:"Action Properties",id:"action-properties",level:2},{value:"Usage Example",id:"usage-example",level:2}];function c(e){const t={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,n.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(t.h1,{id:"file-system-task-configuration-fs",children:["File System Task Configuration (",(0,i.jsx)(t.code,{children:"fs"}),")"]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.em,{children:"Copy other files into project"})}),"\n",(0,i.jsx)(t.p,{children:'The "fs" task is used to perform filesystem operations within your configuration. It allows you to copy files from one location to another within your project. This task is particularly useful when you need to manage project assets, configuration files, or other resources.'}),"\n",(0,i.jsx)(t.h2,{id:"task-properties",children:"Task Properties"}),"\n",(0,i.jsxs)(t.table,{children:[(0,i.jsx)(t.thead,{children:(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,i.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,i.jsx)(t.th,{children:"Description"})]})}),(0,i.jsxs)(t.tbody,{children:[(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"type"}),(0,i.jsx)(t.td,{style:{textAlign:"left"},children:'"fs", required'}),(0,i.jsx)(t.td,{children:'Specifies the task type, which should be set to "fs" for this task.'})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"name"}),(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,i.jsxs)(t.td,{children:["An optional name for the task. If provided, the task state will be saved as a variable. Visit ",(0,i.jsx)(t.a,{href:"../../states",children:"Task and Action States"})," page to learn more."]})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"label"}),(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,i.jsx)(t.td,{children:"An optional label or description for the task."})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"when"}),(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"object"}),(0,i.jsxs)(t.td,{children:["Visit ",(0,i.jsx)(t.a,{href:"../../when",children:"Conditional Tasks and Actions"})," page to learn how to execute task conditionally."]})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"actions"}),(0,i.jsxs)(t.td,{style:{textAlign:"left"},children:["Array<",(0,i.jsx)(t.a,{href:"#action-properties",children:"Action"}),">, required"]}),(0,i.jsx)(t.td,{children:"An array of action items that define the modifications to be made in the file."})]})]})]}),"\n",(0,i.jsx)(t.h2,{id:"action-properties",children:"Action Properties"}),"\n",(0,i.jsxs)(t.table,{children:[(0,i.jsx)(t.thead,{children:(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,i.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,i.jsx)(t.th,{children:"Description"})]})}),(0,i.jsxs)(t.tbody,{children:[(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"name"}),(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,i.jsxs)(t.td,{children:["An optional name for the task. If provided, the task state will be saved as a variable. Visit ",(0,i.jsx)(t.a,{href:"../../states",children:"Task and Action States"})," page to learn more."]})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"when"}),(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"object"}),(0,i.jsxs)(t.td,{children:["Visit ",(0,i.jsx)(t.a,{href:"../../when",children:"Conditional Tasks and Actions"}),"  page to learn how to execute action conditionally."]})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"copyFile"}),(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,i.jsx)(t.td,{children:"A string that specifies the name of the file needed to be copied."})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"destination"}),(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"string, required"}),(0,i.jsx)(t.td,{children:"A relative path from the project's root directory specifying the destination where the file will be copied. This field determines where the copied file will be placed within your project's directory structure."})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"message"}),(0,i.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,i.jsx)(t.td,{children:"A string that serves as the user prompt message when collecting input. If provided, this message will replace the default message."})]})]})]}),"\n",(0,i.jsx)(t.h2,{id:"usage-example",children:"Usage Example"}),"\n",(0,i.jsx)(t.p,{children:'Here\'s an example of how to use the "fs" task in a configuration file:'}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-yaml",children:'tasks:\n- type: fs\n  actions:\n    - copyFile: "example.txt"\n      message: "Please enter the path of the file you want to copy:"\n      destination: "assets/example.txt"\n'})}),"\n",(0,i.jsx)(t.p,{children:"In this example:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:'We define an "fs" task to copy a file named "example.txt".'}),"\n",(0,i.jsx)(t.li,{children:"We customize the user prompt message to request the path of the file to copy."}),"\n",(0,i.jsxs)(t.li,{children:["The ",(0,i.jsx)(t.code,{children:"destination"}),' field specifies that the file should be copied to the "assets/example.txt" path within the project\'s root.']}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},8453:(e,t,s)=>{s.d(t,{R:()=>l,x:()=>o});var i=s(6540);const n={},r=i.createContext(n);function l(e){const t=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:l(e.components),i.createElement(r.Provider,{value:t},e.children)}}}]);