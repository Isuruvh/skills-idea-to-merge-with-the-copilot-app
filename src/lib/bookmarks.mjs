export function normalizeBookmarkUrl(value) {
  if (typeof value !== 'string') return null;

  const input = value.trim();
  if (!input) return null;

  const candidate = input.startsWith('//')
    ? `https:${input}`
    : /^https?:/i.test(input) || /^[a-z][a-z\d+.-]*:\/\//i.test(input)
      ? input
      : `https://${input}`;

  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function loadBookmarks(rawValue) {
  if (typeof rawValue !== 'string' || rawValue.length === 0) return [];

  let parsed;
  try {
    parsed = JSON.parse(rawValue);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  return parsed.flatMap((entry) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return [];

    const url = normalizeBookmarkUrl(entry.url);
    if (!url || typeof entry.slug !== 'string' || !/^mona-[a-zA-Z0-9]+$/.test(entry.slug)) return [];

    return [{ url, slug: entry.slug }];
  });
}

export function formatBookmark(bookmark) {
  return `${bookmark.url} :: ${bookmark.slug}`;
}
