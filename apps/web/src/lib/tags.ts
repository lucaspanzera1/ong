const API_URL = import.meta.env.VITE_API_URL;

export interface Tag {
  _id: string;
  name: string;
  icon: string;
}

export async function listTags(): Promise<Tag[]> {
  const res = await fetch(`${API_URL}/tags`);
  if (!res.ok) throw new Error('Falha ao carregar tags');
  return res.json();
}

export async function createTag(name: string, icon: string): Promise<Tag> {
  const res = await fetch(`${API_URL}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, icon }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? 'Falha ao criar tag');
  }
  return res.json();
}
