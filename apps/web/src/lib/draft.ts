const DRAFT_KEY_PREFIX = 'article-draft';

export interface ArticleDraft {
  title: string;
  content: string;
  titleEn: string;
  contentEn: string;
  tags: string[];
  savedAt: string;
}

// `id` is the article slug being edited, or 'new' for the create flow — keeping
// drafts per-article avoids one article's autosave clobbering another's.
function draftKey(id: string) {
  return `${DRAFT_KEY_PREFIX}:${id}`;
}

export function saveDraft(id: string, draft: Omit<ArticleDraft, 'savedAt'>) {
  localStorage.setItem(draftKey(id), JSON.stringify({ ...draft, savedAt: new Date().toISOString() }));
}

export function loadDraft(id: string): ArticleDraft | null {
  const raw = localStorage.getItem(draftKey(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ArticleDraft;
  } catch {
    return null;
  }
}

export function clearDraft(id: string) {
  localStorage.removeItem(draftKey(id));
}

export function isDraftEmpty(draft: Omit<ArticleDraft, 'savedAt'>): boolean {
  return (
    !draft.title.trim() &&
    !draft.content.trim() &&
    !draft.titleEn.trim() &&
    !draft.contentEn.trim() &&
    draft.tags.length === 0
  );
}

export function draftMatches(
  draft: Omit<ArticleDraft, 'savedAt'>,
  other: Omit<ArticleDraft, 'savedAt'> | null,
): boolean {
  if (!other) return false;
  return (
    draft.title === other.title &&
    draft.content === other.content &&
    draft.titleEn === other.titleEn &&
    draft.contentEn === other.contentEn &&
    draft.tags.length === other.tags.length &&
    draft.tags.every((t, i) => t === other.tags[i])
  );
}
