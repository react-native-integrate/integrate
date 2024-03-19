require('../../../../mocks/mockAll');
import path from 'path';
import { ImportGetter } from '../../../../../types/upgrade.types';
import { getProjectPath } from '../../../../../utils/getProjectPath';
import { importUpgradeFolder } from '../../../../../utils/upgrade/other/importUpgradeFolder';
import { mockFs } from '../../../../mocks/mockFs';

describe('importUpgradeFolder', () => {
  it('should get .upgrade', async () => {
    mockFs.writeFileSync('/oldProject/.upgrade/some.file', 'random');

    const importGetter = importUpgradeFolder('/oldProject') as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('1 files');

    await importGetter.setter();

    expect(
      mockFs.readFileSync(path.join(getProjectPath(), '.upgrade/some.file'))
    ).toContain('random');
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);
    mockFs.writeFileSync('/oldProject/.upgrade/some.file', 'random');

    const importGetter = importUpgradeFolder('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding .upgrade folder', () => {
    const importGetter = importUpgradeFolder('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle copy error', async () => {
    mockFs.writeFileSync('/oldProject/.upgrade/some.file', 'random');

    mockFs.copyFile.mockImplementationOnce(
      (from: string, to: string, cb: CallableFunction) => {
        cb(new Error('random'));
      }
    );
    const importGetter = importUpgradeFolder('/oldProject') as ImportGetter;
    await expect(importGetter.setter()).rejects.toThrow('random');
  });
});
