// language=yaml
export const mockIntegrateWithMinRNVersionYml = `
minRNVersion: 0.71
steps:
  - task: app_delegate
    label: 'App Delegate'
    actions:
      - block: didFinishLaunchingWithOptions
        prepend: "// with-min-rn"`;

// language=yaml
export const mockIntegrateWithInvalidMinRNVersionYml = `
minRNVersion: invalid
steps:
  - task: app_delegate
    label: 'App Delegate'
    actions:
      - block: didFinishLaunchingWithOptions
        prepend: "// with-min-rn"`;

// language=yaml
export const mockIntegrateWithMinVersionYml = `
minVersion: 0.1
steps:
  - task: app_delegate
    label: 'App Delegate'
    actions:
      - block: didFinishLaunchingWithOptions
        prepend: "// with-min"`;

// language=yaml
export const mockIntegrateWithInvalidMinVersionYml = `
minVersion: invalid
steps:
  - task: app_delegate
    label: 'App Delegate'
    actions:
      - block: didFinishLaunchingWithOptions
        prepend: "// with-min"`;
