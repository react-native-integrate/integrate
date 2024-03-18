---
sidebar_position: 4
title: Xcode Project
---
# Xcode Task Configuration (`xcode`)
_Modify Xcode project_

The "xcode" task is used to manage the iOS xcode project. This task allows you to specify which resources to add and where to add them, either to the root level of the iOS project or to specific target groups within the project.

## Task Properties

| Property | Type                                            | Description                                                                                                                                                  |
|:---------|:------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type     | "xcode", required                               | Specifies the task type, which should be set to "xcode" for this task.                                                                                       |
| name     | string                                          | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../guides/states) page to learn more. |
| label    | string                                          | An optional label or description for the task.                                                                                                               |
| when     | object                                          | Visit [Conditional Tasks and Actions](../guides/when) page to learn how to execute task conditionally.                                                       |
| actions  | Array\<[Action](#action-properties)\>, required | An array of action items that define the modifications to be made in the file. Each action item contains the following fields:                               |

## Action Properties

### Common properties

| Property   | Type                                       | Description                                                                                                                                                                                             |
|:-----------|:-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name       | string                                     | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../guides/states) page to learn more.                                            |
| when       | object                                     | Visit [Conditional Tasks and Actions](../guides/when)  page to learn how to execute action conditionally.                                                                                               |

#### _The action item can take these properties based on which action you want to execute._

### Add a resource file

| Property | Type                                       | Description                                                                                                                                         |
|:---------|:-------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| addFile  | string                                     | Specifies the resource file to be added. It can be a string representing the resource file name.                                                    |
| message  | string                                     | A string that serves as the user prompt message when collecting input for file to copy. If provided, this message will replace the default message. |
| target   | [Target](#target-property)                 | Specifies the target group within the iOS project where the resource should be added.                                                               |

#### Target Property
Specifies the target group within the iOS project where the resource should be added. It can take the listed values.
- `root`: (default) Adds the resource to the project root
- `main`: Adds the resource to the main application group
- Or target name or path to add the resource

### Add a new target

| Property  | Type                                             | Description                                                                                                                                                   |
|:----------|:-------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| addTarget | string                                           | Specifies the target name to be added.                                                                                                                        |
| type      | "notification-service" or "notification-content" | Specifies target type to be added. "notification-service" adds Notification Service Extension and "notification-content" adds Notification Content Extension. |
| message   | string                                           | Specifies the message when requesting the target name from the user.                                                                                          |

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

### Add new capability to a target

| Property      | Type                                       | Description                                                                                                                                                                                                       |
|:--------------|:-------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| addCapability | one of [Capability](#capability)           | Specifies the capability to be added                                                                                                                                                                              |
| groups        | Array\<string\>                            | Required when `addCapability` is set to `groups` or `keychain-sharing`                                                                                                                                            |
| modes         | Array\<[BackgroundMode](#backgroundmode)\> | Required when `addCapability` is set to `background-mode`.                                                                                                                                                        |
| controllers   | Array\<[Controller](#controller)\>         | Required when `addCapability` is set to `game-controllers`                                                                                                                                                        |
| routing       | Array\<[Routing](#routing)\>               | Required when `addCapability` is set to `maps`.                                                                                                                                                                   |
| target        | string                                     | Specifies the target group within the iOS project where the capability should be added. Setting "main" adds the capability to the main target, otherwise defines the target name or path to add the capability to |

#### Capability

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

#### BackgroundMode

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

#### Controller

- `extended`
- `micro`
- `directional`

#### Routing

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

### Set deployment version

| Property              | Type                                    | Description                                                                            |
|:----------------------|:----------------------------------------|----------------------------------------------------------------------------------------|
| setDeploymentVersion  | [DeploymentVersion](#deploymentversion) | Specifies the version to set.                                                          |
| target                | [Target](#target-property)              | Specifies the target group within the iOS project where the resource should be added.  |

#### DeploymentVersion

- `string`: String representation of the version. Can also be a variable in `$[variable]` form.
- `number`: Version number
- `(object)`:
    - `min`: Minimum version to set. The target version is set only if it is lower than this value.
    - `max`: Maximum version to set. The target version is set only if it is higher than this value.

### Add configuration

| Property          | Type                       | Description                                                                                                                                                |
|:------------------|:---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| addConfiguration  | string or `{file: string}` | Creates or updates xcconfig configuration file.  It can be a string or an object with a `file` field that points to a file containing the code to append.  |

### Add pre build run script action

| Property                    | Type                       | Description                                                                                                                                                       |
|:----------------------------|:---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| addPreBuildRunScriptAction  | string or `{file: string}` | Adds a pre build run script action into shared scheme.  It can be a string or an object with a `file` field that points to a file containing the code to append.  |

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

In this example, a resource and a new target, `GoogleService-Info.plist` and `OneSignalNotificationService` are specified for addition. The `target` field distinguishes the target groups within the iOS project where each resource should be placed.
