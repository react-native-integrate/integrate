Android Manifest Task Configuration (`android_manifest`)
========================================================

Overview
--------

The `android_manifest` task allows you to modify the AndroidManifest.xml file in an Android project. You can make changes to various elements within the AndroidManifest.xml file, such as the `<manifest>`, `<application>`, or `<activity>` tags. This task provides fine-grained control over AndroidManifest.xml modifications, including adding, updating, or deleting attributes and values.

### Task Properties

#### `type` (string, required)
Specifies the task type, which should be set to "android_manifest" for this task.

#### `label` (string)
An optional label or description for the task.

#### `prompts` (array)
Visit [Prompts](PROMPTS.md) page to learn how to request input from user.

#### `updates` (array of objects, required)
An array of update items that define the modifications to be made in the file. Each update item contains the following fields:

### Update Item

###### Context reduction properties

#### `block` (string)
Specifies the context within the AndroidManifest.xml file where modifications should be applied. It can take one of the following values:

-   `manifest`: Modifies the `<manifest>` tag in the file.
-   `application`: Modifies the `<application>` tag in the file.
-   `activity`: Modifies the `<activity>` tag in the file.

Omitting this field means the entire AndroidManifest.xml file will be the context.

#### `before` (string or object)
Text or code that is used to specify a point within the context where text should be inserted before. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search.

#### `after` (string or object)
Text or code that is used to specify a point within the context where text should be inserted after. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search.

#### `search` (string or object)
A string or object (with regex and flags) that narrows the context to a specific text within the method or file.

###### Context modification properties

#### `prepend` (string or object)
Text or code to prepend at the beginning of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to prepend.

#### `append` (string or object)
Text or code to append at the end of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to append.

#### `replace` (string or object)
Text or code to replace the entire specified context. It can be a string or an object with a `file` field that points to a file containing the code to replace.

######  Other properties

#### `exact` (boolean)
A boolean flag that modifies the whitespace and new line management.

#### `strict` (boolean)
Specifies the behavior of the `before` and `after` fields. If set to `true`, the task will throw an error if the text in the `before` or `after` field is not found in the context, otherwise, it will ignore the field.

#### `ifNotPresent` (string)
Indicates that the task should only be executed if the specified text or code is not present within the specified context.

#### `comment` (string)
An optional comment to add before the inserted code or text. The comment is purely informational and does not affect the code's functionality.

#### `attributes` (object)
An object that defines the attributes and their values to be added, updated, or deleted within the specified tag. When using this property, `block` field must be provided. An attribute can be deleted by setting `$delete: true` as value.

Example:
```yaml
type: android_manifest
updates:
  - block: activity
    attributes:
      android:name: new_name
      android:useless:
        $delete: true
```
In this example, we target the `<activity>` tag and set the `android:name` attribute to "new_name." Additionally, we delete the `android:useless` attribute using `$delete: true`.

Usage Example
-------------

Here's an example of how to use the `android_manifest` task to modify the AndroidManifest.xml file:
```yaml
type: android_manifest
label: "Modify Android Manifest"
updates:
  - block: application
    append: |
      <meta-data
          android:name="com.google.android.gms.ads.APPLICATION_ID"
          android:value="your-admob-app-id" />
  - block: activity
    attributes:
      android:name: "com.example.MainActivity"
      android:theme: "@style/AppTheme.NoActionBar"
```

In this example, we append a `<meta-data>` element within the <application> tag and update attributes of a specific `<activity>` tag.

Conclusion
----------

The `android_manifest` task provides a flexible way to make precise modifications to the AndroidManifest.xml file in your Android project. You can specify the context, attributes, and desired changes to customize your AndroidManifest according to your project requirements.
