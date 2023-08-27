import { IntegratorOptions } from './types/integrator.types';
import { getInstalledPackages } from './utils/getInstalledPackages';
import { readLockFile } from './utils/updateIntegrationStatus';

export function integrate(): void {
  const installedPackage = getInstalledPackages();
  const lockFile = readLockFile();

  // get packages that need to be implemented
  console.log(installedPackage);
}
