---
sidebar_position: 4
title: strings.xml
---
# Strings Xml Task Configuration (`strings_xml`)
_Modify strings.xml file_

The `strings_xml` task allows you to modify the strings.xml file in an Android project. You can add any resource within the strings.xml file.

## Task Properties

| Property | Type                                            | Description                                                                                                                                                                                                                                                                                        |
|:---------|:------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type     | "strings_xml", required                         | Specifies the task type, which should be set to "strings_xml" for this task.                                                                                                                                                                                                                       |
| name     | string                                          | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more.                                                                                                                                       |
| label    | string                                          | An optional label or description for the task.                                                                                                                                                                                                                                                     |
| when     | object                                          | Visit [Conditional Tasks and Actions](../../when) page to learn how to execute task conditionally.                                                                                                                                                                                             |
| actions  | Array\<[Action](#action-properties)\>, required | An array of action items that define the modifications to be made in the file. Each action item contains the following fields:                                                                                                                                                                     |

## Action Properties

### Common properties

| Property   | Type                                       | Description                                                                                                                                                                                             |
|:-----------|:-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name       | string                                     | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more.                                            |
| when       | object                                     | Visit [Conditional Tasks and Actions](../../when)  page to learn how to execute action conditionally.                                                                                               |

### Context reduction properties

| Property   | Type                                       | Description                                                                                                                                                                                             |
|:-----------|:-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| before     | string or `{regex: string, flags: string}` | Text or code that is used to specify a point within the context where text should be inserted before. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search. |
| after      | string or `{regex: string, flags: string}` | Text or code that is used to specify a point within the context where text should be inserted after. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search.  |
| search     | string or `{regex: string, flags: string}` | A string or object (with regex and flags) that narrows the context to a specific text within the method or file.                                                                                        |

### Context modification properties

| Property  | Type                       | Description                                                                                                                                                                  |
|:----------|:---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| prepend   | string or `{file: string}` | Text or code to prepend at the beginning of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to prepend. |
| append    | string or `{file: string}` | Text or code to append at the end of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to append.         |
| replace   | string or `{file: string}` | Text or code to replace the entire specified context. It can be a string or an object with a `file` field that points to a file containing the code to replace.              |

### Other properties

| Property       | Type    | Description                                                                                                                                                                                                                                   |
|:---------------|:--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| exact          | boolean | A boolean flag that modifies the whitespace and new line management.                                                                                                                                                                          |
| strict         | boolean | Specifies the behavior of the `before` and `after` fields. If set to `true`, the task will throw an error if the text in the `before` or `after` field is not found in the context, otherwise, it will ignore the field.                      |
| ifNotPresent   | string  | Indicates that the task should only be executed if the specified text or code is not present within the specified context.                                                                                                                    |
| comment        | string  | An optional comment to add before the inserted code or text. The comment is purely informational and does not affect the code's functionality.                                                                                                |

## Example

Here's an example of how to use the `strings_xml` task to modify the strings.xml file:
```yaml
type: strings_xml
label: "Modify strings.xml"
actions:
  - append: <string name="resource">value</string>
```

In this example, we add a string resource in strings.xml.
