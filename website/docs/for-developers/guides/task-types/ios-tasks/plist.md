---
sidebar_position: 2
title: Info.plist
---
# Property List (PLIST) Task Configuration (`plist`)
_Modify Info.plist file_

The `plist` task allows you to modify property list (plist) files, typically used in iOS projects, to add or modify values.

## Task Properties

| Property | Type                                            | Description                                                                                                                                                  |
|:---------|:------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| task     | "plist", required                               | Specifies the task type, which should be set to "plist" for this task.                                                                                       |
| name     | string                                          | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| label    | string                                          | An optional label or description for the task.                                                                                                               |
| when     | object                                          | Visit [Conditional Tasks and Actions](../../when) page to learn how to execute task conditionally.                                                       |
| target   | string                                          | Specifies the target which contains the plist file. Omitting this field means the plist of main app will be modified.                                        |
| actions  | Array\<[Action](#action-properties)\>, required | An array of action items that define the modifications to be made in the file.                                                                               |

## Action Properties

| Property  | Type                                  | Description                                                                                                                                                  |
|:----------|:--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name      | string                                | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| when      | object                                | Visit [Conditional Tasks and Actions](../../when)  page to learn how to execute action conditionally.                                                    |
| set       | object                                | An object containing key-value pairs that you want to add or modify in the plist.                                                                            |
| strategy  | one of [Strategy](#strategy-property) | Specifies how to handle merging new and existing values.                                                                                                     |

### Strategy Property

-   `assign`: (default) Overwrites the entire key with the new value.
-   `append`: Appends values only if the key does not already exist.
-   `merge`: Merges new values into existing dictionaries.
-   `merge_concat`: Merges dictionaries while concatenating arrays.
-   `merge_distinct`: Merges dictionaries while ensuring that objects with deep equality are distinct.

## Example

```yaml
task: plist
label: Add or Modify Plist Entries
actions:
  - set:
      MY_KEY: "my value"
      ANOTHER_KEY: "another value"
    strategy: assign
  - set:
      NEW_KEY: "new value"
    strategy: merge
```

In this example, the `plist` task is used to add or modify entries in a plist file. Two actions are specified:

1.  The first action sets the value of `MY_KEY` to `"my value"` using the `assign` strategy, which overwrites the value if it already exists.
2.  The second action sets the value of `NEW_KEY` to `"new value"` using the `merge` strategy, which merges new values into existing dictionaries.

The `plist` task provides a flexible way to modify plist files in your iOS project, enabling you to tailor your app's behavior to your needs.
