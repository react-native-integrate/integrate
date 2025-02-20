import { mockFs } from './mockFs';

export const mockGlob = {
  globSync: (pattern: string): string[] => {
    if (!mockFs.permissions.read) throw new Error('[mock] permission denied');
    return Object.keys(mockFs.getStore()).filter(key =>
      new RegExp(pattern.replace(/\\/g, '/').replace(/\*\/?/g, '.*?')).test(
        key.replace(/\\/g, '/')
      )
    );
  },
  glob: (pattern: string) =>
    new Promise(resolve => resolve(mockGlob.globSync(pattern))),
};

jest.mock('glob', () => mockGlob);
