---
sidebar_position: 2
---

# Configure Integration

React Native Integrate now supports a configuration file system that allows you to pre-define options for packages to use while implementing their changes.

Most of the time you won't need this because options can be entered through prompts.

However, in some cases complex inputs are needed that can be defined here.

## Configuration File

Create an `integrate.config.js` file in your project root to configure React Native Integrate. The configuration file should export an object that matches the `IntegrateConfig` interface.

```javascript
// integrate.config.js
module.exports = {
  plugins: [
    // Plugin configurations
    ['plugin-with-config', {
      // Plugin specific configuration
      option1: 'value1',
      option2: 'value2'
    }]
  ]
};
```

## Configuration Options

### Plugins

The `plugins` array allows you to specify which plugins to use and their configurations:

```javascript
plugins: [
  ['my-plugin', {
    // Plugin specific configuration options
    config1: 'value1'
  }]
]
```

## Using Configuration in Your Project

The configuration file is automatically loaded when running react-native-integrate commands. The system will:

1. Look for `integrate.config.js` in your project root
2. Load and validate the configuration
3. Apply plugin configurations as needed

## Plugin Development

If you're developing an integration using complex options, you can access the configuration in two ways:

1. In JavaScript/TypeScript integration scripts:
```typescript
// Access configuration in your integration script
import { getConfig } from '@react-native-integrate/core';
const pluginConfig = getConfig();
```

2. In integration YAML files:
```yaml
# Access configuration in your integration.yml
steps:
  - when:
      config:
        someOption: true
    task: someTask
    # This step runs only when someOption is true in the config
```

## Error Handling

If there are issues with your configuration file:

1. Syntax errors will be reported with detailed error messages
2. Invalid configuration will trigger appropriate warnings
3. Missing configuration file is handled gracefully - the system will use default settings

## Best Practices

1. Keep your configuration file in the project root
2. Document plugin-specific configuration options
3. Version control your configuration file
4. Use TypeScript for better type checking in your configuration file
