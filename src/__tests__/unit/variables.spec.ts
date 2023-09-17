require('../mocks/mockAll');
import { getText, transformTextInObject, variables } from '../../variables';

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
      const replaced = getText('this is $[test:description]');
      expect(replaced).toEqual('this is description');
    });
  });
  describe('transformTextInObject', () => {
    it('should return null', () => {
      const replaced = transformTextInObject(null);
      expect(replaced).toBeNull();
    });
  });
});
