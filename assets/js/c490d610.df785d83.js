"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8728],{3246:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>c,contentTitle:()=>d,default:()=>a,frontMatter:()=>l,metadata:()=>n,toc:()=>o});const n=JSON.parse('{"id":"guides/task-types/ios-tasks/xcode","title":"Xcode Project","description":"Modify Xcode project","source":"@site/docs/guides/task-types/ios-tasks/xcode.md","sourceDirName":"guides/task-types/ios-tasks","slug":"/guides/task-types/ios-tasks/xcode","permalink":"/integrate/docs/guides/task-types/ios-tasks/xcode","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":4,"frontMatter":{"sidebar_position":4,"title":"Xcode Project"},"sidebar":"tutorialSidebar","previous":{"title":"Podfile","permalink":"/integrate/docs/guides/task-types/ios-tasks/podfile"},"next":{"title":"NotificationService.m","permalink":"/integrate/docs/guides/task-types/ios-tasks/notification-service"}}');var s=i(4848),r=i(8453);const l={sidebar_position:4,title:"Xcode Project"},d="Xcode Task Configuration (xcode)",c={},o=[{value:"Task Properties",id:"task-properties",level:2},{value:"Action Properties",id:"action-properties",level:2},{value:"Common properties",id:"common-properties",level:3},{value:"<em>The action item can take these properties based on which action you want to execute.</em>",id:"the-action-item-can-take-these-properties-based-on-which-action-you-want-to-execute",level:4},{value:"Add a resource file",id:"add-a-resource-file",level:3},{value:"Target Property",id:"target-property",level:4},{value:"Add a new target",id:"add-a-new-target",level:3},{value:"Add new capability to a target",id:"add-new-capability-to-a-target",level:3},{value:"Capability",id:"capability",level:4},{value:"BackgroundMode",id:"backgroundmode",level:4},{value:"Controller",id:"controller",level:4},{value:"Routing",id:"routing",level:4},{value:"Set deployment version",id:"set-deployment-version",level:3},{value:"DeploymentVersion",id:"deploymentversion",level:4},{value:"Add configuration",id:"add-configuration",level:3},{value:"Add pre build run script action",id:"add-pre-build-run-script-action",level:3},{value:"Custom script action",id:"custom-script-action",level:3},{value:"Usage Example",id:"usage-example",level:2}];function h(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsxs)(t.h1,{id:"xcode-task-configuration-xcode",children:["Xcode Task Configuration (",(0,s.jsx)(t.code,{children:"xcode"}),")"]})}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.em,{children:"Modify Xcode project"})}),"\n",(0,s.jsx)(t.p,{children:'The "xcode" task is used to manage the iOS xcode project. This task allows you to specify which resources to add and where to add them, either to the\nroot level of the iOS project or to specific target groups within the project.'}),"\n",(0,s.jsx)(t.h2,{id:"task-properties",children:"Task Properties"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"task"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:'"xcode", required'}),(0,s.jsx)(t.td,{children:'Specifies the task type, which should be set to "xcode" for this task.'})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"name"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,s.jsxs)(t.td,{children:["An optional name for the task. If provided, the task state will be saved as a variable. Visit ",(0,s.jsx)(t.a,{href:"../../states",children:"Task and Action States"})," page to learn more."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"label"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,s.jsx)(t.td,{children:"An optional label or description for the task."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"when"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"object"}),(0,s.jsxs)(t.td,{children:["Visit ",(0,s.jsx)(t.a,{href:"../../when",children:"Conditional Tasks and Actions"})," page to learn how to execute task conditionally."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"actions"}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["Array<",(0,s.jsx)(t.a,{href:"#action-properties",children:"Action"}),">, required"]}),(0,s.jsx)(t.td,{children:"An array of action items that define the modifications to be made in the file. Each action item contains the following fields:"})]})]})]}),"\n",(0,s.jsx)(t.h2,{id:"action-properties",children:"Action Properties"}),"\n",(0,s.jsx)(t.h3,{id:"common-properties",children:"Common properties"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"name"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,s.jsxs)(t.td,{children:["An optional name for the task. If provided, the task state will be saved as a variable. Visit ",(0,s.jsx)(t.a,{href:"../../states",children:"Task and Action States"})," page to learn more."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"when"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"object"}),(0,s.jsxs)(t.td,{children:["Visit ",(0,s.jsx)(t.a,{href:"../../when",children:"Conditional Tasks and Actions"}),"  page to learn how to execute action conditionally."]})]})]})]}),"\n",(0,s.jsx)(t.h4,{id:"the-action-item-can-take-these-properties-based-on-which-action-you-want-to-execute",children:(0,s.jsx)(t.em,{children:"The action item can take these properties based on which action you want to execute."})}),"\n",(0,s.jsx)(t.h3,{id:"add-a-resource-file",children:"Add a resource file"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"addFile"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,s.jsx)(t.td,{children:"Specifies the resource file to be added. It can be a string representing the resource file name."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"message"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,s.jsx)(t.td,{children:"A string that serves as the user prompt message when collecting input for file to copy. If provided, this message will replace the default message."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"target"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.a,{href:"#target-property",children:"Target"})}),(0,s.jsx)(t.td,{children:"Specifies the target group within the iOS project where the resource should be added."})]})]})]}),"\n",(0,s.jsx)(t.h4,{id:"target-property",children:"Target Property"}),"\n",(0,s.jsx)(t.p,{children:"Specifies the target group within the iOS project where the resource should be added. It can take the listed values."}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"root"}),": (default) Adds the resource to the project root"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"main"}),": Adds the resource to the main application group"]}),"\n",(0,s.jsx)(t.li,{children:"Or target name or path to add the resource"}),"\n"]}),"\n",(0,s.jsx)(t.h3,{id:"add-a-new-target",children:"Add a new target"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"addTarget"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,s.jsx)(t.td,{children:"Specifies the target name to be added."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"type"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:'"notification-service" or "notification-content"'}),(0,s.jsx)(t.td,{children:'Specifies target type to be added. "notification-service" adds Notification Service Extension and "notification-content" adds Notification Content Extension.'})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"message"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,s.jsx)(t.td,{children:"Specifies the message when requesting the target name from the user."})]})]})]}),"\n",(0,s.jsxs)(t.admonition,{type:"info",children:[(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"name"})," must be specified for this action or you will get a validation error.\nThis action will expose the ",(0,s.jsx)(t.code,{children:"name.target"})," variable which will hold the name of the target which was entered by the user."]}),(0,s.jsx)(t.p,{children:"For example:"}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-yaml",children:"# add a notification service extension \n# with the default name `MyNotificationService`.\n# User can change this when running this action!\n- addTarget: MyNotificationService\n  name: notificationsv # Give it a name\n  type: notification-service\n\n# set extension version to same as main target\n- setDeploymentVersion: $[IOS_DEPLOYMENT_VERSION]\n  target: $[notificationsv.target] # use the name here\n"})})]}),"\n",(0,s.jsx)(t.h3,{id:"add-new-capability-to-a-target",children:"Add new capability to a target"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"addCapability"}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["one of ",(0,s.jsx)(t.a,{href:"#capability",children:"Capability"})]}),(0,s.jsx)(t.td,{children:"Specifies the capability to be added"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"groups"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"Array<string>"}),(0,s.jsxs)(t.td,{children:["Required when ",(0,s.jsx)(t.code,{children:"addCapability"})," is set to ",(0,s.jsx)(t.code,{children:"groups"})," or ",(0,s.jsx)(t.code,{children:"keychain-sharing"})]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"domains"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"Array<string>"}),(0,s.jsxs)(t.td,{children:["Required when ",(0,s.jsx)(t.code,{children:"addCapability"})," is set to ",(0,s.jsx)(t.code,{children:"domains"})]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"modes"}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["Array<",(0,s.jsx)(t.a,{href:"#backgroundmode",children:"BackgroundMode"}),">"]}),(0,s.jsxs)(t.td,{children:["Required when ",(0,s.jsx)(t.code,{children:"addCapability"})," is set to ",(0,s.jsx)(t.code,{children:"background-mode"}),"."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"controllers"}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["Array<",(0,s.jsx)(t.a,{href:"#controller",children:"Controller"}),">"]}),(0,s.jsxs)(t.td,{children:["Required when ",(0,s.jsx)(t.code,{children:"addCapability"})," is set to ",(0,s.jsx)(t.code,{children:"game-controllers"})]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"routing"}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["Array<",(0,s.jsx)(t.a,{href:"#routing",children:"Routing"}),">"]}),(0,s.jsxs)(t.td,{children:["Required when ",(0,s.jsx)(t.code,{children:"addCapability"})," is set to ",(0,s.jsx)(t.code,{children:"maps"}),"."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"target"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"string"}),(0,s.jsx)(t.td,{children:'Specifies the target group within the iOS project where the capability should be added. Setting "main" adds the capability to the main target, otherwise defines the target name or path to add the capability to'})]})]})]}),"\n",(0,s.jsx)(t.h4,{id:"capability",children:"Capability"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"push"}),": Push Notification"]}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"wireless-configuration"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"app-attest"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"data-protection"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"homekit"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"healthkit"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"inter-app-audio"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"increased-memory"})}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"groups"}),": App Groups. Additional ",(0,s.jsx)(t.code,{children:"groups"})," field is required."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"domains"}),": App Domains. Additional ",(0,s.jsx)(t.code,{children:"domains"})," field is required."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"keychain-sharing"}),": Additional ",(0,s.jsx)(t.code,{children:"groups"})," field is required."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"background-mode"}),": Additional ",(0,s.jsx)(t.code,{children:"modes"})," field is required."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"game-controllers"}),": Additional ",(0,s.jsx)(t.code,{children:"controllers"})," field is required."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"maps"}),": Additional ",(0,s.jsx)(t.code,{children:"routing"})," field is required."]}),"\n"]}),"\n",(0,s.jsx)(t.h4,{id:"backgroundmode",children:"BackgroundMode"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"audio"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"bluetooth-central"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"bluetooth-peripheral"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"external-accessory"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"fetch"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"location"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"nearby-interaction"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"processing"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"push-to-talk"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"remote-notification"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"voip"})}),"\n"]}),"\n",(0,s.jsx)(t.h4,{id:"controller",children:"Controller"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"extended"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"micro"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"directional"})}),"\n"]}),"\n",(0,s.jsx)(t.h4,{id:"routing",children:"Routing"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"bike"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"bus"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"car"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"ferry"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"other"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"pedestrian"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"plane"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"ride-share"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"street-car"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"subway"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"taxi"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"train"})}),"\n"]}),"\n",(0,s.jsx)(t.h3,{id:"set-deployment-version",children:"Set deployment version"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"setDeploymentVersion"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.a,{href:"#deploymentversion",children:"DeploymentVersion"})}),(0,s.jsx)(t.td,{children:"Specifies the version to set."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"target"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.a,{href:"#target-property",children:"Target"})}),(0,s.jsx)(t.td,{children:"Specifies the target group within the iOS project where the resource should be added."})]})]})]}),"\n",(0,s.jsx)(t.h4,{id:"deploymentversion",children:"DeploymentVersion"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"string"}),": String representation of the version. Can also be a variable in ",(0,s.jsx)(t.code,{children:"$[variable]"})," form."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"number"}),": Version number"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"(object)"}),":","\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"min"}),": Minimum version to set. The target version is set only if it is lower than this value."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"max"}),": Maximum version to set. The target version is set only if it is higher than this value."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(t.h3,{id:"add-configuration",children:"Add configuration"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"addConfiguration"}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,s.jsx)(t.code,{children:"{file: string}"})]}),(0,s.jsxs)(t.td,{children:["Creates or updates xcconfig configuration file.  It can be a string or an object with a ",(0,s.jsx)(t.code,{children:"file"})," field that points to a file containing the code to append."]})]})})]}),"\n",(0,s.jsx)(t.h3,{id:"add-pre-build-run-script-action",children:"Add pre build run script action"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"addPreBuildRunScriptAction"}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,s.jsx)(t.code,{children:"{file: string}"})]}),(0,s.jsxs)(t.td,{children:["Adds a pre build run script action into shared scheme.  It can be a string or an object with a ",(0,s.jsx)(t.code,{children:"file"})," field that points to a file containing the code to append."]})]})})]}),"\n",(0,s.jsx)(t.h3,{id:"custom-script-action",children:"Custom script action"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Property"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"script"}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["string or ",(0,s.jsx)(t.code,{children:"(project: XcodeProject) => any"})]}),(0,s.jsxs)(t.td,{children:["Run custom js using xcode project from ",(0,s.jsx)(t.code,{children:"xcode"})," module. You can define as string in yml to evaluate or as function in your modules or other scripts."]})]})})]}),"\n",(0,s.jsx)(t.h2,{id:"usage-example",children:"Usage Example"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-yaml",children:'task: xcode\nactions:\n  - addFile: "GoogleService-Info.plist"\n    target: root\n  - addTarget: OneSignalNotificationService\n    type: notification-extension\n'})}),"\n",(0,s.jsxs)(t.p,{children:["In this example, a resource and a new target, ",(0,s.jsx)(t.code,{children:"GoogleService-Info.plist"})," and ",(0,s.jsx)(t.code,{children:"OneSignalNotificationService"})," are specified for addition. The ",(0,s.jsx)(t.code,{children:"target"}),"\nfield distinguishes the target groups within the iOS project where each resource should be placed."]})]})}function a(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},8453:(e,t,i)=>{i.d(t,{R:()=>l,x:()=>d});var n=i(6540);const s={},r=n.createContext(s);function l(e){const t=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:l(e.components),n.createElement(r.Provider,{value:t},e.children)}}}]);