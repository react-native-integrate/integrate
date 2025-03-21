/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-require-imports */

require('./mockProjectPath');
require('./mockFetch');
const { mockPrompter } = require('./mockPrompter');
const { mockFs } = require('./mockFs');
const { mockGlob } = require('./mockGlob');

import path from 'path';
import { Constants } from '../../constants';
import { LockData } from '../../types/integrator.types';
import { mockAndroidManifestTemplate } from './mockAndroidManifestTemplate';
import { mockAppDelegateTemplate } from './mockAppDelegateTemplate';
import { mockPList } from './mockPList';
import { notificationServiceM as mockNotificationServiceTemplate } from '../../scaffold/notification-service/notificationServiceM';
import { notificationViewControllerM as mockNotificationContentTemplate } from '../../scaffold/notification-content/notificationViewControllerM';

jest.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('program exited');
});

function writeMockProject(
  projectJson: Record<any, any>,
  name = 'mock-project'
): string {
  const packageJsonPath = path.resolve(
    __dirname,
    `../${name}/${Constants.PACKAGE_JSON_FILE_NAME}`
  );
  mockFs.writeFileSync(packageJsonPath, JSON.stringify(projectJson, null, 2));
  return packageJsonPath;
}

function writeMockLock(lockData: LockData, name = 'mock-project'): string {
  const lockPath = path.resolve(
    __dirname,
    `../${name}/${Constants.LOCK_FILE_NAME}`
  );
  mockFs.writeFileSync(lockPath, JSON.stringify(lockData, null, 2));
  return lockPath;
}
function writeMockAppDelegate(
  appDelegateContent = mockAppDelegateTemplate,
  name = 'mock-project'
): string {
  const appDelegatePath = path.resolve(
    __dirname,
    `../${name}/ios/test/${Constants.APP_DELEGATE_MM_FILE_NAME}`
  );
  mockFs.writeFileSync(appDelegatePath, appDelegateContent);
  return appDelegatePath;
}
function writeMockNotificationService(
  notificationServiceContent = mockNotificationServiceTemplate,
  name = 'mock-project'
): string {
  const notificationServicePath = path.resolve(
    __dirname,
    `../${name}/ios/test/${Constants.NOTIFICATION_SERVICE_M_FILE_NAME}`
  );
  mockFs.writeFileSync(notificationServicePath, notificationServiceContent);
  return notificationServicePath;
}
function writeMockNotificationContent(
  notificationContentContent = mockNotificationContentTemplate,
  name = 'mock-project'
): string {
  const notificationContentPath = path.resolve(
    __dirname,
    `../${name}/ios/test/${Constants.NOTIFICATION_VIEW_CONTROLLER_M_FILE_NAME}`
  );
  mockFs.writeFileSync(notificationContentPath, notificationContentContent);
  return notificationContentPath;
}
function writeMockPList(target = 'test'): string {
  const plistPath = path.resolve(
    __dirname,
    `../mock-project/ios/${target}/${Constants.PLIST_FILE_NAME}`
  );
  mockFs.writeFileSync(plistPath, mockPList);
  return plistPath;
}
function writeMockJson(filePath = 'test.json'): string {
  const jsonPath = path.resolve(__dirname, `../mock-project/${filePath}`);
  mockFs.writeFileSync(
    jsonPath,
    JSON.stringify({
      mock: 'test',
    })
  );
  return jsonPath;
}
function writeMockAndroidManifest(): string {
  const manifestPath = path.resolve(
    __dirname,
    `../mock-project/${Constants.ANDROID_MAIN_FILE_PATH}/${Constants.ANDROID_MANIFEST_FILE_NAME}`
  );
  mockFs.writeFileSync(manifestPath, mockAndroidManifestTemplate);
  return manifestPath;
}

let didSetup = false;
let mock: any;
if (!didSetup) {
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mock = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    mock.mockClear();
  });
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function

    mockFs.reset();

    // add package.json to mockFs
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package': '^1.2.3',
        'react-native': '1.2.3',
      },
      engines: {
        node: '>=16',
      },
    });
  });
  didSetup = true;
}

export {
  mockFs,
  mockGlob,
  mockPrompter,
  writeMockProject,
  writeMockLock,
  writeMockAppDelegate,
  writeMockNotificationService,
  writeMockNotificationContent,
  writeMockPList,
  writeMockJson,
  writeMockAndroidManifest,
};
