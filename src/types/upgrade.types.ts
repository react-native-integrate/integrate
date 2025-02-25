import { AnyObject, ModStep } from './mod.types';

export type UpgradeConfig = {
  env?: AnyObject;
  pre_install?: {
    imports?: string[];
    steps?: ModStep[];
  };
  imports?: string[];
  steps?: ModStep[];
};

export type ImportGetter = {
  id: string;
  title: string;
  value: string;
  apply: () => Promise<any>;
};

export type RunUpgradeTaskResult =
  | {
      didRun: false;
    }
  | {
      failedTaskCount: number;
      completedTaskCount: number;
      didRun: true;
    };
