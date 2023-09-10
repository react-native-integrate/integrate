Variables in Configuration
==========================

Overview
--------

Variables in configuration files allow you to insert dynamic values into text before applying modifications through tasks. This feature adds flexibility and reusability to your configurations. You can use variables to replace placeholders with specific values, making it easier to adapt your configurations to different contexts.

### Variable Syntax

To use a variable, you enclose its name within square brackets with a dollar sign, like this: `$[variable_name]`. This convention helps distinguish variables from regular text and is easy to identify within your configuration.

### Variable Types

There are three main types of variables:

1.  Predefined Variables: These are predefined and available for use without further definition. You can use them directly in your configuration. Here is the list of the predefined variables:
    - `PLATFORM`: Gets value of `process.platform`.
    - `ENV.(VAR_NAME)`: You can access `process.env` values by using this convention. For example: `$[ENV.USER]`.
    - `IOS_PROJECT_NAME`: Name of the application target in the ios project.

2.  Static Variables: You can define your own variables with static values directly within `env` field of your configuration. These values remain constant throughout the execution.

3.  User-Prompted Variables: You can prompt the user to enter a value for a variable during the execution of your configuration. This allows for dynamic input and customization.

You can use variables in any string property within tasks, making it a versatile tool for customizing your configuration.

Usage Example
-------------

Here's an example of how to use variables in a configuration file:

```yaml
env:
  frb: Firebase
tasks:
  - type: app_delegate
    label: "Integrate $[frb]"
    updates:
      - prepend: "#import <$[frb].h>"
        comment: added by $[frb]
      - block: "didFinishLaunchingWithOptions"
        prepend: "[FIRApp configure];"
```

In this example:

-   We define a static variable `frb` within the `env` section of our configuration.
-   Within the `app_delegate` task, we use this variable to customize the label, prepend a specific import statement, and add comments.
-   The resulting configuration is more dynamic and can be easily adjusted for different use cases.

Conclusion
----------

Variables in your configuration files provide a powerful mechanism for injecting dynamic values into your tasks. They help you streamline the customization of configurations, making it easier to adapt them to various projects and requirements. Whether you're using predefined, static, or user-prompted variables, they can significantly enhance the flexibility and efficiency of your configuration management process.
