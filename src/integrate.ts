import { getInstalledPackages } from './utils/getInstalledPackages';

export function integrate(): void {
  const installedPackage = getInstalledPackages();

  // get packages that need to be implemented
  console.log(installedPackage);
}
