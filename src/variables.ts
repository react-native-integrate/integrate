import { getIosBundleId } from './utils/getBundleId';
import { getIosDeploymentVersion } from './utils/getDeploymentVersion';
import { getIosProjectName } from './utils/getIosProjectPath';

// Predefined variables
const predefinedVariables: Record<string, any> = {
  PLATFORM: process.platform,
  get IOS_PROJECT_NAME() {
    try {
      return getIosProjectName();
    } catch (e) {
      return null;
    }
  },
  get IOS_BUNDLE_ID() {
    try {
      return getIosBundleId();
    } catch (e) {
      return null;
    }
  },
  get IOS_DEPLOYMENT_VERSION() {
    try {
      return getIosDeploymentVersion();
    } catch (e) {
      return null;
    }
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
  setPredefined<T>(name: string, value: T): void {
    predefinedVariables[name] = value;
  },
  clear(): void {
    _store = {};
  },
  getStore(): Record<string, any> {
    return Object.assign(
      Object.create(
        Object.getPrototypeOf(predefinedVariables),
        Object.getOwnPropertyDescriptors(predefinedVariables)
      ),
      _store
    ) as Record<string, any>;
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
  if (obj == null) {
    return obj;
  }

  // If obj is an array, process its elements.
  if (Array.isArray(obj)) {
    return <T>obj.map(item => transformTextInObject<T>(item));
  }

  // If obj is a string, add a "+" sign to it.
  if (typeof obj == 'string') {
    return <T>getText(obj);
  }

  // If obj is an object, process its properties.
  if (typeof obj == 'object') {
    const newObj = <T>{};
    for (const key in obj) {
      // Recursively process the property value.
      newObj[key] = transformTextInObject(obj[key]);
    }
    return newObj;
  }

  // Return any other data types as is.
  return obj;
}
