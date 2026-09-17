const SUPERSCRIPT: Record<string, string> = {
  '-': '⁻',
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
};

// «10⁻¹⁰» из показателя степени.
export const powerOfTen = (exponent: number) =>
  `10${String(Math.round(exponent))
    .split('')
    .map((char) => SUPERSCRIPT[char] ?? char)
    .join('')}`;
