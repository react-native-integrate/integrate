import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import xcode, { XcodeProjectType } from 'xcode';
import { Constants } from '../constants';
import { logMessage, logMessageGray, text } from '../prompter';
import { notificationServiceFiles } from '../scaffold/notification-service';
import {
  XcodeAddFileType,
  XcodeAddTargetType,
  XcodeModifierType,
  XcodeTaskType,
} from '../types/mod.types';
import { getErrMessage } from '../utils/getErrMessage';
import { getPbxProjectPath } from '../utils/getIosProjectPath';
import { getProjectPath } from '../utils/getProjectPath';
import { satisfies } from '../utils/satisfies';
import { setState } from '../utils/setState';
import { getText, variables } from '../variables';
import { applyFsModification } from './fsTask';

export async function xcodeTask(args: {
  configPath: string;
  packageName: string;
  content: XcodeProjectType;
  task: XcodeTaskType;
}): Promise<XcodeProjectType> {
  let { content } = args;
  const { task } = args;

  for (const action of task.actions) {
    if (action.when && !satisfies(variables.getStore(), action.when)) {
      setState(action.name, {
        state: 'skipped',
        reason: 'when',
        error: false,
      });
      continue;
    }

    setState(action.name, {
      state: 'progress',
      error: false,
    });
    try {
      content = await applyXcodeModification(content, action);
      setState(action.name, {
        state: 'done',
        error: false,
      });
    } catch (e) {
      setState(action.name, {
        state: 'error',
        reason: getErrMessage(e),
        error: true,
      });
      throw e;
    }
  }

  return content;
}

async function applyXcodeModification(
  content: XcodeProjectType,
  action: XcodeModifierType
) {
  if ('addFile' in action) return applyAddFile(content, action);
  if ('addTarget' in action) return applyAddTarget(content, action);
  return content;
}

async function applyAddFile(
  content: XcodeProjectType,
  action: XcodeAddFileType
) {
  let { target } = action;
  target = target || 'root';
  if (typeof target == 'string') target = getText(target) as 'root' | 'app';
  action.addFile = getText(action.addFile);

  const fileName = path.basename(action.addFile);
  const nativeTarget = content.getTarget(Constants.XCODE_APPLICATION_TYPE);
  let group;
  let logTarget;
  let destination = 'ios';
  switch (target) {
    case 'root':
      group = content.getFirstProject().firstProject.mainGroup;
      logTarget = 'project root';
      break;
    case 'app':
      group = content.findPBXGroupKey({
        name: nativeTarget.target.name,
      });
      logTarget = `${nativeTarget.target.name} target`;
      destination += `/${nativeTarget.target.name}`;
      break;
    default:
      if (target.name != null) target.name = getText(target.name);
      if (target.path != null) target.path = getText(target.path);
      group = content.findPBXGroupKey(target);
      logTarget = `${target.name} target`;
      destination += `/${target.name}`;
      break;
  }
  destination += `/${fileName}`;
  const groupObj = content.getPBXGroupByKey(group);
  if (groupObj.children.some(x => x.comment == action.addFile)) {
    logMessageGray(
      `skipped adding resource, ${color.yellow(
        action.addFile
      )} is already referenced in ${color.yellow(logTarget)}`
    );
    return content;
  }

  // copy file
  await applyFsModification({
    copyFile: fileName,
    destination,
    message: action.message,
  });

  const releasePatch = patchXcodeProject({
    push: (array, item) => array.unshift(item),
  });
  try {
    content.addResourceFile(fileName, { target: nativeTarget.uuid }, group);
  } finally {
    releasePatch();
  }
  logMessage(
    `added ${color.yellow(action.addFile)} reference in ${color.yellow(
      logTarget
    )}`
  );

  return content;
}

async function applyAddTarget(
  content: XcodeProjectType,
  action: XcodeAddTargetType
) {
  const { type } = action;
  action.addTarget = getText(action.addTarget);

  let targetName = await text(action.message || 'Enter new target name:', {
    defaultValue: action.addTarget,
    placeholder: action.addTarget,
  });
  if (!targetName) targetName = action.addTarget;

  const mainGroup = content.getFirstProject().firstProject.mainGroup;

  const groupObj = content.getPBXGroupByKey(mainGroup);
  if (groupObj.children.some(x => x.comment == targetName)) {
    logMessageGray(
      `skipped adding target, ${color.yellow(targetName)} is already exists`
    );
    return content;
  }
  const targetDir = path.join(getProjectPath(), 'ios', targetName);
  const nativeTarget = content.getTarget(Constants.XCODE_APPLICATION_TYPE);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);

  switch (type) {
    case 'notification-service':
      (() => {
        const files = notificationServiceFiles;

        const extFiles = Object.keys(files);

        // Add a target for the extension
        let bundleId = content.getBuildProperty(
          'PRODUCT_BUNDLE_IDENTIFIER',
          'Release',
          nativeTarget.target.name
        );
        if (bundleId) bundleId += '.' + targetName;
        const target = content.addExtensionTarget(
          targetName,
          'app_extension',
          '',
          {
            bundleId,
            team: content.getBuildProperty(
              'DEVELOPMENT_TEAM',
              'Release',
              nativeTarget.target.name
            ),
            codeSign: content.getBuildProperty(
              'CODE_SIGN_IDENTITY',
              'Release',
              nativeTarget.target.name
            ),
          }
        );

        // Create new PBXGroup for the extension
        const extGroup = content.addPbxGroup([], targetName, targetName);
        const releaseHasFilesPatch = patchXcodeHasFile();
        try {
          Object.entries(files).forEach(([name, fileContent]) => {
            fs.writeFileSync(path.join(targetDir, name), fileContent, 'utf-8');
            if (name.endsWith('.m'))
              content.addExtensionSourceFile(
                name,
                {
                  target: target.uuid,
                },
                extGroup.uuid
              );
            else if (name.endsWith('.h'))
              content.addHeaderFile(
                name,
                {
                  target: target.uuid,
                },
                extGroup.uuid
              );
            else
              content.addFile(name, extGroup.uuid, {
                target: target.uuid,
              });
          });
        } finally {
          releaseHasFilesPatch();
        }
        // Add the new PBXGroup to the main group. This makes the
        // files appear in the file explorer in Xcode.

        const releasePatch = patchXcodeProject({
          push: (array, item, arrayPushOriginal) => {
            const productsIndex = array.findIndex(x => x.comment == 'Products');
            if (productsIndex > -1) array.splice(productsIndex, 0, item);
            else arrayPushOriginal.call(array, item);
            return array.length;
          },
        });
        try {
          content.addToPbxGroup(extGroup.uuid, mainGroup);
        } finally {
          releasePatch();
        }

        // Add build phases to the new target
        content.addBuildPhase(
          extFiles.filter(x => x.endsWith('.m')),
          'PBXSourcesBuildPhase',
          'Sources',
          target.uuid
        );
        content.addBuildPhase(
          [],
          'PBXResourcesBuildPhase',
          'Resources',
          target.uuid
        );
        content.addBuildPhase(
          [],
          'PBXFrameworksBuildPhase',
          'Frameworks',
          target.uuid
        );
      })();
      break;
  }
  logMessage(`added ${color.yellow(targetName)} extension to the project`);

  return content;
}

function getPbxProjPath() {
  const pbxFilePath = getPbxProjectPath();
  if (!fs.existsSync(pbxFilePath)) {
    // noinspection SpellCheckingInspection
    throw new Error(`project.pbxproj file not found at ${pbxFilePath}`);
  }
  return pbxFilePath;
}

function readPbxProjContent() {
  const pbxFilePath = getPbxProjPath();
  const proj = xcode.project(pbxFilePath);
  proj.parseSync();
  return proj;
}

function writePbxProjContent(proj: XcodeProjectType): void {
  const appDelegatePath = getPbxProjPath();
  return fs.writeFileSync(appDelegatePath, proj.writeSync(), 'utf-8');
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: XcodeTaskType;
}): Promise<void> {
  let content = readPbxProjContent();

  content = await xcodeTask({
    ...args,
    content,
  });

  writePbxProjContent(content);
}

function patchXcodeProject(opts: {
  push: (
    array: any[],
    item: any,
    originalPush: (item: any) => number
  ) => number;
}) {
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
function patchXcodeHasFile() {
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
        INFOPLIST_FILE: `"${path.join(
          targetSubfolder,
          `${targetSubfolder}-Info.plist`
        )}"`,
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
        INFOPLIST_FILE: `"${path.join(
          targetSubfolder,
          `${targetSubfolder}-Info.plist`
        )}"`,
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
): any | boolean {
  const file = this.addFile(path, group, opt);

  file.target = opt.target;
  file.uuid = this.generateUuid();

  this.addToPbxBuildFileSection(file); // PBXBuildFile
  // this.addToPbxSourcesBuildPhase(file); // PBXSourcesBuildPhase

  return file;
};

function pbxBuildPhaseObj(file: any): any {
  const obj = Object.create(null);

  obj.value = file.uuid;
  obj.comment = longComment(file);

  return obj;
}

function longComment(file: any) {
  return `${file.basename} in ${file.group}`;
}

export const summary = 'Xcode project modification';
