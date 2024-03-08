Gitignore Task Configuration (`gitignore`)
================================================

Overview
--------

The `gitignore` task allows you to customize .gitignore file, which is used to ignore some files from getting added to version control.

Task Properties
---------------

#### `type` (string, required)
Specifies the task type, which should be set to "gitignore" for this task.

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

###### Context reduction properties

#### `before` (string or object)
Text or code that is used to specify a point within the context where text should be inserted before. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search.

#### `after` (string or object)
Text or code that is used to specify a point within the context where text should be inserted after. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search.

#### `search` (string or object)
A string or object (with regex and flags) that narrows the context to a specific text within the method or file.

###### Context modification properties

#### `prepend` (string or object)
Text or code to prepend at the beginning of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to prepend.

#### `append` (string or object)
Text or code to append at the end of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to append.

#### `replace` (string or object)
Text or code to replace the entire specified context. It can be a string or an object with a `file` field that points to a file containing the code to replace.

######  Other properties

#### `exact` (boolean)
A boolean flag that modifies the whitespace and new line management.

#### `strict` (boolean)
Specifies the behavior of the `before` and `after` fields. If set to `true`, the task will throw an error if the text in the `before` or `after` field is not found in the context, otherwise, it will ignore the field.

#### `ifNotPresent` (string)
Indicates that the task should only be executed if the specified text or code is not present within the specified context.

#### `comment` (string)
An optional comment to add before the inserted code or text. The comment is purely informational and does not affect the code's functionality.

### Usage Example

Here's an example of a configuration file (`integrate.yml`) that utilizes the `gitignore` task to modify the .gitignore file:


```yaml
type: gitignore
label: "Modify .gitignore"
actions:
  - append: ios/tmp.xcconfig
```

In this example, we append a declaration within .gitignore to prevent tmp.xcconfig from getting added to version control.

### Conclusion

The `gitignore` task equips you with the ability to add files to .gitignore to prevent them from getting added to git.
