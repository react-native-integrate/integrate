require('../../../../mocks/mockAll');
const mockSearchReplaceAllFiles = jest.spyOn(
  require('../../../../../utils/searchReplaceAllFiles'),
  'searchReplaceAllFiles'
);
import path from 'path';
import { ImportGetter } from '../../../../../types/upgrade.types';
import { getProjectPath } from '../../../../../utils/getProjectPath';
import { importAndroidAppId } from '../../../../../utils/upgrade/android/importAndroidAppId';
import { mockFs } from '../../../../mocks/mockFs';

describe('importAndroidAppId', () => {
  it('should get app id', async () => {
    mockFs.writeFileSync(
      '/oldProject/android/app/build.gradle',
      `
    ...
    compileSdkVersion rootProject.ext.compileSdkVersion

    namespace "com.testapp"
    defaultConfig {
        applicationId "com.testapp"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
    ...`
    );
    mockFs.writeFileSync(
      path.join(getProjectPath(), 'android/app/build.gradle'),
      `
    ...
    compileSdkVersion rootProject.ext.compileSdkVersion

    namespace "com.newapp"
    defaultConfig {
        applicationId "com.newapp"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
    ...`
    );
    const importGetter = importAndroidAppId('/oldProject') as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('com.testapp');

    mockSearchReplaceAllFiles.mockImplementationOnce(() => 1);
    await importGetter.apply();

    expect(mockSearchReplaceAllFiles).toHaveBeenCalledWith(
      path.join(getProjectPath(), 'android'),
      'com\\.newapp',
      'com.testapp',
      false
    );
    mockSearchReplaceAllFiles.mockClear();
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);

    const importGetter = importAndroidAppId('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding app id', () => {
    mockFs.writeFileSync(
      '/oldProject/android/app/build.gradle',
      'applicationId "com.testapp"'
    );
    mockFs.writeFileSync(
      path.join(getProjectPath(), 'android/app/build.gradle'),
      'random'
    );
    const importGetter = importAndroidAppId('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should not replace when app ids are same', async () => {
    mockFs.writeFileSync(
      '/oldProject/android/app/build.gradle',
      'applicationId "com.testapp"'
    );
    mockFs.writeFileSync(
      path.join(getProjectPath(), 'android/app/build.gradle'),
      'applicationId "com.testapp"'
    );
    const importGetter = importAndroidAppId('/oldProject') as ImportGetter;
    expect(importGetter).not.toBeFalsy();
    expect(importGetter.value).toEqual('com.testapp');

    await importGetter.apply();

    expect(mockSearchReplaceAllFiles).not.toHaveBeenCalled();
  });
});
