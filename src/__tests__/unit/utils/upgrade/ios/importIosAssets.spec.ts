require('../../../../mocks/mockAll');
import path from 'path';
import { ImportGetter } from '../../../../../types/upgrade.types';
import { getProjectPath } from '../../../../../utils/getProjectPath';
import { getIosAssets } from '../../../../../utils/upgrade/ios/importIosAssets';
import { mockFs } from '../../../../mocks/mockFs';

describe('importIosAssets', () => {
  it('should get launch icon', async () => {
    mockFs.writeFileSync(
      '/oldProject/ios/test/Images.xcassets/someImage.png',
      'old image data'
    );
    mockFs.writeFileSync(
      path.join(getProjectPath(), 'ios/test/Images.xcassets/newImage.png'),
      'existing image data'
    );

    mockFs.writeFileSync(
      '/oldProject/ios/test/LaunchScreen.storyboard',
      'old launch screen'
    );
    mockFs.writeFileSync(
      path.join(getProjectPath(), 'ios/test/LaunchScreen.storyboard'),
      'existing launch screen'
    );

    const importGetter = getIosAssets('/oldProject') as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual(
      'Images.xcassets, LaunchScreen.storyboard'
    );

    await importGetter.setter();

    expect(
      mockFs.existsSync(
        path.join(getProjectPath(), 'ios/test/Images.xcassets/newImage.png')
      )
    ).toBeFalsy();
    expect(
      mockFs.existsSync(
        path.join(getProjectPath(), 'ios/test/Images.xcassets/someImage.png')
      )
    ).toBeTruthy();
    expect(
      mockFs.readFileSync(
        path.join(getProjectPath(), 'ios/test/LaunchScreen.storyboard')
      )
    ).toBe('old launch screen');
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);

    const importGetter = getIosAssets('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding assets', () => {
    const importGetter = getIosAssets('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
});
