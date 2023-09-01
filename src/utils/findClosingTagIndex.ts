export function findClosingTagIndex(
  content: string,
  methodStartIndex: number
): number {
  let braceCount = 1;
  let currentIndex = methodStartIndex;

  while (braceCount > 0 && currentIndex < content.length) {
    if (content[currentIndex] === '{') {
      braceCount++;
    } else if (content[currentIndex] === '}') {
      braceCount--;
    }
    currentIndex++;
  }
  if (braceCount > 0)
    throw new Error('Could not find closing tag for method body.');
  return currentIndex - 1;
}
