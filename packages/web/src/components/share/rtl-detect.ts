/**
 * Detects if text contains RTL language (Arabic or Hebrew)
 * @param text - The text to check
 * @param threshold - Percentage threshold of RTL characters (default: 0.15 = 15%)
 * @returns true if the text contains enough RTL characters
 */
export function detectRTLLanguage(text: string, threshold: number = 0.15): boolean {
  // Arabic: U+0600–U+06FF
  // Hebrew: U+0590–U+05FF
  const rtlChars = text.match(/[؀-ۿ֐-׿]/g) || []
  const totalChars = text.length
  return totalChars > 0 && rtlChars.length / totalChars > threshold
}
