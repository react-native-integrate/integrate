---
sidebar_position: 2
---
# Usage

![integrate.gif](../static/img/integrate.gif)

## Without Installation

Run the tool directly using `npx`:

```bash
npx react-native-integrate <package-name>
```

### Example:

```bash npm2yarn
# First install the package
npm install @react-native-firebase/app
```
```bash npm2yarn
# Integrate the package
npx react-native-integrate@latest @react-native-firebase/app
```

## With Global Installation

Install the tool globally for easier access:

```bash npm2yarn
npm install react-native-integrate@latest -g
```

Then use the `rni` command to integrate packages:

```bash
# To integrate multiple newly installed packages
rni

# To integrate a specific package
rni @react-native-firebase/app
```

## Benefits
- Simplifies the process of integrating third-party packages.
- Automates native code modifications, reducing manual effort.
- Provides a consistent way to handle integrations across projects.
