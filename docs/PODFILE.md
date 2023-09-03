Podfile Task Configuration (`podfile`)
================================================

Overview
--------

The `podfile` task allows you to customize your iOS project's Podfile, which is a crucial configuration file for managing third-party dependencies using CocoaPods. You can make targeted changes to specific parts of the Podfile, such as predefined targets and even hooks, by specifying the `block` field in the task. This task empowers you to seamlessly integrate external libraries or configure your iOS project according to your specific requirements.

### Task Properties

-   `type` (string, required): Set this field to `podfile` to indicate that you're using the `podfile` task.
-   `label` (string, optional): A user-friendly label for the task, describing its purpose or functionality.
-   `updates` (array of objects, required): An array of update items that define the modifications to be made in the Podfile.
    -   `block` (string, optional): Specifies the part of the Podfile to target. You can set it to one of the following values:
        -   `target`: Narrows the context to the first target defined in the Podfile.
        -   `target 'TargetName'`: Targets a specific named target.
        -   `target.(hook_name)`: Possible hooks are `pre_install`, `post_install`, `pre_integrate`, `post_integrate`: Targets predefined Podfile hooks.

        If omitted, the entire Podfile will be the context for updates.
    -   `append` (string or object, optional): Appends text to the specified context. You can use either a string for plain text or an object with a `file` field to insert content from an external file.
    -   `prepend` (string or object, optional): Prepends text to the specified context. You can use either a string for plain text or an object with a `file` field to insert content from an external file.
    -   `before` (string or object, optional): Inserts text before a specified point in the context. You can use either a string for plain text or an object with a `file` field to insert content from an external file.
    -   `after` (string or object, optional): Inserts text after a specified point in the context. You can use either a string for plain text or an object with a `file` field to insert content from an external file.
    -   `strict` (Optional): Specifies the behavior of the `before` and `after` fields. If set to `true`, the task will throw an error if the text in the `before` or `after` field is not found in the context, otherwise, it will ignore the field.
    -   `ifNotPresent` (Optional): Indicates that the task should only be executed if the specified text or code is not present within the specified context.
    -   `comment` (Optional): Adds a comment before the inserted text or code within the specified context.

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
