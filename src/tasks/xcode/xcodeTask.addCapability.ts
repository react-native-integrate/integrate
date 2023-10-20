import color from 'picocolors';
import { XcodeProjectType } from 'xcode';
import { Constants } from '../../constants';
import { logMessage } from '../../prompter';
import { XcodeAddCapability } from '../../types/mod.types';
import { getText } from '../../variables';
import { addBMCapability } from './xcodeTask.addCapability.bm';
import { addCommonCapability } from './xcodeTask.addCapability.common';
import { addGCCapability } from './xcodeTask.addCapability.gc';
import { addGroupsCapability } from './xcodeTask.addCapability.groups';
import { addKSCapability } from './xcodeTask.addCapability.ks';
import { addMapsCapability } from './xcodeTask.addCapability.maps';
import { patchXcodeProject } from './xcodeTask.helpers';

export function applyAddCapability(
  content: XcodeProjectType,
  action: XcodeAddCapability
): XcodeProjectType {
  const { addCapability, target } = action;

  const nativeTarget = content.getTarget(Constants.XCODE_APPLICATION_TYPE);
  let group;
  let destination = 'ios';
  switch (target) {
    case 'app':
      group = content.findPBXGroupKey({
        name: nativeTarget.target.name,
      });
      destination += `/${nativeTarget.target.name}`;
      break;
    default:
      if (target.name != null) target.name = getText(target.name);
      if (target.path != null) target.path = getText(target.path);
      group = content.findPBXGroupKey(target);
      destination += `/${target.name}`;
      break;
  }
  const groupObj = content.getPBXGroupByKey(group);
  const filename = groupObj.name + '.entitlements';
  destination += `/${filename}`;
  const isAdded = groupObj.children.some(x => x.comment == filename);
  if (!isAdded) {
    const releasePatch = patchXcodeProject({
      push: (array, item) => array.unshift(item),
    });
    try {
      content.addFile(`${groupObj.name}/${filename}`, group, {
        target: nativeTarget.uuid,
        lastKnownFileType: 'text.plist.entitlements',
      });
    } finally {
      releasePatch();
    }
    content.updateBuildProperty(
      'CODE_SIGN_ENTITLEMENTS',
      `${groupObj.name}/${filename}`,
      null,
      groupObj.name
    );
    content.updateBuildProperty(
      'CODE_SIGN_ENTITLEMENTS',
      `${groupObj.name}/${filename}`,
      null,
      '"' + groupObj.name + '"'
    );
  }
  switch (addCapability) {
    case 'push':
    case 'wireless-configuration':
    case 'app-attest':
    case 'data-protection':
    case 'homekit':
    case 'healthkit':
    case 'inter-app-audio':
    case 'increased-memory':
      addCommonCapability({
        destination,
        filename,
        targetName: groupObj.name,
        capability: addCapability,
      });
      break;
    case 'groups':
      addGroupsCapability({
        destination,
        filename,
        targetName: groupObj.name,
        groups: action.groups,
      });
      break;
    case 'background-mode':
      addBMCapability({
        targetName: groupObj.name,
        modes: action.modes,
      });
      break;
    case 'game-controllers':
      addGCCapability({
        targetName: groupObj.name,
        controllers: action.controllers,
      });
      break;
    case 'maps':
      addMapsCapability({
        targetName: groupObj.name,
        routing: action.routing,
      });
      break;
    case 'keychain-sharing':
      addKSCapability({
        destination,
        filename,
        targetName: groupObj.name,
        groups: action.groups,
      });
      break;
  }

  logMessage(
    `added ${color.yellow(addCapability)} capability to the ${color.yellow(
      groupObj.name
    )} target`
  );

  return content;
}
