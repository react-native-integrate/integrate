---
sidebar_position: 3
---
# For Package Developers

If your package requires "additional steps" after installation which involves native code modification, follow these steps to allow other developers quickly integrate your package into their projects.

1. Create an `integrate.yml` configuration file in the root directory of your project.
2. Specify necessary modifications. On the next page, check [Configuration](configuration) for detailed instructions.
3. Encourage developers to run `npx react-native-integrate <your-package>` right after installation of your package.

## Get help from community

You can also open an issue and provide a link to a repository that features a clean React Native installation with your package integrated.
