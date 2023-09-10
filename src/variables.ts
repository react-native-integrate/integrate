import { getIosProjectName } from './utils/getIosProjectPath';

// Predefined variables
const predefinedVariables: Record<string, any> = {
  PLATFORM: process.platform,
  get IOS_PROJECT_NAME() {
    return getIosProjectName();
  },
  ...Object.entries(process.env).reduce((o, [name, value]) => {
    o[`ENV.${name}`] = value;
    return o;
  }, {} as Record<string, any>),
};

// User-defined variables
let _store: Record<string, any> = {};

export const variables = {
  get<T = any>(name: string): T {
    if (name in predefinedVariables) return predefinedVariables[name] as T;
    return _store[name] as T;
  },
  set<T>(name: string, value: T): void {
    _store[name] = value;
  },
  clear(): void {
    _store = {};
  },
};

export function getText(text: string): string {
  return text.replace(
    /(?:\\+)?\$\[([^\\[\]]+)]/g,
    (allMatch, match: string) => {
      let slashCount = 0;
      for (let i = 0; i < allMatch.length; i++) {
        if (allMatch[i] == '\\') slashCount++;
        else break;
      }
      const slashes = '\\'.repeat(Math.floor(slashCount / 2));
      const isEscaped = slashCount % 2 == 1;

      if (isEscaped) return slashes + `$[${match}]`;
      const value = variables.get<string>(match);
      if (value == null) {
        const descIndex = match.indexOf(':');
        if (descIndex == -1) return slashes + match;
        return slashes + match.substring(descIndex + 1);
      }

      return slashes + value;
    }
  );
}

export function transformTextInObject<T>(obj: T): T {
  // Base case: If the input is not an object, return it as is.
  if (obj == null) {
    return obj;
  }

  // If obj is an array, process its elements.
  if (Array.isArray(obj)) {
    // noinspection TypeScriptValidateTypes
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return obj.map(item => transformTextInObject(item));
  }

  // If obj is an object, process its properties.
  if (typeof obj === 'object') {
    const newObj = {} as T;
    for (const key in obj) {
      // Recursively process the property value.
      newObj[key] = transformTextInObject(obj[key]);
    }
    return newObj;
  }

  // If obj is a string, add a "+" sign to it.
  // noinspection SuspiciousTypeOfGuard
  if (typeof obj === 'string') {
    // noinspection TypeScriptValidateTypes
    // @ts-ignore
    return getText(obj);
  }

  // Return any other data types as is.
  return obj;
}
