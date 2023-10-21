/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');
import path from 'path';
import { getModContent } from '../../../utils/getModContent';

const configPath = 'path/to/config/integrate.yml';
const file = 'folder/file.txt';
const fileContent = 'test';

describe('getModContent', () => {
  it('should return text', () => {
    const content = getModContent(configPath, fileContent);
    expect(content).toBe(fileContent);
  });
  it('should return file content', () => {
    const filePath = path.join(configPath, '..', file);
    mockFs.writeFileSync(filePath, fileContent);
    const content = getModContent(configPath, {
      file: file,
    });
    expect(content).toBe(fileContent);
  });
  it('should throw if file not found', () => {
    expect(() => {
      getModContent(configPath, {
        file: file,
      });
    }).toThrowError('File not found');
  });
});
