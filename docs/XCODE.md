Xcode Task Configuration (`xcode`)
==================================================

Overview
---------

The "xcode" task is used to manage the iOS xcode project. This task allows you to specify which resources to add and where to add them, either to the root level of the iOS project or to specific target groups within the project.

Task Properties
---------------

#### `type` (string, required)
Specifies the task type, which should be set to "xcode" for this task.

#### `name` (string)
An optional name for the task. If provided, the task state will be saved as a variable.
Visit [Task and Action States](STATES.md) page to learn more.

#### `label` (string)
An optional label or description for the task.

#### `when` (object)
Visit [When](WHEN.md) page to learn how to execute task conditionally.

#### `prompts` (array)
Visit [Prompts](PROMPTS.md) page to learn how to request input from user.

#### `actions` (array of objects, required)
An array of action items that define the modifications to be made in the file. Each action item contains the following fields:

### Action Item

#### `name` (string)
An optional name for the action. If provided, the action state will be saved as a variable.
Visit [Task and Action States](STATES.md) page to learn more.

#### `when` (object)
Visit [When](WHEN.md) page to learn how to execute action conditionally.

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
type: xcode
actions:
  - add: "GoogleService-Info.plist"
    target: "app"
  - add: "splash.png"
    target:
      name: "CustomTarget"
```

In this example, two resources, `GoogleService-Info.plist` and `splash.png` are specified for addition. The `target` field distinguishes the target groups within the iOS project where each resource should be placed, enabling precise resource management.

Conclusion
----------

The `xcode` task simplifies the process of modifying an iOS project within a React Native application. By utilizing the `actions` array and specifying the `target` field, you can efficiently manage and configure the addition of resources to specific target groups within the project. This task streamlines Xcode project management and enhances the overall development experience.
