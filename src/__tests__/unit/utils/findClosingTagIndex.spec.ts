/* eslint-disable @typescript-eslint/no-unsafe-call */

require('../../mocks/mockAll');
import {
  findClosingTagIndex,
  TagDefinitions,
} from '../../../utils/findClosingTagIndex';

describe('findClosingTagIndex', () => {
  it('should return closing tag index', () => {
    const content = 'fn() { { {\n\n } } // last line\n}';
    const moreContent = 'fn() { { } }';
    const methodStartMatch = /fn\(\) {/.exec(content);
    expect(methodStartMatch).toBeTruthy();
    if (!methodStartMatch) return;
    const methodStartIndex =
      methodStartMatch.index + methodStartMatch[0].length;
    const closingTagIndex = findClosingTagIndex(
      content + moreContent,
      methodStartIndex
    );
    expect(closingTagIndex).toBe(content.length - 1);
  });
  it('should handle comments', () => {
    const content = 'fn() { // {{{\n /* {{ */ { {\n\n } } }';
    const moreContent = 'fn() { { } }';
    const methodStartMatch = /fn\(\) {/.exec(content);
    expect(methodStartMatch).toBeTruthy();
    if (!methodStartMatch) return;
    const methodStartIndex =
      methodStartMatch.index + methodStartMatch[0].length;
    const closingTagIndex = findClosingTagIndex(
      content + moreContent,
      methodStartIndex
    );
    expect(closingTagIndex).toBe(content.length - 1);
  });
  it('should handle strings', () => {
    const content = 'fn() { " \\"{{{\\\\"\n \' {{ \' { {\n\n } } }';
    const moreContent = 'fn() { { } }';
    const methodStartMatch = /fn\(\) {/.exec(content);
    expect(methodStartMatch).toBeTruthy();
    if (!methodStartMatch) return;
    const methodStartIndex =
      methodStartMatch.index + methodStartMatch[0].length;
    const closingTagIndex = findClosingTagIndex(
      content + moreContent,
      methodStartIndex
    );
    expect(closingTagIndex).toBe(content.length - 1);
  });
  it('should return closing tag index with xml tags', () => {
    const content = '<test1><test2><test3 />\n\n </test2> </test3>';
    const moreContent = '<test4><test5 />\n\n </test4> ';
    const methodStartMatch = /<test1>/.exec(content);
    expect(methodStartMatch).toBeTruthy();
    if (!methodStartMatch) return;
    const methodStartIndex =
      methodStartMatch.index + methodStartMatch[0].length;
    const closingTagIndex = findClosingTagIndex(
      content + moreContent,
      methodStartIndex,
      TagDefinitions.XML
    );
    expect(closingTagIndex).toBe(content.length - 8);
  });
  it('should return closing tag index with Podfile', () => {
    const content = `target 'App' do
  if current_target.to_f < minimum_target.to_f
    config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
  end
  # Comment the next line if you don't want to use dynamic frameworks
end`;
    const moreContent = "\ntarget 'App' do\nend";
    const methodStartMatch = /target 'App' do/.exec(content);
    expect(methodStartMatch).toBeTruthy();
    if (!methodStartMatch) return;
    const methodStartIndex =
      methodStartMatch.index + methodStartMatch[0].length;
    const closingTagIndex = findClosingTagIndex(
      content + moreContent,
      methodStartIndex,
      TagDefinitions.POD
    );
    expect(closingTagIndex).toBe(content.length - 3);
  });
  it('should throw if there is unclosed brace', () => {
    const content = 'fn() { { { } }  ';
    const methodStartMatch = /fn\(\) {/.exec(content);
    expect(methodStartMatch).toBeTruthy();
    if (!methodStartMatch) return;
    const methodStartIndex =
      methodStartMatch.index + methodStartMatch[0].length;
    expect(() => {
      findClosingTagIndex(content, methodStartIndex);
    }).toThrowError('Could not find closing tag');
  });
});
