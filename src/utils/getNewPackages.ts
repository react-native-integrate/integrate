import { InstalledPackages } from '../types/integrator.types';
import { getInstalledPackages } from './getInstalledPackages';
import { readLockFile } from './updateIntegrationStatus';

export function getNewPackages(): InstalledPackages {
  const installedPackages = getInstalledPackages();
  const lockFile = readLockFile();

  return installedPackages.filter(
    ([packageName]) => !(packageName in lockFile.packages)
  );
}
