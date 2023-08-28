import { AnalyzedPackages } from '../types/integrator.types';
import { getInstalledPackages } from './getInstalledPackages';
import { readLockFile } from './updateIntegrationStatus';

export function analyzePackages(): AnalyzedPackages {
  const installedPackages = getInstalledPackages();
  const lockFile = readLockFile();

  const newPackages = installedPackages.filter(
    ([packageName]) => !(packageName in lockFile.packages)
  );
  const updatedPackages = installedPackages.filter(
    ([packageName, version]) =>
      packageName in lockFile.packages &&
      version !== lockFile.packages[packageName].version
  );
  const deletedPackages = Object.entries(lockFile.packages).filter(
    ([packageName]) =>
      installedPackages.every(
        ([installedPackageName]) => installedPackageName != packageName
      )
  );
  return {
    installedPackages,
    newPackages,
    updatedPackages,
    deletedPackages,
  };
}
