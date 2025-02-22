"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2553],{8453:(e,n,i)=>{i.d(n,{R:()=>a,x:()=>s});var t=i(6540);const r={},o=t.createContext(r);function a(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),t.createElement(o.Provider,{value:n},e.children)}},9399:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>a,default:()=>p,frontMatter:()=>o,metadata:()=>s,toc:()=>l});var t=i(4848),r=i(8453);const o={sidebar_position:3},a="Upgrade React Native",s={id:"upgrade/index",title:"Upgrade React Native",description:"You can use this tool to assist you while upgrading your project to new React Native versions.",source:"@site/docs/upgrade/index.md",sourceDirName:"upgrade",slug:"/upgrade/",permalink:"/integrate/docs/upgrade/",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Info",permalink:"/integrate/docs/info"},next:{title:".upgrade folder",permalink:"/integrate/docs/upgrade/upgrade-folder"}},d={},l=[{value:"Steps to follow",id:"steps-to-follow",level:2},{value:"1. Create <code>upgrade.yml</code> in <code>.upgrade</code> folder",id:"1-create-upgradeyml-in-upgrade-folder",level:3},{value:"2. Create a new React Native project",id:"2-create-a-new-react-native-project",level:3},{value:"3. Let the magic happen",id:"3-let-the-magic-happen",level:3},{value:"How it works?",id:"how-it-works",level:2}];function c(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"upgrade-react-native",children:"Upgrade React Native"}),"\n",(0,t.jsx)(n.p,{children:"You can use this tool to assist you while upgrading your project to new React Native versions."}),"\n",(0,t.jsx)(n.h2,{id:"steps-to-follow",children:"Steps to follow"}),"\n",(0,t.jsx)(n.p,{children:"Before this tool steps in, developer is responsible of taking some actions."}),"\n",(0,t.jsxs)(n.h3,{id:"1-create-upgradeyml-in-upgrade-folder",children:["1. Create ",(0,t.jsx)(n.code,{children:"upgrade.yml"})," in ",(0,t.jsx)(n.code,{children:".upgrade"})," folder"]}),"\n",(0,t.jsxs)(n.p,{children:["You can read more about ",(0,t.jsx)(n.code,{children:"upgrade.yml"})," on the next page. In short, it guides the upgrade progress. Think it like a config plugin for your own project. You have to prepare this file only once and update it whenever you need to make native changes yourself. Third party integrations are handled automatically if they are supported."]}),"\n",(0,t.jsx)(n.admonition,{type:"tip",children:(0,t.jsxs)(n.p,{children:["Run ",(0,t.jsxs)(n.a,{href:"./info",children:[(0,t.jsx)(n.code,{children:"info"})," command"]})," to check if a package is available for integration."]})}),"\n",(0,t.jsx)(n.p,{children:"Example upgrade file:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yml",children:'imports:\n  - .husky #third party generated folders\n  - assets #folders that are created by you for scripts or assets like fonts images etc.\n  - android/app/src/main/res/values/ic_launcher_background.xml #any files that do not come with default RN template\n  - src #main JS/TS folder\n  - patches #patch folder used by patch-package\n  - app.json #required\n  - index.js #required\n  - lint-staged.config.js #other config files\n  - react-native.config.js #if you have one\n  - App.tsx #required if it is not in src\n  - tsconfig.json #required\nsteps:\n  - task: android_manifest #An example task that adds a permission to manifest that your app use\n    label: Adding permissions to AndroidManifest.xml\n    actions:\n      - before: <application\n        append: |-\n          <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />\n          <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />\n\n  - task: plist #An example info.plist task that applies changes to the new info.plist\n    label: Setting keys in Info.plist\n    actions:\n      - set:\n          NSCameraUsageDescription: $(PRODUCT_NAME) would like to use your camera\n          NSMicrophoneUsageDescription: $(PRODUCT_NAME) would like to use your microphone (for videos)\n          NSPhotoLibraryAddUsageDescription: $(PRODUCT_NAME) would like to save photos to your photo gallery\n          UISupportedInterfaceOrientations:\n            - UIInterfaceOrientationPortrait\n            - UIInterfaceOrientationLandscapeLeft\n            - UIInterfaceOrientationLandscapeRight\n          UIUserInterfaceStyle: Light\n          UIViewControllerBasedStatusBarAppearance: false\n        strategy: assign\n\n  - task: xcode #Example xcode modifier that changes ios deployment version\n    label: Setting Deployment Target\n    actions:\n      - setDeploymentVersion:\n          min: 15.5\n        target: root\n\n  - task: podfile #Example Podfile modifier that changes ios deployment version\n    label: Modifying Podfile\n    actions:\n      - search:\n          regex: platform :ios,.*\n        replace: platform :ios, \'$[IOS_DEPLOYMENT_VERSION]\'\n\n  - task: fs  #Example shell command to remove detault App.tsx, in case you have it in src folder\n    label: Removing default App.tsx\n    actions:\n      - removeFile: App.tsx\n'})}),"\n",(0,t.jsx)(n.h3,{id:"2-create-a-new-react-native-project",children:"2. Create a new React Native project"}),"\n",(0,t.jsxs)(n.p,{children:["Follow instructions on ",(0,t.jsx)(n.a,{href:"https://reactnative.dev/docs/environment-setup#creating-a-new-application",children:"the official RN page"})," to create a new project with the latest RN version."]}),"\n",(0,t.jsx)(n.h3,{id:"3-let-the-magic-happen",children:"3. Let the magic happen"}),"\n",(0,t.jsx)(n.p,{children:"While in new project folder, run the upgrade command."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npx react-native-integrate upgrade\n\n# or, if you've installed it globally\nrnu\n"})}),"\n",(0,t.jsx)(n.h2,{id:"how-it-works",children:"How it works?"}),"\n",(0,t.jsx)(n.p,{children:"It works by keeping track of every integration."}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Integrated packages are saved in ",(0,t.jsx)(n.code,{children:"integrate-lock.json"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:["Prompt inputs are saved in ",(0,t.jsx)(n.code,{children:".upgrade"})," folder."]}),"\n",(0,t.jsxs)(n.li,{children:["Imported files are also saved in ",(0,t.jsx)(n.code,{children:".upgrade"})," folder."]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"When upgrading;"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"First, basic data like display name, bundle ids, icons, versions etc. is imported."}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Old ",(0,t.jsx)(n.code,{children:"package.json"})," is carefully merged with the new one, without overwriting any dependency."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"integrate-lock.json"})," and ",(0,t.jsx)(n.code,{children:".upgrade"})," folder is imported."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:".git"})," folder is imported."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["All previously integrated packages are re-integrated by using input values from ",(0,t.jsx)(n.code,{children:".upgrade/packages"}),"."]}),"\n",(0,t.jsxs)(n.admonition,{type:"tip",children:[(0,t.jsxs)(n.p,{children:["If you don't want to keep track of user inputs, you can delete ",(0,t.jsx)(n.code,{children:".upgrade"})," or add it to .gitignore."]}),(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"upgrade"})," command will ask inputs from you on the process if it cannot find in ",(0,t.jsx)(n.code,{children:".upgrade"})," folder."]})]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["If exists, files in ",(0,t.jsx)(n.code,{children:".upgrade/imports"})," folder will be copied to their respective paths."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["If exists, ",(0,t.jsxs)(n.a,{href:"./upgrade/configuration",children:[(0,t.jsx)(n.code,{children:".upgrade/upgrade.yml"})," configuration file"]})," will be executed."]}),"\n"]}),"\n"]})]})}function p(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}}}]);