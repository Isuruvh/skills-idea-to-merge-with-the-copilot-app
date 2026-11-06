import assert from 'node:assert/strict';
import test from 'node:test';
import { formatBookmark, loadBookmarks, normalizeBookmarkUrl } from './bookmarks.mjs';

test('normalizes a URL with or without https:// to the same value', () => {
  assert.equal(
    normalizeBookmarkUrl('www.example.com/path'),
    normalizeBookmarkUrl('https://www.example.com/path'),
  );
});

test('recovers gracefully from empty, corrupted, legacy, and non-array storage values', () => {
  for (const value of [
    '',
    null,
    undefined,
    '{corrupted',
    '{"url":"https://example.com","slug":"mona-7fk2"}',
    '{"version":1,"bookmarks":[]}',
    '42',
    'null',
  ]) {
    assert.doesNotThrow(() => loadBookmarks(value));
    assert.deepEqual(loadBookmarks(value), []);
  }
});

test('drops malformed entries while loading a bookmark array', () => {
  assert.deepEqual(
    loadBookmarks(JSON.stringify([
      { url: 'https://www.example.com', slug: 'mona-7fk2' },
      { url: 'javascript:alert(1)', slug: 'mona-nope' },
      { url: 'https://example.org', slug: 'legacy-slug' },
      null,
    ])),
    [{ url: 'https://www.example.com/', slug: 'mona-7fk2' }],
  );
});

test('formats a saved bookmark with the exact separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});
