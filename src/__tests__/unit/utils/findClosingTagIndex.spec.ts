/* eslint-disable @typescript-eslint/no-unsafe-call */

require('../../mocks/mockAll');
import { findClosingTagIndex } from '../../../utils/findClosingTagIndex';

describe('findClosingTagIndex', () => {
  it('should return closing tag index', () => {
    const content = 'fn() { { { } } }';
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
