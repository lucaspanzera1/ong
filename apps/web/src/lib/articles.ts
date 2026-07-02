const API_URL = import.meta.env.VITE_API_URL;

export interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export async function listArticles(): Promise<Article[]> {
  const res = await fetch(`${API_URL}/articles`);
  if (!res.ok) throw new Error('Falha ao carregar artigos');
  return res.json();
}

export async function getArticle(slug: string): Promise<Article> {
  const res = await fetch(`${API_URL}/articles/${slug}`);
  if (!res.ok) throw new Error('Artigo não encontrado');
  return res.json();
}

export async function createArticle(title: string, content: string, tags: string[]): Promise<Article> {
  const res = await fetch(`${API_URL}/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ title, content, tags }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? 'Falha ao criar artigo');
  }
  return res.json();
}
