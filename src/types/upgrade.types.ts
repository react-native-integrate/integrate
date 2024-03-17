import { AnyObject, ModTask } from './mod.types';

export type UpgradeConfig = {
  env?: AnyObject;
  tasks: ModTask[];
};

export type ImportGetter = {
  id: string;
  title: string;
  value: string;
  setter: () => Promise<any>;
};
