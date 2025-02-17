---
sidebar_position: 1
---

# Introduction

## What's this?

This is a command-line tool with two main points.
1. Integrate any third party React Native package which require native code changes.
2. Assist with upgrading to new React Native versions.

## Are you an Expo user?

Then these functionalities are already provided to you by Expo Continuous Native Generation (CNG). You do not need this tool.

## Why do you need it?

If you work with bare React Native projects then you already know that upgrading is a pain in React Native. For a developer who has tens of projects, keeping them up to date is a very time-consuming matter. We often create a new project with the latest RN version and move JS/TS files from the old to the new one.

Problem begins with native code changes. We have to visit every file (build.gradle, AndroidManifest.xml, AppDelegate etc) and pick the changes required by third party modules. Renaming the app, changing bundle ids, version numbers, launch icons and more are also part of this pain.

Now multiply all these steps by the count of your projects and multiply again by the count of major React Native releases per year (currently about 3).

To be able keep up the existing projects with the latest RN version, but to also integrate packages quickly to the new projects, this tool comes to help.

## What's the goal?

The ultimate objective of this project is to handle all native changes like Expo CNG, while retaining the complete power and freedom of a bare React Native workflow.
