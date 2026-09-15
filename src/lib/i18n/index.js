import km from "../../app/locales/km.js";
import en from "../../app/locales/en.js";

export const locales = { km, en };
export const defaultLang = "km";
export const supportedLangs = Object.keys(locales);

/**
 * Returns the translation dictionary for a given language,
 * falling back to the default if the lang is unknown.
 */
export function getTranslations(lang) {
  return locales[lang] ?? locales[defaultLang];
}
