require('../../../../mocks/mockAll');
import path from 'path';
import { ImportGetter } from '../../../../../types/upgrade.types';
import { getProjectPath } from '../../../../../utils/getProjectPath';
import { importAndroidLaunchIcon } from '../../../../../utils/upgrade/android/importAndroidLaunchIcon';
import { mockFs } from '../../../../mocks/mockFs';

describe('importAndroidLaunchIcon', () => {
  it('should get launch icon', async () => {
    mockFs.writeFileSync(
      '/oldProject/android/app/src/main/res/mipmap-any/ic_launcher.png',
      'old image data'
    );
    mockFs.writeFileSync(
      '/oldProject/android/app/src/main/res/drawable-any/ic_notification.png',
      'old image data'
    );
    mockFs.writeFileSync(
      path.join(
        getProjectPath(),
        'android/app/src/main/res/mipmap-any/ic_launcher.png'
      ),
      'existing image data'
    );

    mockFs.writeFileSync(
      '/oldProject/android/app/src/main/AndroidManifest.xml',
      `android:label="@string/app_name"
      android:icon="@mipmap/test_ic_launcher"
      android:roundIcon="@mipmap/test_ic_launcher_round"
      android:allowBackup="false"`
    );
    mockFs.writeFileSync(
      path.join(getProjectPath(), 'android/app/src/main/AndroidManifest.xml'),
      `android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"`
    );

    const importGetter = importAndroidLaunchIcon('/oldProject') as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('@mipmap/test_ic_launcher');

    await importGetter.apply();

    expect(
      mockFs.readFileSync(
        path.join(getProjectPath(), 'android/app/src/main/AndroidManifest.xml')
      )
    ).toContain('android:icon="@mipmap/test_ic_launcher"');
  });
  it('should remove roundIcon when does not exist in old project', async () => {
    mockFs.writeFileSync(
      '/oldProject/android/app/src/main/AndroidManifest.xml',
      'android:icon="@mipmap/test_ic_launcher"'
    );
    mockFs.writeFileSync(
      path.join(getProjectPath(), 'android/app/src/main/AndroidManifest.xml'),
      `android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"`
    );

    const importGetter = importAndroidLaunchIcon('/oldProject') as ImportGetter;
    await importGetter.apply();

    expect(
      mockFs.readFileSync(
        path.join(getProjectPath(), 'android/app/src/main/AndroidManifest.xml')
      )
    ).not.toContain('android:roundIcon="@mipmap/ic_launcher_round"');
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);

    const importGetter = importAndroidLaunchIcon('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding icon', () => {
    mockFs.writeFileSync(
      '/oldProject/android/app/src/main/AndroidManifest.xml',
      'random'
    );
    const importGetter = importAndroidLaunchIcon('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
});
