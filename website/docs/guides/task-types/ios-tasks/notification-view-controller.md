---
sidebar_position: 6
title: NotificationViewController.m
---

# Notification View Controller Task Configuration (`notification_view_controller`)

_Modify NotificationViewController.m file_

The `notification_view_controller` task is used to modify the NotificationViewController.m file in an iOS project. This task allows you to insert
code, import statements, or comments into specific methods within the NotificationViewController.m file. The modifications can be made before or after
a specified point in the method.

## Task Properties

| Property | Type                                            | Description                                                                                                                                              |
|:---------|:------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| task     | "notification_view_controller", required        | Specifies the task type, which should be set to "notification_view_controller" for this task.                                                            |
| name     | string                                          | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| label    | string                                          | An optional label or description for the task.                                                                                                           |
| when     | object                                          | Visit [Conditional Tasks and Actions](../../when) page to learn how to execute task conditionally.                                                       |
| actions  | Array\<[Action](#action-properties)\>, required | An array of action items that define the modifications to be made in the file.                                                                           |

## Action Properties

### Common properties

| Property | Type   | Description                                                                                                                                              |
|:---------|:-------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| name     | string | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| when     | object | Visit [Conditional Tasks and Actions](../../when)  page to learn how to execute action conditionally.                                                    |

### Context reduction properties

| Property | Type                                                 | Description                                                                                                                                                                                                                                                                                              |
|:---------|:-----------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| block    | one of [Allowed Method Names](#allowed-method-names) | Specifies the name of the method within NotificationViewController.m where the modification should be applied. It must match one of the allowed method names. See [Allowed Method Names](#allowed-method-names) section for details. Omitting this field instructs the action item to modify whole file. |
| before   | string or `{regex: string, flags: string}`           | Text or code that is used to specify a point within the context where text should be inserted before. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search.                                                                                                  |
| after    | string or `{regex: string, flags: string}`           | Text or code that is used to specify a point within the context where text should be inserted after. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search.                                                                                                   |
| search   | string or `{regex: string, flags: string}`           | A string or object (with regex and flags) that narrows the context to a specific text within the method or file.                                                                                                                                                                                         |

### Context modification properties

| Property | Type                       | Description                                                                                                                                                                  |
|:---------|:---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| prepend  | string or `{file: string}` | Text or code to prepend at the beginning of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to prepend. |
| append   | string or `{file: string}` | Text or code to append at the end of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to append.         |
| replace  | string or `{file: string}` | Text or code to replace the entire specified context. It can be a string or an object with a `file` field that points to a file containing the code to replace.              |
| script   | string or `{file: string}` | JS code script to evaluate. It can be a string or an object with a `file` field that points to a file containing the script. In script these functions are available to be called: `await prepend(content), await append(content), await replace(content) |

### Other properties

| Property     | Type    | Description                                                                                                                                                                                                              |
|:-------------|:--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| exact        | boolean | A boolean flag that modifies the whitespace and new line management.                                                                                                                                                     |
| strict       | boolean | Specifies the behavior of the `before` and `after` fields. If set to `true`, the task will throw an error if the text in the `before` or `after` field is not found in the context, otherwise, it will ignore the field. |
| ifNotPresent | string  | Indicates that the task should only be executed if the specified text or code is not present within the specified context.                                                                                               |
| comment      | string  | An optional comment to add before the inserted code or text. The comment is purely informational and does not affect the code's functionality.                                                                           |

### Allowed Method Names

The `block` field within the action items must match one of the allowed method names within the NotificationViewController.m file. The method is
created if it does not exist. The following method names are allowed:

- `viewDidLoad`
- `viewWillAppear`
- `viewDidAppear`
- `viewWillDisappear`
- `dealloc`
- `didReceiveNotification`
- `didReceiveNotificationResponse`

## Example

Here's an example of how to use the `notification_view_controller` task:

```yaml
task: notification_view_controller
label: Replacing NotificationViewController.m content
target: SomeNotificationViewControllerExtension
actions:
  - replace:
      file: .integrate/MyNotificationViewController.m
```

In this example, we replace `NotificationViewController.m` file with the contents of `.integrate/MyNotificationViewController.m`.
