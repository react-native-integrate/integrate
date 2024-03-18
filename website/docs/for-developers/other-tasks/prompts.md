---
sidebar_position: 4
title: User Prompts
---
# Prompt Task Configuration (`prompt`)
_Ask for user input_

The `prompt` task type allows you to gather user input during the integration process.

## Task Properties

| Property | Type                                            | Description                                                                                                                                                  |
|:---------|:------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type     | "prompt", required                              | Specifies the task type, which should be set to "prompt" for this task.                                                                                      |
| name     | string                                          | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../guides/states) page to learn more. |
| label    | string                                          | An optional label or description for the task.                                                                                                               |
| when     | object                                          | Visit [Conditional Tasks and Actions](../guides/when) page to learn how to execute task conditionally.                                                       |
| actions  | Array\<[Action](#action-properties)\>, required | An array of action items that define the modifications to be made in the file.                                                                               |

## Action Properties

| Property | Type                                           | Description                                                                                                                                                  |
|:---------|:-----------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name     | string                                         | An optional name for the task. If provided, the task state will be saved as a variable. Visit [Task and Action States](../guides/states) page to learn more. |
| when     | object                                         | Visit [Conditional Tasks and Actions](../guides/when)  page to learn how to execute action conditionally.                                                    |
| text     | "text" or "boolean" or "multiselect", required | The text displayed to prompt the user.                                                                                                                       |
| type     | string, required                               | Specifies the type of prompt to display.                                                                                                                     |
| message  | string                                         | A string that serves as the user prompt message when collecting input. If provided, this message will replace the default message.                           |

#### _The action item can take these properties based on which action you want to execute._

### Text Prompt

| Property     | Type                                          | Description                                                                                                                        |
|:-------------|:----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| defaultValue | string                                        | The value that is assigned if user does not enter any value.                                                                       |
| initialValue | string                                        | The initial text value.                                                                                                            |
| placeholder  | string                                        | The hint text to be shown when user does not enter any value.                                                                      |
| validate     | Array\<[Validation](#validation-properties)\> | Validates the user input before submission.                                                                                        |

#### Validation Properties

| Property    | Type             | Description                                                                                                                        |
|:------------|:-----------------|------------------------------------------------------------------------------------------------------------------------------------|
| regex       | string, required | Displays a yes/no confirmation for the user to choose from.                                                                        |
| message     | string           | Message to be displayed if validation fails.                                                                                       |

#### Example:

```yaml
type: prompt
actions:
  - name: user_name
    text: "Enter your name:"
    validate:
      - regex: ^[a-z0-9]+$
        message: must contain only lowercase letters or numbers
      - regex: ^[a-z]
        message: must start with a letter
```
### Boolean Prompt

| Property      | Type     | Description                                |
|:--------------|:---------|--------------------------------------------|
| positive      | string   | The text to be displayed instead of 'yes'. |
| negative      | string   | The text to be displayed instead of 'no'.  |
| initialValue  | boolean  | Default selection value.                   |

#### Example:

```yaml
type: prompt
actions:
  - name: run_task
    type: boolean
    text: "Do you want to run this task?"
```

### Multi Select Prompt

| Property       | Type                                  | Description                                                 |
|:---------------|:--------------------------------------|-------------------------------------------------------------|
| required       | boolean                               | Defines that user must select at least one of select items. |
| options        | Array\<[Option](#option-properties)\> | An array of options items.                                  |
| initialValues  | Array\<string or boolean or number\>  | Default selected values.                                    |

#### Option Properties

| Property | Type                        | Description                                   |
|:---------|:----------------------------|-----------------------------------------------|
| value    | string or boolean or number | The value of the option item                  |
| label    | string                      | A text to be shown as label.                  |
| hint     | string                      | Displays information about this option item.  |

#### Example:
```yaml
type: prompt
actions:
  - name: platforms
    type: multiselect
    required: true
    text: "Select platforms to integrate:"
    options:
      - value: android
        label: Android
        hint: will integrate into android platform
      - value: ios
        label: iOS
        hint: will integrate into iOS platform
```

## Example

Here's an example of how to use prompts in a configuration file:

```yaml
tasks:
  - type: prompt
    actions:
      - name: run_app_delegate
        type: boolean
        text: "Do you want to run the app_delegate task?"
  - type: app_delegate
    when:
      run_app_delegate: true
```

In this example:

-   We define a boolean prompt to ask if the user wants to execute the task.
-   Within the `app_delegate` task, we check if the user confirmed to run the task.

The values entered by the user in response to prompts are stored as variables and can be referenced later in the configuration.
