import type { Direction } from '../types';

/**
 * Detects whether text should be rendered as RTL (right-to-left) or LTR (left-to-right).
 * 
 * Supports detection of:
 * - Arabic script (U+0600 to U+06FF, U+0750 to U+077F, U+FB50 to U+FDFF, U+FE70 to U+FEFF)
 * - Hebrew script (U+0590 to U+05FF)
 * - Persian/Farsi (subset of Arabic)
 * - Urdu (subset of Arabic)
 * 
 * @param text - The text to analyze
 * @param threshold - Percentage threshold (0-1) of RTL characters to consider the text RTL. Default: 0.4
 * @returns 'rtl' if text is predominantly right-to-left, 'ltr' otherwise
 */
export function detectDirection(text: string, threshold: number = 0.4): Direction {
    if (!text || text.trim().length === 0) {
        return 'ltr';
    }

    // Unicode ranges for RTL scripts
    const rtlRanges = [
        // Arabic
        /[\u0600-\u06FF]/g,
        // Arabic Supplement
        /[\u0750-\u077F]/g,
        // Arabic Extended-A
        /[\u08A0-\u08FF]/g,
        // Arabic Presentation Forms-A
        /[\uFB50-\uFDFF]/g,
        // Arabic Presentation Forms-B
        /[\uFE70-\uFEFF]/g,
        // Hebrew
        /[\u0590-\u05FF]/g,
        // Syriac
        /[\u0700-\u074F]/g,
        // Thaana (Maldivian)
        /[\u0780-\u07BF]/g,
    ];

    // Count RTL characters
    let rtlCount = 0;
    for (const range of rtlRanges) {
        const matches = text.match(range);
        if (matches) {
            rtlCount += matches.length;
        }
    }

    // Count all alphabetic characters (excluding numbers, punctuation, whitespace)
    const alphaMatches = text.match(/[a-zA-Z\u0600-\u06FF\u0590-\u05FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g);
    const totalAlpha = alphaMatches ? alphaMatches.length : 0;

    if (totalAlpha === 0) {
        return 'ltr';
    }

    const rtlPercentage = rtlCount / totalAlpha;
    return rtlPercentage >= threshold ? 'rtl' : 'ltr';
}

/**
 * Checks if a single character is an RTL character.
 * 
 * @param char - Single character to check
 * @returns true if the character is RTL
 */
export function isRTLChar(char: string): boolean {
    if (!char || char.length !== 1) {
        return false;
    }

    const code = char.charCodeAt(0);

    // Arabic
    if (code >= 0x0600 && code <= 0x06FF) return true;
    // Arabic Supplement
    if (code >= 0x0750 && code <= 0x077F) return true;
    // Arabic Extended-A
    if (code >= 0x08A0 && code <= 0x08FF) return true;
    // Hebrew
    if (code >= 0x0590 && code <= 0x05FF) return true;
    // Syriac
    if (code >= 0x0700 && code <= 0x074F) return true;
    // Thaana
    if (code >= 0x0780 && code <= 0x07BF) return true;

    return false;
}

/**
 * Gets the first strong directional character from text.
 * This is useful for determining the base direction of mixed-content text.
 * 
 * @param text - The text to analyze
 * @returns 'rtl' | 'ltr' | null if no strong directional character found
 */
export function getFirstStrongDirection(text: string): Direction | null {
    for (const char of text) {
        // Skip whitespace, numbers, and common punctuation
        if (/[\s\d.,!?;:'"\-_()[\]{}]/.test(char)) {
            continue;
        }

        if (isRTLChar(char)) {
            return 'rtl';
        }

        // Check if it's a Latin character
        if (/[a-zA-Z]/.test(char)) {
            return 'ltr';
        }
    }

    return null;
}
