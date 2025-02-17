import path from 'path';
import color from 'picocolors';
import { XcodeProjectType } from 'xcode';
import { Constants } from '../../constants';
import { logMessage } from '../../prompter';
import { XcodeAddCapability } from '../../types/mod.types';
import { getText } from '../../variables';
import { addDomainsCapability } from './xcodeTask.addCapability.ad';
import { addBMCapability } from './xcodeTask.addCapability.bm';
import { addCommonCapability } from './xcodeTask.addCapability.common';
import { addGCCapability } from './xcodeTask.addCapability.gc';
import { addGroupsCapability } from './xcodeTask.addCapability.groups';
import { addKSCapability } from './xcodeTask.addCapability.ks';
import { addMapsCapability } from './xcodeTask.addCapability.maps';
import { patchXcodeProject, unquote } from './xcodeTask.helpers';

export function applyAddCapability(
  content: XcodeProjectType,
  action: XcodeAddCapability
): XcodeProjectType {
  const { addCapability } = action;
  let { target } = action;
  target = getText(target);

  const nativeTarget = content.getTarget(Constants.XCODE_APPLICATION_TYPE);
  let group;
  let destination = 'ios';
  switch (target) {
    case 'main':
      group = content.findPBXGroupKey({
        name: nativeTarget.target.name,
      });
      destination += `/${nativeTarget.target.name}`;
      break;
    default:
      group = content.findPBXGroupKeyByAny(target);
      destination += `/${target}`;
      break;
  }
  const groupObj = content.getPBXGroupByKey(group);
  const groupName = groupObj.name || path.basename(groupObj.path);
  const filename = groupName + '.entitlements';
  destination += `/${filename}`;
  const isAdded = groupObj.children.some(x => unquote(x.comment) == filename);
  if (!isAdded) {
    const releasePatch = patchXcodeProject({
      push: (array, item) => array.unshift(item),
    });
    try {
      content.addFile(`${filename}`, group, {
        target: nativeTarget.uuid,
        lastKnownFileType: 'text.plist.entitlements',
      });
    } finally {
      releasePatch();
    }
    content.updateBuildProperty(
      'CODE_SIGN_ENTITLEMENTS',
      `${groupName}/${filename}`,
      null,
      groupName
    );
    content.updateBuildProperty(
      'CODE_SIGN_ENTITLEMENTS',
      `${groupName}/${filename}`,
      null,
      '"' + groupName + '"'
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
        targetName: groupName,
        capability: addCapability,
      });
      break;
    case 'groups':
      addGroupsCapability({
        destination,
        filename,
        targetName: groupName,
        groups: action.groups,
      });
      break;
    case 'domains':
      addDomainsCapability({
        destination,
        filename,
        targetName: groupName,
        domains: action.domains,
      });
      break;
    case 'background-mode':
      addBMCapability({
        targetName: groupName,
        modes: action.modes,
      });
      break;
    case 'game-controllers':
      addGCCapability({
        targetName: groupName,
        controllers: action.controllers,
      });
      break;
    case 'maps':
      addMapsCapability({
        targetName: groupName,
        routing: action.routing,
      });
      break;
    case 'keychain-sharing':
      addKSCapability({
        destination,
        filename,
        targetName: groupName,
        groups: action.groups,
      });
      break;
  }

  logMessage(
    `added ${color.yellow(addCapability)} capability to the ${color.yellow(
      groupName
    )} target`
  );

  return content;
}
