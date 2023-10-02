// language=yaml
export const mockIntegrateYml = `
env:
  test: true
preInfo: Config pre info
postInfo:
  title: test
  message: Config post info
tasks:
  - type: prompt
    actions:
      - name: test2
        text: Test prompt
        when:
          test: true
        validate:
          regex: .*
          message: test
      - name: test3
        type: boolean
        text: Test prompt
        when:
          test: false
      - name: test12
        type: boolean
        text: Test prompt
      - name: testMulti
        type: multiselect
        text: Test prompt
        options:
          - value: opt1
          - value: opt2
  - type: app_delegate
    name: app_delegate
    label: 'Will not run'
    when:
      test: false
  - type: app_delegate
    when:
      test: true
    label: 'App Delegate'
    actions:
      - prepend: "#import <Firebase.h>"
      - block: didFinishLaunchingWithOptions
        prepend: "[FIRApp configure];"
  - type: app_delegate
    preInfo: Task pre info
    postInfo: Task post info
    actions:
      - prepend: "#import <Firebase.h>"
      - block: didFinishLaunchingWithOptions
        prepend: "[FIRApp configure];"`;
