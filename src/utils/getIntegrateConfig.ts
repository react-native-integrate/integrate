import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { IntegrateConfig } from '../types/integrator.types';
import { getProjectPath } from './getProjectPath';

export function getIntegrateConfig(projectPath?: string) {
  try {
    const configFilePath = path.join(
      projectPath || getProjectPath(),
      Constants.INTEGRATE_CONFIG_FILE_NAME
    );
    if (!fs.existsSync(configFilePath)) return null;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const config = require(configFilePath) as
      | IntegrateConfig
      | { default: IntegrateConfig };
    return 'default' in config ? config.default : config;
  } catch (error) {
    console.error('Error reading integrate.config.js:', error);
    process.abort();
  }
}

export function getIntegratePackageConfig(
  integrateConfig: IntegrateConfig,
  packageName: string
) {
  if (!integrateConfig) return null;

  const plugin = integrateConfig.plugins?.find(
    plugin => (Array.isArray(plugin) ? plugin[0] : plugin) === packageName
  );
  if (!Array.isArray(plugin)) return null;

  return plugin[1] ?? null;
}
