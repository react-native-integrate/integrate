Prompt Task Configuration (`prompt`)
========================

Overview
--------

The prompt task type allows you to gather user input during the integration process.

Task Properties
---------------

#### `type` (string, required)
Specifies the task type, which should be set to "prompt" for this task.

#### `name` (string)
An optional name for the task. If provided, the task state will be saved as a variable.
Visit [Task and Action States](STATES.md) page to learn more.

#### `label` (string)
An optional label or description for the task.

#### `when` (object)
Visit [When](WHEN.md) page to learn how to execute task conditionally.

#### `actions` (array of objects, required)
An array of action items that define the questions to be asked to the user. Each action item contains the following fields:

### Action Item

#### `name` (string, required)
A unique identifier for the prompt. You will use this name to reference the user's input or decision later in the configuration.

#### `type` (string, required): 
Specifies the type of prompt to display. Currently supported types include:

-   `boolean`: Displays a yes/no confirmation for the user to choose from.
-   `multiselect`: Displays a list of options for the user to select multiple items from.

Omit the property to request a text input

##### Additional Properties Per Type

###### Text Prompt

#### `defaultValue` (string)
The value that is assigned if user does not enter any value.

#### `initialValue` (string)
The initial text value.

#### `placeholder` (string)
The hint text to be shown when user does not enter any value.

#### `validate` (array of objects)
Validates the user input before submit. A validation item can have following fields:
-   `regex`: **(string, required)** Displays a yes/no confirmation for the user to choose from.
-   `message`: **(string)** Message to be displayed if validation fails.

Example:
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
###### Boolean Prompt

#### `positive` (string)
The text to be displayed instead of 'yes'.

#### `negative` (string)
The text to be displayed instead of 'no'.

#### `initialValue` (string)
Default selection value.

Example:
```yaml
type: prompt
actions:
  - name: run_task
    type: boolean
    text: "Do you want to run this task?"
```

###### Multi Select Prompt

#### `required` (boolean)
Defines that user must select at least one of select items.

#### `options` (array of objects)
An array of options items. Can have these fields:
-   `value`: **(string | boolean | number, required)** The value of the option item
-   `label`: **(string)** A text to be shown as label.
-   `hint`: **(string)** Displays information about this option item.

#### `initialValues` (string)
Default selection values.

Example:
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

Usage Example
-------------

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

Conclusion
----------

Prompts enhance your configuration files by enabling user interaction. They allow you to collect user input, making your configurations more adaptable to different scenarios. By incorporating prompts, you can streamline the customization process and create configurations that meet specific project requirements with ease.
