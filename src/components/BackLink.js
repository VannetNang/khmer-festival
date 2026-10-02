"use client";

import Link from "next/link";
import { FONT } from "../lib/styles/fonts.js";
import { useLanguage } from "../lib/i18n/LanguageProvider.js";
import { getTranslations } from "../lib/i18n/index.js";

const STYLES = {
  link: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 600,
    color: "#97A1B3",
    textDecoration: "none",
    marginBottom: 20,
  },
};

export default function BackLink({ href = "/" }) {
  const { lang } = useLanguage();
  const t = getTranslations(lang).common;

  return (
    <Link href={href} style={STYLES.link}>
      <span aria-hidden="true">←</span>
      {t.back}
    </Link>
  );
}
