export function camelToWords(str: string): string[] {
  if (!str) return [];

  // Split before each uppercase letter, keep words intact
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // insert space before uppercase
    .split(" ") // split by space
    .map((word) => word.toLowerCase()); // optional: normalize case
}
