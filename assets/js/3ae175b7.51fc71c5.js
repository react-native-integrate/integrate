"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2296],{2856:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>h,frontMatter:()=>r,metadata:()=>d,toc:()=>c});var s=i(4848),n=i(8453);const r={sidebar_position:3,title:"settings.gradle"},l="Settings Gradle Task Configuration (settings_gradle)",d={id:"for-developers/guides/task-types/android-tasks/settings-gradle",title:"settings.gradle",description:"Modify settings.gradle file",source:"@site/docs/for-developers/guides/task-types/android-tasks/settings-gradle.md",sourceDirName:"for-developers/guides/task-types/android-tasks",slug:"/for-developers/guides/task-types/android-tasks/settings-gradle",permalink:"/integrate/docs/for-developers/guides/task-types/android-tasks/settings-gradle",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,title:"settings.gradle"},sidebar:"tutorialSidebar",previous:{title:"build.gradle",permalink:"/integrate/docs/for-developers/guides/task-types/android-tasks/build-gradle"},next:{title:"strings.xml",permalink:"/integrate/docs/for-developers/guides/task-types/android-tasks/strings-xml"}},o={},c=[{value:"Task Properties",id:"task-properties",level:2},{value:"Action Properties",id:"action-properties",level:2},{value:"Common properties",id:"common-properties",level:3},{value:"Context reduction properties",id:"context-reduction-properties",level:3},{value:"Context modification properties",id:"context-modification-properties",level:3},{value:"Other properties",id:"other-properties",level:3},{value:"Example",id:"example",level:2}];function a(e){const t={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,n.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(t.h1,{id:"settings-gradle-task-configuration-settings_gradle",children:["Settings Gradle Task Configuration (",(0,s.jsx)(t.code,{children:"settings_gradle"}),")"]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.em,{children:"Modify settings.gradle file"})}),"\n",(0,s.jsxs)(t.p,{children:["The ",(0,s.jsx)(t.code,{children:"settings_gradle"})," task is designed to facilitate modifications to the ",(0,s.jsx)(t.code,{children:"settings.gradle"})," files in Android projects. It is the main entry file of\nthe android application. This task provides the flexibility to make changes to different sections of the ",(0,s.jsx)(t.code,{children:"settings.gradle"})," file."]}),"\n",(0,s.jsx)(t.h2,{id:"task-properties",children:"Task Properties"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"task"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:'"settings_gradle", required'}),(0,s.jsx)(t.td,{children:'Specifies the task type, which should be set to "settings_gradle" for this task.'})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"name"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,s.jsxs)(t.td,{children:["An optional name for the task. If provided, the task state will be saved as a variable. Visit ",(0,s.jsx)(t.a,{href:"../../states",children:"Task and Action States"})," page to learn more."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"label"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,s.jsx)(t.td,{children:"An optional label or description for the task."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"when"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"object"}),(0,s.jsxs)(t.td,{children:["Visit ",(0,s.jsx)(t.a,{href:"../../when",children:"Conditional Tasks and Actions"})," page to learn how to execute task conditionally."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"actions"}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["Array<",(0,s.jsx)(t.a,{href:"#action-properties",children:"Action"}),">, required"]}),(0,s.jsx)(t.td,{children:"An array of action items that define the modifications to be made in the file. Each action item contains the following fields:"})]})]})]}),"\n",(0,s.jsx)(t.h2,{id:"action-properties",children:"Action Properties"}),"\n",(0,s.jsx)(t.h3,{id:"common-properties",children:"Common properties"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"name"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,s.jsxs)(t.td,{children:["An optional name for the task. If provided, the task state will be saved as a variable. Visit ",(0,s.jsx)(t.a,{href:"../../states",children:"Task and Action States"})," page to learn more."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"when"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"object"}),(0,s.jsxs)(t.td,{children:["Visit ",(0,s.jsx)(t.a,{href:"../../when",children:"Conditional Tasks and Actions"}),"  page to learn how to execute action conditionally."]})]})]})]}),"\n",(0,s.jsx)(t.h3,{id:"context-reduction-properties",children:"Context reduction properties"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"before"}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,s.jsx)(t.code,{children:"{regex: string, flags: string}"})]}),(0,s.jsxs)(t.td,{children:["Text or code that is used to specify a point within the context where text should be inserted before. It can be a string or an object with a ",(0,s.jsx)(t.code,{children:"regex"})," and ",(0,s.jsx)(t.code,{children:"flags"})," field to perform a regex-based search."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"after"}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,s.jsx)(t.code,{children:"{regex: string, flags: string}"})]}),(0,s.jsxs)(t.td,{children:["Text or code that is used to specify a point within the context where text should be inserted after. It can be a string or an object with a ",(0,s.jsx)(t.code,{children:"regex"})," and ",(0,s.jsx)(t.code,{children:"flags"})," field to perform a regex-based search."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"search"}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,s.jsx)(t.code,{children:"{regex: string, flags: string}"})]}),(0,s.jsx)(t.td,{children:"A string or object (with regex and flags) that narrows the context to a specific text within the method or file."})]})]})]}),"\n",(0,s.jsx)(t.h3,{id:"context-modification-properties",children:"Context modification properties"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"prepend"}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,s.jsx)(t.code,{children:"{file: string}"})]}),(0,s.jsxs)(t.td,{children:["Text or code to prepend at the beginning of the specified context. It can be a string or an object with a ",(0,s.jsx)(t.code,{children:"file"})," field that points to a file containing the code to prepend."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"append"}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,s.jsx)(t.code,{children:"{file: string}"})]}),(0,s.jsxs)(t.td,{children:["Text or code to append at the end of the specified context. It can be a string or an object with a ",(0,s.jsx)(t.code,{children:"file"})," field that points to a file containing the code to append."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"replace"}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,s.jsx)(t.code,{children:"{file: string}"})]}),(0,s.jsxs)(t.td,{children:["Text or code to replace the entire specified context. It can be a string or an object with a ",(0,s.jsx)(t.code,{children:"file"})," field that points to a file containing the code to replace."]})]})]})]}),"\n",(0,s.jsx)(t.h3,{id:"other-properties",children:"Other properties"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"exact"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"boolean"}),(0,s.jsx)(t.td,{children:"A boolean flag that modifies the whitespace and new line management."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"strict"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"boolean"}),(0,s.jsxs)(t.td,{children:["Specifies the behavior of the ",(0,s.jsx)(t.code,{children:"before"})," and ",(0,s.jsx)(t.code,{children:"after"})," fields. If set to ",(0,s.jsx)(t.code,{children:"true"}),", the task will throw an error if the text in the ",(0,s.jsx)(t.code,{children:"before"})," or ",(0,s.jsx)(t.code,{children:"after"})," field is not found in the context, otherwise, it will ignore the field."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"ifNotPresent"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,s.jsx)(t.td,{children:"Indicates that the task should only be executed if the specified text or code is not present within the specified context."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"comment"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,s.jsx)(t.td,{children:"An optional comment to add before the inserted code or text. The comment is purely informational and does not affect the code's functionality."})]})]})]}),"\n",(0,s.jsx)(t.h2,{id:"example",children:"Example"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-yaml",children:"task: settings_gradle\nlabel: \"Including code push\"\nactions:\n  - append: |-\n      include ':app', ':react-native-code-push'\n      project(':react-native-code-push').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-code-push/android/app')\n"})}),"\n",(0,s.jsxs)(t.p,{children:["In this example, the ",(0,s.jsx)(t.code,{children:"settings_gradle"})," task adds an import to the file."]})]})}function h(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(a,{...e})}):a(e)}},8453:(e,t,i)=>{i.d(t,{R:()=>l,x:()=>d});var s=i(6540);const n={},r=s.createContext(n);function l(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:l(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);