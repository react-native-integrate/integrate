// language=yaml
export const mockIntegrateYml = `
env:
  test: true
preInfo: Config pre info
postInfo:
  title: test
  message: Config post info
prompts:
  - name: test2
    text: Test prompt
  - name: test3
    type: boolean
    text: Test prompt
  - name: testMulti
    type: multiselect
    text: Test prompt
    options:
      - value: opt1
      - value: opt2
tasks:
  - type: app_delegate
    name: app_delegate
    label: 'Will not run'
    when:
      test: false
  - type: app_delegate
    when:
      test: true
    prompts:
      - name: test4
        text: Test prompt
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
