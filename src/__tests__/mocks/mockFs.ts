import { Constants } from '../../constants';

let store: Record<string, string> = {};
const permissions = {
  read: true,
  write: true,
};

export const mockFs = {
  existsSync: (path: string): boolean => path in store,
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
  mkdirSync: (): boolean => {
    return true;
  },
  readdirSync: (): string[] => {
    return ['test' + Constants.XCODEPROJ_EXT];
  },
  watch: (
    filePath: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    opts: any,
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
};

jest.mock('fs', () => mockFs);
