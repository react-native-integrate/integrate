require('../../../mocks/mockAll');
import path from 'path';
import { getProjectPath } from '../../../../utils/getProjectPath';
import { restoreBackupFiles } from '../../../../utils/upgrade/restoreBackupFiles';
import { mockFs } from '../../../mocks/mockFs';

describe('restoreBackupFiles', () => {
  it('should restore backup files in .upgrade', async () => {
    mockFs.writeFileSync(
      path.join(getProjectPath(), '.upgrade/imports/test/some.file'),
      'random'
    );

    const didRestore = await restoreBackupFiles();

    expect(didRestore).toBeTruthy();
    expect(
      mockFs.readFileSync(path.join(getProjectPath(), 'test/some.file'))
    ).toEqual('random');
  });
  it('should handle not finding backup files', async () => {
    const didRestore = await restoreBackupFiles();

    expect(didRestore).toBeFalsy();
  });
  it('should handle copy error', async () => {
    mockFs.writeFileSync(
      path.join(getProjectPath(), '.upgrade/imports/test/some.file'),
      'random'
    );
    mockFs.copyFile.mockImplementationOnce(
      (from: string, to: string, cb: CallableFunction) => {
        cb(new Error('random'));
      }
    );
    await expect(restoreBackupFiles()).rejects.toThrow('random');
  });
});
