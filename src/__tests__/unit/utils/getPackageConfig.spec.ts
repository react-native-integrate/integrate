/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');

import path from 'path';
import { Constants } from '../../../constants';
import {
  getPackageConfig,
  getPackagePath,
  getRemotePath,
} from '../../../utils/getPackageConfig';
import { mockIntegrateYml } from '../../mocks/mockIntegrateYml';

describe('getRemotePath', () => {
  it('should return remote path correctly', () => {
    const packageName = '@react-native-firebase/app';
    const remotePath = getRemotePath(packageName);
    expect(remotePath).toContain('/1/a/b/%40react-native-firebase/app');
  });
});

describe('getPackageConfig', () => {
  beforeEach(() => {
    // @ts-ignore
    fetch.mockClear();
  });
  it('should download from remote repo', async () => {
    const packageName = '@react-native-firebase/app';
    const configPath = await getPackageConfig(packageName);
    expect(configPath).toBeTruthy();
    expect(fetch).toHaveBeenCalled();
  });
  it('should fail when config not available in remote repo', async () => {
    const packageName = '@react-native-firebase/fail';
    const configPath = await getPackageConfig(packageName);
    expect(configPath).toBeNull();
    expect(fetch).toHaveBeenCalled();
  });
  it('should use local config', async () => {
    const packageName = '@react-native-firebase/app';

    const localPackagePath = getPackagePath(packageName);
    const localConfigPath = path.join(
      localPackagePath,
      Constants.CONFIG_FILE_NAME
    );
    mockFs.writeFileSync(localConfigPath, mockIntegrateYml);

    const configPath = await getPackageConfig(packageName);
    expect(configPath).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });
});
