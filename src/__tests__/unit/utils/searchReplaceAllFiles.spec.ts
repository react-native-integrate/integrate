require('../../mocks/mockAll');
import { searchReplaceAllFiles } from '../../../utils/searchReplaceAllFiles';
import { mockFs } from '../../mocks/mockFs';

describe('searchReplaceAllFiles', () => {
  it('should replace all files correctly', async () => {
    mockFs.readdir.mockImplementation(
      (p, _opts, cb: (...args: any[]) => void) => {
        if (p === '/path/to')
          cb(null, [{ name: 'project', isDirectory: () => true }]);
        else cb(null, [{ name: 'file.js', isDirectory: () => false }]);
      }
    );
    mockFs.writeFileSync('/path/to/project/file.js', 'before, content, after');
    const changes = await searchReplaceAllFiles(
      '/path/to',
      'content',
      'test',
      false
    );

    mockFs.readdir.mockRestore();

    expect(mockFs.readFileSync('/path/to/project/file.js')).toBe(
      'before, test, after'
    );
    expect(changes).toBe(1);
  });
  it('should search with ignore case', async () => {
    mockFs.readdir.mockImplementation(
      (_p, _opts, cb: (...args: any[]) => void) => {
        cb(null, [{ name: 'file.js', isDirectory: () => false }]);
      }
    );
    mockFs.writeFileSync('/path/to/project/file.js', 'before, content, after');
    const changes = await searchReplaceAllFiles(
      '/path/to/project',
      'CONTENT',
      'test',
      true
    );

    mockFs.readdir.mockRestore();

    expect(mockFs.readFileSync('/path/to/project/file.js')).toBe(
      'before, test, after'
    );
    expect(changes).toBe(1);
  });
  it('should throw on read error', async () => {
    mockFs.readdir.mockImplementation(
      (_p, _opts, cb: (...args: any[]) => void) => {
        cb(new Error('some error'), null);
      }
    );

    await expect(
      searchReplaceAllFiles('/path/to/project', 'CONTENT', 'test', true)
    ).rejects.toThrow('some error');

    mockFs.readdir.mockRestore();
  });
});
