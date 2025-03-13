---
sidebar_position: 3
---
# Task States

The state management feature in your configuration allows you to track the execution status of tasks and actions by defining a `name` for each task and action. This feature provides a way to check and control the flow of your operations based on the execution results.

## State Variables

For each task or action, the following state variables are automatically set based on its execution, where `<name>` is the name you provide to the task or action:

-   `<name>`: This variable holds the current state of the task or action and can have one of the following values:

    -   `progress`: The task or action is currently running. (This state is primarily for internal tracking and may not be useful in most cases.)
    -   `skipped`: The task or action did not meet the `when` condition and was skipped.
    -   `done`: The task or action completed successfully.
    -   `error`: The task or action resulted in an error.

-   `reason.<name>`: This variable contains the reason of error or skip.

    Error reason contains the thrown error message.

    Skip reason has one of the following values:
    - `search`: The searched value was not found.
    - `prepend.ifNotPresent`: Prepend was skipped because `ifNotPresent` was present in context.
    - `prepend.exists`: Prepend was skipped because the code was already existed in context.
    - `append.ifNotPresent`: Append was skipped because `ifNotPresent` was present in context.
    - `append.exists`: Append was skipped because the code was already existed in context.
    - `replace.ifNotPresent`: Replace was skipped because `ifNotPresent` was present in context.
    - `replace.exists`: Replace was skipped because the code was already existed in context.

## Usage Example

Here's an example of how to use task and action states:

```yaml
steps:
  - task: fs
    name: fs_google
    label: Importing google-services.json
    when:
      platform: android
    actions:
      - copyFile: google-services.json
        destination: android/app/google-services.json

  - task: build_gradle
    when:
      fs_google.state: done
```

In this example, we have two tasks. The first task, `fs_google`, has a name assigned to it. The second task, `build_gradle`, uses the `when` condition to check the state of the `fs_google` task. It will only execute when the `fs_google` task is in the `done` state (completed successfully).
