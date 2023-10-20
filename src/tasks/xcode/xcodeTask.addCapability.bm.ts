import { Constants } from '../../constants';
import { XcodeAddBMCapabilityModes } from '../../types/mod.types';
import { applyObjectModification } from '../../utils/applyObjectModification';
import { readPListContent, writePListContent } from '../plistTask';

export function addBMCapability(args: {
  targetName: string;
  modes: XcodeAddBMCapabilityModes[];
}): void {
  let plistContent = readPListContent(
    args.targetName,
    Constants.PLIST_FILE_NAME,
    true
  );

  const capabilityValues = {
    UIBackgroundModes: args.modes,
  };
  plistContent = applyObjectModification(plistContent, {
    set: capabilityValues,
    strategy: 'merge_distinct',
  });

  writePListContent(plistContent, args.targetName);
}
