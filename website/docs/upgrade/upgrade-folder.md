---
sidebar_position: 1
---
# .upgrade folder

This is a special folder containing files and data required for upgrades. Integrations often require developer input such as configuration files, API keys, etc. We preserve these values in this folder to use later during upgrades, so they are not requested again from developer.

This folder and all of its sub-folders are optional.

## Structure

```
.upgrade/
├── backup/ 
│   └── files to be restored during upgrade
├── packages/
│   └── some-package/
│       ├── files/
│       │   └── imported files of some-package
│       └── upgrade.json
└── upgrade.yml
```

### 📁 backup

Files in this folder will be copied directly to the root with their respective paths.

For instance, a file located at `.upgrade/backup/android/app/some.file` will be copied to `android/app/some.file`.

### 📁 packages

This folder is managed by this tool, and you are not supposed to make any changes here.

### 📄 upgrade.yml

Additional native code changes can be defined here to be executed during upgrade. [Learn more](configuration)
