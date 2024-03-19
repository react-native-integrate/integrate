require('../../../mocks/mockAll');

const getAndroidAppId = jest.spyOn(
  require('../../../../utils/upgrade/android/importAndroidAppId'),
  'importAndroidAppId'
);
const getAndroidDisplayName = jest.spyOn(
  require('../../../../utils/upgrade/android/importAndroidDisplayName'),
  'importAndroidDisplayName'
);
const getAndroidLaunchIcon = jest.spyOn(
  require('../../../../utils/upgrade/android/importAndroidLaunchIcon'),
  'importAndroidLaunchIcon'
);
const getAndroidVersionCode = jest.spyOn(
  require('../../../../utils/upgrade/android/importAndroidVersionCode'),
  'importAndroidVersionCode'
);
const getAndroidVersionName = jest.spyOn(
  require('../../../../utils/upgrade/android/importAndroidVersionName'),
  'importAndroidVersionName'
);
const getIosAssets = jest.spyOn(
  require('../../../../utils/upgrade/ios/importIosAssets'),
  'importIosAssets'
);
const getIosBundleId = jest.spyOn(
  require('../../../../utils/upgrade/ios/importIosBundleId'),
  'importIosBundleId'
);
const getIosDisplayName = jest.spyOn(
  require('../../../../utils/upgrade/ios/importIosDisplayName'),
  'importIosDisplayName'
);
const getIosMarketingVersion = jest.spyOn(
  require('../../../../utils/upgrade/ios/importIosMarketingVersion'),
  'importIosMarketingVersion'
);
const getIosProjectVersion = jest.spyOn(
  require('../../../../utils/upgrade/ios/importIosProjectVersion'),
  'importIosProjectVersion'
);
import { ImportGetter } from '../../../../types/upgrade.types';
import { importFromOldProject } from '../../../../utils/upgrade/importFromOldProject';
import { mockPrompter } from '../../../mocks/mockPrompter';

const exampleGetter = {
  id: 'androidAppId',
  value: 'someAppId',
  title: 'Android App Id',
  apply: jest.fn(() => Promise.resolve()),
};
describe('importFromOldProject', () => {
  beforeAll(() => {
    getAndroidAppId.mockImplementation((): ImportGetter => exampleGetter);
    getAndroidDisplayName.mockImplementation(
      (): ImportGetter => ({
        id: 'androidDisplayName',
        value: 'someDisplayName',
        title: 'Android Display Name',
        apply: jest.fn(() => Promise.resolve()),
      })
    );
    getAndroidLaunchIcon.mockImplementation(
      (): ImportGetter => ({
        id: 'androidLaunchIcon',
        value: 'someIcon',
        title: 'Android Launch Icon',
        apply: jest.fn(() => Promise.resolve()),
      })
    );
    getAndroidVersionCode.mockImplementation(
      (): ImportGetter => ({
        id: 'androidVersionCode',
        value: 'someVersionCode',
        title: 'Android Version Code',
        apply: jest.fn(() => Promise.resolve()),
      })
    );
    getAndroidVersionName.mockImplementation(
      (): ImportGetter => ({
        id: 'androidVersionName',
        value: 'someVersionName',
        title: 'Android Version Name',
        apply: jest.fn(() => Promise.resolve()),
      })
    );
    getIosAssets.mockImplementation(
      (): ImportGetter => ({
        id: 'iosAssets',
        value: 'someAssets',
        title: 'iOS Assets',
        apply: jest.fn(() => Promise.resolve()),
      })
    );
    getIosBundleId.mockImplementation(
      (): ImportGetter => ({
        id: 'iosBundleId',
        value: 'someBundleId',
        title: 'iOS Bundle Id',
        apply: jest.fn(() => Promise.resolve()),
      })
    );
    getIosDisplayName.mockImplementation(
      (): ImportGetter => ({
        id: 'iosDisplayName',
        value: 'someDisplayName',
        title: 'iOS Display Name',
        apply: jest.fn(() => Promise.resolve()),
      })
    );
    getIosMarketingVersion.mockImplementation(
      (): ImportGetter => ({
        id: 'iosMarketingVersion',
        value: 'someMarketingVersion',
        title: 'iOS Marketing Version',
        apply: jest.fn(() => Promise.resolve()),
      })
    );
    getIosProjectVersion.mockImplementation(
      (): ImportGetter => ({
        id: 'iosProjectVersion',
        value: 'someProjectVersion',
        title: 'iOS Project Version',
        apply: jest.fn(() => Promise.resolve()),
      })
    );
  });
  afterAll(() => {
    getAndroidAppId.mockRestore();
    getAndroidDisplayName.mockRestore();
    getAndroidLaunchIcon.mockRestore();
    getAndroidVersionCode.mockRestore();
    getAndroidVersionName.mockRestore();
    getIosAssets.mockRestore();
    getIosBundleId.mockRestore();
    getIosDisplayName.mockRestore();
    getIosMarketingVersion.mockRestore();
    getIosProjectVersion.mockRestore();
  });
  it('should skip when not confirmed', async () => {
    mockPrompter.confirm.mockImplementationOnce(() => false);
    mockPrompter.log.message.mockReset();
    expect(await importFromOldProject('/oldProject')).toBeFalsy();

    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('skipping import from old project')
    );
    mockPrompter.confirm.mockReset();
  });
  it('should call importer apply', async () => {
    mockPrompter.confirm.mockImplementationOnce(() => true);
    expect(await importFromOldProject('/oldProject')).toBeTruthy();

    expect(exampleGetter.apply).toHaveBeenCalled();
  });
  it('should log warning on some error', async () => {
    mockPrompter.confirm.mockImplementationOnce(() => true);
    mockPrompter.log.warning.mockReset();
    exampleGetter.apply.mockImplementationOnce(() =>
      Promise.reject(new Error('some error'))
    );
    expect(await importFromOldProject('/oldProject')).toBeTruthy();

    expect(mockPrompter.log.warning).toHaveBeenCalledWith(
      expect.stringContaining('some error')
    );
  });
});
