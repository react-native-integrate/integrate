/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');

import { waitForFile } from '../../../utils/waitForFile';

describe('waitForFile', () => {
  it('should resolve false when file exists', async () => {
    mockFs.writeFileSync('/test/file.json', 'test-content');
    await expect(waitForFile('/test/file.json')).resolves.toBe(false);
  });
  it('should resolve true when file not exists', async () => {
    await expect(waitForFile('/test/file.json')).resolves.toBe(true);
  });
  it('should thorw when has no permission', async () => {
    mockFs.setReadPermission(false);
    await expect(waitForFile('/test/file.json')).rejects.toThrowError(
      'permission denied'
    );
  });
});
