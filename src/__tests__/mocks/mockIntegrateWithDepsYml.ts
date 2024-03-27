// language=yaml
export const mockIntegrateWithDepsYml = `
dependencies:
  - dep-package
  - dep-package-2
steps:
  - task: app_delegate
    label: 'App Delegate'
    actions:
      - block: didFinishLaunchingWithOptions
        prepend: "// with-deps"`;
