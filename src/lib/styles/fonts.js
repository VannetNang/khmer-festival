// The app uses exactly two typefaces: "Inter" for Latin text and
// "Kantumruy Pro" for Khmer text. Inter ships no Khmer glyphs, so Khmer
// characters fall through to Kantumruy Pro automatically. Anything else
// falls back to a generic sans-serif — no OS-specific system fonts.
export const FONT = '"Inter", "Kantumruy Pro", sans-serif';
