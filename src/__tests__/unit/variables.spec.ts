require('../mocks/mockAll');
import { getPbxProjectPath } from '../../utils/getIosProjectPath';
import { getText, transformTextInObject, variables } from '../../variables';
import { mockFs } from '../mocks/mockFs';
import { mockPbxProjTemplate } from '../mocks/mockPbxProjTemplate';

describe('variables', () => {
  beforeEach(() => {
    variables.clear();
  });
  it('should get store', () => {
    variables.set('test', 'value');
    const obj = variables.getStore();
    expect(obj['test']).toEqual('value');
  });
  it('should get ios project name', () => {
    const iosProjectName = variables.get('IOS_PROJECT_NAME');
    expect(iosProjectName).toEqual('test');
  });
  it('should get ios bundle id', () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);
    const iosBundleId = variables.get('IOS_BUNDLE_ID');
    expect(iosBundleId).toEqual(
      'org.reactjs.native.example.ReactNativeCliTemplates'
    );
  });
  it('should get ios bundle id as null when no project exists', () => {
    const iosBundleId = variables.get('IOS_BUNDLE_ID');
    expect(iosBundleId).toEqual(null);
  });
  it('should get ios deployment version', () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);
    const iosDeploymentVersion = variables.get('IOS_DEPLOYMENT_VERSION');
    expect(iosDeploymentVersion).toEqual('10.0');
  });
  it('should get ios bundle id as null when no project exists', () => {
    const iosBundleId = variables.get('IOS_BUNDLE_ID');
    expect(iosBundleId).toEqual(null);
  });
  it('should get ios deployment version as null when no project exists', () => {
    const iosBundleId = variables.get('IOS_DEPLOYMENT_VERSION');
    expect(iosBundleId).toEqual(null);
  });
  it('should get null ios project name when no project', () => {
    const mock = jest.spyOn(mockFs, 'readdirSync');
    mock.mockImplementationOnce(() => ['random']);
    const iosProjectName = variables.get('IOS_PROJECT_NAME');
    expect(iosProjectName).toEqual(null);
    mock.mockRestore();
  });
  it('should get and set the default value', () => {
    variables.set('test', 'value');
    expect(variables.get('test')).toEqual('value');
  });
  describe('getText', () => {
    it('should return text', () => {
      const replaced = getText('this has no var');
      expect(replaced).toEqual('this has no var');
    });
    it('should replace variables', () => {
      variables.set('test', 'value');
      const replaced = getText('this is $[test]');
      expect(replaced).toEqual('this is value');
    });
    it('should not replace escaped variables', () => {
      variables.set('test', 'value');
      const replaced = getText('this is \\$[test]');
      expect(replaced).toEqual('this is $[test]');
    });
    it('should replace double escaped variables', () => {
      variables.set('test', 'value');
      const replaced = getText('this is \\\\$[test]');
      expect(replaced).toEqual('this is \\value');
    });
    it('should not replace triple escaped variables', () => {
      variables.set('test', 'value');
      const replaced = getText('this is \\\\\\$[test]');
      expect(replaced).toEqual('this is \\$[test]');
    });
    it('should replace with name for non existing variables', () => {
      const replaced = getText('this is $[test]');
      expect(replaced).toEqual('this is test');
    });
    it('should replace with description for non existing variables', () => {
      const replaced = getText(
        'this is $[get("nonExisting") ?? "description"]'
      );
      expect(replaced).toEqual('this is description');
    });
    it('should process script', () => {
      const replaced = getText(`this is $[
        var result = true; 
        set("test2", result);
        result;
      ]`);
      expect(replaced).toEqual('this is true');
      expect(variables.get('test2')).toEqual(true);
    });
  });
  describe('transformTextInObject', () => {
    it('should return null', () => {
      const replaced = transformTextInObject(null);
      expect(replaced).toBeNull();
    });
  });
});
