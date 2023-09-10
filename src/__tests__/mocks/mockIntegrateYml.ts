// language=yaml
export const mockIntegrateYml = `
env:
  test: true
tasks:
  - type: app_delegate
    updates:
      - prepend: "#import <Firebase.h>"
      - block: didFinishLaunchingWithOptions
        prepend: "[FIRApp configure];"`;
