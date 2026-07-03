const API_URL = import.meta.env.VITE_API_URL;

export interface Tag {
  _id: string;
  name: string;
  nameEn?: string;
  icon: string;
}

export async function listTags(): Promise<Tag[]> {
  const res = await fetch(`${API_URL}/tags`);
  if (!res.ok) throw new Error('Falha ao carregar tags');
  return res.json();
}

export async function createTag(name: string, icon: string, nameEn?: string): Promise<Tag> {
  const res = await fetch(`${API_URL}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, icon, nameEn }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? 'Falha ao criar tag');
  }
  return res.json();
}

export async function updateTag(id: string, nameEn: string): Promise<Tag> {
  const res = await fetch(`${API_URL}/tags/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ nameEn }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? 'Falha ao atualizar tag');
  }
  return res.json();
}

export function tagName(tag: Tag, lang: 'EN' | 'PT'): string {
  return lang === 'EN' && tag.nameEn ? tag.nameEn : tag.name;
}

export function translateTagLabel(tags: Tag[], name: string, lang: 'EN' | 'PT'): string {
  if (lang !== 'EN') return name;
  const match = tags.find(t => t.name === name);
  return match?.nameEn || name;
}
