import { resolve } from 'path';

describe('getProjectPath', () => {
  it('should return current working directory', () => {
    const projectPath = resolve('.');
    expect(projectPath).toBeTruthy();
  });
});
