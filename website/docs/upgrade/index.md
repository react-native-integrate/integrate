---
sidebar_position: 3
---
# Upgrade React Native

You can use this tool to assist you while upgrading your project to new React Native versions.

## Steps to follow

Before this tool steps in, developer is responsible of taking some actions.

### 1. Create `upgrade.yml` in `.upgrade` folder

You can read more about `upgrade.yml` on the next page. In short, it guides the upgrade progress. Think it like a config plugin for your own project. You have to prepare this file only once and update it whenever you need to make native changes yourself. Third party integrations are handled automatically if they are supported.

:::tip
Run [`info` command](./info) to check if a package is available for integration.
:::
   
Example upgrade file:
```yml
imports:
  - .husky #third party generated folders
  - assets #folders that are created by you for scripts or assets like fonts images etc.
  - android/app/src/main/res/values/ic_launcher_background.xml #any files that do not come with default RN template
  - src #main JS/TS folder
  - patches #patch folder used by patch-package
  - app.json #required
  - index.js #required
  - lint-staged.config.js #other config files
  - react-native.config.js #if you have one
  - App.tsx #required if it is not in src
  - tsconfig.json #required
steps:
  - task: android_manifest #An example task that adds a permission to manifest that your app use
    label: Adding permissions to AndroidManifest.xml
    actions:
      - before: <application
        append: |-
          <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
          <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

  - task: plist #An example info.plist task that applies changes to the new info.plist
    label: Setting keys in Info.plist
    actions:
      - set:
          NSCameraUsageDescription: $(PRODUCT_NAME) would like to use your camera
          NSMicrophoneUsageDescription: $(PRODUCT_NAME) would like to use your microphone (for videos)
          NSPhotoLibraryAddUsageDescription: $(PRODUCT_NAME) would like to save photos to your photo gallery
          UISupportedInterfaceOrientations:
            - UIInterfaceOrientationPortrait
            - UIInterfaceOrientationLandscapeLeft
            - UIInterfaceOrientationLandscapeRight
          UIUserInterfaceStyle: Light
          UIViewControllerBasedStatusBarAppearance: false
        strategy: assign

  - task: xcode #Example xcode modifier that changes ios deployment version
    label: Setting Deployment Target
    actions:
      - setDeploymentVersion:
          min: 15.5
        target: root

  - task: podfile #Example Podfile modifier that changes ios deployment version
    label: Modifying Podfile
    actions:
      - search:
          regex: platform :ios,.*
        replace: platform :ios, '$[IOS_DEPLOYMENT_VERSION]'

  - task: fs  #Example shell command to remove detault App.tsx, in case you have it in src folder
    label: Removing default App.tsx
    actions:
      - removeFile: App.tsx
```

### 2. Let the magic happen

Run the upgrade command.

```bash
npx react-native-integrate upgrade

# or, if you've installed it globally
rnu
```

#### Optional manual mode

Normally `upgrade` command creates a new project, applies changes and uses git commands to commit and push changes to a new branch. If you have permission issues, you can try the manual mode.

Follow step 1 above, then create a new project manually and run upgrade command in the new project folder:
```bash
npx react-native-integrate upgrade --manual

# or, if you've installed it globally
rnu -m
```

## How it works?

It works by keeping track of every integration.

- Integrated packages are saved in `integrate-lock.json`.
- Prompt inputs are saved in `.upgrade` folder.
- Imported files are also saved in `.upgrade` folder.

When upgrading;
1. First, basic data like display name, bundle ids, icons, versions etc. is imported.
2. Old `package.json` is carefully merged with the new one, without overwriting any dependency.
3. `integrate-lock.json` and `.upgrade` folder is imported.
4. `.git` folder is imported.
5. All previously integrated packages are re-integrated by using input values from `.upgrade/packages`.

   :::tip
   If you don't want to keep track of user inputs, you can delete `.upgrade` or add it to .gitignore.

   `upgrade` command will ask inputs from you on the process if it cannot find in `.upgrade` folder.
   :::
6. If exists, files in `.upgrade/imports` folder will be copied to their respective paths.
7. If exists, [`.upgrade/upgrade.yml` configuration file](./upgrade/configuration) will be executed.
