require('../../../../mocks/mockAll');
import { ImportGetter } from '../../../../../types/upgrade.types';
import { escapeRegExp } from '../../../../../utils/escapeRegExp';
import { getPbxProjectPath } from '../../../../../utils/getIosProjectPath';
import { importIosProjectVersion } from '../../../../../utils/upgrade/ios/importIosProjectVersion';
import { mockFs } from '../../../../mocks/mockFs';
import { mockPbxProjTemplate } from '../../../../mocks/mockPbxProjTemplate';

describe('importIosProjectVersion', () => {
  it('should get project version', async () => {
    mockFs.writeFileSync(
      getPbxProjectPath('/oldProject'),
      mockPbxProjTemplate.replace(
        new RegExp(escapeRegExp('CURRENT_PROJECT_VERSION = 1'), 'g'),
        'CURRENT_PROJECT_VERSION = 5'
      )
    );
    mockFs.writeFileSync(getPbxProjectPath(), mockPbxProjTemplate);

    const importGetter = importIosProjectVersion('/oldProject') as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('5');

    await importGetter.apply();
    expect(mockFs.readFileSync(getPbxProjectPath())).toContain(
      'CURRENT_PROJECT_VERSION = 5'
    );
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);

    const importGetter = importIosProjectVersion('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding project version', () => {
    mockFs.writeFileSync(
      getPbxProjectPath('/oldProject'),
      mockPbxProjTemplate.replace(
        new RegExp(escapeRegExp('CURRENT_PROJECT_VERSION = 1'), 'g'),
        'random = "random"'
      )
    );
    const importGetter = importIosProjectVersion('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });

  it('should get project version from variable', async () => {
    mockFs.writeFileSync(
      getPbxProjectPath('/oldProject'),
      mockPbxProjTemplate
        .replace(
          new RegExp(escapeRegExp('CURRENT_PROJECT_VERSION = 1'), 'g'),
          'CURRENT_PROJECT_VERSION = "${VARIABLE}"'
        )
        .replace(
          new RegExp(escapeRegExp('ALWAYS_SEARCH_USER_PATHS = NO;'), 'g'),
          'VARIABLE = 5;'
        )
    );
    mockFs.writeFileSync(getPbxProjectPath(), mockPbxProjTemplate);

    const importGetter = importIosProjectVersion('/oldProject') as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('"${VARIABLE}" (5)');

    await importGetter.apply();
    expect(mockFs.readFileSync(getPbxProjectPath())).toContain(
      'CURRENT_PROJECT_VERSION = "${VARIABLE}"'
    );
    expect(mockFs.readFileSync(getPbxProjectPath())).toContain('VARIABLE = 5;');
  });
});
