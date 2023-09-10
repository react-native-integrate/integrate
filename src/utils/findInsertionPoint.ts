import { TextOrRegex } from '../types/mod.types';
import { getText } from '../variables';

export function findInsertionPoint(
  content: string,
  textOrRegex: TextOrRegex
): { start: number; end: number; match: string | null } {
  if (typeof textOrRegex == 'string') {
    textOrRegex = getText(textOrRegex);
    const index = content.indexOf(textOrRegex);
    if (index == -1)
      return {
        start: -1,
        end: -1,
        match: null,
      };
    return {
      start: index,
      end: index + textOrRegex.length,
      match: textOrRegex,
    };
  }
  const match = new RegExp(getText(textOrRegex.regex), textOrRegex.flags).exec(
    content
  );
  if (!match)
    return {
      start: -1,
      end: -1,
      match: null,
    };

  return {
    start: match.index,
    end: match.index + match[0].length,
    match: match[0],
  };
}
