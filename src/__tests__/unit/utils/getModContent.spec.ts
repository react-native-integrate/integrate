/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');
import path from 'path';
import { getModContent } from '../../../utils/getModContent';

const configPath = 'path/to/config/integrate.yml';
const packageName = 'test';
const file = 'folder/file.txt';
const fileContent = 'test';

describe('getModContent', () => {
  it('should return text', async () => {
    const content = await getModContent(configPath, packageName, fileContent);
    expect(content).toBe(fileContent);
  });
  it('should return file content', async () => {
    const filePath = path.join(configPath, '..', file);
    mockFs.writeFileSync(filePath, fileContent);
    const content = await getModContent(configPath, packageName, {
      file: file,
    });
    expect(content).toBe(fileContent);
  });
  it('should throw if file not found', async () => {
    await expect(
      getModContent(configPath, packageName, {
        file: file,
      })
    ).rejects.toThrowError('File not found');
  });
});
