import fs from 'fs';
import path from 'path';
import { TextOrFileValue } from '../types/mod.types';

export function getModContent(
  configPath: string,
  textOrFile: TextOrFileValue
): string {
  if (typeof textOrFile == 'string') return textOrFile;
  const fullConfigPath = path.join(configPath, textOrFile.file);
  if (!fs.existsSync(fullConfigPath))
    throw new Error(`File not found at ${fullConfigPath}`);
  return fs.readFileSync(fullConfigPath, 'utf-8');
}
