import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { XcodeProjectType } from 'xcode';
import { Constants } from '../../constants';
import { logMessage, logMessageGray } from '../../prompter';
import { notificationContentFiles } from '../../scaffold/notification-content';
import { notificationServiceFiles } from '../../scaffold/notification-service';
import { XcodeAddTarget } from '../../types/mod.types';
import { getProjectPath } from '../../utils/getProjectPath';
import { runPrompt } from '../../utils/runPrompt';
import { getText, variables } from '../../variables';
import {
  normalizeBundleId,
  patchXcodeHasFile,
  patchXcodeProject,
  unquote,
} from './xcodeTask.helpers';

export async function applyAddTarget(
  content: XcodeProjectType,
  action: XcodeAddTarget,
  packageName: string
): Promise<XcodeProjectType> {
  const { type } = action;
  action.addTarget = getText(action.addTarget);

  await runPrompt(
    {
      name: action.name + '.target',
      text: action.message || 'Enter new target name:',
      type: 'text',
      defaultValue: action.addTarget,
      placeholder: action.addTarget,
    },
    packageName
  );
  let targetName = variables.get<string>(action.name + '.target');
  if (!targetName) targetName = action.addTarget;

  const mainGroup = content.getFirstProject().firstProject.mainGroup;

  const groupObj = content.getPBXGroupByKey(mainGroup);
  if (groupObj.children.some(x => unquote(x.comment) == targetName)) {
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
        if (bundleId) {
          bundleId = normalizeBundleId(bundleId, {
            productName: nativeTarget.target.name,
          });
          bundleId += '.' + targetName;
        }

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
    case 'notification-content':
      (() => {
        const files = notificationContentFiles;

        // Add a target for the extension
        let bundleId = content.getBuildProperty(
          'PRODUCT_BUNDLE_IDENTIFIER',
          'Release',
          nativeTarget.target.name
        );
        if (bundleId) {
          bundleId = normalizeBundleId(bundleId, {
            productName: nativeTarget.target.name,
          });
          bundleId += '.' + targetName;
        }
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

        // Add build phases to the new target
        content.addBuildPhase(
          [],
          'PBXSourcesBuildPhase',
          'Sources',
          target.uuid
        );
        content.addBuildPhase(
          [],
          'PBXFrameworksBuildPhase',
          'Frameworks',
          target.uuid
        );
        content.addBuildPhase(
          [],
          'PBXResourcesBuildPhase',
          'Resources',
          target.uuid
        );

        // Create new PBXGroup for the extension
        const extGroup = content.addPbxGroup([], targetName, targetName);
        const releaseHasFilesPatch = patchXcodeHasFile();
        try {
          Object.entries(files).forEach(([name, fileContent]) => {
            if (name.endsWith('.m') && typeof fileContent === 'string') {
              fs.writeFileSync(
                path.join(targetDir, name),
                fileContent,
                'utf-8'
              );
              content.addSourceFile(
                name,
                {
                  target: target.uuid,
                },
                extGroup.uuid
              );
            } else if (name.endsWith('.h') && typeof fileContent === 'string') {
              fs.writeFileSync(
                path.join(targetDir, name),
                fileContent,
                'utf-8'
              );
              content.addHeaderFile(
                name,
                {
                  target: target.uuid,
                },
                extGroup.uuid
              );
            } else if (name.endsWith('.lproj')) {
              if (!fs.existsSync(path.join(targetDir, name)))
                fs.mkdirSync(path.join(targetDir, name));
              Object.entries(fileContent).forEach(
                ([childName, childFileContent]) => {
                  if (childName.endsWith('.storyboard')) {
                    fs.writeFileSync(
                      path.join(targetDir, name, childName),
                      childFileContent,
                      'utf-8'
                    );
                    const group = content.addExtensionLocalizationVariantGroup(
                      childName,
                      target.uuid
                    );
                    content.addToPbxGroup(group, extGroup.uuid);
                    content.addExtensionResourceFile(
                      name + '/' + childName,
                      {
                        target: target.uuid,
                        lastKnownFileType: 'file.storyboard',
                        variantGroup: true,
                      },
                      group.fileRef
                    );
                  }
                }
              );
            } else {
              if (typeof fileContent === 'string') {
                fs.writeFileSync(
                  path.join(targetDir, name),
                  fileContent,
                  'utf-8'
                );
                content.addFile(name, extGroup.uuid, {
                  target: target.uuid,
                });
              }
            }
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

        content.addFramework('UserNotifications.framework', {
          target: target.uuid,
        });
        content.addFramework('UserNotificationsUI.framework', {
          target: target.uuid,
        });
      })();
      break;
  }
  logMessage(`added ${color.yellow(targetName)} extension to the project`);

  return content;
}
