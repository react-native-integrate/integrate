require('../../../../mocks/mockAll');
import path from 'path';
import { ImportGetter } from '../../../../../types/upgrade.types';
import { getProjectPath } from '../../../../../utils/getProjectPath';
import { getAndroidVersionName } from '../../../../../utils/upgrade/android/androidVersionName';
import { mockFs } from '../../../../mocks/mockFs';

describe('androidVersionName', () => {
  it('should get version name', async () => {
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
    const importGetter = getAndroidVersionName('/oldProject') as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('"5.5"');

    await importGetter.setter();

    expect(
      mockFs.readFileSync(
        path.join(getProjectPath(), 'android/app/build.gradle')
      )
    ).toContain('versionName "5.5"');
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);

    const importGetter = getAndroidVersionName('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding version name', () => {
    mockFs.writeFileSync('/oldProject/android/app/build.gradle', 'random');
    const importGetter = getAndroidVersionName('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
});
