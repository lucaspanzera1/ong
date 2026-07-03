const API_URL = import.meta.env.VITE_API_URL;

export type ArticleStatus = 'published' | 'archived';

export interface Article {
  _id: string;
  title: string;
  titleEn?: string;
  slug: string;
  content: string;
  contentEn?: string;
  tags: string[];
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleUpdate {
  title?: string;
  content?: string;
  titleEn?: string;
  contentEn?: string;
  tags?: string[];
  status?: ArticleStatus;
}

export function articleTitle(article: Article, lang: 'EN' | 'PT'): string {
  return lang === 'EN' && article.titleEn ? article.titleEn : article.title;
}

export function articleBody(article: Article, lang: 'EN' | 'PT'): string {
  return lang === 'EN' && article.contentEn ? article.contentEn : article.content;
}

export async function listArticles(): Promise<Article[]> {
  const res = await fetch(`${API_URL}/articles`);
  if (!res.ok) throw new Error('Falha ao carregar artigos');
  return res.json();
}

export async function listArticlesForAdmin(): Promise<Article[]> {
  const res = await fetch(`${API_URL}/articles/admin/all`, { credentials: 'include' });
  if (!res.ok) throw new Error('Falha ao carregar artigos');
  return res.json();
}

export async function getArticle(slug: string): Promise<Article> {
  const res = await fetch(`${API_URL}/articles/${slug}`);
  if (!res.ok) throw new Error('Artigo não encontrado');
  return res.json();
}

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

export async function createArticle(
  title: string,
  content: string,
  tags: string[],
  titleEn?: string,
  contentEn?: string,
): Promise<Article> {
  const res = await fetch(`${API_URL}/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ title, content, tags, titleEn, contentEn }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? 'Falha ao criar artigo');
  }
  return res.json();
}

export async function updateArticle(slug: string, updates: ArticleUpdate): Promise<Article> {
  const res = await fetch(`${API_URL}/articles/${slug}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? 'Falha ao atualizar artigo');
  }
  return res.json();
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/uploads`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? 'Falha ao fazer upload da imagem');
  }

  const data = await res.json();
  return `${API_URL}${data.url}`;
}
