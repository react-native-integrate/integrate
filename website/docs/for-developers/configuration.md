---
sidebar_position: 1
title: Configuration
---
# Configuration File (`integrate.yml`)

The configuration file is where you define the overall structure of your integration process. It includes various sections and fields to customize and control the behavior of the integration process.

| Property     | Type                                         | Description                                                                                                                                                                                                                                             |
|:-------------|:---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| env          | object                                       | Allows you to define variables that can be used throughout the configuration. These variables can hold values that you want to reuse in different parts of your tasks. Variables defined in `env` can be referenced using the `$[var_name]` convention. |
| tasks        | array of objects, required                   | This is where you define individual integration tasks and their properties. Each task should have a `type` field that specifies the type of task to perform.                                                                                            |
| preInfo      | string or `{title: string, message: string}` | Allows you to display information or messages before the integration process.                                                                                                                                                                           |
| postInfo     | string or `{title: string, message: string}` | Allows you to display information or messages after the integration process.                                                                                                                                                                            |
| minRNVersion | string                                       | It is used to set the minimum React Native version supported for the integration of the package.                                                                                                                                                        |
| minVersion   | string                                       | It is used to set the minimum package version supported for the integration of the package.                                                                                                                                                             |

#### Example:

```yaml
minRNVersion: 0.72
minVersion: 1.4
env:
  app_id: your_app_id
preInfo: "Please make sure you have your API keys ready."
tasks:
  - type: app_delegate
    label: "Integrate Firebase"
    actions:
      - prepend: "#import <Firebase.h>"
      - block: "didFinishLaunchingWithOptions"
        prepend: "[FIRApp configure];"
postInfo:
  title: "Integration Completed"
  message: "The integration process has finished successfully."
```

#### Example in production

Check out the [configuration of @react-native-firebase/app](https://github.com/react-native-integrate/configs/blob/main/packages/1/a/b/%40react-native-firebase/app/integrate.yml)  to see the usage in production.
