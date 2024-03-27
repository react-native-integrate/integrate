---
sidebar_position: 2
title: Configuration
---
# Configuration File (`upgrade.yml`)

The configuration file is where you define the overall structure of your upgrade process.

| Property | Type              | Description                                                                                                                                                                                                                                             |
|:---------|:------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| env      | object            | Allows you to define variables that can be used throughout the configuration. These variables can hold values that you want to reuse in different parts of your tasks. Variables defined in `env` can be referenced using the `$[var_name]` convention. |
| imports  | array of strings  | Relative paths of files and folders which will be imported during upgrade.                                                                                                                                                                              |
| steps    | array of objects  | This is where you define individual integration tasks and their properties. Each task should have a `task` field that specifies the type of task to perform.                                                                                            |

#### Example:

```yaml
env:
  some-variable: value
steps:
  - task: app_delegate
    label: "Appending some code"
    actions:
      - prepend: "#import <SomeFile.h>"
      - block: "didFinishLaunchingWithOptions"
        prepend: "[SomeClass configure];"
```
All possible task types are explained in [Guides](../category/guides)
