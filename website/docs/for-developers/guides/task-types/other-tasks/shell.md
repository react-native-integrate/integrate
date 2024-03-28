---
sidebar_position: 3
title: Shell Commands
---

# Shell Task Configuration (`shell`)

_Run shell commands_

The `shell` task type allows you to run shell commands.

## Task Properties

| Property | Type                                            | Description                                                                                                                                              |
|:---------|:------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| task     | "shell", required                               | Specifies the task type, which should be set to "shell" for this task.                                                                                   |
| name     | string                                          | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| label    | string                                          | An optional label or description for the task.                                                                                                           |
| when     | object                                          | Visit [Conditional Tasks and Actions](../../when) page to learn how to execute task conditionally.                                                       |
| actions  | Array\<[Action](#action-properties)\>, required | An array of action items that define the modifications to be made in the file.                                                                           |

## Action Properties

| Property | Type             | Description                                                                                                                                              |
|:---------|:-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| name     | string           | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| when     | object           | Visit [Conditional Tasks and Actions](../../when)  page to learn how to execute action conditionally.                                                    |
| command  | string, required | The process name to spawn. Command can have simple args, parser supports quotes. For more complex args, use `args` property.                             |
| args     | Array\<string\>  | Array of args to be past directly to process.                                                                                                            |
| cwd      | string           | Working directory to run shell. Must be relative to the project root. Default is project root.                                                           |

## Example

Here's an example of how to use shell task in a configuration file:

```yaml
steps:
  - task: shell
    label: Embedding assets
    actions:
      - command: npx react-native-asset
      - command: some-command --some-flag "some literal args"
      - command: other-command
        args:
          - --some-flag
          - "some \"complex\" args"
```

:::tip
Specify `name` field for this action to expose the `name.output` variable which will hold the output of the process.

#### Example:

```yaml
  # run command 
  - command: npx react-native-asset
    name: cmd_asset # Give it a name

  # you can run another command if previous was success and output contains some value
  - when:
      cmd_asset: done
      cmd_asset.output: # use the name here
        $regex: somevalue
    command: some-other-command
 ```

:::

:::warning
`shell` commands that are used in package integrations will always ask permission from user before execution. User may choose to skip the execution,
so don't rely on it too much.

It does not ask permission when used in [upgrade.yml](../../../../upgrade/configuration).
:::
