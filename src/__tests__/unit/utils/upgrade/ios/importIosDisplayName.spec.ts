require('../../../../mocks/mockAll');
import path from 'path';
import { Constants } from '../../../../../constants';
import { ImportGetter } from '../../../../../types/upgrade.types';
import { getProjectPath } from '../../../../../utils/getProjectPath';
import { importIosDisplayName } from '../../../../../utils/upgrade/ios/importIosDisplayName';
import { mockFs } from '../../../../mocks/mockFs';
import { mockPList } from '../../../../mocks/mockPList';

describe('importIosDisplayName', () => {
  it('should get display name', async () => {
    const plistPath = `/oldProject/ios/test/${Constants.PLIST_FILE_NAME}`;
    mockFs.writeFileSync(
      plistPath,
      mockPList.replace('<string>test</string>', '<string>old-name</string>')
    );
    mockFs.writeFileSync(
      path.join(getProjectPath(), 'ios/test/Info.plist'),
      mockPList
    );

    const importGetter = importIosDisplayName('/oldProject') as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('old-name');

    await importGetter.apply();
    expect(
      mockFs.readFileSync(path.join(getProjectPath(), 'ios/test/Info.plist'))
    ).toContain('<string>old-name</string>');
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);

    const importGetter = importIosDisplayName('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding display name', () => {
    const plistPath = `/oldProject/ios/test/${Constants.PLIST_FILE_NAME}`;
    mockFs.writeFileSync(
      plistPath,
      mockPList.replace('CFBundleDisplayName', 'random')
    );

    const importGetter = importIosDisplayName('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
});
