---
sidebar_position: 2
---
# Conditional Tasks and Actions

The `when` field of tasks and actions in your configuration allows you to specify conditions under which a particular task or action should be executed. It provides flexibility in controlling the flow of the integration based on variables and their values.

## Syntax

The `when` field is an object that uses MongoDB-like query notation. It can contain simple key-value pairs or more complex queries.

## Examples

**1.  Simple Key-Value Check:**

```yaml
when:
  platform: android
```
In this example, the associated task will only execute if the 'platform' variable is set to 'android'.


**2.  Complex Query:**

```yaml
when:
  $and:
    - platform: android
    - environment: production
```

This example demonstrates a more complex query. The task will execute only if both 'platform' is 'android' and 'environment' is 'production'.


**3.  Logical Operators:**

```yaml
when:
  $or:
    - platform: android
    - platform: ios
```

Here, the task will execute if either 'platform' is 'android' or 'ios'.


**4.  Array Membership Check:**

```yaml
when:
  platform:
    $in:
      - android
      - ios
```

This query checks if 'platform' is in the list `['android', 'ios']`. If it matches, the task will execute.

**5.  Combining Conditions:**

```yaml
when:
  $and:
    - $or:
        - platform: android
        - platform: ios
    - environment: development
```

In this example, the task will execute if either 'platform' is 'android' or 'ios', and 'environment' is 'development'.
