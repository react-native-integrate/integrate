"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5468],{3622:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>o,contentTitle:()=>r,default:()=>a,frontMatter:()=>l,metadata:()=>d,toc:()=>c});var n=i(4848),s=i(8453);const l={sidebar_position:1,title:"AppDelegate.mm"},r="App Delegate Task Configuration (app_delegate)",d={id:"for-developers/ios-tasks/app_delegate",title:"AppDelegate.mm",description:"Modify AppDelegate.mm file",source:"@site/docs/for-developers/ios-tasks/app_delegate.md",sourceDirName:"for-developers/ios-tasks",slug:"/for-developers/ios-tasks/app_delegate",permalink:"/integrate/docs/for-developers/ios-tasks/app_delegate",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,title:"AppDelegate.mm"},sidebar:"tutorialSidebar",previous:{title:"iOS Modifications",permalink:"/integrate/docs/category/ios-modifications"},next:{title:"Info.plist",permalink:"/integrate/docs/for-developers/ios-tasks/plist"}},o={},c=[{value:"Task Properties",id:"task-properties",level:2},{value:"Action Properties",id:"action-properties",level:2},{value:"Common properties",id:"common-properties",level:3},{value:"Context reduction properties",id:"context-reduction-properties",level:3},{value:"Context modification properties",id:"context-modification-properties",level:3},{value:"Other properties",id:"other-properties",level:3},{value:"Allowed Method Names",id:"allowed-method-names",level:3},{value:"Example",id:"example",level:2}];function h(e){const t={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,s.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(t.h1,{id:"app-delegate-task-configuration-app_delegate",children:["App Delegate Task Configuration (",(0,n.jsx)(t.code,{children:"app_delegate"}),")"]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.em,{children:"Modify AppDelegate.mm file"})}),"\n",(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.code,{children:"app_delegate"})," task is used to modify the AppDelegate.mm file in an iOS project. This task allows you to insert code, import statements, or comments into specific methods within the AppDelegate.mm file. The modifications can be made before or after a specified point in the method. This task is particularly useful for integrating third-party libraries or SDKs that require changes to the AppDelegate file."]}),"\n",(0,n.jsx)(t.h2,{id:"task-properties",children:"Task Properties"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,n.jsx)(t.th,{children:"Description"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"type"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:'"app_delegate", required'}),(0,n.jsx)(t.td,{children:'Specifies the task type, which should be set to "app_delegate" for this task.'})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"name"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,n.jsxs)(t.td,{children:["An optional name for the task. If provided, the task state will be saved as a variable. Visit ",(0,n.jsx)(t.a,{href:"../guides/states",children:"Task and Action States"})," page to learn more."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"label"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,n.jsx)(t.td,{children:"An optional label or description for the task."})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"when"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"object"}),(0,n.jsxs)(t.td,{children:["Visit ",(0,n.jsx)(t.a,{href:"../guides/when",children:"Conditional Tasks and Actions"})," page to learn how to execute task conditionally."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"actions"}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:["Array<",(0,n.jsx)(t.a,{href:"#action-properties",children:"Action"}),">, required"]}),(0,n.jsx)(t.td,{children:"An array of action items that define the modifications to be made in the file."})]})]})]}),"\n",(0,n.jsx)(t.h2,{id:"action-properties",children:"Action Properties"}),"\n",(0,n.jsx)(t.h3,{id:"common-properties",children:"Common properties"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,n.jsx)(t.th,{children:"Description"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"name"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,n.jsxs)(t.td,{children:["An optional name for the task. If provided, the task state will be saved as a variable. Visit ",(0,n.jsx)(t.a,{href:"../guides/states",children:"Task and Action States"})," page to learn more."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"when"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"object"}),(0,n.jsxs)(t.td,{children:["Visit ",(0,n.jsx)(t.a,{href:"../guides/when",children:"Conditional Tasks and Actions"}),"  page to learn how to execute action conditionally."]})]})]})]}),"\n",(0,n.jsx)(t.h3,{id:"context-reduction-properties",children:"Context reduction properties"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,n.jsx)(t.th,{children:"Description"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"block"}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:["one of ",(0,n.jsx)(t.a,{href:"#allowed-method-names",children:"Allowed Method Names"})]}),(0,n.jsxs)(t.td,{children:["Specifies the name of the method within AppDelegate.mm where the modification should be applied. It must match one of the allowed method names. See ",(0,n.jsx)(t.a,{href:"#allowed-method-names",children:"Allowed Method Names"})," section for details. Omitting this field instructs the action item to modify whole file."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"before"}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,n.jsx)(t.code,{children:"{regex: string, flags: string}"})]}),(0,n.jsxs)(t.td,{children:["Text or code that is used to specify a point within the context where text should be inserted before. It can be a string or an object with a ",(0,n.jsx)(t.code,{children:"regex"})," and ",(0,n.jsx)(t.code,{children:"flags"})," field to perform a regex-based search."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"after"}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,n.jsx)(t.code,{children:"{regex: string, flags: string}"})]}),(0,n.jsxs)(t.td,{children:["Text or code that is used to specify a point within the context where text should be inserted after. It can be a string or an object with a ",(0,n.jsx)(t.code,{children:"regex"})," and ",(0,n.jsx)(t.code,{children:"flags"})," field to perform a regex-based search."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"search"}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,n.jsx)(t.code,{children:"{regex: string, flags: string}"})]}),(0,n.jsx)(t.td,{children:"A string or object (with regex and flags) that narrows the context to a specific text within the method or file."})]})]})]}),"\n",(0,n.jsx)(t.h3,{id:"context-modification-properties",children:"Context modification properties"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,n.jsx)(t.th,{children:"Description"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"prepend"}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,n.jsx)(t.code,{children:"{file: string}"})]}),(0,n.jsxs)(t.td,{children:["Text or code to prepend at the beginning of the specified context. It can be a string or an object with a ",(0,n.jsx)(t.code,{children:"file"})," field that points to a file containing the code to prepend."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"append"}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,n.jsx)(t.code,{children:"{file: string}"})]}),(0,n.jsxs)(t.td,{children:["Text or code to append at the end of the specified context. It can be a string or an object with a ",(0,n.jsx)(t.code,{children:"file"})," field that points to a file containing the code to append."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"replace"}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,n.jsx)(t.code,{children:"{file: string}"})]}),(0,n.jsxs)(t.td,{children:["Text or code to replace the entire specified context. It can be a string or an object with a ",(0,n.jsx)(t.code,{children:"file"})," field that points to a file containing the code to replace."]})]})]})]}),"\n",(0,n.jsx)(t.h3,{id:"other-properties",children:"Other properties"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,n.jsx)(t.th,{children:"Description"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"exact"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"boolean"}),(0,n.jsx)(t.td,{children:"A boolean flag that modifies the whitespace and new line management."})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"strict"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"boolean"}),(0,n.jsxs)(t.td,{children:["Specifies the behavior of the ",(0,n.jsx)(t.code,{children:"before"})," and ",(0,n.jsx)(t.code,{children:"after"})," fields. If set to ",(0,n.jsx)(t.code,{children:"true"}),", the task will throw an error if the text in the ",(0,n.jsx)(t.code,{children:"before"})," or ",(0,n.jsx)(t.code,{children:"after"})," field is not found in the context, otherwise, it will ignore the field."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"ifNotPresent"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,n.jsx)(t.td,{children:"Indicates that the task should only be executed if the specified text or code is not present within the specified context."})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"comment"}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,n.jsx)(t.td,{children:"An optional comment to add before the inserted code or text. The comment is purely informational and does not affect the code's functionality."})]})]})]}),"\n",(0,n.jsx)(t.h3,{id:"allowed-method-names",children:"Allowed Method Names"}),"\n",(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.code,{children:"block"})," field within the action items must match one of the allowed method names within the AppDelegate.mm file. The method is created if it does not exist. The following method names are allowed:"]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"didFinishLaunchingWithOptions"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"applicationDidBecomeActive"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"applicationWillResignActive"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"applicationDidEnterBackground"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"applicationWillEnterForeground"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"applicationWillTerminate"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"openURL"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"restorationHandler"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"didRegisterForRemoteNotificationsWithDeviceToken"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"didFailToRegisterForRemoteNotificationsWithError"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"didReceiveRemoteNotification"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"fetchCompletionHandler"})}),"\n"]}),"\n",(0,n.jsx)(t.h2,{id:"example",children:"Example"}),"\n",(0,n.jsxs)(t.p,{children:["Here's an example of how to use the ",(0,n.jsx)(t.code,{children:"app_delegate"})," task:"]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-yaml",children:'type: app_delegate\nlabel: "Integrate Firebase"\nactions:\n  - prepend: "#import <Firebase.h>"\n  - block: "didFinishLaunchingWithOptions"\n    prepend: "[FIRApp configure];"\n  - block: "openURL"\n    before: "return YES;"\n    append: "// Handle custom URL schemes here."\n'})}),"\n",(0,n.jsx)(t.p,{children:'In this example, the task is labeled "Integrate Firebase." It defines three action items:'}),"\n",(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsxs)(t.p,{children:["It prepends the header import to the file ",(0,n.jsx)(t.code,{children:"#import <Firebase.h>"}),"."]}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsxs)(t.p,{children:["In the ",(0,n.jsx)(t.code,{children:"didFinishLaunchingWithOptions"})," method, it prepends the code ",(0,n.jsx)(t.code,{children:"[FIRApp configure];"}),"."]}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsxs)(t.p,{children:["In the ",(0,n.jsx)(t.code,{children:"openURL"})," method, it adds a comment before the ",(0,n.jsx)(t.code,{children:"return YES;"})," statement, followed by code to handle custom URL schemes."]}),"\n"]}),"\n"]})]})}function a(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},8453:(e,t,i)=>{i.d(t,{R:()=>r,x:()=>d});var n=i(6540);const s={},l=n.createContext(s);function r(e){const t=n.useContext(l);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),n.createElement(l.Provider,{value:t},e.children)}}}]);