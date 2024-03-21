---
sidebar_position: 1
title: JSON Files
---
# JSON Task Configuration (`json`)
_Create or modify any json file_

The `json` task allows you to create or modify json files.

## Task Properties

| Property | Type                                            | Description                                                                                                                                                  |
|:---------|:------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type     | "json", required                                | Specifies the task type, which should be set to "json" for this task.                                                                                        |
| name     | string                                          | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| label    | string                                          | An optional label or description for the task.                                                                                                               |
| when     | object                                          | Visit [Conditional Tasks and Actions](../../when) page to learn how to execute task conditionally.                                                       |
| path     | string                                          | Specifies the path of the json file to create or modify.                                                                                                     |
| actions  | Array\<[Action](#action-properties)\>, required | An array of action items that define the modifications to be made in the file.                                                                               |

## Action Properties

| Property  | Type                                  | Description                                                                                                                                                  |
|:----------|:--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name      | string                                | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| when      | object                                | Visit [Conditional Tasks and Actions](../../when)  page to learn how to execute action conditionally.                                                    |
| set       | object                                | An object containing key-value pairs that you want to add or modify in the json.                                                                             |
| strategy  | one of [Strategy](#strategy-property) | Specifies how to handle merging new and existing values.                                                                                                     |

### Strategy Property

-   `assign`: (default) Overwrites the entire key with the new value.
-   `append`: Appends values only if the key does not already exist.
-   `merge`: Merges new values into existing dictionaries.
-   `merge_concat`: Merges dictionaries while concatenating arrays.
-   `merge_distinct`: Merges dictionaries while ensuring that objects with deep equality are distinct.

## Example

```yaml
type: json
label: Add or Modify Json Entries
path: some_file.json
actions:
  - set:
      MY_KEY: "my value"
      ANOTHER_KEY: "another value"
    strategy: assign
  - set:
      NEW_KEY: "new value"
    strategy: merge
```

In this example, the `json` task is used to add or modify entries in the `some_file.json` file. Two actions are specified:

1.  The first action sets the value of `MY_KEY` to `"my value"` using the `assign` strategy, which overwrites the value if it already exists.
2.  The second action sets the value of `NEW_KEY` to `"new value"` using the `merge` strategy, which merges new values into existing dictionaries.
