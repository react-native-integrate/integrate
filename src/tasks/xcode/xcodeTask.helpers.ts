import path from 'path';
import xcode from 'xcode';
import pbxFile from 'xcode/lib/pbxFile';

const COMMENT_KEY = /_comment$/;
export function patchXcodeProject(opts: {
  push: (
    array: any[],
    item: any,
    originalPush: (item: any) => number
  ) => number;
}): () => void {
  // fixes a bug in pbxGroupByName
  const pbxGroupByNameOriginal = xcode.project.prototype.pbxGroupByName as (
    name: string
  ) => { path: string };
  xcode.project.prototype.pbxGroupByName = function (name: string) {
    const result = pbxGroupByNameOriginal.call(this, name);
    if (name == 'Resources' && result == null) return { path: null };
    return result;
  };
  // makes files to be added on top
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const arrayPushOriginal = Array.prototype.push;
  Array.prototype.push = function (item: any) {
    return opts.push(this, item, arrayPushOriginal);
  };
  return () => {
    xcode.project.prototype.pbxGroupByName = pbxGroupByNameOriginal;
    Array.prototype.push = arrayPushOriginal;
  };
}

export function patchXcodeHasFile(): () => void {
  // force add file
  const hasFileOriginal = xcode.project.prototype.hasFile;
  xcode.project.prototype.hasFile = function () {
    return false;
  };
  return () => {
    xcode.project.prototype.hasFile = hasFileOriginal;
  };
}

/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return*/

// noinspection JSUnusedGlobalSymbols
xcode.project.prototype.addExtensionTarget = function (
  name: string,
  type: string,
  subfolder: string,
  opts: { bundleId?: string; team?: string; codeSign?: string }
) {
  // Setup uuid and name of new target
  const targetUuid = this.generateUuid(),
    targetType = type,
    targetSubfolder = subfolder || name,
    targetName = name.trim(),
    targetBundleId = opts.bundleId,
    targetTeam = opts.team,
    targetCodeSign = opts.codeSign;

  // Build Configuration: Create
  let buildConfigurationsList: Record<string, any>[] = [
    {
      name: 'Debug',
      isa: 'XCBuildConfiguration',
      buildSettings: {
        CLANG_ANALYZER_NONNULL: 'YES',
        CLANG_ANALYZER_NUMBER_OBJECT_CONVERSION: 'YES_AGGRESSIVE',
        CLANG_CXX_LANGUAGE_STANDARD: '"gnu++20"',
        CLANG_ENABLE_OBJC_WEAK: 'YES',
        CLANG_WARN_DOCUMENTATION_COMMENTS: 'YES',
        CLANG_WARN_UNGUARDED_AVAILABILITY: 'YES_AGGRESSIVE',
        CODE_SIGN_STYLE: 'Automatic',
        CURRENT_PROJECT_VERSION: '1',
        DEBUG_INFORMATION_FORMAT: 'dwarf',
        GCC_C_LANGUAGE_STANDARD: 'gnu11',
        GENERATE_INFOPLIST_FILE: 'YES',
        INFOPLIST_FILE: `"${path.join(targetSubfolder, 'Info.plist')}"`,
        INFOPLIST_KEY_CFBundleDisplayName: `"${targetSubfolder}"`,
        INFOPLIST_KEY_NSHumanReadableCopyright: '""',
        IPHONEOS_DEPLOYMENT_TARGET: '16.4',
        LD_RUNPATH_SEARCH_PATHS: [
          '"$(inherited)"',
          '"@executable_path/Frameworks"',
          '"@executable_path/../../Frameworks"',
        ],
        MARKETING_VERSION: '1.0',
        MTL_ENABLE_DEBUG_INFO: 'INCLUDE_SOURCE',
        MTL_FAST_MATH: 'YES',
        PRODUCT_NAME: '"$(TARGET_NAME)"',
        SKIP_INSTALL: 'YES',
        SWIFT_EMIT_LOC_STRINGS: 'YES',
        TARGETED_DEVICE_FAMILY: '"1,2"',
      },
    },
    {
      name: 'Release',
      isa: 'XCBuildConfiguration',
      buildSettings: {
        CLANG_ANALYZER_NONNULL: 'YES',
        CLANG_ANALYZER_NUMBER_OBJECT_CONVERSION: 'YES_AGGRESSIVE',
        CLANG_CXX_LANGUAGE_STANDARD: '"gnu++20"',
        CLANG_ENABLE_OBJC_WEAK: 'YES',
        CLANG_WARN_DOCUMENTATION_COMMENTS: 'YES',
        CLANG_WARN_UNGUARDED_AVAILABILITY: 'YES_AGGRESSIVE',
        CODE_SIGN_STYLE: 'Automatic',
        COPY_PHASE_STRIP: 'NO',
        CURRENT_PROJECT_VERSION: '1',
        DEBUG_INFORMATION_FORMAT: '"dwarf-with-dsym"',
        GCC_C_LANGUAGE_STANDARD: 'gnu11',
        GENERATE_INFOPLIST_FILE: 'YES',
        INFOPLIST_FILE: `"${path.join(targetSubfolder, 'Info.plist')}"`,
        INFOPLIST_KEY_CFBundleDisplayName: `"${targetSubfolder}"`,
        INFOPLIST_KEY_NSHumanReadableCopyright: '""',
        IPHONEOS_DEPLOYMENT_TARGET: '16.4',
        LD_RUNPATH_SEARCH_PATHS: [
          '"$(inherited)"',
          '"@executable_path/Frameworks"',
          '"@executable_path/../../Frameworks"',
        ],
        MARKETING_VERSION: '1.0',
        MTL_FAST_MATH: 'YES',
        PRODUCT_NAME: '"$(TARGET_NAME)"',
        SKIP_INSTALL: 'YES',
        SWIFT_EMIT_LOC_STRINGS: 'YES',
        TARGETED_DEVICE_FAMILY: '"1,2"',
      },
    },
  ];

  // Add optional bundleId to build configuration
  buildConfigurationsList = buildConfigurationsList.map(elem => {
    if (targetBundleId) {
      elem.buildSettings.PRODUCT_BUNDLE_IDENTIFIER = '"' + targetBundleId + '"';
    }
    if (targetTeam) {
      elem.buildSettings.DEVELOPMENT_TEAM = '"' + targetTeam + '"';
    }
    if (targetCodeSign) {
      elem.buildSettings.CODE_SIGN_IDENTITY = '"' + targetCodeSign + '"';
    }
    return elem;
  });

  // Build Configuration: Add
  const buildConfigurations = this.addXCConfigurationList(
    buildConfigurationsList,
    'Release',
    'Build configuration list for PBXNativeTarget "' + targetName + '"'
  );

  // Product: Create
  const productName = targetName,
    productType = 'com.apple.product-type.app-extension',
    productFileType = '"wrapper.app-extension"',
    productFile = this.addProductFile(productName, {
      group: 'Embed Foundation Extensions',
      target: targetUuid,
      explicitFileType: productFileType,
    });
  productFile.settings = {
    ATTRIBUTES: ['RemoveHeadersOnCopy'],
  };
  // Product: Add to build file list
  this.addToPbxBuildFileSection(productFile);

  // Target: Create
  const target = {
    uuid: targetUuid,
    pbxNativeTarget: {
      isa: 'PBXNativeTarget',
      name: '"' + targetName + '"',
      productName: '"' + targetName + '"',
      productReference: productFile.fileRef,
      productType: `"${productType}"`,
      buildConfigurationList: buildConfigurations.uuid,
      buildPhases: [],
      buildRules: [],
      dependencies: [],
    },
  };

  // Target: Add to PBXNativeTarget section
  this.addToPbxNativeTargetSection(target);

  // Create CopyFiles phase in first target
  let sources = this.buildPhaseObject(
    'PBXCopyFilesBuildPhase',
    'Embed Foundation Extensions',
    productFile.target
  );
  if (!sources) {
    this.addBuildPhase(
      [],
      'PBXCopyFilesBuildPhase',
      'Embed Foundation Extensions',
      this.getFirstTarget().uuid,
      targetType
    );

    // Add product to Embed Foundation Extensions phase
    sources = this.buildPhaseObject(
      'PBXCopyFilesBuildPhase',
      'Embed Foundation Extensions',
      productFile.target
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  sources.files.push(pbxBuildPhaseObj(productFile));

  // Target: Add uuid to root project
  this.addToPbxProjectSection(target);

  // Target: Add dependency for this target to other targets
  this.addTargetDependency(this.getFirstTarget().uuid, [target.uuid]);

  // Return target on success
  return target;
};

// noinspection JSUnusedGlobalSymbols
xcode.project.prototype.addExtensionSourceFile = function (
  path: string,
  opt: { target: string },
  group: string
): any {
  const file = this.addFile(path, group, opt);

  file.target = opt.target;
  file.uuid = this.generateUuid();

  this.addToPbxBuildFileSection(file); // PBXBuildFile
  // this.addToPbxSourcesBuildPhase(file); // PBXSourcesBuildPhase

  return file;
};

// noinspection JSUnusedGlobalSymbols
xcode.project.prototype.addExtensionResourceFile = function (
  path: string,
  opt: { target: string; variantGroup: boolean },
  group: string
) {
  // noinspection JSPotentiallyInvalidConstructorUsage
  const file = new pbxFile(path, opt);

  file.uuid = this.generateUuid();
  file.target = opt.target;

  file.fileRef = this.generateUuid();

  this.addToPbxFileReferenceSection(file); // PBXFileReference
  if (this.getPBXVariantGroupByKey(group)) {
    this.addToPbxVariantGroup(file, group); // PBXVariantGroup
  }

  return file;
};

// noinspection JSUnusedGlobalSymbols
xcode.project.prototype.addExtensionLocalizationVariantGroup = function (
  name: string,
  target: any
) {
  const groupKey = this.pbxCreateVariantGroup(name);

  const resourceGroupKey = this.findPBXGroupKey({ name: 'Resources' });
  this.addToPbxGroup(groupKey, resourceGroupKey);

  const localizationVariantGroup = {
    uuid: this.generateUuid(),
    fileRef: groupKey,
    basename: name,
    group: 'Resources',
    target,
  };
  this.addToPbxBuildFileSection(localizationVariantGroup); // PBXBuildFile
  this.addToPbxResourcesBuildPhase(localizationVariantGroup); //PBXResourcesBuildPhase

  return localizationVariantGroup;
};

xcode.project.prototype.findPBXGroupKeyByAny = function (nameOrPath: string) {
  const groups = this.hash.project.objects['PBXGroup'];
  let target;

  for (const key in groups) {
    // only look for comments
    if (COMMENT_KEY.test(key)) continue;

    const group = groups[key];
    if (nameOrPath) {
      if (nameOrPath === group.path || nameOrPath === group.name) {
        target = key;
        break;
      }
    }
  }

  return target;
};

xcode.project.prototype.getBuildPropertyByTarget = function (
  prop: string,
  build: string,
  target: any
) {
  let value;
  const validConfigs = [];

  if (target) {
    const targetBuildConfigs = target.buildConfigurationList;

    const xcConfigList = this.pbxXCConfigurationList();

    // Collect the UUID's from the configuration of our target
    for (const configName in xcConfigList) {
      if (!COMMENT_KEY.test(configName) && targetBuildConfigs === configName) {
        const buildVariants = xcConfigList[configName].buildConfigurations;

        for (const item of buildVariants) {
          validConfigs.push(item.value);
        }

        break;
      }
    }
  }

  const configs = this.pbxXCBuildConfigurationSection();
  for (const configName in configs) {
    if (!COMMENT_KEY.test(configName)) {
      if (target && !validConfigs.includes(configName)) continue;
      const config = configs[configName];
      if ((build && config.name === build) || build === undefined) {
        if (config.buildSettings[prop] !== undefined) {
          value = config.buildSettings[prop];
        }
      }
    }
  }
  return value;
};

xcode.project.prototype.updateBuildPropertyByTarget = function (
  prop: string,
  value: string,
  build: string,
  target: any
) {
  const validConfigs = [];

  if (target) {
    const targetBuildConfigs = target.buildConfigurationList;

    const xcConfigList = this.pbxXCConfigurationList();

    // Collect the UUID's from the configuration of our target
    for (const configName in xcConfigList) {
      if (!COMMENT_KEY.test(configName) && targetBuildConfigs === configName) {
        const buildVariants = xcConfigList[configName].buildConfigurations;

        for (const item of buildVariants) {
          validConfigs.push(item.value);
        }

        break;
      }
    }
  }

  const configs = this.pbxXCBuildConfigurationSection();
  for (const configName in configs) {
    if (!COMMENT_KEY.test(configName)) {
      if (target && !validConfigs.includes(configName)) continue;

      const config = configs[configName];
      if ((build && config.name === build) || !build) {
        config.buildSettings[prop] = value;
      }
    }
  }
};

export function pbxBuildPhaseObj(file: {
  basename: string;
  group: string;
  uuid: string;
}): any {
  const obj = Object.create(null);

  obj.value = file.uuid;
  obj.comment = longComment(file);

  return obj;
}

export function longComment(file: { basename: string; group: string }): string {
  return `${file.basename} in ${file.group}`;
}

export function normalizeBundleId(
  bundleId: string,
  opts: { productName: string }
): string {
  return bundleId
    .replace(/"/g, '')
    .replace(/\$\(PRODUCT_NAME.*?\)/g, opts.productName);
}

export function unquote(str: string): string {
  return str?.replace(/^"(.*)"$/, '$1');
}
