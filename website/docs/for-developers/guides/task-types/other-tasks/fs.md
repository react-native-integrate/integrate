---
sidebar_position: 2
title: File System Operations
---

# File System Task Configuration (`fs`)

_Copy other files into project_

The "fs" task is used to perform filesystem operations within your configuration. It allows you to copy files from one location to another within your
project. This task is particularly useful when you need to manage project assets, configuration files, or other resources.

## Task Properties

| Property | Type                                            | Description                                                                                                                                              |
|:---------|:------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| task     | "fs", required                                  | Specifies the task type, which should be set to "fs" for this task.                                                                                      |
| name     | string                                          | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| label    | string                                          | An optional label or description for the task.                                                                                                           |
| when     | object                                          | Visit [Conditional Tasks and Actions](../../when) page to learn how to execute task conditionally.                                                       |
| actions  | Array\<[Action](#action-properties)\>, required | An array of action items that define the modifications to be made in the file.                                                                           |

## Action Properties

### Common properties

| Property | Type   | Description                                                                                                                                              |
|:---------|:-------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| name     | string | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| when     | object | Visit [Conditional Tasks and Actions](../../when)  page to learn how to execute action conditionally.                                                    |

#### _The action item can take these properties based on which action you want to execute._

### Copy (import) a file to the project

| Property    | Type             | Description                                                                                                                                                                                                       |
|:------------|:-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| copyFile    | string, required | A string that specifies the name of the file needed to be copied.                                                                                                                                                 |
| destination | string, required | A relative path from the project's root directory specifying the destination where the file will be copied. This field determines where the copied file will be placed within your project's directory structure. |
| message     | string           | A string that serves as the user prompt message when collecting input. If provided, this message will replace the default message.                                                                                |

### Delete a file from the project

| Property   | Type             | Description                                                   |
|:-----------|:-----------------|---------------------------------------------------------------|
| removeFile | string, required | A string that specifies the path of the file.                 |
| strict     | boolean          | If true, task will throw an error if the file does not exist. |

Usage Example
-------------

Here's an example of how to use the "fs" task in a configuration file:

```yaml
steps:
  - task: fs
    actions:
      - copyFile: "example.txt"
        message: "Please enter the path of the file you want to copy:"
        destination: "assets/example.txt"
```

In this example:

- We define an "fs" task to copy a file named "example.txt".
- We customize the user prompt message to request the path of the file to copy.
- The `destination` field specifies that the file should be copied to the "assets/example.txt" path within the project's root.
