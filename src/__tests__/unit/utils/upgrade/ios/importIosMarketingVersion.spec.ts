require('../../../../mocks/mockAll');
import { ImportGetter } from '../../../../../types/upgrade.types';
import { escapeRegExp } from '../../../../../utils/escapeRegExp';
import { getPbxProjectPath } from '../../../../../utils/getIosProjectPath';
import { getIosMarketingVersion } from '../../../../../utils/upgrade/ios/importIosMarketingVersion';
import { mockFs } from '../../../../mocks/mockFs';
import { mockPbxProjTemplate } from '../../../../mocks/mockPbxProjTemplate';

describe('importIosMarketingVersion', () => {
  it('should get marketing version', async () => {
    mockFs.writeFileSync(
      getPbxProjectPath('/oldProject'),
      mockPbxProjTemplate.replace(
        new RegExp(escapeRegExp('CURRENT_PROJECT_VERSION = 1'), 'g'),
        'MARKETING_VERSION = "5.5"'
      )
    );
    mockFs.writeFileSync(getPbxProjectPath(), mockPbxProjTemplate);

    const importGetter = getIosMarketingVersion('/oldProject') as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('"5.5"');

    await importGetter.setter();
    expect(mockFs.readFileSync(getPbxProjectPath())).toContain(
      'MARKETING_VERSION = "5.5"'
    );
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);

    const importGetter = getIosMarketingVersion('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding marketing version', () => {
    mockFs.writeFileSync(getPbxProjectPath('/oldProject'), mockPbxProjTemplate);
    const importGetter = getIosMarketingVersion('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });

  it('should get marketing version from variable', async () => {
    mockFs.writeFileSync(
      getPbxProjectPath('/oldProject'),
      mockPbxProjTemplate
        .replace(
          new RegExp(escapeRegExp('CURRENT_PROJECT_VERSION = 1'), 'g'),
          'MARKETING_VERSION = "${VARIABLE}"'
        )
        .replace(
          new RegExp(escapeRegExp('ALWAYS_SEARCH_USER_PATHS = NO;'), 'g'),
          'VARIABLE = 5;'
        )
    );
    mockFs.writeFileSync(getPbxProjectPath(), mockPbxProjTemplate);

    const importGetter = getIosMarketingVersion('/oldProject') as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('"${VARIABLE}" (5)');

    await importGetter.setter();
    expect(mockFs.readFileSync(getPbxProjectPath())).toContain(
      'MARKETING_VERSION = "${VARIABLE}"'
    );
    expect(mockFs.readFileSync(getPbxProjectPath())).toContain('VARIABLE = 5;');
  });
});
