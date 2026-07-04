const API_URL = import.meta.env.VITE_API_URL;

export interface Tag {
  _id: string;
  name: string;
  nameEn?: string;
  icon: string;
  parentId?: string | null;
  order: number;
}

export interface TagNode extends Tag {
  children: TagNode[];
}

export async function listTags(): Promise<Tag[]> {
  const res = await fetch(`${API_URL}/tags`);
  if (!res.ok) throw new Error('Falha ao carregar tags');
  return res.json();
}

export async function createTag(
  name: string,
  icon: string,
  nameEn?: string,
  parentId?: string | null,
): Promise<Tag> {
  const res = await fetch(`${API_URL}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, icon, nameEn, parentId: parentId ?? null }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? 'Falha ao criar tag');
  }
  return res.json();
}

export async function updateTag(
  id: string,
  updates: { nameEn?: string; parentId?: string | null },
): Promise<Tag> {
  const res = await fetch(`${API_URL}/tags/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? 'Falha ao atualizar tag');
  }
  return res.json();
}

export async function reorderTags(
  parentId: string | null,
  order: string[],
): Promise<void> {
  const res = await fetch(`${API_URL}/tags/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ parentId, order }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? 'Falha ao reordenar tags');
  }
}

export function tagName(tag: Tag, lang: 'EN' | 'PT'): string {
  return lang === 'EN' && tag.nameEn ? tag.nameEn : tag.name;
}

export function translateTagLabel(tags: Tag[], name: string, lang: 'EN' | 'PT'): string {
  if (lang !== 'EN') return name;
  const match = tags.find(t => t.name === name);
  return match?.nameEn || name;
}

export function buildTagTree(tags: Tag[]): TagNode[] {
  const byId = new Map<string, TagNode>();
  tags.forEach(t => byId.set(t._id, { ...t, children: [] }));

  const roots: TagNode[] = [];
  byId.forEach(node => {
    const parent = node.parentId ? byId.get(node.parentId) : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortRec = (nodes: TagNode[]) => {
    nodes.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
    nodes.forEach(n => sortRec(n.children));
  };
  sortRec(roots);

  return roots;
}

export function flattenTagTree(nodes: TagNode[]): Array<{ tag: Tag; depth: number }> {
  const result: Array<{ tag: Tag; depth: number }> = [];
  const walk = (list: TagNode[], depth: number) => {
    for (const { children, ...tag } of list) {
      result.push({ tag, depth });
      walk(children, depth + 1);
    }
  };
  walk(nodes, 0);
  return result;
}

export function primaryTagInfo(
  articleTagNames: string[],
  tags: Tag[],
  lang: 'EN' | 'PT',
): { name: string; icon: string } | null {
  const first = articleTagNames
    .map(name => tags.find(t => t.name === name))
    .find((t): t is Tag => Boolean(t));
  if (!first) return null;

  const parent = first.parentId ? tags.find(t => t._id === first.parentId) : undefined;
  const primary = parent ?? first;
  return { name: tagName(primary, lang), icon: primary.icon };
}

export function getDescendantIds(tagId: string, tags: Tag[]): Set<string> {
  const ids = new Set<string>();
  const children = tags.filter(t => t.parentId === tagId);
  for (const child of children) {
    ids.add(child._id);
    getDescendantIds(child._id, tags).forEach(id => ids.add(id));
  }
  return ids;
}
