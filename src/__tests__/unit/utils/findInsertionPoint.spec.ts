/* eslint-disable @typescript-eslint/no-unsafe-call */

require('../../mocks/mockAll');
import { findInsertionPoint } from '../../../utils/findInsertionPoint';

describe('findInsertionPoint', () => {
  it('should return insertion point index', () => {
    const preContent = 'fn() { ';
    const findContent = 'test1;';
    const postContent = ' test2; }';
    const content = preContent + findContent + postContent;
    const insertionPoint = findInsertionPoint(content, findContent);
    expect(insertionPoint).toEqual({
      start: preContent.length,
      end: preContent.length + findContent.length,
      match: findContent,
    });
  });
  it('should return negative on fail', () => {
    const preContent = 'fn() { ';
    const findContent = 'test1;';
    const postContent = ' test2; }';
    const content = preContent + findContent + postContent;
    const insertionPoint = findInsertionPoint(content, 'random');
    expect(insertionPoint).toEqual({
      start: -1,
      end: -1,
      match: null,
    });
  });
  it('should return insertion point index with regex search', () => {
    const preContent = 'fn() { ';
    const findContent = 'test1; random \n more random strings;';
    const postContent = ' test2; }';
    const content = preContent + findContent + postContent;
    const insertionPoint = findInsertionPoint(content, {
      regex: 'test1;.*?strings;',
      flags: 's',
    });
    expect(insertionPoint).toEqual({
      start: preContent.length,
      end: preContent.length + findContent.length,
      match: findContent,
    });
  });
  it('should return negative on fail with regex search', () => {
    const preContent = 'fn() { ';
    const findContent = 'test1; random \n more random strings;';
    const postContent = ' test2; }';
    const content = preContent + findContent + postContent;
    const insertionPoint = findInsertionPoint(content, {
      regex: 'test_random',
      flags: 's',
    });
    expect(insertionPoint).toEqual({
      start: -1,
      end: -1,
      match: null,
    });
  });
});
