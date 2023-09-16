// language=yaml
export const integrateYmlSchema = `type: object
required:
 - tasks
properties:
  env:
    type: object
  prompts:
    type: array
    items:
      type: object
      oneOf:
        # text prompt
        - required:
            - name
            - text
          additionalProperties: false
          properties:
            name:
              type: string
            text:
              type: string
            defaultValue:
              type: string
            initialValue:
              type: string
            placeholder:
              type: string
        
        # confirm prompt
        - required:
            - name
            - text
            - type
          properties:
            name:
              type: string
            text:
              type: string
            type:
              type: string
              enum: [boolean]
            initialValue:
              type: string
            positive:
              type: string
            negative:
              type: string
        
        # multiselect prompt
        - required:
            - name
            - text
            - type
          properties:
            name:
              type: string
            text:
              type: string
            type:
              type: string
              enum: [multiselect]
            required:
              type: boolean
            options:
              type: array
              items:
                type: object
                required:
                  - value
                properties:
                  label:
                    type: string
                  hint:
                    type: string
                  value:
                    oneOf:
                      - type: string
                      - type: boolean
                      - type: number
            initialValues:
              type: array
              items:
                oneOf:
                  - type: string
                  - type: boolean
                  - type: number
              
  tasks:
    type: array
    items:
      type: object
      required:
        - type
      properties:
        label:
          type: string
        prompts:
          type: array
          items:
            type: object
            oneOf:
              # text prompt
              - required:
                  - name
                  - text
                additionalProperties: false
                properties:
                  name:
                    type: string
                  text:
                    type: string
                  defaultValue:
                    type: string
                  initialValue:
                    type: string
                  placeholder:
                    type: string
      
              # confirm prompt
              - required:
                  - name
                  - text
                  - type
                properties:
                  name:
                    type: string
                  text:
                    type: string
                  type:
                    type: string
                    enum: [boolean]
                  initialValue:
                    type: string
                  positive:
                    type: string
                  negative:
                    type: string
      
              # multiselect prompt
              - required:
                  - name
                  - text
                  - type
                properties:
                  name:
                    type: string
                  text:
                    type: string
                  type:
                    type: string
                    enum: [multiselect]
                  required:
                    type: boolean
                  options:
                    type: array
                    items:
                      type: object
                      required:
                        - value
                      properties:
                        label:
                          type: string
                        hint:
                          type: string
                        value:
                          oneOf:
                            - type: string
                            - type: boolean
                            - type: number
                  initialValues:
                    type: array
                    items:
                      oneOf:
                        - type: string
                        - type: boolean
                        - type: number

      anyOf:
        # plist task
        - properties:
            type: 
              type: string
              enum: [plist]
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

        # app_delegate task
        - properties:
            type:
              type: string
              enum: [app_delegate]
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
                  replace:
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
                  search:
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
                  exact:
                    type: boolean

        # validate task
        - properties:
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
        - properties:
            type:
              type: string
              enum: [build_gradle]
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
                  replace:
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
                  search:
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
                  exact:
                    type: boolean

        # android manifest task
        - properties:
            type:
              type: string
              enum: [android_manifest]
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
                  replace:
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
                  search:
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
                  exact:
                    type: boolean

        # ios resource task
        - properties:
            type:
              type: string
              enum: [ios_resources]
            updates:
              type: array
              items:
                type: object
                properties:
                  add:
                    type: string
                  message:
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
        - properties:
            type:
              type: string
              enum: [podfile]
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
                  replace:
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
                  search:
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
                  exact:
                    type: boolean

        # fs task
        - properties:
            type:
              type: string
              enum: [fs]
            updates:
              type: array
              items:
                type: object
                required:
                  - destination
                properties:
                  destination:
                    type: string
                  message:
                    type: string
                oneOf:
                  - properties:
                      copyFile:
                        type: string
`;
