import { PHOTO_TYPES } from "../validation/entry.js";

// Uploads a contributed photo to the public "photos" bucket and returns its
// public URL. Follows OWASP file-upload guidance on the client side:
//   - allowlist the type (JPEG/PNG/WebP) and derive the extension from it,
//   - never trust or reuse the user-supplied file name,
//   - generate a random UUID name so uploads cannot overwrite each other,
//   - store the file under the owner's own folder: <user id>/<uuid>.<ext>.
// The bucket itself must also enforce a 5 MB limit and the same allowed MIME
// types in the Supabase dashboard, so the rule holds even if the client lies.
export async function uploadEntryPhoto(supabase, userId, file) {
  const extension = PHOTO_TYPES[file.type];
  if (!extension) {
    throw new Error("Unsupported photo type");
  }

  const path = `${userId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from("photos").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("photos").getPublicUrl(path);
  return data.publicUrl;
}
