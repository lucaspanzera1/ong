// Mirrors apps/web/src/lib/articles.ts#articleExcerpt — kept in sync manually
// since the web and api packages don't currently share a common lib.
export function articleExcerpt(content: string, maxLength = 160): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length <= maxLength ? plain : `${plain.slice(0, maxLength).trimEnd()}...`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
