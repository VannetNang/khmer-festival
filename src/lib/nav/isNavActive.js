// Shared sidebar / bottom-nav active check. The entry edit screen lives inside
// the Dashboard (profile) context, so "Dashboard" stays highlighted while the
// user is editing one of their entries.
const ENTRY_EDIT = /^\/entry\/[^/]+\/edit\/?$/;

export function isNavActive(pathname, href) {
  if (href === "/") return pathname === "/";
  if (href === "/profile" && ENTRY_EDIT.test(pathname)) return true;
  return pathname.startsWith(href);
}
