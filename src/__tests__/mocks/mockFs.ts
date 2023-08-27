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
  reset(): void {
    store = {};
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
