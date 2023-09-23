Prompts in Configuration
========================

Overview
--------

Prompts are interactive elements within your configuration that allow you to collect user input and make your configuration more dynamic and customizable. With prompts, you can request specific information or decisions from the user before executing tasks, enabling you to adapt your configuration to different scenarios.

### Prompt Syntax

Prompts are defined in the configuration file using the following syntax:

```yaml
prompts:
  - name: prompt_name
    type: prompt_type
    text: prompt_text
```

-   `name`: A unique identifier for the prompt. You will use this name to reference the user's input or decision later in the configuration.
-   `type`: The type of prompt, which determines the format of the expected user input (e.g., text, boolean, number).
-   `text`: The text displayed to the user as the prompt message or question.

Prompt Types
------------

### Text Prompt

Text prompts request free-form text input from the user. You can use this type to collect strings, names, paths, or any other textual information.

```yaml
prompts:
  - name: user_name
    text: "Enter your name:"
    validate:
      - regex: ^[a-z0-9]+$
        message: must contain only lowercase letters or numbers
      - regex: ^[a-z]
        message: must start with a letter
```

### Boolean Prompt

Boolean prompts present a yes/no or true/false question to the user. These prompts are useful for obtaining binary decisions.

```yaml
prompts:
  - name: run_task
    type: boolean
    text: "Do you want to run this task?"
```

### Multi Select Prompt

Multi select prompts request multiple values by presenting a list of options.

```yaml
prompts:
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

<!--
### Numeric Prompt

Numeric prompts are used to gather numerical data from the user. You can specify whether you expect an integer or a floating-point number.

```yaml
prompts:
  - name: age
    type: number
    text: "Enter your age:"
```
-->
Usage Example
-------------

Here's an example of how to use prompts in a configuration file:

```yaml
prompts:
  - name: app_id
    text: "Enter your app ID:"
tasks:
  - type: app_delegate
    prompts:
      - name: run_app_delegate
        type: boolean
        text: "Do you want to run the app_delegate task?"
```

In this example:

-   We define a text prompt to collect the app ID from the user.
-   Within the `app_delegate` task, we define a boolean prompt to ask if the user wants to execute the task.

The values entered by the user in response to prompts are stored as variables and can be referenced later in the configuration.

Conclusion
----------

Prompts enhance your configuration files by enabling user interaction. They allow you to collect user input, making your configurations more adaptable to different scenarios. By incorporating prompts, you can streamline the customization process and create configurations that meet specific project requirements with ease.
