---
sidebar_position: 3
---
# Info

To check the availability of integration for a specific package and view related information, you can use the following command:

```bash
npx react-native-integrate info <package-name>

# or, with global installation
rni info <package-name>
```

## Example:
```bash
npx react-native-integrate info @react-native-firebase/app
```

## What Does It Do?
This command allows you to verify the integration status, including the availability of local or remote configuration files. It provides details on how to proceed with the integration.

## Use Cases

- **Check Integration Availability**: Verify if a package has a supported integration configuration.
- **Get Remote Config Path**: Use this command to get the remote path before submitting a configuration to the [public config repo](https://github.com/react-native-integrate/configs).
- **Troubleshoot Integration**: If an integration fails, use this command to check if the configuration is available or if there are any errors.

