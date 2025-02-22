---
sidebar_position: 7
---
# Community Configurations


## Submitting Configurations

If your package requires native code changes, you can contribute a configuration to the community repository. This allows other developers to quickly integrate your package using this tool.

## How to Submit

1. Run the following command to get the required path for your package:

```bash
npx react-native-integrate info <package-name>
```

2. The command will display the path based on the md5 hash of the package name. For example:

```
...
remote configuration: not found
at https://github.com/react-native-integrate/configs/tree/main/packages/<hash-path>/<package-name>/integrate.yml
...
```

3. Submit your configuration to the repository at the generated path.

## Example

Let's submit a configuration for `some-package`:

```bash
npx react-native-integrate info some-package
```

This will generate a path like:

```
https://github.com/react-native-integrate/configs/tree/main/packages/6/1/a/some-package/integrate.yml
```
Submit your configuration to this path.
