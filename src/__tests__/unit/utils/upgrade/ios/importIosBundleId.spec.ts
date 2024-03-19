require('../../../../mocks/mockAll');
import { ImportGetter } from '../../../../../types/upgrade.types';
import { escapeRegExp } from '../../../../../utils/escapeRegExp';
import { getPbxProjectPath } from '../../../../../utils/getIosProjectPath';
import { importIosBundleId } from '../../../../../utils/upgrade/ios/importIosBundleId';
import { mockFs } from '../../../../mocks/mockFs';
import { mockPbxProjTemplate } from '../../../../mocks/mockPbxProjTemplate';

describe('importIosBundleId', () => {
  it('should get bundle id', async () => {
    mockFs.writeFileSync(
      getPbxProjectPath('/oldProject'),
      mockPbxProjTemplate.replace(
        new RegExp(
          escapeRegExp(
            'PRODUCT_BUNDLE_IDENTIFIER = "org.reactjs.native.example.$(PRODUCT_NAME:rfc1034identifier)"'
          ),
          'g'
        ),
        'PRODUCT_BUNDLE_IDENTIFIER = "com.oldProject"'
      )
    );
    mockFs.writeFileSync(getPbxProjectPath(), mockPbxProjTemplate);

    const importGetter = importIosBundleId('/oldProject') as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('com.oldProject');

    await importGetter.apply();
    expect(mockFs.readFileSync(getPbxProjectPath())).toContain(
      'PRODUCT_BUNDLE_IDENTIFIER = com.oldProject'
    );
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);

    const importGetter = importIosBundleId('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding bundle id', () => {
    mockFs.writeFileSync(
      getPbxProjectPath('/oldProject'),
      mockPbxProjTemplate.replace(
        new RegExp(
          escapeRegExp(
            'PRODUCT_BUNDLE_IDENTIFIER = "org.reactjs.native.example.$(PRODUCT_NAME:rfc1034identifier)"'
          ),
          'g'
        ),
        'random = "random"'
      )
    );
    const importGetter = importIosBundleId('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
});
