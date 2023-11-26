// language=yaml
export const mockIntegrateWithMinRNVersionYml = `
minRNVersion: 0.71
tasks:
  - type: app_delegate
    label: 'App Delegate'
    actions:
      - block: didFinishLaunchingWithOptions
        prepend: "// with-min-rn"`;

// language=yaml
export const mockIntegrateWithInvalidMinRNVersionYml = `
minRNVersion: invalid
tasks:
  - type: app_delegate
    label: 'App Delegate'
    actions:
      - block: didFinishLaunchingWithOptions
        prepend: "// with-min-rn"`;

// language=yaml
export const mockIntegrateWithMinVersionYml = `
minVersion: 0.1
tasks:
  - type: app_delegate
    label: 'App Delegate'
    actions:
      - block: didFinishLaunchingWithOptions
        prepend: "// with-min"`;

// language=yaml
export const mockIntegrateWithInvalidMinVersionYml = `
minVersion: invalid
tasks:
  - type: app_delegate
    label: 'App Delegate'
    actions:
      - block: didFinishLaunchingWithOptions
        prepend: "// with-min"`;
