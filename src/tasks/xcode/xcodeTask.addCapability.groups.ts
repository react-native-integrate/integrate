import { applyObjectModification } from '../../utils/applyObjectModification';
import { readPListContent, writePListContent } from '../plistTask';

export function addGroupsCapability(args: {
  destination: string;
  targetName: string;
  filename: string;
  groups: string[];
}): void {
  let plistContent = readPListContent(args.targetName, args.filename, true);

  const capabilityValues = {
    'com.apple.security.application-groups': args.groups,
  };
  plistContent = applyObjectModification(plistContent, {
    set: capabilityValues,
    strategy: 'merge_distinct',
  });

  writePListContent(plistContent, args.targetName, args.filename);
}
