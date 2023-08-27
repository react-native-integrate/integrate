export interface IntegratorOptions {
  debug: boolean;
}

export type InstalledPackages = [string, string][];

export interface LockData {
  lockfileVersion: number;
  packages: { [projectName: string]: LockProjectData };
}

export interface LockProjectData {
  version: string;
  integrated: boolean;
}
