require('../../../../mocks/mockAll');
import path from 'path';
import { ImportGetter } from '../../../../../types/upgrade.types';
import { getProjectPath } from '../../../../../utils/getProjectPath';
import { importGitFolder } from '../../../../../utils/upgrade/other/importGitFolder';
import { mockFs } from '../../../../mocks/mockFs';

describe('importGitFolder', () => {
  it('should get .git', async () => {
    mockFs.writeFileSync('/oldProject/.git/some.file', 'random');

    const importGetter = importGitFolder('/oldProject') as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('1 files');

    await importGetter.apply();

    expect(
      mockFs.readFileSync(path.join(getProjectPath(), '.git/some.file'))
    ).toContain('random');
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);
    mockFs.writeFileSync('/oldProject/.git/some.file', 'random');

    const importGetter = importGitFolder('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding .git folder', () => {
    const importGetter = importGitFolder('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle copy error', async () => {
    mockFs.writeFileSync('/oldProject/.git/some.file', 'random');

    mockFs.copyFile.mockImplementationOnce(
      (from: string, to: string, cb: CallableFunction) => {
        cb(new Error('random'));
      }
    );
    const importGetter = importGitFolder('/oldProject') as ImportGetter;
    await expect(importGetter.apply()).rejects.toThrow('random');
  });
});
