/* eslint-disable @typescript-eslint/no-unsafe-call */

require('../../mocks/mockAll');
import { findInsertionPoint } from '../../../utils/findInsertionPoint';

describe('findInsertionPoint', () => {
  it('should return insertion point index', () => {
    const preContent = 'fn() { ';
    const findContent = 'test1;';
    const postContent = ' test2; }';
    const content = preContent + findContent + postContent;
    const insertionPoint = findInsertionPoint(content, {
      find: findContent,
      insert: 'any',
    });
    expect(insertionPoint).toEqual({
      start: preContent.length,
      end: preContent.length + findContent.length,
    });
  });
  it('should return negative on fail', () => {
    const preContent = 'fn() { ';
    const findContent = 'test1;';
    const postContent = ' test2; }';
    const content = preContent + findContent + postContent;
    const insertionPoint = findInsertionPoint(content, {
      find: 'random',
      insert: 'any',
    });
    expect(insertionPoint).toEqual({
      start: -1,
      end: -1,
    });
  });
  it('should return insertion point index with regex search', () => {
    const preContent = 'fn() { ';
    const findContent = 'test1; random \n more random strings;';
    const postContent = ' test2; }';
    const content = preContent + findContent + postContent;
    const insertionPoint = findInsertionPoint(content, {
      find: {
        regex: 'test1;.*?strings;',
        flags: 's',
      },
      insert: 'any',
    });
    expect(insertionPoint).toEqual({
      start: preContent.length,
      end: preContent.length + findContent.length,
    });
  });
  it('should return negative on fail with regex search', () => {
    const preContent = 'fn() { ';
    const findContent = 'test1; random \n more random strings;';
    const postContent = ' test2; }';
    const content = preContent + findContent + postContent;
    const insertionPoint = findInsertionPoint(content, {
      find: {
        regex: 'testrandom',
        flags: 's',
      },
      insert: 'any',
    });
    expect(insertionPoint).toEqual({
      start: -1,
      end: -1,
    });
  });
});
