---
sidebar_position: 3
title: Podfile
---
# Podfile Task Configuration (`podfile`)
_Modify Podfile in ios folder_

The `podfile` task allows you to customize your iOS project's Podfile, which is a crucial configuration file for managing third-party dependencies using CocoaPods. You can make targeted changes to specific parts of the Podfile, such as predefined targets and even hooks, by specifying the `block` field in the task. This task empowers you to seamlessly integrate external libraries or configure your iOS project according to your specific requirements.

## Task Properties

| Property | Type                                            | Description                                                                                                                                              |
|:---------|:------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| task     | "podfile", required                             | Specifies the task type, which should be set to "podfile" for this task.                                                                                 |
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

### Special properties

| Property       | Type                      | Description                                                                                                                                                                                                                                                                                                  |
|:---------------|:--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| useFrameworks  | "dynamic" or "static"     | Sets `use_frameworks` value and handles compatibility accordingly. "dynamic" sets useFrameworks value with dynamic linkage. In this case static libs will be set in pre_install hook. "static" sets useFrameworks value with static linkage. This action is skipped or overridden by dynamic linkage action. |
| staticLibrary  | string or Array\<string\> | Defines name of pods that will be set as static library in case some module requires `use_frameworks` with dynamic linkage.                                                                                                                                                                                  |
| disableFlipper | boolean                   | Disables flipper usage.                                                                                                                                                                                                                                                                                      |

### Context reduction properties

| Property | Type                                       | Description                                                                                                                                                                                             |
|:---------|:-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| block    | string                                     | Specifies the part of the Podfile to target. If omitted, the entire Podfile will be the context for actions. Check [Block](#block-property) section below.                                              |
| before   | string or `{regex: string, flags: string}` | Text or code that is used to specify a point within the context where text should be inserted before. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search. |
| after    | string or `{regex: string, flags: string}` | Text or code that is used to specify a point within the context where text should be inserted after. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search.  |
| search   | string or `{regex: string, flags: string}` | A string or object (with regex and flags) that narrows the context to a specific text within the method or file.                                                                                        |

### Context modification properties

| Property | Type                       | Description                                                                                                                                                                  |
|:---------|:---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| prepend  | string or `{file: string}` | Text or code to prepend at the beginning of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to prepend. |
| append   | string or `{file: string}` | Text or code to append at the end of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to append.         |
| replace  | string or `{file: string}` | Text or code to replace the entire specified context. It can be a string or an object with a `file` field that points to a file containing the code to replace.              |

### Other properties

| Property     | Type    | Description                                                                                                                                                                                                              |
|:-------------|:--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| exact        | boolean | A boolean flag that modifies the whitespace and new line management.                                                                                                                                                     |
| strict       | boolean | Specifies the behavior of the `before` and `after` fields. If set to `true`, the task will throw an error if the text in the `before` or `after` field is not found in the context, otherwise, it will ignore the field. |
| ifNotPresent | string  | Indicates that the task should only be executed if the specified text or code is not present within the specified context.                                                                                               |
| comment      | string  | An optional comment to add before the inserted code or text. The comment is purely informational and does not affect the code's functionality.                                                                           |

### Block Property
Specifies the part of the Podfile to target. You can set it to one of the following values:
-   `target`: Narrows the context to the first target defined in the Podfile.
-   `target 'TargetName'`: Targets a specific named target.
-   `target.(hook_name)`: Possible hooks are `pre_install`, `post_install`, `pre_integrate`, `post_integrate`: Targets predefined Podfile hooks.

## Example

Here's an example of a configuration file (`integrate.yml`) that utilizes the `podfile` task to modify the iOS project's Podfile:

```yaml
task: podfile
label: "Modify Podfile"
actions:
  - block: target
    prepend: |
      pod 'SomeLibrary', '1.0.0'
  - block: target.pre_install
    append: |
      puts "Performing pre-installation tasks..."
```

In this example, we prepend a pod declaration within app target and append a message to the `pre_install` hook in first target.
