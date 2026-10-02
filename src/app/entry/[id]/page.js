import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server.js";
import BackLink from "../../../components/BackLink.js";

// Read-only detail view for a single entry. This is the page a contributor
// lands on after saving, and it is public like the rest of the archive.
const FONT =
  "'Kantumruy Pro', 'Inter', 'Noto Sans Khmer', system-ui, -apple-system, sans-serif";

const STYLES = {
  main: {
    minHeight: "100vh",
    backgroundColor: "#14181F",
    color: "#E8EDF2",
    fontFamily: FONT,
    padding: "24px",
  },
  wrap: { maxWidth: 760, margin: "0 auto" },
  card: {
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    display: "block",
    backgroundColor: "#14181F",
  },
  body: { padding: "28px 32px 32px" },
  category: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#2EE6A8",
    margin: 0,
  },
  titleKhmer: { fontSize: 26, fontWeight: 700, margin: "10px 0 2px", lineHeight: 1.4 },
  titleEnglish: { fontSize: 18, fontWeight: 600, color: "#B9C1CE", margin: "0 0 12px" },
  meta: { fontSize: 13, color: "#7FD8B4", margin: "0 0 20px" },
  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#97A1B3",
    margin: "0 0 6px",
  },
  paragraph: { fontSize: 15, lineHeight: 1.7, color: "#E8EDF2", margin: "0 0 10px" },
  paragraphEn: { fontSize: 14, lineHeight: 1.7, color: "#B9C1CE", margin: 0 },
  tags: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 },
  tag: {
    fontSize: 12,
    color: "#97A1B3",
    backgroundColor: "#14181F",
    border: "1px solid #2E3644",
    borderRadius: 999,
    padding: "3px 11px",
  },
  source: {
    fontSize: 13,
    lineHeight: 1.6,
    color: "#B9C1CE",
    borderTop: "1px solid #2E3644",
    paddingTop: 16,
    margin: 0,
  },
};

export default async function EntryPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: entry, error } = await supabase
    .from("archive_entries")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !entry) notFound();

  const tags = entry.tags ?? [];

  return (
    <main style={STYLES.main}>
      <div style={STYLES.wrap}>
        <BackLink lang="en" />
        <article style={STYLES.card}>
          {entry.image_path ? (
            <img
              src={entry.image_path}
              alt={entry.title_english}
              style={STYLES.image}
            />
          ) : null}
          <div style={STYLES.body}>
            <p style={STYLES.category}>{entry.category}</p>
            <h1 style={STYLES.titleKhmer} lang="km">
              {entry.title_khmer}
            </h1>
            <p style={STYLES.titleEnglish}>{entry.title_english}</p>
            <p style={STYLES.meta}>{entry.season_or_month}</p>

            <div style={STYLES.section}>
              <p style={STYLES.sectionLabel}>Khmer</p>
              <p style={STYLES.paragraph} lang="km">
                {entry.description_khmer}
              </p>
            </div>

            <div style={STYLES.section}>
              <p style={STYLES.sectionLabel}>English</p>
              <p style={STYLES.paragraphEn}>{entry.description_english}</p>
            </div>

            {tags.length > 0 ? (
              <div style={STYLES.section}>
                <p style={STYLES.sectionLabel}>Tags</p>
                <div style={STYLES.tags}>
                  {tags.map((tag) => (
                    <span key={tag} style={STYLES.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <p style={STYLES.source}>Source: {entry.source}</p>
          </div>
        </article>
      </div>
    </main>
  );
}
