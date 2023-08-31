// language=yaml
export const integrateYmlSchema = `type: object
required:
 - tasks
properties:
  tasks:
    type: array
    items:
      anyOf:
        #plist task
        - type: object
          required:
            - type
          properties:
            type:
              type: string
              enum: [plist]
            label:
              type: string
            set:
              type: object
            strategy:
              type: string
              enum: [merge_concat, merge, assign]

        #app_delegate task     
        - type: object
          required:
            - type
          properties:
            type:
              type: string
              enum: [app_delegate]
            label:
              type: string
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
                strict:
                  type: boolean
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
                strict:
                  type: boolean
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
        - type: object
          required:
            - type
          properties:
            type:
              type: string
              enum: [validate]
            label:
              type: string
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

        # build and app/build gradle task       
        - type: object
          required:
            - type
          properties:
            type:
              type: string
              enum: [build_gradle, app_build_gradle]
            label:
              type: string
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
                strict:
                  type: boolean
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
                strict:
                  type: boolean
            path:
              type: string
            comment:
              type: string

        # android manifest task
        - type: object
          required:
            - type
          properties:
            type:
              type: string
              enum: [android_manifest]
            label:
              type: string

        # add resource task
        - type: object
          required:
            - type
          properties:
            type:
              type: string
              enum: [add_resource]
            label:
              type: string
            file:
              type: string
            target:
              anyOf:
                - type: string
                  enum: [root, app]
                - type: object
                  properties:
                    name:
                      type: string
                    path:
                      type: string
`;
