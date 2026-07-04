const API_URL = import.meta.env.VITE_API_URL;

export interface About {
  content: string;
  contentEn?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AboutUpdate {
  content?: string;
  contentEn?: string;
}

export function aboutBody(about: About, lang: 'EN' | 'PT'): string {
  return lang === 'EN' && about.contentEn ? about.contentEn : about.content;
}

export async function getAbout(): Promise<About> {
  const res = await fetch(`${API_URL}/about`);
  if (!res.ok) throw new Error('Falha ao carregar a página about');
  return res.json();
}

export async function updateAbout(updates: AboutUpdate): Promise<About> {
  const res = await fetch(`${API_URL}/about`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? 'Falha ao atualizar a página about');
  }
  return res.json();
}
