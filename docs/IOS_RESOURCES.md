Ios Resources Task Configuration (`ios_resources`)
==================================================

Overview
---------

The "ios_resources" task is used to manage resources within the iOS project. This task allows you to specify which resources to add and where to add them, either to the root level of the iOS project or to specific target groups within the project. The task operates within the context of iOS resource management, making it easier to handle asset additions efficiently.

Task Properties
---------------

#### `type` (string, required)
Specifies the task type, which should be set to "ios_resources" for this task.

#### `label` (string)
An optional label or description for the task.

#### `prompts` (array)
Visit [Prompts](PROMPTS.md) page to learn how to request input from user.

#### `updates` (array of objects, required)
An array of update items that define the modifications to be made in the file. Each update item contains the following fields:

### Update Item

#### `addFile` (string)
Specifies the resource file to be added. It can be a string representing the resource file name.

#### `message` (string)
A string that serves as the user prompt message when collecting input for file to copy. If provided, this message will replace the default message.

#### `target` (string or object)
Specifies the target group within the iOS project where the resource should be added. It can take the listed values.
- `root`: (default) Adds the resource to the project root
- `app`: Adds the resource to the main application group
- `(object)`
    - `name`: Name of the target group
    - `path`: Path of the target group

Usage Example
-------------

```yaml
type: ios_resources
updates:
  - add: "GoogleService-Info.plist"
    target: "app"
  - add: "splash.png"
    target:
      name: "CustomTarget"
```

In this example, two resources, `GoogleService-Info.plist` and `splash.png` are specified for addition. The `target` field distinguishes the target groups within the iOS project where each resource should be placed, enabling precise resource management.

Conclusion
----------

The `ios_resources` task simplifies the process of adding resources to an iOS project within a React Native application. By utilizing the `updates` array and specifying the `target` field, you can efficiently manage and configure the addition of resources to specific target groups within the project. This task streamlines iOS resource management and enhances the overall development experience.
