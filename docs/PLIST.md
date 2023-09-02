Property List (PLIST) Task Configuration (`plist`)
==================================================

The `plist` task allows you to modify property list (plist) files, typically used in iOS projects, to add or modify values.

### Fields

-   `type`: This should be set to `plist` to indicate that you're using the `plist` task.
-   `label`: A label or description for the task. It's used for documentation purposes and doesn't affect the functionality.
-   `updates`: An array of updates you want to make to the plist file. Each update object represents a modification.

#### Update Item Fields

Each object within the `updates` array represents a modification you want to make to the plist file. Here are the fields within an update object:
-   `set`: An object containing key-value pairs that you want to add or modify in the plist.
-   `strategy`:  (optional) Specifies how to handle merging new and existing values. It can be one of the following:
    -   `assign`: (default) Overwrites the entire key with the new value.
    -   `merge`: Merges new values into existing dictionaries.
    -   `merge_concat`: Merges dictionaries while concatenating arrays.

### Example Usage

```yaml
- type: plist
  label: Add or Modify Plist Entries
  update:
    - set:
        MY_KEY: "my value"
        ANOTHER_KEY: "another value"
      strategy: assign

    - set:
        NEW_KEY: "new value"
      strategy: merge
```

In this example, the `plist` task is used to add or modify entries in a plist file. Two updates are specified:

1.  The first update sets the value of `MY_KEY` to `"my value"` using the `assign` strategy, which overwrites the value if it already exists.
2.  The second update sets the value of `NEW_KEY` to `"new value"` using the `merge` strategy, which merges new values into existing dictionaries.

The `plist` task provides a flexible way to modify plist files in your iOS project, enabling you to tailor your app's behavior to your needs.
