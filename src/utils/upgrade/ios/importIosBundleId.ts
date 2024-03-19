import fs from 'fs';
import color from 'picocolors';
import xcode from 'xcode';
import { Constants } from '../../../constants';
import { logMessage } from '../../../prompter';
import { normalizeBundleId } from '../../../tasks/xcode/xcodeTask.helpers';
import { ImportGetter } from '../../../types/upgrade.types';
import { getPbxProjectPath } from '../../getIosProjectPath';

export function importIosBundleId(projectPath: string): ImportGetter | null {
  try {
    const pbxFilePath = getPbxProjectPath(projectPath);
    const proj = xcode.project(pbxFilePath);
    proj.parseSync();
    const nativeTarget = proj.getTarget(Constants.XCODE_APPLICATION_TYPE);
    let bundleId = proj.getBuildProperty(
      'PRODUCT_BUNDLE_IDENTIFIER',
      'Release',
      nativeTarget.target.name
    );
    if (!bundleId) return null;

    bundleId = normalizeBundleId(bundleId, {
      productName: nativeTarget.target.name,
    });

    return {
      id: 'iosBundleId',
      title: 'Ios Bundle Id',
      value: bundleId,
      apply: () => setIosBundleId(bundleId),
    };
  } catch (e) {
    return null;
  }
}

async function setIosBundleId(newBundleId: string) {
  const pbxFilePath = getPbxProjectPath();
  const proj = xcode.project(pbxFilePath);
  proj.parseSync();
  const nativeTarget = proj.getTarget(Constants.XCODE_APPLICATION_TYPE);
  proj.updateBuildPropertyByTarget(
    'PRODUCT_BUNDLE_IDENTIFIER',
    newBundleId,
    'Debug',
    nativeTarget.target
  );
  proj.updateBuildPropertyByTarget(
    'PRODUCT_BUNDLE_IDENTIFIER',
    newBundleId,
    'Release',
    nativeTarget.target
  );

  fs.writeFileSync(pbxFilePath, proj.writeSync(), 'utf-8');
  logMessage(
    `set ${color.yellow('PRODUCT_BUNDLE_IDENTIFIER')} to ${color.yellow(newBundleId)}`
  );
  return Promise.resolve();
}
