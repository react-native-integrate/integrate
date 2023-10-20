import { Constants } from '../../constants';
import { XcodeAddGCCapabilityControllers } from '../../types/mod.types';
import { applyObjectModification } from '../../utils/applyObjectModification';
import { readPListContent, writePListContent } from '../plistTask';

export function addGCCapability(args: {
  targetName: string;
  controllers: XcodeAddGCCapabilityControllers[];
}): void {
  let plistContent = readPListContent(
    args.targetName,
    Constants.PLIST_FILE_NAME,
    true
  );

  const capabilityValues = {
    GCSupportedGameControllers: args.controllers.map(
      x => mapsCapabilityRouting[x]
    ),
  };
  plistContent = applyObjectModification(plistContent, {
    set: capabilityValues,
    strategy: 'merge_distinct',
  });

  writePListContent(plistContent, args.targetName);
}

const mapsCapabilityRouting: Record<XcodeAddGCCapabilityControllers, string> = {
  extended: 'ExtendedGamepad',
  micro: 'MicroGamepad',
  directional: 'DirectionalGamepad',
};
