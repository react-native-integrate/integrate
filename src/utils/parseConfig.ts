import Ajv from 'ajv';
import fs from 'fs';
import { parse } from 'yaml';
import { Constants } from '../constants';
import integrateYmlSchema from '../schema/integrate.schema.json';
import upgradeYmlSchema from '../schema/upgrade.schema.json';

const ajv = new Ajv({ allowUnionTypes: true });
const validateIntegrate = ajv.compile(integrateYmlSchema);
const validateUpgrade = ajv.compile(upgradeYmlSchema);

export function parseConfig(configPath: string): Record<string, any> {
  const configContent = fs.readFileSync(configPath, 'utf8');
  return parseConfigString(
    configContent,
    configPath.endsWith(Constants.UPGRADE_CONFIG_FILE_NAME)
      ? 'upgrade'
      : 'integrate'
  );
}

export function parseConfigString(
  configContent: string,
  schema: 'integrate' | 'upgrade'
): Record<string, any> {
  const config = parse(configContent) as Record<string, any>;
  if (schema == 'integrate' && !validateIntegrate(config)) {
    throw new Error(validateIntegrate.errors?.map(e => e.message).join(', '));
  } else if (schema == 'upgrade' && !validateUpgrade(config)) {
    throw new Error(validateUpgrade.errors?.map(e => e.message).join(', '));
  }
  return config;
}
