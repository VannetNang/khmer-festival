"use client";

import { useRouter } from "next/navigation";
import ExploreButton from "./ExploreButton.js";

const styles = {
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    overflow: "hidden",
    width: "100%",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    display: "block",
    backgroundColor: "var(--bg)",
  },
  // Wraps the photo so an optional badge (e.g. review status) can sit on top.
  imageWrap: {
    position: "relative",
  },
  topRight: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
    display: "flex",
    justifyContent: "flex-end",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: "20px 22px 22px",
  },
  category: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "var(--accent-text)",
    margin: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "var(--text)",
    margin: "6px 0 4px",
    lineHeight: 1.35,
    minHeight: "1.35em", // Fixed single-line height keeps every card uniform
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  season: {
    fontSize: 13,
    color: "var(--season)",
    margin: "0 0 12px",
    minHeight: "1.3em", // Ensures missing/short seasons maintain line height
  },
  description: {
    fontSize: 14,
    color: "var(--text-muted)",
    lineHeight: 1.6,
    margin: "0 0 16px",
    minHeight: "4.8em", // Fixed space for up to 3 lines
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    // Long unspaced English strings (e.g. a pasted URL) must wrap instead of
    // bursting out of the card.
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: "auto", // Pins tag section strictly to the card bottom
  },
  tag: {
    fontSize: 12,
    color: "var(--text-dim)",
    backgroundColor: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: 999,
    padding: "3px 11px",
  },
  source: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "var(--text-faint)",
    margin: 0,
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid var(--border)",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  sourceLabel: {
    fontWeight: 700,
    color: "var(--text-muted)",
  },
  actions: {
    marginTop: 14,
  },
};

const COPY = {
  km: {
    sourceLabel: "ប្រភព៖",
  },
  en: {
    sourceLabel: "Source:",
  },
};

const EntryCard = ({ entry, lang, from = "home", actions, topRight }) => {
  const router = useRouter();
  const title = lang === "km" ? entry.titleKhmer : entry.titleEnglish;
  const description =
    lang === "km" ? entry.descriptionKhmer : entry.descriptionEnglish;
  const src = entry.imagePath.replace(/ /g, "%20");
  const t = COPY[lang] ?? COPY.en;

  // The whole card opens the detail view, not just the "Explore More" button.
  // Inner controls (Explore, Edit, Delete, confirm dialog) call
  // event.stopPropagation() so their own clicks never bubble up to here.
  const openEntry = () => router.push(`/entry/${entry.id}?from=${from}`);

  const handleKeyDown = (event) => {
    // Only react to keys pressed on the card itself, never on a child button.
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openEntry();
    }
  };

  return (
    <div
      className="card-cell entry-card"
      style={styles.card}
      role="link"
      tabIndex={0}
      onClick={openEntry}
      onKeyDown={handleKeyDown}
    >
      <div style={styles.imageWrap}>
        <img src={src} alt={title} style={styles.image} loading="lazy" />
        {topRight ? <div style={styles.topRight}>{topRight}</div> : null}
      </div>
      <div style={styles.body}>
        <p style={styles.category}>{entry.category}</p>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.season}>{entry.seasonOrMonth}</p>
        <p style={styles.description}>{description}</p>
        <div style={styles.tags}>
          {entry.tags.map((tag) => (
            <span key={tag} style={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        {entry.source && (
          <p style={styles.source}>
            <span style={styles.sourceLabel}>{t.sourceLabel}</span>{" "}
            {entry.source}
          </p>
        )}
        <ExploreButton entryId={entry.id} from={from} lang={lang} />
        {actions ? <div style={styles.actions}>{actions}</div> : null}
      </div>
    </div>
  );
};

export default EntryCard;
