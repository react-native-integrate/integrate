# React Native Integrate

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

**Automate Integration of Additional Code into React Native Projects**

## Introduction

This is a command-line tool designed to streamline the process of integrating additional code into React Native projects. It automates the integration steps that are often required when adding packages that involve modifications to iOS or Android projects.

You can focus more on coding and development, while the tool takes care of integrating the necessary code changes into your project. It is particularly helpful for reducing manual labor and potential errors when working with various React Native packages.

## Features

- Automatic integration of additional code into React Native iOS and Android projects.
- Simplifies the process of handling code changes required by various packages.
- Saves time and effort by automating integration tasks.
- Works seamlessly with your project's package management.

## Usage

There are two options to use this CLI, manual and automatic.

### 1. Manual
In manual usage you run the cli after each time you install a package.
```bash
npx react-native-integrate <package-name>
```

#### Example
```bash
# First install the package
npm install @react-native-firebase/app

# Then integrate it
npx react-native-integrate @react-native-firebase/app
```

### 2. Automatic
- Install this package as a dev dependency

```bash
npm install react-native-integrate --save-dev
# or
yarn add react-native-integrate --dev
```

- Add the "integrate" command as a post-install script in your project's package.json:

```json
"scripts": {
  "postinstall": "integrate"
}
```

After each package installation, the "integrate" command will automatically be triggered, and the necessary code changes will be integrated into your React Native project.

It gets your approval before each integration so no need to worry about messing up your code.

> **_NOTE:_**  If you are using npm, since 7.0.0 postinstall script does not run after `npm install <some-package>`
> 
> In this case you can run `integrate` manually after a package installation.
## For Package Developers

If your package requires "additional steps" after installation, follow these steps to allow other developers quickly integrate your package into their projects.

1. Create an `integrate.yml` file in the root directory of your project.
2. Add the necessary tasks for integrating your package into this file. You can use the example below as a starting point.
3. Encourage developers to run `npx react-native-integrate <your-package>` right after installation of your package.

#### Example
```yaml
tasks:
  - type: app_delegate
    label: "Updating AppDelegate.mm"
    updates:
      - prepend: "#import <YourPackage.h>"
      - block: didFinishLaunchingWithOptions
        prepend: "[YourPackage configure];"
  - type: build_gradle
    label: "Enabling multidex"
    location: "app",
    updates:
      - block: "android.defaultConfig"
        after: versionName
        prepend: multiDexEnabled true
```

#### Task types

Click on the links below to learn how to use each task type:

- [AppDelegate](docs/APP_DELEGATE.md)
- [Plist](docs/PLIST.md)
- [iOS Resources](docs/IOS_RESOURCES.md)
- [Build Gradle](docs/BUILD_GRADLE.md)
- [Android Manifest](docs/ANDROID_MANIFEST.md)
- [Podfile](docs/PODFILE.md)

#### Variables

Check [Variables](docs/VARIABLES.md) page to learn how to assign and use variables in configuration files.

### Get help from community

You can also open an issue and provide a link to a repository that features a clean React Native installation with your package integrated.

## Contributing

Contributions are welcome! If you find any issues, have suggestions feel free to submit a pull request or open an issue. For major changes, please discuss the proposed changes with us first.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[build-img]:https://github.com/murat-mehmet/react-native-integrate/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/murat-mehmet/react-native-integrate/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/react-native-integrate
[downloads-url]:https://www.npmtrends.com/react-native-integrate
[npm-img]:https://img.shields.io/npm/v/react-native-integrate
[npm-url]:https://www.npmjs.com/package/react-native-integrate
[issues-img]:https://img.shields.io/github/issues/murat-mehmet/react-native-integrate
[issues-url]:https://github.com/murat-mehmet/react-native-integrate/issues
[codecov-img]:https://codecov.io/gh/murat-mehmet/react-native-integrate/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/murat-mehmet/react-native-integrate
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
