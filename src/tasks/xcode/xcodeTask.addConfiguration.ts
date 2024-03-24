import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { XcodeProjectType } from 'xcode';
import { Constants } from '../../constants';
import { logMessage, logMessageGray, summarize } from '../../prompter';
import { XcodeAddConfiguration } from '../../types/mod.types';
import { getModContent } from '../../utils/getModContent';
import { getProjectPath } from '../../utils/getProjectPath';
import { patchXcodeProject, unquote } from './xcodeTask.helpers';

export async function applyAddConfiguration(
  content: XcodeProjectType,
  action: XcodeAddConfiguration,
  configPath: string,
  packageName: string
): Promise<XcodeProjectType> {
  const nativeTarget = content.getTarget(Constants.XCODE_APPLICATION_TYPE);
  const group = content.getFirstProject().firstProject.mainGroup;
  const logTarget = 'project root';
  const buildConfigurationLists = content.pbxXCConfigurationList();
  const buildConfigurationList =
    buildConfigurationLists[
      content.getFirstProject().firstProject.buildConfigurationList
    ];
  const buildConfigurationSection = content.pbxXCBuildConfigurationSection();
  const processedFiles: string[] = [];
  let createdFile = null;
  const projectPath = getProjectPath();
  let configurationContent = await getModContent(
    configPath,
    packageName,
    action.addConfiguration
  );
  if (!configurationContent.endsWith('\n')) configurationContent += '\n';

  for (const buildConfiguration of buildConfigurationList.buildConfigurations) {
    const id = buildConfiguration.value;
    const buildConfig = buildConfigurationSection[id];
    if (buildConfig.baseConfigurationReference) {
      // config exists

      const fileRefSection = content.pbxFileReferenceSection();
      const fileRef = fileRefSection[buildConfig.baseConfigurationReference];
      const filePath = path.join(
        projectPath,
        'ios',
        unquote(fileRef.path as string)
      );
      if (!processedFiles.includes(filePath)) {
        processedFiles.push(filePath);

        let fileContent = fs.readFileSync(filePath, 'utf-8');

        if (fileContent.includes(configurationContent)) {
          logMessageGray(
            `code already exists, skipped appending configuration: ${summarize(
              configurationContent
            )}`
          );
        } else {
          if (fileContent && !fileContent.endsWith('\n')) fileContent += '\n';
          fileContent += configurationContent;
          fs.writeFileSync(filePath, fileContent);

          logMessage(
            `added ${summarize(
              configurationContent
            )} configuration in ${color.yellow(fileRef.path as string)}`
          );
        }
      }
    } else {
      // config does not exist

      if (!createdFile) {
        const fileName = Constants.XCConfig_FILE_NAME;
        const filePath = path.join(projectPath, 'ios', fileName);

        fs.writeFileSync(filePath, configurationContent);
        processedFiles.push(filePath);

        const groupObj = content.getPBXGroupByKey(group);
        const fileRefExists = groupObj.children.find(
          x => unquote(x.comment) == fileName
        );
        if (fileRefExists) {
          logMessageGray(
            `skipped adding resource, ${color.yellow(
              fileName
            )} is already referenced in ${color.yellow(logTarget)}`
          );
          createdFile = {
            fileRef: fileRefExists.value,
            basename: fileRefExists.comment,
          };
        } else {
          const releasePatch = patchXcodeProject({
            push: (array, item) => array.unshift(item),
          });
          try {
            createdFile = content.addResourceFile(
              fileName,
              { target: nativeTarget.uuid },
              group
            );
          } finally {
            releasePatch();
          }

          logMessage(
            `added ${summarize(
              configurationContent
            )} configuration in ${color.yellow(fileName)}`
          );
        }
      }
      buildConfig.baseConfigurationReference = createdFile.fileRef;
      buildConfig.baseConfigurationReference_comment = createdFile.basename;

      logMessage(
        `set ${color.yellow(
          createdFile.basename as string
        )} as base configuration for ${color.yellow(
          buildConfiguration.comment as string
        )} build`
      );
    }
  }
  return content;
  //
  // destination += `/${fileName}`;
  // const groupObj = content.getPBXGroupByKey(group);
  // if (groupObj.children.some(x => x.comment == action.addConfiguration)) {
  //   logMessageGray(
  //     `skipped adding resource, ${color.yellow(
  //       action.addConfiguration
  //     )} is already referenced in ${color.yellow(logTarget)}`
  //   );
  //   return content;
  // }
  //
  // destination = path.join(projectPath, destination);
  // const configurationContent = await getModContent(configPath, packageName, action.addConfiguration)
  // fs.writeFileSync(destination, configurationContent);
  //
  // const releasePatch = patchXcodeProject({
  //   push: (array, item) => array.unshift(item),
  // });
  // try {
  //   content.addResourceFile(fileName, { target: nativeTarget.uuid }, group);
  // } finally {
  //   releasePatch();
  // }
  // logMessage(
  //   `added ${color.yellow(action.addConfiguration)} reference in ${color.yellow(
  //     logTarget
  //   )}`
  // );
  //
  // return content;
}
