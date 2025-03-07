---
sidebar_position: 6
title: babel.config.js
---

# Babel Config Task Configuration (`babel_config`)

_Modify babel.config.js file_

The `babel_config` task allows you to modify plugins and presets in babel.config.js files.

## Task Properties

| Property | Type                                            | Description                                                                                                                                              |
|:---------|:------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| task     | "babel_config", required                        | Specifies the task type, which should be set to "babel_config" for this task.                                                                            |
| name     | string                                          | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| label    | string                                          | An optional label or description for the task.                                                                                                           |
| when     | object                                          | Visit [Conditional Tasks and Actions](../../when) page to learn how to execute task conditionally.                                                       |
| actions  | Array\<[Action](#action-properties)\>, required | An array of action items that define the modifications to be made in the file.                                                                           |

## Action Properties

### Default Mode

In default mode you can modify the exported object in js file like it's an json object

| Property | Type                                  | Description                                                                                                                                              |
|:---------|:--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| name     | string                                | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| when     | object                                | Visit [Conditional Tasks and Actions](../../when)  page to learn how to execute action conditionally.                                                    |
| set      | object                                | An object containing key-value pairs that you want to add or modify in the json.                                                                         |
| strategy | one of [Strategy](#strategy-property) | Specifies how to handle merging new and existing values.                                                                                                 |

#### Strategy Property

- `assign`: (default) Overwrites the entire key with the new value.
- `append`: Appends values only if the key does not already exist.
- `merge`: Merges new values into existing dictionaries.
- `merge_concat`: Merges dictionaries while concatenating arrays.
- `merge_distinct`: Merges dictionaries while ensuring that objects with deep equality are distinct.

#### Example

```yaml
task: babel_config
label: Modifying babel.config.js
actions:
  - set:
      plugins:
        - some-module/plugin
```

---
### Text Mode

#### Common properties

| Property | Type   | Description                                                                                                                                              |
|:---------|:-------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| mode     | "text" | Tells action to operate in "text" mode.                                                                                                                  |
| name     | string | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| when     | object | Visit [Conditional Tasks and Actions](../../when)  page to learn how to execute action conditionally.                                                    |

#### Context reduction properties

| Property | Type                                       | Description                                                                                                                                                                                             |
|:---------|:-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| before   | string or `{regex: string, flags: string}` | Text or code that is used to specify a point within the context where text should be inserted before. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search. |
| after    | string or `{regex: string, flags: string}` | Text or code that is used to specify a point within the context where text should be inserted after. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search.  |
| search   | string or `{regex: string, flags: string}` | A string or object (with regex and flags) that narrows the context to a specific text within the method or file.                                                                                        |

#### Context modification properties

| Property | Type                       | Description                                                                                                                                                                  |
|:---------|:---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| prepend  | string or `{file: string}` | Text or code to prepend at the beginning of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to prepend. |
| append   | string or `{file: string}` | Text or code to append at the end of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to append.         |
| replace  | string or `{file: string}` | Text or code to replace the entire specified context. It can be a string or an object with a `file` field that points to a file containing the code to replace.              |
| script   | string                     | JS code script to evaluate. In script these functions are available to be called: `await prepend(content), await append(content), await replace(content)                     |

#### Other properties

| Property     | Type    | Description                                                                                                                                                                                                              |
|:-------------|:--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| exact        | boolean | A boolean flag that modifies the whitespace and new line management.                                                                                                                                                     |
| strict       | boolean | Specifies the behavior of the `before` and `after` fields. If set to `true`, the task will throw an error if the text in the `before` or `after` field is not found in the context, otherwise, it will ignore the field. |
| ifNotPresent | string  | Indicates that the task should only be executed if the specified text or code is not present within the specified context.                                                                                               |
| comment      | string  | An optional comment to add before the inserted code or text. The comment is purely informational and does not affect the code's functionality.                                                                           |

### Example

```yaml
task: babel_config
label: Modifying babel.config.js
actions:
  - mode: text
    prepend: require('some-module')
```

In this example, the `babel_config` task is used to modify `plugins` array in the `babel.config.js` file.

The action adds `your-plugin` to `plugins` array.
