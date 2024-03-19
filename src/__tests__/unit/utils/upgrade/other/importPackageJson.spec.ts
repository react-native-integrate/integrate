require('../../../../mocks/mockAll');
const mockSpawn = jest.spyOn(require('child_process'), 'spawn');

import path from 'path';
import { Constants } from '../../../../../constants';
import { PackageJsonType } from '../../../../../types/mod.types';
import { ImportGetter } from '../../../../../types/upgrade.types';
import { getProjectPath } from '../../../../../utils/getProjectPath';
import {
  getInstallCommand,
  importPackageJson,
} from '../../../../../utils/upgrade/other/importPackageJson';
import { mockFs } from '../../../../mocks/mockFs';
import { mockPrompter } from '../../../../mocks/mockPrompter';

describe('importPackageJson', () => {
  it('should get package.json', async () => {
    mockFs.writeFileSync(
      '/oldProject/' + Constants.PACKAGE_JSON_FILE_NAME,
      JSON.stringify(
        {
          name: 'test',
          version: '1.0.0',
          description: 'old',
          scripts: {
            start: 'start',
          },
          dependencies: {
            'react-native': '1.0.0',
            'mock-package': '1.0.0',
            'non-integrated-mock-package': '1.0.0',
          },
          devDependencies: {
            'some-package': '1.0.0',
          },
          something: 'value',
          engines: {
            node: '>=14',
          },
        } as PackageJsonType,
        null,
        2
      )
    );

    const importGetter = importPackageJson('/oldProject') as ImportGetter;
    expect(importGetter).toBeTruthy();
    expect(importGetter.value).toEqual('test@1.0.0');

    mockSpawn.mockImplementationOnce(() => ({
      on: (_event: string, cb: CallableFunction) => {
        cb(0);
      },
    }));

    await importGetter.setter();

    expect(
      mockFs.readFileSync(
        path.join(getProjectPath(), Constants.PACKAGE_JSON_FILE_NAME)
      )
    ).toContain('non-integrated-mock-package');
  });
  it('should get package.json and handle failed module installation', async () => {
    mockFs.writeFileSync(
      '/oldProject/' + Constants.PACKAGE_JSON_FILE_NAME,
      JSON.stringify(
        {
          name: 'test',
          dependencies: {
            'react-native': '1.0.0',
            'some-package': '1.0.0',
          },
        } as PackageJsonType,
        null,
        2
      )
    );

    const importGetter = importPackageJson('/oldProject') as ImportGetter;

    mockSpawn.mockImplementationOnce(() => ({
      on: (_event: string, cb: CallableFunction) => {
        cb(1);
      },
    }));
    mockPrompter.multiselect.mockClear();

    await importGetter.setter();
    expect(mockPrompter.multiselect).toHaveBeenCalled();
  });
  it('should handle errors', () => {
    mockFs.setReadPermission(false);
    mockFs.writeFileSync('/oldProject/' + Constants.PACKAGE_JSON_FILE_NAME, '');

    const importGetter = importPackageJson('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });
  it('should handle not finding react-native in package lock', () => {
    mockFs.writeFileSync(
      '/oldProject/' + Constants.PACKAGE_JSON_FILE_NAME,
      JSON.stringify(
        {
          name: 'test',
          version: '1.0.0',
          dependencies: {
            'mock-package': '1.0.0',
            'non-integrated-mock-package': '1.0.0',
          },
        } as PackageJsonType,
        null,
        2
      )
    );

    const importGetter = importPackageJson('/oldProject') as ImportGetter;
    expect(importGetter).toBeNull();
  });

  describe('getInstallCommand', () => {
    it('should ask user when multiple lock exists', async () => {
      mockFs.writeFileSync('/oldProject/package-lock.json', '');
      mockFs.writeFileSync('/oldProject/yarn.lock', '');
      mockFs.writeFileSync('/oldProject/pnpm-lock.yaml', '');
      mockFs.writeFileSync('/oldProject/bun.lockb', '');

      mockPrompter.select.mockClear();
      const cmd = await getInstallCommand('/oldProject');

      expect(mockPrompter.select).toHaveBeenCalled();
      expect(cmd).toEqual('npm install');
    });
    it('should proceed when single lock exists', async () => {
      mockFs.writeFileSync('/oldProject/yarn.lock', '');

      mockPrompter.select.mockClear();
      const cmd = await getInstallCommand('/oldProject');

      expect(mockPrompter.select).not.toHaveBeenCalled();
      expect(cmd).toEqual('yarn install');
    });
  });
});
