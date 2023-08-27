import { IntegratorOptions } from './types/integrator.types';

let _opts: IntegratorOptions;
export const options = {
  get(): IntegratorOptions {
    return _opts;
  },
  set(opts: IntegratorOptions): void {
    _opts = opts;
  },
};
