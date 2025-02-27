---
sidebar_position: 5
title: MainActivity.java/kt
---

# MainActivity Task Configuration (`main_activity`)

_Modify MainActivity java or kt file_

The `main_activity` task is designed to facilitate modifications to the `MainActivity` java or kotlin files in Android projects. It is the main entry
file of the android application. This task provides the flexibility to make changes to different sections of the `MainActivity` java or kotlin file.

## Task Properties

| Property | Type                                            | Description                                                                                                                                                                                                                                                    |
|:---------|:------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| task     | "main_activity", required                       | Specifies the task type, which should be set to "main_activity" for this task.                                                                                                                                                                                 |
| name     | string                                          | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more.                                                                                                       |
| label    | string                                          | An optional label or description for the task.                                                                                                                                                                                                                 |
| when     | object                                          | Visit [Conditional Tasks and Actions](../../when) page to learn how to execute task conditionally.                                                                                                                                                             |
| lang     | "java" (default) or "kotlin"                    | Specifies the language of the file, distinguishing between the java and kt file. It helps determine which MainActivity file to modify during the configuration process. "java" modifies `MainActivity.java` file and "kotlin" modifies `MainActivity.kt` file. |
| actions  | Array\<[Action](#action-properties)\>, required | An array of action items that define the modifications to be made in the file. Each action item contains the following fields:                                                                                                                                 |

## Action Properties

### Common properties

| Property | Type   | Description                                                                                                                                              |
|:---------|:-------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| name     | string | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| when     | object | Visit [Conditional Tasks and Actions](../../when)  page to learn how to execute action conditionally.                                                    |

### Context reduction properties

| Property | Type                                       | Description                                                                                                                                                                                             |
|:---------|:-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| before   | string or `{regex: string, flags: string}` | Text or code that is used to specify a point within the context where text should be inserted before. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search. |
| after    | string or `{regex: string, flags: string}` | Text or code that is used to specify a point within the context where text should be inserted after. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search.  |
| search   | string or `{regex: string, flags: string}` | A string or object (with regex and flags) that narrows the context to a specific text within the method or file.                                                                                        |

### Context modification properties

| Property | Type                       | Description                                                                                                                                                                  |
|:---------|:---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| prepend  | string or `{file: string}` | Text or code to prepend at the beginning of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to prepend. |
| append   | string or `{file: string}` | Text or code to append at the end of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to append.         |
| replace  | string or `{file: string}` | Text or code to replace the entire specified context. It can be a string or an object with a `file` field that points to a file containing the code to replace.              |
| script   | string or `{file: string}` | JS code script to evaluate. It can be a string or an object with a `file` field that points to a file containing the script. In script these functions are available to be called: `await prepend(content), await append(content), await replace(content) |

### Other properties

| Property     | Type    | Description                                                                                                                                                                                                              |
|:-------------|:--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| exact        | boolean | A boolean flag that modifies the whitespace and new line management.                                                                                                                                                     |
| strict       | boolean | Specifies the behavior of the `before` and `after` fields. If set to `true`, the task will throw an error if the text in the `before` or `after` field is not found in the context, otherwise, it will ignore the field. |
| ifNotPresent | string  | Indicates that the task should only be executed if the specified text or code is not present within the specified context.                                                                                               |
| comment      | string  | An optional comment to add before the inserted code or text. The comment is purely informational and does not affect the code's functionality.                                                                           |

## Example

```yaml
task: main_activity
label: "Adding import"
lang: "kotlin",
actions:
  - prepend: import com.some.lib
```

In this example, the `main_activity` task adds an import to the file.
