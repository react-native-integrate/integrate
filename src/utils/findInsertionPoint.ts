import { FindType } from '../types/mod.types';

export function findInsertionPoint(
  content: string,
  finder: FindType
): { start: number; end: number; match: string | null } {
  if (typeof finder.find == 'string') {
    const index = content.indexOf(finder.find);
    if (index == -1)
      return {
        start: -1,
        end: -1,
        match: null,
      };
    return {
      start: index,
      end: index + finder.find.length,
      match: finder.find,
    };
  }
  const match = new RegExp(finder.find.regex, finder.find.flags).exec(content);
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
