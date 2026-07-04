import { useEffect, useMemo, useState } from 'react';
import {
  buildTagTree,
  createTag,
  flattenTagTree,
  getDescendantIds,
  listTags,
  reorderTags,
  updateTag,
  type Tag,
  type TagNode,
} from '../lib/tags';
import { IconPicker } from './IconPicker';

export function TagManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [icon, setIcon] = useState('');
  const [parentId, setParentId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [iconPickerKey, setIconPickerKey] = useState(0);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    listTags().then(setTags).catch(() => {});
  }, []);

  const tree = useMemo(() => buildTagTree(tags), [tags]);
  const flatOptions = useMemo(() => flattenTagTree(tree), [tree]);

  async function handleCreateTag(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !icon) {
      setError('Preencha o nome e escolha um ícone.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const tag = await createTag(name.trim(), icon, nameEn.trim() || undefined, parentId || null);
      setTags(prev => [...prev, tag]);
      setName('');
      setNameEn('');
      setIcon('');
      setParentId('');
      setIconPickerKey(k => k + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar tag');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveNameEn(tag: Tag, value: string) {
    const trimmed = value.trim();
    if (trimmed === (tag.nameEn ?? '')) return;
    try {
      const updated = await updateTag(tag._id, { nameEn: trimmed });
      setTags(prev => prev.map(t => (t._id === tag._id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar tradução da tag');
    }
  }

  async function handleChangeParent(tag: Tag, newParentId: string) {
    const resolved = newParentId || null;
    if ((tag.parentId ?? null) === resolved) return;
    try {
      const updated = await updateTag(tag._id, { parentId: resolved });
      setTags(prev => prev.map(t => (t._id === tag._id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao mover tag');
    }
  }

  async function handleDrop(target: Tag, siblings: Tag[]) {
    const sourceId = draggedId;
    setDraggedId(null);
    if (!sourceId || sourceId === target._id) return;

    const dragged = tags.find(t => t._id === sourceId);
    if (!dragged) return;

    const sameGroup = (dragged.parentId ?? null) === (target.parentId ?? null);

    if (!sameGroup) {
      try {
        const updated = await updateTag(dragged._id, { parentId: target.parentId ?? null });
        setTags(prev => prev.map(t => (t._id === updated._id ? updated : t)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha ao mover tag');
      }
      return;
    }

    const ids = siblings.map(s => s._id);
    const from = ids.indexOf(dragged._id);
    const to = ids.indexOf(target._id);
    if (from === -1 || to === -1) return;
    ids.splice(from, 1);
    ids.splice(to, 0, dragged._id);

    setTags(prev => {
      const orderById = new Map(ids.map((id, index) => [id, index]));
      return prev.map(t => (orderById.has(t._id) ? { ...t, order: orderById.get(t._id)! } : t));
    });

    try {
      await reorderTags(target.parentId ?? null, ids);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao reordenar tags');
    }
  }

  return (
    <section className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-2xl">style</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Gerenciamento de Tags</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Crie e organize as tags para categorizar seus projetos.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
           <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
           <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">{tags.length} tags cadastradas</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-10">
        <div className="order-2 lg:order-1">
          <form onSubmit={handleCreateTag} className="flex flex-col gap-5 lg:sticky lg:top-6 p-6 rounded-2xl bg-white dark:bg-black/20 border border-neutral-100 dark:border-neutral-800/50 shadow-sm">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Nova Tag</h3>
              <p className="text-xs text-neutral-500 mb-5">Adicione uma nova categoria ao sistema.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest pl-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: UX Design, React..."
                className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-blue-400/20 dark:focus:border-blue-400 transition-all placeholder:text-neutral-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest pl-1">Nome (Inglês) · opcional</label>
              <input
                type="text"
                value={nameEn}
                onChange={e => setNameEn(e.target.value)}
                placeholder="Ex: UX Design, React..."
                className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-blue-400/20 dark:focus:border-blue-400 transition-all placeholder:text-neutral-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest pl-1">Tag pai · opcional</label>
              <select
                value={parentId}
                onChange={e => setParentId(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-blue-400/20 dark:focus:border-blue-400 transition-all"
              >
                <option value="">Nenhuma (tag raiz)</option>
                {flatOptions.map(({ tag, depth }) => (
                  <option key={tag._id} value={tag._id}>
                    {'—  '.repeat(depth)}{tag.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest pl-1">Ícone</label>
              <IconPicker key={iconPickerKey} value={icon} onChange={setIcon} />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400 flex items-center gap-2 animate-in slide-in-from-top-1">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-md hover:shadow-lg"
            >
              <span className={`material-symbols-outlined text-lg ${submitting ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`}>
                {submitting ? 'progress_activity' : 'add_circle'}
              </span>
              {submitting ? 'Criando...' : 'Criar Nova Tag'}
            </button>
          </form>
        </div>

        <div className="order-1 lg:order-2 bg-neutral-50/80 dark:bg-black/20 rounded-2xl p-6 lg:p-8 border border-neutral-200/50 dark:border-neutral-800/50 min-h-[300px]">
          <h3 className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            Inventário de Tags
          </h3>

          <div className="flex flex-col gap-2">
            {tree.map(node => (
              <TagTreeItem
                key={node._id}
                node={node}
                depth={0}
                siblings={tree}
                allTags={tags}
                draggedId={draggedId}
                onDragStart={setDraggedId}
                onDrop={handleDrop}
                onSaveNameEn={handleSaveNameEn}
                onChangeParent={handleChangeParent}
                flatOptions={flatOptions}
              />
            ))}
            {tags.length === 0 && (
              <div className="w-full h-full flex flex-col items-center justify-center text-center text-neutral-400 py-16">
                <div className="w-16 h-16 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl opacity-50">style</span>
                </div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Nenhuma tag encontrada</p>
                <p className="text-sm mt-1 opacity-70 max-w-[250px]">Comece adicionando tags no formulário para categorizar seus projetos.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface TagTreeItemProps {
  node: TagNode;
  depth: number;
  siblings: Tag[];
  allTags: Tag[];
  draggedId: string | null;
  onDragStart: (id: string) => void;
  onDrop: (target: Tag, siblings: Tag[]) => void;
  onSaveNameEn: (tag: Tag, value: string) => void;
  onChangeParent: (tag: Tag, parentId: string) => void;
  flatOptions: Array<{ tag: Tag; depth: number }>;
}

function TagTreeItem({
  node,
  depth,
  siblings,
  allTags,
  draggedId,
  onDragStart,
  onDrop,
  onSaveNameEn,
  onChangeParent,
  flatOptions,
}: TagTreeItemProps) {
  const descendantIds = useMemo(() => getDescendantIds(node._id, allTags), [node._id, allTags]);
  const parentOptions = flatOptions.filter(
    ({ tag }) => tag._id !== node._id && !descendantIds.has(tag._id),
  );

  return (
    <div>
      <div
        draggable
        onDragStart={() => onDragStart(node._id)}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          onDrop(node, siblings);
        }}
        style={{ marginLeft: depth * 28 }}
        className={`group flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-700/50 bg-white dark:bg-neutral-900/80 text-sm text-neutral-700 dark:text-neutral-300 hover:border-blue-500/40 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-all shadow-sm hover:shadow-md duration-300 cursor-grab active:cursor-grabbing ${
          draggedId === node._id ? 'opacity-40' : ''
        }`}
      >
        <span className="material-symbols-outlined text-[18px] text-neutral-300 dark:text-neutral-600">drag_indicator</span>
        <span className="material-symbols-outlined text-[20px] text-neutral-400 group-hover:text-blue-500 transition-colors">
          {node.icon}
        </span>
        <span className="font-medium pr-1">{node.name}</span>

        <input
          type="text"
          defaultValue={node.nameEn ?? ''}
          placeholder="Nome em inglês"
          onBlur={e => onSaveNameEn(node, e.target.value)}
          className="flex-1 min-w-[140px] px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200/80 dark:border-neutral-700/50 bg-neutral-50/50 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-blue-400/20 dark:focus:border-blue-400 transition-all placeholder:text-neutral-400"
        />

        <select
          value={node.parentId ?? ''}
          onChange={e => onChangeParent(node, e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200/80 dark:border-neutral-700/50 bg-neutral-50/50 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-blue-400/20 dark:focus:border-blue-400 transition-all"
        >
          <option value="">Tag raiz</option>
          {parentOptions.map(({ tag, depth: optionDepth }) => (
            <option key={tag._id} value={tag._id}>
              {'—  '.repeat(optionDepth)}{tag.name}
            </option>
          ))}
        </select>
      </div>

      {node.children.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {node.children.map(child => (
            <TagTreeItem
              key={child._id}
              node={child}
              depth={depth + 1}
              siblings={node.children}
              allTags={allTags}
              draggedId={draggedId}
              onDragStart={onDragStart}
              onDrop={onDrop}
              onSaveNameEn={onSaveNameEn}
              onChangeParent={onChangeParent}
              flatOptions={flatOptions}
            />
          ))}
        </div>
      )}
    </div>
  );
}
