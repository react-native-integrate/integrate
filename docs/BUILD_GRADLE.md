Build Gradle Task Configuration (`build_gradle`)
================================================

Overview
--------

The `build_gradle` task is designed to facilitate modifications to the `build.gradle` files in Android projects. It is commonly used to add dependencies, configure build settings, and perform other customizations within Android app modules. This task provides the flexibility to make changes to different sections of the `build.gradle` file.

Task Properties
---------------

#### `type` (string, required)
Specifies the task type, which should be set to "build_gradle" for this task.

#### `name` (string)
An optional name for the task. If provided, the task state will be saved as a variable.
Visit [Task and Action States](STATES.md) page to learn more.

#### `label` (string)
An optional label or description for the task.

#### `when` (object)
Visit [When](WHEN.md) page to learn how to execute task conditionally.

#### `location` (string)
Specifies the target location within the project structure, distinguishing between the root and app folders. It helps determine which build.gradle file to modify during the configuration process.
    -   `root`: (default) Modifies `android/build.gradle` file.
    -   `app`: Modifies `android/app/build.gradle` file.
    
#### `actions` (array of objects, required)
An array of action items that define the modifications to be made in the file. Each action item contains the following fields:

### Action Item

###### Common properties

#### `name` (string)
An optional name for the action. If provided, the action state will be saved as a variable.
Visit [Task and Action States](STATES.md) page to learn more.

#### `when` (object)
Visit [When](WHEN.md) page to learn how to execute action conditionally.

###### Context reduction properties

#### `block` (string)
A string specifying the block path within the `build.gradle` file where modifications should occur. Check Block section below.

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

### Block

The `block` property in the `build_gradle` task serves as a block path within the `build.gradle` file. This path helps define the specific context within the file where modifications should be made. By specifying this block path, you can precisely target the portion of the `build.gradle` file that requires customization.

Usage Example
-------------

```yaml
type: build_gradle
label: "Enabling multidex"
location: "app",
actions:
  - block: "android.defaultConfig"
    after: versionName
    prepend: multiDexEnabled true
```

In this example, the `build_gradle` task enables multidex in `defaultConfig` block in the `build.gradle` file. The `block` property is set to "android.defaultConfig", indicating the modification context.

Conclusion
----------

The `build_gradle` task is a powerful tool for customizing Android project configurations by making precise modifications to the `build.gradle` files. It allows you to add dependencies, configure build settings, and perform other customizations with ease. The `block` property ensures that modifications occur in the intended context within the file, offering fine-grained control over project configuration. The `actions` property enhances this task's capabilities by allowing multiple modifications within the specified block.
