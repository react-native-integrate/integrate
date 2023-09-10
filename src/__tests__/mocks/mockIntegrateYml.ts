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
