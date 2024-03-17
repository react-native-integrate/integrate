// noinspection JSUnusedGlobalSymbols

import { Constants } from '../../constants';

let store: Record<string, string> = {};
const permissions = {
  read: true,
  write: true,
};

export const mockFs = {
  existsSync: (path: string): boolean =>
    Object.keys(store).some(key => key.startsWith(path)),
  readFileSync: (path: string): string => {
    if (!permissions.read) throw new Error('[mock] permission denied');
    if (!(path in store)) throw new Error('[mock] file not found');
    return store[path];
  },
  writeFileSync: (path: string, data: string): boolean => {
    if (!permissions.write) throw new Error('[mock] permission denied');
    store[path] = data;
    return true;
  },
  copyFileSync: (from: string, to: string): boolean => {
    const content = mockFs.readFileSync(from);
    mockFs.writeFileSync(to, content);
    return true;
  },
  copyFile: jest.fn((from: string, to: string, cb: CallableFunction) => {
    mockFs.copyFileSync(from, to);
    cb(true);
  }),
  mkdirSync: (): boolean => {
    return true;
  },
  mkdir: jest.fn((_path, _opts, cb: CallableFunction) => cb(true) as void),
  readdirSync: (): string[] => {
    return ['test' + Constants.XCODEPROJ_EXT];
  },
  readdir: jest.fn(),
  unlink: jest.fn((filePath: string, cb: CallableFunction) => {
    delete store[filePath];
    cb();
  }),
  lstatSync: jest.fn((p: string) => {
    if (Object.keys(store).includes(p)) {
      return {
        isFile: () => true,
        isDirectory: () => false,
      };
    } else if (Object.keys(store).some(key => key.startsWith(p))) {
      return {
        isFile: () => false,
        isDirectory: () => true,
      };
    } else {
      throw new Error('[mock] file not found');
    }
  }),
  watch: (
    _filePath: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    _opts: any,
    listener: (event: string, filename: string) => void
  ): any => {
    if (!permissions.read) throw new Error('[mock] permission denied');
    // simulate created
    setImmediate(() => listener('rename', 'file.json'));
    return {
      close: jest.fn(),
    };
  },
  reset(): void {
    store = {};
    permissions.read = true;
    permissions.write = true;
  },
  getStore(): Record<string, string> {
    return store;
  },
  setReadPermission(value: boolean): void {
    permissions.read = value;
  },
  setWritePermission(value: boolean): void {
    permissions.write = value;
  },
  get permissions() {
    return permissions;
  },
};

jest.mock('fs', () => mockFs);
