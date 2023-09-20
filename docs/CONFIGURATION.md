Configuration File (`integrate.yml`)
==================

The configuration file is where you define the overall structure of your integration process. It includes various sections and fields to customize and control the behavior of the integration process.

Env
---

The `env` section allows you to define variables that can be used throughout the configuration. These variables can hold values that you want to reuse in different parts of your tasks. Variables defined in `env` can be referenced using the `$[var_name]` convention.

#### Example:

```yaml
env:
  app_id: your_app_id
```
Check [Variables](VARIABLES.md) page to learn more about how to assign and use variables in configuration files.


Prompts
-------

The `prompts` section lets you collect user input before the integration process starts. You can define questions or prompts that the user must answer. The responses are then stored in variables for later use.

#### Example:

```yaml
prompts:
  - name: app_id
    text: "Enter your app ID:"
  - name: integrate_platforms
    text: "Select platforms to integrate:"
    type: multiselect
    options:
      - value: android
        label: Android
        hint: Integrate to Android platform
      - value: ios
        label: iOS
        hint: Integrate to iOS platform
```

Visit [Prompts](PROMPTS.md) page to learn more about how to request input from user.
 
Tasks
-----

The `tasks` section is where you define individual integration tasks and their properties. Each task should have a `type` field that specifies the type of task to perform.

#### Example:

```yaml
tasks:
  - type: app_delegate
    label: "Integrate Firebase"
    actions:
      - prepend: "#import <Firebase.h>"
      - block: "didFinishLaunchingWithOptions"
        prepend: "[FIRApp configure];"
```
### Task types

Click on the links below to learn how to use each task type:

|                  Task                   | Description                     |
|:---------------------------------------:|---------------------------------|
|     [AppDelegate](APP_DELEGATE.md)      | Modify AppDelegate.mm file      |
|            [Plist](PLIST.md)            | Modify Info.plist file          |
|            [Xcode](XCODE.md)            | Modify Xcode project            |
|     [Build Gradle](BUILD_GRADLE.md)     | Modify build.gradle files       |
| [Android Manifest](ANDROID_MANIFEST.md) | Modify AndroidManifest.xml file |
|          [Podfile](PODFILE.md)          | Modify Podfile in ios folder    |
|          [File system](FS.md)           | Copy other files into project   |

PreInfo and PostInfo
--------------------

The `preInfo` and `postInfo` fields allow you to display information or messages before and after the integration process. You can provide either a simple string or an object with `title` and `message` fields to provide more structured information.

#### Example:

```yaml
preInfo: "Please make sure you have your API keys ready."
postInfo:
  title: "Integration Completed"
  message: "The integration process has finished successfully."
```

These fields can be used in the config file to provide information at the beginning and end of the entire integration process.

Example in production
---------------------

#### Check out the [configuration of @react-native-firebase/app](https://github.com/murat-mehmet/react-native-integrate-configs/blob/main/packages/1/a/b/%40react-native-firebase/app/integrate.yml)  to see the usage in production.

### Conclusion

This configuration structure provides a flexible way to define your integration process and gather necessary information from the user before proceeding with the tasks.
