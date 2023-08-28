import { resolve } from 'path';
import { getProjectPath } from '../../../utils/getProjectPath';

describe('getProjectPath', () => {
  it('should return current working directory', () => {
    const projectPath = resolve('.');
    expect(getProjectPath()).toEqual(projectPath);
  });
});
