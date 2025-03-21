import { IntegratorOptions } from './types/integrator.types';

let _opts: IntegratorOptions = {
  interactive: false,
  verbose: false,
  manual: false,
};
export const options = {
  get(): IntegratorOptions {
    return _opts;
  },
  set(opts: IntegratorOptions): void {
    _opts = opts;
  },
};
