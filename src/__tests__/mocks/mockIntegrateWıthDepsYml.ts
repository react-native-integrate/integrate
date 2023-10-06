// language=yaml
export const mockIntegrateWithDepsYml = `
dependencies:
  - dep-package
  - dep-package-2
tasks:
  - type: app_delegate
    label: 'App Delegate'
    actions:
      - block: didFinishLaunchingWithOptions
        prepend: "// with-deps"`;
