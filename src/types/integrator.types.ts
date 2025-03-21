export interface IntegratorOptions {
  verbose: boolean;
  interactive: boolean;
  manual: boolean;
}

export type PackageTuples = [string, string][];
export type AnalyzedPackages = {
  installedPackages: PackageTuples;
  newPackages: PackageTuples;
  updatedPackages: PackageTuples;
  deletedPackages: [string, LockProjectData][];
  integratedPackages: [string, LockProjectData][];
  justCreatedLockFile: boolean;
  forceIntegratePackageName: string | undefined;
};

export interface LockData {
  lockfileVersion: number;
  packages: { [projectName: string]: LockProjectData };
}

export interface LockDataWithMeta {
  lockData: LockData;
  justCreated: boolean;
}

export interface LockProjectData {
  version: string;
  integrated: boolean;
  deleted?: boolean;
}

export interface PackageUpgradeConfig {
  inputs?: Record<string, any>;
  files?: Record<string, string>;
}

export interface IntegrateConfig {
  plugins?: (string | [string, Record<string, any>])[];
}
