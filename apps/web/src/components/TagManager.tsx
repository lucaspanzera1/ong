import { useEffect, useState } from 'react';
import { createTag, listTags, updateTag, type Tag } from '../lib/tags';
import { IconPicker } from './IconPicker';

export function TagManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [icon, setIcon] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [iconPickerKey, setIconPickerKey] = useState(0);

  useEffect(() => {
    listTags().then(setTags).catch(() => {});
  }, []);

  async function handleCreateTag(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !icon) {
      setError('Preencha o nome e escolha um ícone.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const tag = await createTag(name.trim(), icon, nameEn.trim() || undefined);
      setTags(prev => [...prev, tag].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
      setNameEn('');
      setIcon('');
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
      const updated = await updateTag(tag._id, trimmed);
      setTags(prev => prev.map(t => (t._id === tag._id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar tradução da tag');
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
          
          <div className="flex flex-wrap gap-3">
            {tags.map(tag => (
              <div
                key={tag._id}
                className="group flex flex-col gap-2 px-4 py-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-700/50 bg-white dark:bg-neutral-900/80 text-sm text-neutral-700 dark:text-neutral-300 hover:border-blue-500/40 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-300 transition-all shadow-sm hover:shadow-md duration-300"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-neutral-400 group-hover:text-blue-500 transition-colors">
                    {tag.icon}
                  </span>
                  <span className="font-medium pr-1">{tag.name}</span>
                </div>
                <input
                  type="text"
                  defaultValue={tag.nameEn ?? ''}
                  placeholder="Nome em inglês"
                  onBlur={e => handleSaveNameEn(tag, e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200/80 dark:border-neutral-700/50 bg-neutral-50/50 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-blue-400/20 dark:focus:border-blue-400 transition-all placeholder:text-neutral-400"
                />
              </div>
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
