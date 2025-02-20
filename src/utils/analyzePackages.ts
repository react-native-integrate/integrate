import { AnalyzedPackages } from '../types/integrator.types';
import { getInstalledPackages } from './getInstalledPackages';
import { readLockFile } from './updateIntegrationStatus';

export function analyzePackages(
  forceIntegratePackageName?: string
): AnalyzedPackages {
  const installedPackages = getInstalledPackages();
  const { lockData, justCreated: justCreatedLockFile } = readLockFile();

  if (forceIntegratePackageName) {
    // delete from lock to get force integrated
    delete lockData.packages[forceIntegratePackageName];
  }
  const newPackages = installedPackages.filter(
    ([packageName]) => !(packageName in lockData.packages)
  );
  const updatedPackages = installedPackages.filter(
    ([packageName, version]) =>
      packageName in lockData.packages &&
      version !== lockData.packages[packageName].version
  );
  const deletedPackages = Object.entries(lockData.packages).filter(
    ([packageName]) =>
      installedPackages.every(
        ([installedPackageName]) => installedPackageName != packageName
      )
  );
  const integratedPackages = Object.entries(lockData.packages).filter(
    ([, packageLock]) => packageLock.integrated
  );
  return {
    installedPackages,
    newPackages,
    updatedPackages,
    deletedPackages,
    integratedPackages,
    justCreatedLockFile,
    forceIntegratePackageName,
  };
}
