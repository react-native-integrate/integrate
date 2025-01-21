import { applyObjectModification } from '../../utils/applyObjectModification';
import { readPListContent, writePListContent } from '../plistTask';

export function addDomainsCapability(args: {
  destination: string;
  targetName: string;
  filename: string;
  domains: string[];
}): void {
  let plistContent = readPListContent(args.targetName, args.filename, true);

  const capabilityValues = {
    'com.apple.developer.associated-domains': args.domains,
  };
  plistContent = applyObjectModification(plistContent, {
    set: capabilityValues,
    strategy: 'merge_distinct',
  });

  writePListContent(plistContent, args.targetName, args.filename);
}
