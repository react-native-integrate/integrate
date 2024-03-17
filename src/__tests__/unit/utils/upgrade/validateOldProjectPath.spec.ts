require('../../../mocks/mockAll');

import { validateOldProjectPath } from '../../../../utils/upgrade/validateOldProjectPath';
import { mockFs } from '../../../mocks/mockFs';

describe('validateOldProjectPath', () => {
  it('should return void when empty', () => {
    expect(validateOldProjectPath('')).toBeUndefined();
  });
  it('should return message when path does not exist', () => {
    expect(validateOldProjectPath('/path')).toMatch('path does not exist');
  });
  it('should return message when path is not a directory', () => {
    mockFs.writeFileSync('/path', 'content');
    expect(validateOldProjectPath('/path')).toMatch('path must be a directory');
  });
  it('should return message when path does not contain package.json', () => {
    mockFs.writeFileSync('/path/random', 'content');
    expect(validateOldProjectPath('/path')).toMatch(
      'path must contain a package.json file'
    );
  });
});
