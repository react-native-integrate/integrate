# react-native-integrate

[![npm package][npm-img]][npm-url]
[![GitHub package.json version][version-img]][version-url]
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

## Supported Modifications


### iOS

- [x] PList
- [x] AppDelegate.mm
- [ ] Resource additions
- [ ] Waiting and validating manual additions (like xcode extensions, capabilities)
- [ ] Extension content

### android
- [x] build.gradle
- [x] app/build.gradle
- [ ] AndroidManifest.xml

## Installation

To get started, install "react-native-integrate" into devDependencies using npm:

```bash
npm install react-native-integrate --save-dev
# or
yarn add react-native-integrate --dev
```

## Usage

Add the "integrate" command as a post-install script in your project's package.json:

```json
"scripts": {
  "postinstall": "integrate"
}
```

After each package installation, the "integrate" command will automatically be triggered, and the necessary code changes will be integrated into your React Native project.

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
[version-img]:https://img.shields.io/github/package-json/v/murat-mehmet/react-native-integrate
[version-url]:https://github.com/murat-mehmet/react-native-integrate
