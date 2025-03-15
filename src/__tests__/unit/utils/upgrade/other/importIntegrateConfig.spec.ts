require('../../../../mocks/mockAll');
import path from 'path';
import { Constants } from '../../../../../constants';
import { ImportGetter } from '../../../../../types/upgrade.types';
import { getProjectPath } from '../../../../../utils/getProjectPath';
import { importIntegrateConfig } from '../../../../../utils/upgrade/other/importIntegrateConfig';
import { mockFs } from '../../../../mocks/mockFs';

describe('importIntegrateConfig', () => {
  it('should get integrate.config.js', async () => {
    const configFile = path.join(
      __dirname,
      '../../../../mocks',
      Constants.INTEGRATE_CONFIG_FILE_NAME
    );
    mockFs.writeFileSync(configFile, "module.exports = {plugins: ['test']}");

    const importGetter = importIntegrateConfig(
      path.join(__dirname, '../../../../mocks')
    ) as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('1 plugin configuration');

    await importGetter.apply();

    expect(
      mockFs.readFileSync(
        path.join(getProjectPath(), Constants.INTEGRATE_CONFIG_FILE_NAME)
      )
    ).toContain("module.exports = {plugins: ['test']}");
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);
    mockFs.writeFileSync('/oldProject/' + Constants.LOCK_FILE_NAME, '');

    const importGetter = importIntegrateConfig('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding integrate config', () => {
    const importGetter = importIntegrateConfig('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
});
