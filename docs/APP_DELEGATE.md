App Delegate Task Configuration (`app_delegate`)
================================================

Overview
--------

The `app_delegate` task is used to modify the AppDelegate.mm file in an iOS project. This task allows you to insert code, import statements, or comments into specific methods within the AppDelegate.mm file. The modifications can be made before or after a specified point in the method. This task is particularly useful for integrating third-party libraries or SDKs that require changes to the AppDelegate file.

Task Properties
---------------

-   `type` (string, required): Specifies the task type as "app_delegate".
-   `label` (string): An optional label or description for the task.
-   `updates` (array of objects, required): An array of update items that define the modifications to be made in the AppDelegate.mm file. Each update item contains the following fields:
    -   `block` (string): Specifies the name of the method within AppDelegate.mm where the modification should be applied. It must match one of the allowed method names. See the "Allowed Method Names" section for details. Omitting this field instructs the update item to modify whole file.
    -   `prepend` (string or object): Text or code to prepend at the beginning of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to prepend.
    -   `append` (string or object): Text or code to append at the end of the specified context. It can be a string or an object with a `file` field that points to a file containing the code to append.
    -   `before` (string or object): Text or code to insert before a specific point within the context. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search for the insertion point.
    -   `after` (string or object): Text or code to insert after a specific point within the context. It can be a string or an object with a `regex` and `flags` field to perform a regex-based search for the insertion point.
    -   `comment` (string): An optional comment to add before the inserted code or text. The comment is purely informational and does not affect the code's functionality.

Allowed Method Names
--------------------

The `block` field within the update items must match one of the allowed method names within the AppDelegate.mm file. The method is created if it does not exist. The following method names are allowed:

-   `didFinishLaunchingWithOptions`
-   `applicationDidBecomeActive`
-   `applicationWillResignActive`
-   `applicationDidEnterBackground`
-   `applicationWillEnterForeground`
-   `applicationWillTerminate`
-   `openURL`
-   `restorationHandler`
-   `didRegisterForRemoteNotificationsWithDeviceToken`
-   `didFailToRegisterForRemoteNotificationsWithError`
-   `didReceiveRemoteNotification`
-   `fetchCompletionHandler`

Usage Example
-------------

Here's an example of how to use the `app_delegate` task:

```yaml
- type: app_delegate
  label: "Integrate Firebase"
  updates:
    - prepend: "#import <Firebase.h>"
    - block: "didFinishLaunchingWithOptions"
      prepend: "[FIRApp configure];"
    - block: "openURL"
      before: "return YES;"
      append: "// Handle custom URL schemes here."
```

In this example, the task is labeled "Integrate Firebase." It defines three update items:

1.  It prepends the header import to the file `#import <Firebase.h>`.
 
2.  In the `didFinishLaunchingWithOptions` method, it prepends the code `[FIRApp configure];`.

3.  In the `openURL` method, it adds a comment before the `return YES;` statement, followed by code to handle custom URL schemes.

Conclusion
----------

The `app_delegate` task is a powerful tool for making targeted modifications to the AppDelegate.mm file in an iOS project. It allows you to seamlessly integrate third-party libraries, SDKs, or custom code into specific parts of your iOS application's lifecycle.
