import { getTranslations } from "../lib/i18n/index.js";
import { FONT } from "../lib/styles/fonts.js";

// Colours are chosen to read clearly on both light and dark themes. published
// and returned reuse the archive's existing season/danger tokens.
const PALETTE = {
  pending: {
    color: "#d97706",
    background: "rgba(217, 119, 6, 0.12)",
    border: "rgba(217, 119, 6, 0.5)",
  },
  published: {
    color: "var(--season)",
    background: "rgba(46, 230, 168, 0.12)",
    border: "rgba(46, 230, 168, 0.5)",
  },
  returned: {
    color: "var(--danger)",
    background: "var(--danger-soft)",
    border: "var(--danger-border-strong)",
  },
};

const STYLES = {
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.3,
    padding: "4px 10px",
    borderRadius: 999,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    backgroundColor: "currentColor",
    flexShrink: 0,
  },
};

// A small pill that shows an entry's review status in plain words, in the
// current UI language. Unknown statuses fall back to the raw database value.
const EntryStatusBadge = ({ status, lang }) => {
  const labels = getTranslations(lang).myEntries.status;
  const label = labels[status] ?? status;
  const palette = PALETTE[status] ?? PALETTE.pending;

  return (
    <span
      style={{ ...STYLES.badge, ...palette }}
      role="status"
      aria-label={label}
    >
      <span style={STYLES.dot} />
      {label}
    </span>
  );
};

export default EntryStatusBadge;
