---
sidebar_position: 3
---
# Upgrade React Native

You can use this tool to assist you while upgrading your project to new React Native versions.

## Steps to follow

Before this tool steps in, developer is responsible to take some actions.

### 1. Create a new React Native project

Follow instructions on [the official RN page](https://reactnative.dev/docs/environment-setup#creating-a-new-application) to create a new project with the latest RN version.

### 2. Move JS/TS files and assets

Your JS/TS files are usually in `src` folder. Copy this folder along with `index.js` and any other asset folder you have.

:::info
In a future version we may try to do this using this tool. For now bear with us.
:::

### 3. Let the magic happen

Run the upgrade command.

```bash
npx react-native-integrate upgrade
# or, if you've installed it globally
rni upgrade
# or simpler...
rnu
```

## How it works?

It works by keeping track of every integration.

- Integrated packages are saved in `integrate-lock.json`.
- Prompt inputs are saved in `.upgrade` folder.
- Imported files are also saved in `.upgrade` folder.

When upgrading;
1. First, basic data like display name, bundle ids, icons, versions etc. is imported.
2. Old `package.json` is carefully merged with the new one, without overwriting any dependency.
3. `integrate-lock.json` and `.upgrade` folder is imported.
4. `.git` folder is imported.
5. All previously integrated packages are re-integrated by using input values from `.upgrade/packages`.

   :::tip
   If you don't want to keep track of user inputs, you can delete `.upgrade` or add it to .gitignore.

   `upgrade` command will ask inputs from you on the process if it cannot find in `.upgrade` folder.
   :::
6. If exists, files in `.upgrade/imports` will be copied to their respective paths.
7. If exists, [`.upgrade/upgrade.yml` configuration file](./upgrade/configuration) will be executed.
