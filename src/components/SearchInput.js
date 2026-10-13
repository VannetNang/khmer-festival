"use client";

import { useRef } from "react";
import { FONT } from "../lib/styles/fonts.js";

const styles = {
  wrap: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  input: {
    width: "100%",
    maxWidth: 520,
    padding: "12px 20px",
    fontSize: 15,
    fontFamily: FONT,
    borderRadius: 999,
    border: "1px solid var(--border-strong)",
    backgroundColor: "var(--hero-input-bg)",
    color: "var(--hero-text)",
    outline: "none",
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
    boxSizing: "border-box",
  },
};

// The home hero search box.
// Khmer — like every IME script — assembles a word from several keystrokes:
// base letters, subscripts and combining marks only settle when composition
// ends. The text stays in a controlled input so it never desyncs from the DOM,
// but we only report a new search term to the archive once the IME is done.
// That way the result list is never re-filtered mid-word and character
// combination / subscript rendering is never interrupted.
const SearchInput = ({ value, placeholder, onChange, onSearch }) => {
  const composingRef = useRef(false);

  const handleChange = (event) => {
    onChange(event.target.value);
    if (!composingRef.current) onSearch(event.target.value);
  };

  const handleCompositionStart = () => {
    composingRef.current = true;
  };

  const handleCompositionEnd = (event) => {
    composingRef.current = false;
    onChange(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div style={styles.wrap}>
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        style={styles.input}
        aria-label={placeholder}
      />
    </div>
  );
};

export default SearchInput;
