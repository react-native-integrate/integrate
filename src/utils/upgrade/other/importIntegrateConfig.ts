import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { Constants } from '../../../constants';
import { logMessage } from '../../../prompter';
import { ImportGetter } from '../../../types/upgrade.types';
import { getIntegrateConfig } from '../../getIntegrateConfig';
import { getProjectPath } from '../../getProjectPath';

export function importIntegrateConfig(
  projectPath: string
): ImportGetter | null {
  try {
    const configFilePath = path.join(
      projectPath,
      Constants.INTEGRATE_CONFIG_FILE_NAME
    );

    const integrateConfig = getIntegrateConfig(projectPath);

    if (!integrateConfig) return null;

    return {
      id: 'integrateConfigJs',
      title: 'Integrate Config File',
      value: `${integrateConfig.plugins?.length || '0'} plugin configuration`,
      apply: () => setIntegrateConfig(configFilePath),
    };
  } catch (_e) {
    return null;
  }
}

async function setIntegrateConfig(file: string) {
  const destination = path.join(
    getProjectPath(),
    Constants.INTEGRATE_CONFIG_FILE_NAME
  );

  await new Promise((res, rej) => {
    fs.copyFile(file, destination, err => {
      if (err) rej(err);
      else res(null);
    });
  });

  logMessage(`imported ${color.yellow('integrate.config.js')}`);
  return Promise.resolve();
}
