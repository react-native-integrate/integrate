export interface IntegratorOptions {
  debug: boolean;
}

export type PackageTuples = [string, string][];
export type AnalyzedPackages = {
  installedPackages: PackageTuples;
  newPackages: PackageTuples;
  updatedPackages: PackageTuples;
  deletedPackages: [string, LockProjectData][];
};

export interface LockData {
  lockfileVersion: number;
  packages: { [projectName: string]: LockProjectData };
}

export interface LockProjectData {
  version: string;
  integrated: boolean;
  deleted?: boolean;
}
