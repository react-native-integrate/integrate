Podfile Task Configuration (`podfile`)
================================================

Overview
--------

The `podfile` task allows you to customize your iOS project's Podfile, which is a crucial configuration file for managing third-party dependencies using CocoaPods. You can make targeted changes to specific parts of the Podfile, such as predefined targets and even hooks, by specifying the `block` field in the task. This task empowers you to seamlessly integrate external libraries or configure your iOS project according to your specific requirements.

Task Properties
---------------

#### `type` (string, required)
Specifies the task type, which should be set to "podfile" for this task.

#### `label` (string)
An optional label or description for the task.

#### `when` (object)
Visit [When](WHEN.md) page to learn how to execute task conditionally.

#### `prompts` (array)
Visit [Prompts](PROMPTS.md) page to learn how to request input from user.

#### `updates` (array of objects, required)
An array of update items that define the modifications to be made in the file. Each update item contains the following fields:

### Update Item

###### Context reduction properties

#### `block` (string)
Specifies the part of the Podfile to target. You can set it to one of the following values:
-   `target`: Narrows the context to the first target defined in the Podfile.
-   `target 'TargetName'`: Targets a specific named target.
-   `target.(hook_name)`: Possible hooks are `pre_install`, `post_install`, `pre_integrate`, `post_integrate`: Targets predefined Podfile hooks.

If omitted, the entire Podfile will be the context for updates.

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

### Usage Example

Here's an example of a configuration file (`integrate.yml`) that utilizes the `podfile` task to modify the iOS project's Podfile:


```yaml
type: podfile
label: "Modify Podfile"
updates:
  - block: target
    prepend: |
      pod 'SomeLibrary', '1.0.0'
  - block: target.pre_install
    append: |
      puts "Performing pre-installation tasks..."
```

In this example, we prepend a pod declaration within app target and append a message to the `pre_install` hook in first target.

### Conclusion

The `podfile` task equips you with the ability to tailor your iOS project's Podfile to meet your specific needs. Whether you want to add dependencies, configure targets, or implement custom logic within predefined hooks, this task provides the flexibility to seamlessly integrate third-party libraries or customize your project's CocoaPods configuration.
