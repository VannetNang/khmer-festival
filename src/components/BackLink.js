"use client";

import Link from "next/link";
import { getTranslations } from "../lib/i18n/index.js";

const FONT =
  "'Kantumruy Pro', 'Inter', 'Noto Sans Khmer', system-ui, -apple-system, sans-serif";

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

export default function BackLink({ lang, href = "/" }) {
  const t = getTranslations(lang).common;

  return (
    <Link href={href} style={STYLES.link}>
      <span aria-hidden="true">←</span>
      {t.back}
    </Link>
  );
}
