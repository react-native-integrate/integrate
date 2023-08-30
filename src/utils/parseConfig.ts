import fs from 'fs';
import { parse } from 'yaml';
import { integrateYmlSchema } from '../schema/integrate.yml';
import { IntegrationConfig } from '../types/mod.types';
import Ajv from 'ajv';

const ajv = new Ajv();
const yamlSchema = parse(integrateYmlSchema);
const validate = ajv.compile(yamlSchema);

export function parseConfig(configPath: string): IntegrationConfig {
  const configContent = fs.readFileSync(configPath, 'utf8');
  const config = parse(configContent) as IntegrationConfig;
  if (!validate(config)) {
    throw new Error(validate.errors?.map(e => e.message).join(', '));
  }
  return config;
}
