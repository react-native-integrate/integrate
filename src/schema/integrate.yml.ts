// language=yaml
export const integrateYmlSchema = `type: object
required:
 - tasks
properties:
  tasks:
    type: array
    items:
      type: object
      required:
        - type
      properties:
        type:
          type: string
          enum: [plist, app_delegate, validate, build_gradle, app_build_gradle, android_manifest, add_resource]
        ifNotPresent:
          type: string
        prepend:
          anyOf:
            - type: string
            - type: object
              properties:
                file:
                  type: string
        append:
          anyOf:
            - type: string
            - type: object
              properties:
                file:
                  type: string
        before:
          type: object
          properties:
            find:
              anyOf:
                - type: string
                - type: object
                  properties:
                    regex:
                      type: string
                    flags:
                      type: string
            insert:
              anyOf:
                - type: string
                - type: object
                  properties:
                    file:
                      type: string
        after:
          type: object
          properties:
            find:
              anyOf:
                - type: string
                - type: object
                  properties:
                    regex:
                      type: string
                    flags:
                      type: string
            insert:
              anyOf:
                - type: string
                - type: object
                  properties:
                    file:
                      type: string
        
        #plist task
        set:
          type: object
        strategy:
          type: string
          enum: [merge_concat, merge, assign]
          
        # app_delegate task
        imports:
          type: array
          items:
            type: string
        method:
          type: string
          enum: [didFinishLaunchingWithOptions, applicationDidBecomeActive, applicationWillResignActive, applicationDidEnterBackground, applicationWillEnterForeground, applicationWillTerminate, openURL, restorationHandler, didRegisterForRemoteNotificationsWithDeviceToken, didFailToRegisterForRemoteNotificationsWithError, didReceiveRemoteNotification, fetchCompletionHandler]
        comment:
          type: string
          
        # validate task
        file:
          anyOf:
            - type: string
            - type: object
              properties:
                regex:
                  type: string
                flags:
                  type: string
        find:
          anyOf:
            - type: string
            - type: object
              properties:
                regex:
                  type: string
                flags:
                  type: string
        errorMsg:
          type: string
        
`;
