/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../mocks/mockAll');

import path from 'path';
import color from 'picocolors';
import { Constants } from '../../constants';
import { getInfo } from '../../getInfo';
import { getPackagePath } from '../../utils/getPackageConfig';
import { mockPrompter } from '../mocks/mockAll';
import { mockIntegrateYml } from '../mocks/mockIntegrateYml';

describe('getInfo', () => {
  it('should get info of package', async () => {
    mockPrompter.log.success.mockReset();

    await getInfo('mock-package');
    expect(mockPrompter.log.success).toHaveBeenCalledWith(
      expect.stringContaining('ready and available for integration')
    );
  });
  it('should get info of non existing package', async () => {
    mockPrompter.log.warning.mockReset();

    await getInfo('mock-package-fail');
    expect(mockPrompter.log.warning).toHaveBeenCalledWith(
      expect.stringContaining('not available for integration')
    );
  });
  it('should get info of local configured package', async () => {
    const packageName = '@react-native-firebase/app';

    const localPackagePath = getPackagePath(packageName);
    const localConfigPath = path.join(
      localPackagePath,
      Constants.CONFIG_FILE_NAME
    );
    mockFs.writeFileSync(localConfigPath, mockIntegrateYml);
    mockPrompter.log.step.mockReset();

    await getInfo(packageName);
    expect(mockPrompter.log.step).toHaveBeenCalledWith(
      expect.stringContaining(
        `local configuration: ${color.bold(color.green('exists'))}`
      )
    );
  });
});
