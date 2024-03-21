import { AnyObject, ModTask } from './mod.types';

export type UpgradeConfig = {
  env?: AnyObject;
  tasks: ModTask[];
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
