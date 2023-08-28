import { getNewPackages } from './utils/getNewPackages';

export function integrate(): void {
  const packagesToIntegrate = getNewPackages();

  // get packages that need to be implemented
  console.log(packagesToIntegrate);
}
