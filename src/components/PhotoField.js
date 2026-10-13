"use client";

import { useEffect, useRef, useState } from "react";
import EntryFormField from "./EntryFormField.js";

const styles = {
  preview: {
    display: "block",
    width: "100%",
    maxWidth: 280,
    aspectRatio: "16 / 9",
    objectFit: "cover",
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid var(--border)",
    backgroundColor: "var(--bg)",
  },
};

// The photo picker, with a live thumbnail.
// It shows the entry's current image when editing, or a preview of the file
// just chosen. `accept="image/*"` lets mobile browsers offer the camera or the
// photo library instead of a desktop-only file dialog.
const PhotoField = ({ t, error, hint, existingPhotoUrl, onSelect }) => {
  const [preview, setPreview] = useState(existingPhotoUrl ?? null);
  const urlRef = useRef(null);

  // Object URLs created for previews must be released again.
  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  const handleChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    onSelect(file);

    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      urlRef.current = objectUrl;
      setPreview(objectUrl);
    } else {
      // Nothing chosen: keep the photo already saved on the entry.
      setPreview(existingPhotoUrl ?? null);
    }
  };

  return (
    <EntryFormField id="photo" label={t.fields.photo} error={error} hint={hint}>
      {preview ? (
        <img src={preview} alt={t.currentPhoto} style={styles.preview} />
      ) : null}
      <input
        id="photo"
        className="c-input"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
    </EntryFormField>
  );
};

export default PhotoField;
