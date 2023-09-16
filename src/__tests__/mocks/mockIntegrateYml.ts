// language=yaml
export const mockIntegrateYml = `
env:
  test: true
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
    prompts:
      - name: test4
        text: Test prompt
    label: 'App Delegate'
    updates:
      - prepend: "#import <Firebase.h>"
      - block: didFinishLaunchingWithOptions
        prepend: "[FIRApp configure];"
  - type: app_delegate
    updates:
      - prepend: "#import <Firebase.h>"
      - block: didFinishLaunchingWithOptions
        prepend: "[FIRApp configure];"`;
