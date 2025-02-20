import fs from 'fs';
import path from 'path';

export function validateOldProjectPath(
  oldProjectPath: string
): string | Error | undefined {
  const fullPath = path.resolve(oldProjectPath);
  if (!oldProjectPath) return;
  if (!fs.existsSync(fullPath)) return 'such path does not exist';
  if (!fs.lstatSync(fullPath).isDirectory()) return 'path must be a directory';
  if (!fs.existsSync(path.join(fullPath, 'package.json')))
    return 'path must contain a package.json file';
}
