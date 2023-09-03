Android Manifest Task Configuration (`android_manifest`)
================================================

Overview
--------

The `android_manifest` task allows you to modify the AndroidManifest.xml file in an Android project. You can make changes to various elements within the AndroidManifest.xml file, such as the `<manifest>`, `<application>`, or `<activity>` tags. This task provides fine-grained control over AndroidManifest.xml modifications, including adding, updating, or deleting attributes and values.

### Task Properties

-   `type` (Required): Specifies the type of task, which should be set to "android_manifest".
-   `label` (Optional): A user-friendly label for the task, providing a clear description of its purpose.
-   `updates` (Required): An array of update items that define the modifications to be made to the AndroidManifest.xml file.
    -   `block` (Optional): Specifies the context within the AndroidManifest.xml file where modifications should be applied. It can take one of the following values:
        -   `manifest`: Modifies the `<manifest>` tag in the file.
        -   `application`: Modifies the `<application>` tag in the file.
        -   `activity`: Modifies the `<activity>` tag in the file.
        -   Omitting this field means the entire AndroidManifest.xml file will be the context.
    -   `attributes` (Optional): An object that defines the attributes and their values to be added, updated, or deleted within the specified tag. When using the `block` field, this property must be provided.

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

-   `append` (Optional): Specifies text or code to be added after the specified context within the AndroidManifest.xml file.
-   `prepend` (Optional): Specifies text or code to be added before the specified context within the AndroidManifest.xml file.
-   `before` (Optional): Specifies text or code to be added immediately before a specific text or code within the specified context. This field can also include a `$delete: true` flag to remove the specified text.
-   `after` (Optional): Specifies text or code to be added immediately after a specific text or code within the specified context. This field can also include a `$delete: true` flag to remove the specified text.
-   `strict` (Optional): Specifies the behavior of the `before` and `after` fields. If set to `true`, the task will throw an error if the text in the `before` or `after` field is not found in the context, otherwise, it will ignore the field.
-   `ifNotPresent` (Optional): Indicates that the task should only be executed if the specified text or code is not present within the specified context.
-   `comment` (Optional): Adds a comment before the inserted text or code within the specified context.

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
