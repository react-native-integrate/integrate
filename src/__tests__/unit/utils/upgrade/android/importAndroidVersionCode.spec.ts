require('../../../../mocks/mockAll');
import path from 'path';
import { ImportGetter } from '../../../../../types/upgrade.types';
import { getProjectPath } from '../../../../../utils/getProjectPath';
import { getAndroidVersionCode } from '../../../../../utils/upgrade/android/importAndroidVersionCode';
import { mockFs } from '../../../../mocks/mockFs';

describe('importAndroidVersionCode', () => {
  it('should get version code', async () => {
    mockFs.writeFileSync(
      '/oldProject/android/app/build.gradle',
      `
    ...
        versionCode 5
        versionName "5.5"
    ...`
    );
    mockFs.writeFileSync(
      path.join(getProjectPath(), 'android/app/build.gradle'),
      `
    ...
        versionCode 1
        versionName "1.0"
    ...`
    );
    const importGetter = getAndroidVersionCode('/oldProject') as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('5');

    await importGetter.setter();

    expect(
      mockFs.readFileSync(
        path.join(getProjectPath(), 'android/app/build.gradle')
      )
    ).toContain('versionCode 5');
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);

    const importGetter = getAndroidVersionCode('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding version code', () => {
    mockFs.writeFileSync('/oldProject/android/app/build.gradle', 'random');
    const importGetter = getAndroidVersionCode('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
});
