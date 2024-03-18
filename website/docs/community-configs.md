---
sidebar_position: 5
---
# Community Configurations

If this tool gets adopted by package developers, configurations will be shipped along with their packages.

Until then, we will be creating and maintaining all of the configurations in the [Integrate Configurations Repo](https://github.com/react-native-integrate/configs)

## Submission

This repo contains packages with a prefix that's generated from md5 hash of the package name. `info` command can be used to easily obtain this prefix before submission.

### Example

Lets submit configuration for some-package. We run the command.

```bash
npx react-native-integrate info some-package
```
which prints

```
...
remote configuration: not found
at https://github.com/react-native-integrate/configs/tree/main/packages/6/1/a/some-package/integrate.yml
...
```

From here we understand that this package should be submitted to the repo with path `packages/6/1/a/some-package/integrate.yml`.
