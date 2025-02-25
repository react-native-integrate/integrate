"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7391],{1680:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>d,contentTitle:()=>o,default:()=>u,frontMatter:()=>s,metadata:()=>t,toc:()=>l});const t=JSON.parse('{"id":"upgrade/upgrade-folder","title":".upgrade folder","description":"This is a special folder containing files and data required for upgrades. Integrations often require developer input such as configuration files, API keys, etc. We preserve these values in this folder to use later during upgrades, so they are not requested again from developer.","source":"@site/docs/upgrade/upgrade-folder.md","sourceDirName":"upgrade","slug":"/upgrade/upgrade-folder","permalink":"/integrate/docs/upgrade/upgrade-folder","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1},"sidebar":"tutorialSidebar","previous":{"title":"Upgrade React Native","permalink":"/integrate/docs/upgrade/"},"next":{"title":"Configuration","permalink":"/integrate/docs/upgrade/configuration"}}');var i=n(4848),a=n(8453);const s={sidebar_position:1},o=".upgrade folder",d={},l=[{value:"Structure",id:"structure",level:2},{value:"\ud83d\udcc1 imports",id:"-imports",level:3},{value:"\ud83d\udcc1 packages",id:"-packages",level:3},{value:"\ud83d\udcc4 upgrade.yml",id:"-upgradeyml",level:3}];function p(e){const r={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(r.header,{children:(0,i.jsx)(r.h1,{id:"upgrade-folder",children:".upgrade folder"})}),"\n",(0,i.jsx)(r.p,{children:"This is a special folder containing files and data required for upgrades. Integrations often require developer input such as configuration files, API keys, etc. We preserve these values in this folder to use later during upgrades, so they are not requested again from developer."}),"\n",(0,i.jsx)(r.p,{children:"This folder and all of its sub-folders are optional."}),"\n",(0,i.jsx)(r.h2,{id:"structure",children:"Structure"}),"\n",(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{children:".upgrade/\n\u251c\u2500\u2500 imports/ \n\u2502   \u2514\u2500\u2500 files to be restored during upgrade\n\u251c\u2500\u2500 packages/\n\u2502   \u2514\u2500\u2500 some-package/\n\u2502       \u251c\u2500\u2500 files/\n\u2502       \u2502   \u2514\u2500\u2500 imported files of some-package\n\u2502       \u2514\u2500\u2500 upgrade.json\n\u2514\u2500\u2500 upgrade.yml\n"})}),"\n",(0,i.jsx)(r.h3,{id:"-imports",children:"\ud83d\udcc1 imports"}),"\n",(0,i.jsx)(r.p,{children:"Files in this folder will be copied directly to the root with their respective paths."}),"\n",(0,i.jsxs)(r.p,{children:["For instance, a file located at ",(0,i.jsx)(r.code,{children:".upgrade/imports/android/app/some.file"})," will be copied to ",(0,i.jsx)(r.code,{children:"android/app/some.file"}),"."]}),"\n",(0,i.jsx)(r.h3,{id:"-packages",children:"\ud83d\udcc1 packages"}),"\n",(0,i.jsx)(r.p,{children:"This folder is managed by this tool, and you are not supposed to make any changes here."}),"\n",(0,i.jsx)(r.h3,{id:"-upgradeyml",children:"\ud83d\udcc4 upgrade.yml"}),"\n",(0,i.jsxs)(r.p,{children:["Additional native code changes can be defined here to be executed during upgrade. ",(0,i.jsx)(r.a,{href:"configuration",children:"Learn more"})]})]})}function u(e={}){const{wrapper:r}={...(0,a.R)(),...e.components};return r?(0,i.jsx)(r,{...e,children:(0,i.jsx)(p,{...e})}):p(e)}},8453:(e,r,n)=>{n.d(r,{R:()=>s,x:()=>o});var t=n(6540);const i={},a=t.createContext(i);function s(e){const r=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function o(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),t.createElement(a.Provider,{value:r},e.children)}}}]);