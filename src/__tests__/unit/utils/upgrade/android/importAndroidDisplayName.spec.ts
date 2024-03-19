require('../../../../mocks/mockAll');
import path from 'path';
import { ImportGetter } from '../../../../../types/upgrade.types';
import { getProjectPath } from '../../../../../utils/getProjectPath';
import { importAndroidDisplayName } from '../../../../../utils/upgrade/android/importAndroidDisplayName';
import { mockFs } from '../../../../mocks/mockFs';

describe('importAndroidDisplayName', () => {
  it('should get display name', async () => {
    mockFs.writeFileSync(
      '/oldProject/android/app/src/main/res/values/strings.xml',
      `
<resources>
    <string name="app_name">test app</string>
</resources>
`
    );
    mockFs.writeFileSync(
      path.join(
        getProjectPath(),
        'android/app/src/main/res/values/strings.xml'
      ),
      `
<resources>
    <string name="app_name">new app</string>
</resources>
`
    );
    const importGetter = importAndroidDisplayName(
      '/oldProject'
    ) as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('test app');

    await importGetter.apply();

    expect(
      mockFs.readFileSync(
        path.join(
          getProjectPath(),
          'android/app/src/main/res/values/strings.xml'
        )
      )
    ).toContain('<string name="app_name">test app</string>');
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);

    const importGetter = importAndroidDisplayName(
      '/oldProject'
    ) as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding display name', () => {
    mockFs.writeFileSync(
      '/oldProject/android/app/src/main/res/values/strings.xml',
      'random'
    );
    const importGetter = importAndroidDisplayName(
      '/oldProject'
    ) as ImportGetter;
    expect(importGetter).toBeNull();
  });
});
