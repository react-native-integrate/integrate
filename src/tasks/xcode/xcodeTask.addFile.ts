import path from 'path';
import color from 'picocolors';
import { XcodeProjectType } from 'xcode';
import { Constants } from '../../constants';
import { logMessage, logMessageGray } from '../../prompter';
import { XcodeAddFile } from '../../types/mod.types';
import { getText } from '../../variables';
import { applyFsModification } from '../fsTask';
import { patchXcodeProject } from './xcodeTask.helpers';

export async function applyAddFile(
  content: XcodeProjectType,
  action: XcodeAddFile
): Promise<XcodeProjectType> {
  let { target } = action;
  target = target || 'root';
  target = getText(target);
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
    case 'main':
      group = content.findPBXGroupKey({
        name: nativeTarget.target.name,
      });
      logTarget = `${nativeTarget.target.name} target`;
      destination += `/${nativeTarget.target.name}`;
      break;
    default:
      target = getText(target);
      group = content.findPBXGroupKeyByAny(target);
      logTarget = `${target} target`;
      destination += `/${target}`;
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
