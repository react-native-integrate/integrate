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

#### `actions` (array of objects, required)
An array of action items that define the modifications to be made in the file. Each action item contains the following fields:

### Action Item

###### Common properties

#### `name` (string)
An optional name for the action. If provided, the action state will be saved as a variable.
Visit [Task and Action States](STATES.md) page to learn more.

#### `when` (object)
Visit [When](WHEN.md) page to learn how to execute action conditionally.

##### _The action item can take these properties based on which action you want to execute._

###### Add a resource file

#### `addFile` (string)
Specifies the resource file to be added. It can be a string representing the resource file name.

#### `message` (string)
A string that serves as the user prompt message when collecting input for file to copy. If provided, this message will replace the default message.

#### `target` (string)
Specifies the target group within the iOS project where the resource should be added. It can take the listed values.
- `root`: (default) Adds the resource to the project root
- `main`: Adds the resource to the main application group
- Or target name or path to add the resource

###### Add a new target

#### `addTarget` (string)
Specifies the target name to be added.

#### `type` (string)
Specifies target type to be added. It can be one of the following values:
- `notification-service`: Notification Service Extension
- `notification-content`: Notification Content Extension

#### `message` (string)
Specifies the message when requesting the target name from the user.

> **Note**: Specify `name` field for this action to expose the `name.target` variable which will hold the name of the target which was entered by the user.
> 
> For example:
> ```yaml
>  # add a notification service extension 
>  # with the default name `MyNotificationService`.
>  # User can change this when running this action!
>  - addTarget: MyNotificationService
>    name: notificationsv # Give it a name
>    type: notification-service
> 
>  # set extension version to same as main target
>  - setDeploymentVersion: $[IOS_DEPLOYMENT_VERSION]
>    target: $[notificationsv.target] # use the name here
> ```

###### Add new capability to a target

#### `addCapability` (string)
Specifies the capability to be added. Can take one of these values:
- `push`: Push Notification
- `wireless-configuration`
- `app-attest`
- `data-protection`
- `homekit`
- `healthkit`
- `inter-app-audio`
- `increased-memory`
- `groups`: App Groups. Additional `groups` field is required, check below.
- `keychain-sharing`: Additional `groups` field is required, check below.
- `background-mode`: Additional `modes` field is required, check below.
- `game-controllers`: Additional `controllers` field is required, check below.
- `maps`: Additional `routing` field is required, check below.

#### `groups` (array of strings) 
Required when `addCapability` is set to `groups` or `keychain-sharing`.

#### `modes` (array of strings) 
Required when `addCapability` is set to `background-mode`. Can take these values:
- `audio`
- `bluetooth-central`
- `bluetooth-peripheral`
- `external-accessory`
- `fetch`
- `location`
- `nearby-interaction`
- `processing`
- `push-to-talk`
- `remote-notification`
- `voip`

#### `controllers` (array of strings) 
Required when `addCapability` is set to `game-controllers`. Can take these values:
- `extended`
- `micro`
- `directional`

#### `routing` (array of strings) 
Required when `addCapability` is set to `maps`. Can take these values:
- `bike`
- `bus`
- `car`
- `ferry`
- `other`
- `pedestrian`
- `plane`
- `ride-share`
- `street-car`
- `subway`
- `taxi`
- `train`

#### `target` (string)
Specifies the target group within the iOS project where the capability should be added. It can take the listed values.
- `main`: Adds the capability to the main target
- Or target name or path to add the capability to

###### Set deployment version

#### `setDeploymentVersion` (string or object)
Specifies the version to set. Can the these type of values:
- `string`: String representation of the version. Can also be a variable in `$[variable]` form.
- `number`: Version number
- `(object)`:
  - `min`: Minimum version to set. The target version is set only if it is lower than this value.
  - `max`: Maximum version to set. The target version is set only if it is higher than this value.

#### `target` (string)
Specifies the deployment target iOS version. It can take the listed values.
- `root`: Sets deployment target version of the project root
- `main`: Sets deployment target version of the main target
- Or target name or path to set the deployment version

Usage Example
-------------

```yaml
type: xcode
actions:
  - addFile: "GoogleService-Info.plist"
    target: root
  - addTarget: OneSignalNotificationService
    type: notification-extension
```

In this example, a resource and a new target, `GoogleService-Info.plist` and `OneSignalNotificationService` are specified for addition. The `target` field distinguishes the target groups within the iOS project where each resource should be placed, enabling precise resource management.

Conclusion
----------

The `xcode` task simplifies the process of modifying an iOS project within a React Native application. By utilizing the `actions` array and specifying the `target` field, you can efficiently manage and configure the addition of resources to specific target groups within the project. This task streamlines Xcode project management and enhances the overall development experience.
