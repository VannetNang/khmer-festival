"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getTranslations } from "../lib/i18n/index.js";
import Spinner from "./Spinner.js";

// Explore button on every entry card. Shows an instant loading state and blocks
// double clicks while navigating to the entry detail view.
const ExploreButton = ({ entryId, from, lang }) => {
  const router = useRouter();
  const t = getTranslations(lang).entry;
  const [loading, setLoading] = useState(false);
  const href = `/entry/${entryId}?from=${from}`;

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    router.push(href);
  };

  return (
    <button
      type="button"
      className="explore-btn"
      onClick={handleClick}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? <Spinner /> : null}
      {loading ? t.opening : t.explore}
      {loading ? null : <span aria-hidden="true">→</span>}
    </button>
  );
};

export default ExploreButton;
