import { FindType } from '../types/mod.types';

export function findInsertionPoint(
  content: string,
  finder: FindType
): { start: number; end: number } {
  if (typeof finder.find == 'string') {
    const index = content.indexOf(finder.find);
    if (index == -1)
      return {
        start: -1,
        end: -1,
      };
    return {
      start: index,
      end: index + finder.find.length,
    };
  }
  const match = new RegExp(finder.find.regex, finder.find.flags).exec(content);
  if (!match)
    return {
      start: -1,
      end: -1,
    };

  return {
    start: match.index,
    end: match.index + match[0].length,
  };
}
