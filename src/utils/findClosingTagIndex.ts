export function findClosingTagIndex(
  content: string,
  methodStartIndex: number,
  tags = TagDefinitions.CURLY
): number {
  let braceCount = 1;
  let currentIndex = methodStartIndex;
  const comments = getCommentIndexes(content, tags.comment);
  const isIndexInComments = (index: number) =>
    comments.some(x => x[0] <= index && index <= x[1]);
  const openTagMatcher = new RegExp(tags.open);
  const anyTagMatcher = new RegExp(`(${tags.open}|${tags.close})`, 'msg');
  anyTagMatcher.lastIndex = currentIndex;
  while (braceCount > 0) {
    const matchNext = anyTagMatcher.exec(content);
    if (!matchNext) break;

    if (isIndexInComments(matchNext.index)) continue;
    if (openTagMatcher.test(matchNext[0])) braceCount++;
    else braceCount--;

    currentIndex = matchNext.index;
  }
  if (braceCount > 0)
    throw new Error('Could not find closing tag for method body.');
  return currentIndex;
}

function getCommentIndexes(content: string, regex: string) {
  const commentIndexes: [number, number][] = [];
  const commentMatcher = new RegExp(regex, 'msg');
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const match = commentMatcher.exec(content);
    if (!match) break;
    else {
      commentIndexes.push([match.index, match.index + match[0].length - 1]);
    }
  }
  return commentIndexes;
}
export const TagDefinitions = {
  CURLY: { open: '\\{', close: '\\}', comment: '(\\/\\/.*?$|\\/\\*.*?\\*\\/)' },
  XML: {
    open: '<(?![\\/!])[^<]+(?!\\/).>',
    close: '</.*?>',
    comment: '<!--.*?-->',
  },
};
