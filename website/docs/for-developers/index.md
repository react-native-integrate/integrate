---
sidebar_position: 4
---
# For Package Developers

## How to Create an Integration Configuration

If your package requires "additional steps" after installation which involves native code modification, follow these steps to allow other developers to quickly integrate your package into their projects.

### 1. Create an `integrate.yml` configuration file
Create an `integrate.yml` file in the root directory of your library. This file will define the necessary modifications for integrating your package.

### 2. Specify Modifications
Specify the necessary modifications in the `integrate.yml` file. Check the [Configuration](/docs/for-developers/configuration) page for detailed instructions.

### 3. Encourage Developers to Integrate
Encourage developers to run the following command right after installation of your package:

```bash
npx react-native-integrate <your-package>
```

## Get Help from the Community

You can also open an issue and provide a link to a repository that features a clean React Native installation with your package integrated. This will help the community to better understand how to integrate your package.

## Example Configuration

Here's an example of an `integrate.yml` file:

```yaml
minRNVersion: "0.72" # minimum RN version required to use your module
preInfo: "Please make sure you have your API keys ready."
steps:
  - task: app_delegate
    label: "Integrate Firebase"
    actions:
      - prepend: "#import <Firebase.h>"
      - block: "didFinishLaunchingWithOptions"
        prepend: "[FIrApp configure];"
postInfo:
  title: "Integration Completed"
  message: "The integration process has finished successfully."
```
