export function stringSplice(
  text: string,
  idx: number,
  rem: number,
  str: string
): string {
  return text.slice(0, idx) + str + text.slice(idx + Math.abs(rem));
}
