/* eslint-disable @typescript-eslint/no-unsafe-call */
// noinspection DuplicatedCode

const { mockFs, writeMockLock } = require('../../mocks/mockAll');
import path from 'path';
import { Constants } from '../../../constants';
import { getProjectPath } from '../../../utils/getProjectPath';
import { updateIntegrationStatus } from '../../../utils/updateIntegrationStatus';

describe('updateIntegrationStatus', () => {
  it('should create new lock file', () => {
    updateIntegrationStatus('test', {
      version: '1.2.3',
      integrated: true,
    });

    const filePath = path.join(getProjectPath(), Constants.LOCK_FILE_NAME);
    const fileContent = mockFs.readFileSync(filePath);
    expect(fileContent).toBeTruthy();
    const content = JSON.parse(fileContent);
    expect(content.packages).toEqual({
      test: {
        version: '1.2.3',
        integrated: true,
      },
    });
  });
  it('should update existing lock file', () => {
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {},
    });
    updateIntegrationStatus('test', {
      version: '1.2.3',
      integrated: true,
    });

    const filePath = path.join(getProjectPath(), Constants.LOCK_FILE_NAME);
    const fileContent = mockFs.readFileSync(filePath);
    expect(fileContent).toBeTruthy();
    const content = JSON.parse(fileContent);
    expect(content.packages).toEqual({
      test: {
        version: '1.2.3',
        integrated: true,
      },
    });
  });
  it('should update empty lock file', () => {
    const lockPath = path.resolve(
      __dirname,
      `../../mock-project/${Constants.LOCK_FILE_NAME}`
    );
    mockFs.writeFileSync(lockPath, '');
    updateIntegrationStatus('test', {
      version: '1.2.3',
      integrated: true,
    });

    const filePath = path.join(getProjectPath(), Constants.LOCK_FILE_NAME);
    const fileContent = mockFs.readFileSync(filePath);
    expect(fileContent).toBeTruthy();
    const content = JSON.parse(fileContent);
    expect(content.packages).toEqual({
      test: {
        version: '1.2.3',
        integrated: true,
      },
    });
  });
  it('should update existing lock file with no packages field', () => {
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: undefined,
    } as any);
    updateIntegrationStatus('test', {
      version: '1.2.3',
      integrated: true,
    });

    const filePath = path.join(getProjectPath(), Constants.LOCK_FILE_NAME);
    const fileContent = mockFs.readFileSync(filePath);
    expect(fileContent).toBeTruthy();
    const content = JSON.parse(fileContent);
    expect(content.packages).toEqual({
      test: {
        version: '1.2.3',
        integrated: true,
      },
    });
  });
  it('should abort for unsupported lock file version', () => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const mockAbort = jest.spyOn(process, 'abort').mockImplementation(() => {});

    writeMockLock({
      lockfileVersion: -1,
      packages: {},
    });

    updateIntegrationStatus('test', {
      version: '1.2.3',
      integrated: true,
    });
    expect(mockAbort).toHaveBeenCalledTimes(1);
  });
  it('should abort when has no read permission', () => {
    mockFs.setReadPermission(false);
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const mockAbort = jest.spyOn(process, 'abort').mockImplementation(() => {});

    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {},
    });

    updateIntegrationStatus('test', {
      version: '1.2.3',
      integrated: true,
    });
    expect(mockAbort).toHaveBeenCalledTimes(1);
  });
  it('should abort when has no write permission', () => {
    mockFs.setWritePermission(false);
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const mockAbort = jest.spyOn(process, 'abort').mockImplementation(() => {});

    updateIntegrationStatus('test', {
      version: '1.2.3',
      integrated: true,
    });
    expect(mockAbort).toHaveBeenCalledTimes(1);
  });
});
