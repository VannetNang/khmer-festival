import Link from "next/link";

const styles = {
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 14,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    display: "block",
    backgroundColor: "#14181F",
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
    color: "#2EE6A8",
    margin: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "#E8EDF2",
    margin: "6px 0 4px",
    lineHeight: 1.35,
    minHeight: "2.7em", // Fixed space for up to 2 lines
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  season: {
    fontSize: 13,
    color: "#7FD8B4",
    margin: "0 0 12px",
    minHeight: "1.3em", // Ensures missing/short seasons maintain line height
  },
  description: {
    fontSize: 14,
    color: "#B9C1CE",
    lineHeight: 1.6,
    margin: "0 0 16px",
    minHeight: "4.8em", // Fixed space for up to 3 lines
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: "auto", // Pins tag section strictly to the card bottom
  },
  tag: {
    fontSize: 12,
    color: "#97A1B3",
    backgroundColor: "#14181F",
    border: "1px solid #2E3644",
    borderRadius: 999,
    padding: "3px 11px",
  },
  source: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#7A8494",
    margin: 0,
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid #2E3644",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  sourceLabel: {
    fontWeight: 700,
    color: "#B9C1CE",
  },
  actions: {
    marginTop: 14,
  },
  explore: {
    alignSelf: "flex-start",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    padding: "9px 16px",
    borderRadius: 999,
    border: "1px solid #2EE6A8",
    color: "#2EE6A8",
    fontSize: 13,
    fontWeight: 700,
    textDecoration: "none",
  },
};

const COPY = {
  km: {
    sourceLabel: "ប្រភព៖",
    explore: "មើលលម្អិត",
  },
  en: {
    sourceLabel: "Source:",
    explore: "Explore",
  },
};

const EntryCard = ({ entry, lang, from = "home", actions }) => {
  const title = lang === "km" ? entry.titleKhmer : entry.titleEnglish;
  const description =
    lang === "km" ? entry.descriptionKhmer : entry.descriptionEnglish;
  const src = entry.imagePath.replace(/ /g, "%20");
  const t = COPY[lang] ?? COPY.en;
  const exploreHref = `/entry/${entry.id}?from=${from}`;

  return (
    <div className="card-cell" style={styles.card}>
      <img src={src} alt={title} style={styles.image} loading="lazy" />
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
        <Link href={exploreHref} style={styles.explore}>
          {t.explore}
          <span aria-hidden="true">→</span>
        </Link>
        {actions ? <div style={styles.actions}>{actions}</div> : null}
      </div>
    </div>
  );
};

export default EntryCard;
