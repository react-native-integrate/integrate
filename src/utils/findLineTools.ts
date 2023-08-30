export function findLineStart(
  content: string,
  characterIndex: number,
  minIndex?: number
): number {
  minIndex = Math.max(minIndex ?? 0, 0);
  let lineStart = characterIndex;

  while (lineStart > minIndex && content[lineStart] !== '\n') {
    lineStart--;
  }

  return content[lineStart] === '\n' ? lineStart + 1 : lineStart;
}

export function findLineEnd(
  content: string,
  characterIndex: number,
  maxIndex?: number
): number {
  maxIndex = Math.min(maxIndex ?? content.length - 1, content.length - 1);
  let lineStart = characterIndex;

  while (lineStart < maxIndex && content[lineStart] !== '\n') {
    lineStart++;
  }

  return lineStart;
}
