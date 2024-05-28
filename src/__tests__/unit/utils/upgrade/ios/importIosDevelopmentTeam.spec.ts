require('../../../../mocks/mockAll');
import { ImportGetter } from '../../../../../types/upgrade.types';
import { escapeRegExp } from '../../../../../utils/escapeRegExp';
import { getPbxProjectPath } from '../../../../../utils/getIosProjectPath';
import { importIosDevelopmentTeam } from '../../../../../utils/upgrade/ios/importIosDevelopmentTeam';
import { mockFs } from '../../../../mocks/mockFs';
import { mockPbxProjTemplate } from '../../../../mocks/mockPbxProjTemplate';

describe('importIosDevelopmentTeam', () => {
  it('should get project version', async () => {
    mockFs.writeFileSync(
      getPbxProjectPath('/oldProject'),
      mockPbxProjTemplate.replace(
        new RegExp(escapeRegExp('DEVELOPMENT_TEAM = 1234'), 'g'),
        'DEVELOPMENT_TEAM = ABCD'
      )
    );
    mockFs.writeFileSync(getPbxProjectPath(), mockPbxProjTemplate);

    const importGetter = importIosDevelopmentTeam(
      '/oldProject'
    ) as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('ABCD');

    await importGetter.apply();
    expect(mockFs.readFileSync(getPbxProjectPath())).toContain(
      'DEVELOPMENT_TEAM = ABCD'
    );
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);

    const importGetter = importIosDevelopmentTeam(
      '/oldProject'
    ) as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding project version', () => {
    mockFs.writeFileSync(
      getPbxProjectPath('/oldProject'),
      mockPbxProjTemplate.replace(
        new RegExp(escapeRegExp('DEVELOPMENT_TEAM = 1234'), 'g'),
        'random = "random"'
      )
    );
    const importGetter = importIosDevelopmentTeam(
      '/oldProject'
    ) as ImportGetter;
    expect(importGetter).toBeNull();
  });
});
