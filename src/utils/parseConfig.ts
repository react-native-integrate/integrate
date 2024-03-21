import Ajv from 'ajv';
import fs from 'fs';
import { parse } from 'yaml';
import integrateYmlSchema from '../schema/integrate.schema.json';

const ajv = new Ajv({ allowUnionTypes: true });
const validate = ajv.compile(integrateYmlSchema);

export function parseConfig(configPath: string): Record<string, any> {
  const configContent = fs.readFileSync(configPath, 'utf8');
  return parseConfigString(configContent);
}

export function parseConfigString(configContent: string): Record<string, any> {
  const config = parse(configContent) as Record<string, any>;
  if (!validate(config)) {
    throw new Error(validate.errors?.map(e => e.message).join(', '));
  }
  return config;
}
