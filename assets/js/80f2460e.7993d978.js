"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5108],{8409:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>o,contentTitle:()=>r,default:()=>h,frontMatter:()=>l,metadata:()=>d,toc:()=>a});var n=i(4848),s=i(8453);const l={sidebar_position:5,title:"MainApplication.java/kt"},r="MainApplication Task Configuration (main_application)",d={id:"for-developers/android-tasks/main-application",title:"MainApplication.java/kt",description:"Modify MainApplication java or kt file",source:"@site/docs/for-developers/android-tasks/main-application.md",sourceDirName:"for-developers/android-tasks",slug:"/for-developers/android-tasks/main-application",permalink:"/integrate/docs/for-developers/android-tasks/main-application",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5,title:"MainApplication.java/kt"},sidebar:"tutorialSidebar",previous:{title:"strings.xml",permalink:"/integrate/docs/for-developers/android-tasks/strings-xml"},next:{title:"Other Tasks",permalink:"/integrate/docs/category/other-tasks"}},o={},a=[{value:"Task Properties",id:"task-properties",level:2},{value:"Action Properties",id:"action-properties",level:2},{value:"Common properties",id:"common-properties",level:3},{value:"Context reduction properties",id:"context-reduction-properties",level:3},{value:"Context modification properties",id:"context-modification-properties",level:3},{value:"Other properties",id:"other-properties",level:3},{value:"Example",id:"example",level:2}];function c(e){const t={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,s.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(t.h1,{id:"mainapplication-task-configuration-main_application",children:["MainApplication Task Configuration (",(0,n.jsx)(t.code,{children:"main_application"}),")"]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.em,{children:"Modify MainApplication java or kt file"})}),"\n",(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.code,{children:"main_application"})," task is designed to facilitate modifications to the ",(0,n.jsx)(t.code,{children:"MainApplication"})," java or kotlin files in Android projects. It is the main entry file of the android application. This task provides the flexibility to make changes to different sections of the ",(0,n.jsx)(t.code,{children:"MainApplication"})," java or kotlin file."]}),"\n",(0,n.jsx)(t.h2,{id:"task-properties",children:"Task Properties"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,n.jsx)(t.th,{children:"Description"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"type"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:'"main_application", required'}),(0,n.jsx)(t.td,{children:'Specifies the task type, which should be set to "main_application" for this task.'})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"name"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,n.jsxs)(t.td,{children:["An optional name for the task. If provided, the task state will be saved as a variable. Visit ",(0,n.jsx)(t.a,{href:"../guides/states",children:"Task and Action States"})," page to learn more."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"label"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,n.jsx)(t.td,{children:"An optional label or description for the task."})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"when"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"object"}),(0,n.jsxs)(t.td,{children:["Visit ",(0,n.jsx)(t.a,{href:"../guides/when",children:"Conditional Tasks and Actions"})," page to learn how to execute task conditionally."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"lang"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:'"java" (default) or "kotlin"'}),(0,n.jsxs)(t.td,{children:['Specifies the language of the file, distinguishing between the java and kt file. It helps determine which MainApplication file to modify during the configuration process. "java" modifies ',(0,n.jsx)(t.code,{children:"MainApplication.java"}),' file and "kotlin" modifies ',(0,n.jsx)(t.code,{children:"MainApplication.kt"})," file."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"actions"}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:["Array<",(0,n.jsx)(t.a,{href:"#action-properties",children:"Action"}),">, required"]}),(0,n.jsx)(t.td,{children:"An array of action items that define the modifications to be made in the file. Each action item contains the following fields:"})]})]})]}),"\n",(0,n.jsx)(t.h2,{id:"action-properties",children:"Action Properties"}),"\n",(0,n.jsx)(t.h3,{id:"common-properties",children:"Common properties"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,n.jsx)(t.th,{children:"Description"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"name"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,n.jsxs)(t.td,{children:["An optional name for the task. If provided, the task state will be saved as a variable. Visit ",(0,n.jsx)(t.a,{href:"../guides/states",children:"Task and Action States"})," page to learn more."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"when"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"object"}),(0,n.jsxs)(t.td,{children:["Visit ",(0,n.jsx)(t.a,{href:"../guides/when",children:"Conditional Tasks and Actions"}),"  page to learn how to execute action conditionally."]})]})]})]}),"\n",(0,n.jsx)(t.h3,{id:"context-reduction-properties",children:"Context reduction properties"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,n.jsx)(t.th,{children:"Description"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"before"}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,n.jsx)(t.code,{children:"{regex: string, flags: string}"})]}),(0,n.jsxs)(t.td,{children:["Text or code that is used to specify a point within the context where text should be inserted before. It can be a string or an object with a ",(0,n.jsx)(t.code,{children:"regex"})," and ",(0,n.jsx)(t.code,{children:"flags"})," field to perform a regex-based search."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"after"}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,n.jsx)(t.code,{children:"{regex: string, flags: string}"})]}),(0,n.jsxs)(t.td,{children:["Text or code that is used to specify a point within the context where text should be inserted after. It can be a string or an object with a ",(0,n.jsx)(t.code,{children:"regex"})," and ",(0,n.jsx)(t.code,{children:"flags"})," field to perform a regex-based search."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"search"}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,n.jsx)(t.code,{children:"{regex: string, flags: string}"})]}),(0,n.jsx)(t.td,{children:"A string or object (with regex and flags) that narrows the context to a specific text within the method or file."})]})]})]}),"\n",(0,n.jsx)(t.h3,{id:"context-modification-properties",children:"Context modification properties"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,n.jsx)(t.th,{children:"Description"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"prepend"}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,n.jsx)(t.code,{children:"{file: string}"})]}),(0,n.jsxs)(t.td,{children:["Text or code to prepend at the beginning of the specified context. It can be a string or an object with a ",(0,n.jsx)(t.code,{children:"file"})," field that points to a file containing the code to prepend."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"append"}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,n.jsx)(t.code,{children:"{file: string}"})]}),(0,n.jsxs)(t.td,{children:["Text or code to append at the end of the specified context. It can be a string or an object with a ",(0,n.jsx)(t.code,{children:"file"})," field that points to a file containing the code to append."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"replace"}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,n.jsx)(t.code,{children:"{file: string}"})]}),(0,n.jsxs)(t.td,{children:["Text or code to replace the entire specified context. It can be a string or an object with a ",(0,n.jsx)(t.code,{children:"file"})," field that points to a file containing the code to replace."]})]})]})]}),"\n",(0,n.jsx)(t.h3,{id:"other-properties",children:"Other properties"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,n.jsx)(t.th,{children:"Description"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"exact"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"boolean"}),(0,n.jsx)(t.td,{children:"A boolean flag that modifies the whitespace and new line management."})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"strict"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"boolean"}),(0,n.jsxs)(t.td,{children:["Specifies the behavior of the ",(0,n.jsx)(t.code,{children:"before"})," and ",(0,n.jsx)(t.code,{children:"after"})," fields. If set to ",(0,n.jsx)(t.code,{children:"true"}),", the task will throw an error if the text in the ",(0,n.jsx)(t.code,{children:"before"})," or ",(0,n.jsx)(t.code,{children:"after"})," field is not found in the context, otherwise, it will ignore the field."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"ifNotPresent"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,n.jsx)(t.td,{children:"Indicates that the task should only be executed if the specified text or code is not present within the specified context."})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"comment"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,n.jsx)(t.td,{children:"An optional comment to add before the inserted code or text. The comment is purely informational and does not affect the code's functionality."})]})]})]}),"\n",(0,n.jsx)(t.h2,{id:"example",children:"Example"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-yaml",children:'type: main_application\nlabel: "Adding import"\nlang: "kotlin",\nactions:\n  - prepend: import com.some.lib\n'})}),"\n",(0,n.jsxs)(t.p,{children:["In this example, the ",(0,n.jsx)(t.code,{children:"main_application"})," task adds an import to the file."]})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},8453:(e,t,i)=>{i.d(t,{R:()=>r,x:()=>d});var n=i(6540);const s={},l=n.createContext(s);function r(e){const t=n.useContext(l);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),n.createElement(l.Provider,{value:t},e.children)}}}]);