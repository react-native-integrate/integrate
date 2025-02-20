// noinspection JSUnusedGlobalSymbols

import { Constants } from '../../constants';
import { escapeRegExp } from '../../utils/escapeRegExp';
import nodePath from 'path';

let store: Record<string, string> = {};
const permissions = {
  read: true,
  write: true,
};

function isDirectoryMatch(path: string, directory: string): boolean {
  return new RegExp(
    escapeRegExp(directory) + `(?:${escapeRegExp(nodePath.sep)}|$)`,
    'i'
  ).test(path);
}

export const mockFs = {
  existsSync: (path: string): boolean => {
    path = nodePath.resolve(path);
    return Object.keys(store).some(key => isDirectoryMatch(key, path));
  },
  renameSync: (from: string, to: string) => {
    from = nodePath.resolve(from);
    to = nodePath.resolve(to);
    Object.entries(store)
      .filter(([key]) => isDirectoryMatch(key, from))
      .forEach(([key, value]) => {
        store[key.replace(from, to)] = value;
        delete store[key];
      });
  },
  readFileSync: (path: string): string => {
    path = nodePath.resolve(path);
    if (!permissions.read) throw new Error('[mock] permission denied');
    if (!(path in store)) throw new Error('[mock] file not found');
    return store[path];
  },
  writeFileSync: (path: string, data: string): boolean => {
    path = nodePath.resolve(path);
    if (!permissions.write) throw new Error('[mock] permission denied');
    store[path] = data;
    return true;
  },
  copyFileSync: (from: string, to: string): boolean => {
    from = nodePath.resolve(from);
    to = nodePath.resolve(to);
    const content = mockFs.readFileSync(from);
    mockFs.writeFileSync(to, content);
    return true;
  },
  copyFile: jest.fn((from: string, to: string, cb: (e?: Error) => void) => {
    from = nodePath.resolve(from);
    to = nodePath.resolve(to);
    mockFs.copyFileSync(from, to);
    cb();
  }),
  mkdirSync: (): boolean => {
    return true;
  },
  rmSync: (path: string) => {
    path = nodePath.resolve(path);
    Object.keys(store)
      .filter(key => isDirectoryMatch(key, path))
      .forEach(key => delete store[key]);
    return true;
  },
  rm: jest.fn((path: string, _opts, cb: (e?: Error) => void) => {
    mockFs.rmSync(path);
    cb();
  }),
  mkdir: jest.fn((_path, _opts, cb: (e?: Error) => void) => cb()),
  readdirSync: (): string[] => {
    return ['test' + Constants.XCODEPROJ_EXT];
  },
  readdir: jest.fn(),
  unlink: jest.fn((filePath: string, cb: (e?: Error) => void) => {
    filePath = nodePath.resolve(filePath);
    delete store[filePath];
    cb();
  }),
  lstatSync: jest.fn((p: string) => {
    p = nodePath.resolve(p);
    if (Object.keys(store).includes(p)) {
      return {
        isFile: () => true,
        isDirectory: () => false,
      };
    } else if (Object.keys(store).some(key => isDirectoryMatch(key, p))) {
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
