require('../../../../mocks/mockAll');
import path from 'path';
import { Constants } from '../../../../../constants';
import { LockData } from '../../../../../types/integrator.types';
import { ImportGetter } from '../../../../../types/upgrade.types';
import { getProjectPath } from '../../../../../utils/getProjectPath';
import { importIntegrateLockJson } from '../../../../../utils/upgrade/other/importIntegrateLockJson';
import { mockFs } from '../../../../mocks/mockFs';

describe('importIntegrateLockJson', () => {
  it('should get integrate-lock.json', async () => {
    mockFs.writeFileSync(
      '/oldProject/' + Constants.LOCK_FILE_NAME,
      JSON.stringify(
        {
          lockfileVersion: 1,
          packages: {
            'mock-package': {
              integrated: true,
              version: '1.0.0',
            },
            'non-integrated-mock-package': {
              integrated: false,
              version: '1.0.0',
            },
          },
        } as LockData,
        null,
        2
      )
    );

    const importGetter = importIntegrateLockJson('/oldProject') as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('2 total, 1 integrated packages');

    await importGetter.setter();

    expect(
      mockFs.readFileSync(path.join(getProjectPath(), Constants.LOCK_FILE_NAME))
    ).toContain('non-integrated-mock-package');
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);
    mockFs.writeFileSync('/oldProject/' + Constants.LOCK_FILE_NAME, '');

    const importGetter = importIntegrateLockJson('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding integrate lock', () => {
    const importGetter = importIntegrateLockJson('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
});
