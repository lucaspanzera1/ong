const DRAFT_KEY = 'article-draft';

export interface ArticleDraft {
  title: string;
  content: string;
  titleEn: string;
  contentEn: string;
  tags: string[];
  savedAt: string;
}

export function saveDraft(draft: Omit<ArticleDraft, 'savedAt'>) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, savedAt: new Date().toISOString() }));
}

export function loadDraft(): ArticleDraft | null {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ArticleDraft;
  } catch {
    return null;
  }
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
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
