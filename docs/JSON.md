JSON Task Configuration (`json`)
==================================================

The `json` task allows you to create or modify json files.

Task Properties
---------------

#### `type` (string, required)
Specifies the task type, which should be set to "json" for this task.

#### `name` (string)
An optional name for the task. If provided, the task state will be saved as a variable.
Visit [Task and Action States](STATES.md) page to learn more.

#### `label` (string)
An optional label or description for the task.

#### `when` (object)
Visit [When](WHEN.md) page to learn how to execute task conditionally.

#### `path` (string)
Specifies the path of the json file to create or modify.

#### `actions` (array of objects, required)
An array of action items that define the modifications to be made in the file. Each action item contains the following fields:

### Action Item

#### `name` (string)
An optional name for the action. If provided, the action state will be saved as a variable.
Visit [Task and Action States](STATES.md) page to learn more.

#### `when` (object)
Visit [When](WHEN.md) page to learn how to execute action conditionally.

#### `set` (object)
An object containing key-value pairs that you want to add or modify in the json.

#### `strategy` (string)
Specifies how to handle merging new and existing values. It can be one of the following:
-   `assign`: (default) Overwrites the entire key with the new value.
-   `append`: Appends values only if the key does not already exist.
-   `merge`: Merges new values into existing dictionaries.
-   `merge_concat`: Merges dictionaries while concatenating arrays.

### Example Usage

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

The `json` task provides a flexible way to modify json files in the project, enabling you to tailor your app's behavior to your needs.
