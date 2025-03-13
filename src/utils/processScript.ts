/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-implied-eval,no-shadow-restricted-names,@typescript-eslint/no-unsafe-call */
import type { variables } from '../variables';

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export function processScript(
  script: string,
  _variables: typeof variables,
  inline: boolean,
  async: true,
  ctx?: any
): Promise<any>;
export function processScript(
  script: string,
  _variables: typeof variables,
  inline: boolean,
  async: false,
  ctx?: any
): any;
export function processScript(
  script: string,
  _variables: typeof variables,
  inline: boolean,
  async: boolean,
  ctx?: any
): any {
  const functionSet = {
    get: function (variable: string): any {
      return _variables.get(variable);
    },
    set: function (variable: string, value: any): any {
      _variables.set(variable, value);
    },
    json: function (object: any): string {
      return JSON.stringify(object, null, 2);
    },
    parse: function (str: string): any {
      return JSON.parse(str);
    },
    require,
  };
  const scope = Object.assign(
    Object.keys(globalThis).reduce(
      (acc, k) => {
        acc[k] = undefined;
        return acc;
      },
      {} as Record<string, any>
    ),
    functionSet,
    ctx
  );

  for (const storeKey in _variables.getStore()) {
    Object.defineProperty(scope, storeKey, {
      get(): any {
        return _variables.get(storeKey);
      },
      set(value): any {
        return _variables.set(storeKey, value);
      },
    });
  }

  if (async) {
    if (inline) {
      return new AsyncFunction(
        'script',
        'with(this) { return eval(script) }'
      ).call(scope, script);
    } else {
      return new AsyncFunction('with(this) { ' + script + ' }').call(scope);
    }
  }

  if (inline) {
    return new Function('script', 'with(this) { return eval(script) }').call(
      scope,
      script
    );
  } else {
    return new Function('with(this) { ' + script + ' }').call(scope);
  }
}
