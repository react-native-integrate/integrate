import xcode from 'xcode';
import { Constants } from '../constants';
import { normalizeBundleId } from '../tasks/xcode/xcodeTask.helpers';
import { getPbxProjectPath } from './getIosProjectPath';

export function getIosBundleId(): string {
  const pbxFilePath = getPbxProjectPath();
  const proj = xcode.project(pbxFilePath);
  proj.parseSync();
  const nativeTarget = proj.getTarget(Constants.XCODE_APPLICATION_TYPE);
  let bundleId = proj.getBuildProperty(
    'PRODUCT_BUNDLE_IDENTIFIER',
    'Release',
    nativeTarget.target.name
  );
  if (bundleId)
    bundleId = normalizeBundleId(bundleId, {
      productName: nativeTarget.target.name,
    });
  return bundleId;
}
