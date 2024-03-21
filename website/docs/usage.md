---
sidebar_position: 2
---
# Usage

You can use this CLI with or without installation.

### 1. Without installation

```bash
npx react-native-integrate <package-name>
```

#### Example
```bash npm2yarn
# First install the package
npm install @react-native-firebase/app

# Then integrate it
npx react-native-integrate@latest @react-native-firebase/app
```

### 2. With global installation

First, install this package as globally once.

```bash npm2yarn
npm install react-native-integrate -g
```

Then simply run the command to complete the integration:

```bash
# To integrate multiple newly installed packages
rni
# or to integrate a specific package
rni @react-native-firebase/app
```
