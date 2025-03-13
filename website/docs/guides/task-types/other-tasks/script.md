---
sidebar_position: 1
title: Script
---

# Script Task Configuration (`script`)

_Execute custom JS script_

The `script` task type allows you to evaluate JS scripts to have full control over the task flow.

## Task Properties

| Property | Type                                            | Description                                                                                                                                              |
|:---------|:------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| task     | "script", required                              | Specifies the task type, which should be set to "prompt" for this task.                                                                                  |
| name     | string                                          | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| label    | string                                          | An optional label or description for the task.                                                                                                           |
| when     | object                                          | Visit [Conditional Tasks and Actions](../../when) page to learn how to execute task conditionally.                                                       |
| actions  | Array\<[Action](#action-properties)\>, required | An array of action items that define the modifications to be made in the file.                                                                           |

## Action Properties

| Property | Type   | Description                                                                                                                                              |
|:---------|:-------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| name     | string | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../../states) page to learn more. |
| when     | object | Visit [Conditional Tasks and Actions](../../when)  page to learn how to execute action conditionally.                                                    |
| script   | string | The script to be executed.                                                                                                                               |
| module   | string | The module file to run. Your module should export a function with a single context parameter. Context parameter contains all supported task actions.     |

## Example

Here's an example of how to use prompts in a configuration file:

```yaml
steps:
  - task: script
    actions:
      - script: |-
          if (get('some-task') == 'done')
            set('run_app_delegate', true);
  - task: app_delegate
    when:
      run_app_delegate: true
```

In this example:

- We evaluate a script to check if `some-task` was run with success and define `run_app_delegate` variable.
- `app_delegate` task will run if `run_app_delegate` is true.

#### You can also call any task in a script:

```yaml
steps:
  - task: script
    actions:
      - script: |-
          await app_delegate({
            prepend: 'some import'
          });
```

#### Or run your custom plugin module:

```yaml
steps:
  - task: script
    actions:
      - module: 'plugin/integrate.js';
```

_plugin/integrate.js_

```js
module.exports = async function integrate(ctx) {
  await ctx.app_delegate({
    prepend: 'some import'
  });
}
```

### Typescript

You can add `react-native-integrate` as dev dependency and use `ModuleContext` type for TS.
Note that you need to transpile your plugin to CommonJS before shipping.

_plugin/integrate.ts_

```js
import { ModuleContext } from "react-native-integrate";

export default async function integrate(ctx: ModuleContext) {
  await ctx.app_delegate({
    prepend: 'some import'
  });
}
```
