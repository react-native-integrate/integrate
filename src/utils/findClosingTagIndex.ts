export function findClosingTagIndex(
  content: string,
  methodStartIndex: number,
  tags = TagDefinitions.CURLY
): number {
  let braceCount = 1;
  let currentIndex = methodStartIndex;
  const strippedContent = stripNonCode(content, tags.comment);
  const openTagMatcher = new RegExp(tags.open);
  const anyTagMatcher = new RegExp(`(${tags.open}|${tags.close})`, 'msg');
  anyTagMatcher.lastIndex = currentIndex;
  while (braceCount > 0) {
    const matchNext = anyTagMatcher.exec(strippedContent);
    if (!matchNext) break;

    if (openTagMatcher.test(matchNext[0])) braceCount++;
    else braceCount--;

    currentIndex = matchNext.index;
  }
  if (braceCount > 0)
    throw new Error('Could not find closing tag for method body.');
  return currentIndex;
}

export function stripNonCode(content: string, regex: string) {
  const nonCodeMatcher = new RegExp(`(${regex}|${stringRegex})`, 'msg');
  return content.replace(nonCodeMatcher, m => ' '.repeat(m.length));
}

// eslint-disable-next-line quotes
const stringRegex = `"(?:\\\\.|[^\\\\"])*"|'(?:\\\\.|[^\\\\'])*'`;
export const TagDefinitions = {
  CURLY: { open: '\\{', close: '\\}', comment: '(\\/\\/.*?$|\\/\\*.*?\\*\\/)' },
  XML: {
    open: '<(?![\\/!])[^<]+(?!\\/).>',
    close: '</.*?>',
    comment: '<!--.*?-->',
  },
  POD: {
    open: '\\b(do\\b(\\s\\|.*?\\|)?|(?<!end )if\\b)',
    close: '\\bend(\\sif)?\\b',
    comment: '(#.*?$|=begin.*?=end)',
  },
  BRACKETS: {
    open: '\\[',
    close: '\\]',
    comment: '(\\/\\/.*?$|\\/\\*.*?\\*\\/)',
  },
};
