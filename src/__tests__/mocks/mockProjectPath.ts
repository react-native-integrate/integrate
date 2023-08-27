import { resolve } from 'path';

jest.mock('../../utils/getProjectPath', () => ({
  getProjectPath: () => resolve(__dirname, '../mock-project'),
}));
