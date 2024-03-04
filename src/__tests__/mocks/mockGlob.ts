import { mockFs } from './mockFs';

export const mockGlob = {
  globSync: (pattern: string): string[] =>
    Object.keys(mockFs.getStore()).filter(key =>
      new RegExp(pattern.replace(/\*\*/g, '.*?')).test(key)
    ),
};

jest.mock('glob', () => mockGlob);
