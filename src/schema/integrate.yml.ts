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
            updates:
              type: array
              items:
                type: object
                properties:
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
            updates:
              type: array
              items:
                type: object
                properties:
                  block:
                    type: string
                    enum: [didFinishLaunchingWithOptions, applicationDidBecomeActive, applicationWillResignActive, applicationDidEnterBackground, applicationWillEnterForeground, applicationWillTerminate, openURL, restorationHandler, didRegisterForRemoteNotificationsWithDeviceToken, didFailToRegisterForRemoteNotificationsWithError, didReceiveRemoteNotification, fetchCompletionHandler]
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
                    anyOf:
                      - type: string
                      - type: object
                        properties:
                          regex:
                            type: string
                          flags:
                            type: string
                  after:
                    anyOf:
                      - type: string
                      - type: object
                        properties:
                          regex:
                            type: string
                          flags:
                            type: string
                  strict:
                    type: boolean
                  ifNotPresent:
                    type: string
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

        # build gradle task  
        - type: object
          required:
            - type
          properties:
            type:
              type: string
              enum: [build_gradle]
            label:
              type: string
            location:
              type: string
              enum: [root, app]
            updates:
              type: array
              items:
                type: object
                properties:
                  block:
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
                    anyOf:
                      - type: string
                      - type: object
                        properties:
                          regex:
                            type: string
                          flags:
                            type: string
                  after:
                    anyOf:
                      - type: string
                      - type: object
                        properties:
                          regex:
                            type: string
                          flags:
                            type: string
                  strict:
                    type: boolean
                  ifNotPresent:
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
            updates:
              type: array
              items:
                type: object
                properties:
                  block:
                    type: string
                    enum: [manifest, application, activity]
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
                    anyOf:
                      - type: string
                      - type: object
                        properties:
                          regex:
                            type: string
                          flags:
                            type: string
                  after:
                    anyOf:
                      - type: string
                      - type: object
                        properties:
                          regex:
                            type: string
                          flags:
                            type: string
                  strict:
                    type: boolean
                  ifNotPresent:
                    type: string
                  comment:
                    type: string

        # add resource task
        - type: object
          required:
            - type
          properties:
            type:
              type: string
              enum: [ios_resources]
            label:
              type: string
            updates:
              type: array
              items:
                type: object
                properties:
                  add:
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

        # podfile task  
        - type: object
          required:
            - type
          properties:
            type:
              type: string
              enum: [podfile]
            label:
              type: string
            updates:
              type: array
              items:
                type: object
                properties:
                  block:
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
                    anyOf:
                      - type: string
                      - type: object
                        properties:
                          regex:
                            type: string
                          flags:
                            type: string
                  after:
                    anyOf:
                      - type: string
                      - type: object
                        properties:
                          regex:
                            type: string
                          flags:
                            type: string
                  strict:
                    type: boolean
                  ifNotPresent:
                    type: string
                  comment:
                    type: string
`;
