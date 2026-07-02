import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createArticle, listArticles, type Article } from '../lib/articles';
import { listTags, type Tag } from '../lib/tags';

export function ArticleManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listArticles().then(setArticles).catch(() => {});
    listTags().then(setAvailableTags).catch(() => {});
  }, []);

  function toggleTag(name: string) {
    setSelectedTags(prev => (prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]));
  }

  async function handleCreateArticle(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Preencha o título e o conteúdo do artigo.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const article = await createArticle(title.trim(), content.trim(), selectedTags);
      setArticles(prev => [article, ...prev]);
      setTitle('');
      setContent('');
      setSelectedTags([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar artigo');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-2xl">article</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Gerenciamento de Artigos</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Escreva artigos em Markdown e organize-os com tags.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">{articles.length} artigos publicados</span>
        </div>
      </div>

      <form onSubmit={handleCreateArticle} className="flex flex-col gap-5 mb-10 p-6 rounded-2xl bg-white dark:bg-black/20 border border-neutral-100 dark:border-neutral-800/50 shadow-sm">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Novo Artigo</h3>
          <p className="text-xs text-neutral-500 mb-5">O conteúdo é escrito em Markdown e renderizado na página pública.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest pl-1">Título</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ex: Como configurei meu home lab..."
            className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/40 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:ring-purple-400/20 dark:focus:border-purple-400 transition-all placeholder:text-neutral-400"
          />
        </div>

        {availableTags.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest pl-1">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => {
                const active = selectedTags.includes(tag.name);
                return (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => toggleTag(tag.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all ${
                      active
                        ? 'bg-purple-500/10 border-purple-400/60 text-purple-700 dark:text-purple-300'
                        : 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-purple-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{tag.icon}</span>
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest pl-1">Conteúdo (Markdown)</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={'## Título\n\nEscreva seu artigo em **markdown**...'}
              rows={16}
              className="w-full px-4 py-3 text-sm font-mono rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/40 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:ring-purple-400/20 dark:focus:border-purple-400 transition-all placeholder:text-neutral-400 resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest pl-1">Pré-visualização</label>
            <div className="h-[calc(100%-1.5rem)] max-h-[420px] overflow-y-auto px-4 py-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/40 prose prose-sm prose-neutral dark:prose-invert max-w-none">
              {content.trim() ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              ) : (
                <p className="text-neutral-400 text-sm not-prose">A pré-visualização aparece aqui...</p>
              )}
            </div>
          </div>
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
          className="mt-2 w-full sm:w-auto sm:self-end px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-md hover:shadow-lg"
        >
          <span className={`material-symbols-outlined text-lg ${submitting ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`}>
            {submitting ? 'progress_activity' : 'add_circle'}
          </span>
          {submitting ? 'Publicando...' : 'Publicar Artigo'}
        </button>
      </form>

      <div className="bg-neutral-50/80 dark:bg-black/20 rounded-2xl p-6 lg:p-8 border border-neutral-200/50 dark:border-neutral-800/50 min-h-[200px]">
        <h3 className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-6">
          Artigos Publicados
        </h3>

        <div className="flex flex-col gap-3">
          {articles.map(article => (
            <Link
              key={article._id}
              to={`/articles/${article.slug}`}
              className="group flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-neutral-200/80 dark:border-neutral-700/50 bg-white dark:bg-neutral-900/80 hover:border-purple-500/40 hover:bg-purple-50/50 dark:hover:bg-purple-500/10 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 truncate">
                  {article.title}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map(tag => (
                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="material-symbols-outlined text-neutral-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all shrink-0">
                arrow_forward
              </span>
            </Link>
          ))}
          {articles.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center text-center text-neutral-400 py-16">
              <div className="w-16 h-16 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl opacity-50">article</span>
              </div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Nenhum artigo encontrado</p>
              <p className="text-sm mt-1 opacity-70 max-w-[250px]">Comece escrevendo seu primeiro artigo acima.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
