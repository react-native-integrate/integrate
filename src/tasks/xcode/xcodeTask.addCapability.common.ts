import { XcodeAddCommonCapabilityType } from '../../types/mod.types';
import { applyObjectModification } from '../../utils/applyObjectModification';
import { readPListContent, writePListContent } from '../plistTask';

export function addCommonCapability(args: {
  destination: string;
  targetName: string;
  filename: string;
  capability: XcodeAddCommonCapabilityType;
}): void {
  let plistContent = readPListContent(args.targetName, args.filename, true);

  const capabilityValues = commonCapabilityValues[args.capability];
  plistContent = applyObjectModification(plistContent, {
    set: capabilityValues,
    strategy: 'merge_distinct',
  });

  writePListContent(plistContent, args.targetName, args.filename);
}

const commonCapabilityValues: Record<
  XcodeAddCommonCapabilityType,
  Record<string, any>
> = {
  push: {
    'aps-environment': 'development',
  },
  'wireless-configuration': {
    'com.apple.external-accessory.wireless-configuration': true,
  },
  'app-attest': {
    'com.apple.developer.devicecheck.appattest-environment': 'development',
  },
  'data-protection': {
    'com.apple.developer.default-data-protection': 'NSFileProtectionComplete',
  },
  homekit: {
    'com.apple.developer.homekit': true,
  },
  healthkit: {
    'com.apple.developer.healthkit': true,
    'com.apple.developer.healthkit.access': [],
  },
  'inter-app-audio': {
    'inter-app-audio': true,
  },
  'increased-memory': {
    'com.apple.developer.kernel.increased-memory-limit': true,
  },
};
