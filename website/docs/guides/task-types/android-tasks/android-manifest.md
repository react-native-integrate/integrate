---
sidebar_position: 1
title: AndroidManifest.xml
---

# Android Manifest Task Configuration (`android_manifest`)

_Modify AndroidManifest.xml file_

The `android_manifest` task allows you to modify the AndroidManifest.xml file in an Android project. You can make changes to various elements within
the AndroidManifest.xml file, such as the `<manifest>`, `<application>`, or `<activity>` tags. This task provides fine-grained control over
AndroidManifest.xml modifications, including adding, updating, or deleting attributes and values.

## Task Properties

| Property | Type                                            | Description                                                                                                                                              |
|:---------|:------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| task     | "android_manifest", required                    | Specifies the task type, which should be set to "android_manifest" for this task.                                                                        |
| name     | string                                          | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| label    | string                                          | An optional label or description for the task.                                                                                                           |
| when     | object                                          | Visit [Conditional Tasks and Actions](../../when) page to learn how to execute task conditionally.                                                       |
| actions  | Array\<[Action](#action-properties)\>, required | An array of action items that define the modifications to be made in the file. Each action item contains the following fields:                           |

## Action Properties

### Common properties

| Property | Type   | Description                                                                                                                                              |
|:---------|:-------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| name     | string | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| when     | object | Visit [Conditional Tasks and Actions](../../when)  page to learn how to execute action conditionally.                                                    |

### Context reduction properties

| Property | Type                                       | Description                                                                                                                                                                                             |
|:---------|:-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| block    | "manifest" or "application" or "activity"  | Specifies the context within the AndroidManifest.xml file where modifications should be applied. Omitting this field means the entire AndroidManifest.xml file will be the context.                     |
| before   | string or `{regex: string, flags: string}` | Text or code that is used to specify a point within the context where text should be inserted before. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search. |
| after    | string or `{regex: string, flags: string}` | Text or code that is used to specify a point within the context where text should be inserted after. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search.  |
| search   | string or `{regex: string, flags: string}` | A string or object (with regex and flags) that narrows the context to a specific text within the method or file.                                                                                        |

### Context modification properties

| Property | Type                       | Description                                                                                                                                                                  |
|:---------|:---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| prepend  | string or `{file: string}` | Text or code to prepend at the beginning of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to prepend. |
| append   | string or `{file: string}` | Text or code to append at the end of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to append.         |
| replace  | string or `{file: string}` | Text or code to replace the entire specified context. It can be a string or an object with a `file` field that points to a file containing the code to replace.              |
| script   | string                     | JS code script to evaluate. In script these functions are available to be called: `await prepend(content), await append(content), await replace(content)                     |

### Other properties

| Property     | Type    | Description                                                                                                                                                                                                                                  |
|:-------------|:--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| exact        | boolean | A boolean flag that modifies the whitespace and new line management.                                                                                                                                                                         |
| strict       | boolean | Specifies the behavior of the `before` and `after` fields. If set to `true`, the task will throw an error if the text in the `before` or `after` field is not found in the context, otherwise, it will ignore the field.                     |
| ifNotPresent | string  | Indicates that the task should only be executed if the specified text or code is not present within the specified context.                                                                                                                   |
| comment      | string  | An optional comment to add before the inserted code or text. The comment is purely informational and does not affect the code's functionality.                                                                                               |
| attributes   | object  | An object that defines the attributes and their values to be added, updated, or deleted within the specified tag. When using this property, `block` field must be provided. An attribute can be deleted by setting `$delete: true` as value. |

## Example

Here's an example of how to use the `android_manifest` task to modify the AndroidManifest.xml file:

```yaml
task: android_manifest
label: "Modify Android Manifest"
actions:
  - block: application
    append: |
      <meta-data
          android:name="com.google.android.gms.ads.APPLICATION_ID"
          android:value="your-admob-app-id" />
  - block: activity
    attributes:
      android:name: "com.example.MainActivity"
      android:theme: "@style/AppTheme.NoActionBar"
      android:useless:
        $delete: true
```

In this example, we append a `<meta-data>` element within the `<application>` tag and action attributes of a specific `<activity>` tag. Additionally,
we delete the `android:useless` attribute using `$delete: true`
