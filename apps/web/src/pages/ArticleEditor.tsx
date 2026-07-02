import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  createArticle,
  listArticlesForAdmin,
  updateArticle,
} from '../lib/articles';
import { listTags, type Tag } from '../lib/tags';

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

export function ArticleEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(slug);

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    listTags().then(setAvailableTags).catch(() => {});
    if (isEditing && slug) {
      listArticlesForAdmin()
        .then((articles) => {
          const article = articles.find((a) => a.slug === slug);
          if (article) {
            setTitle(article.title);
            setContent(article.content);
            setSelectedTags(article.tags);
          } else {
            setError('Artigo não encontrado.');
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Falha ao carregar o artigo.');
          setLoading(false);
        });
    }
  }, [isEditing, slug]);

  function toggleTag(name: string) {
    setSelectedTags((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Preencha o título e o conteúdo do artigo.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (isEditing && slug) {
        await updateArticle(slug, {
          title: title.trim(),
          content: content.trim(),
          tags: selectedTags,
        });
      } else {
        await createArticle(title.trim(), content.trim(), selectedTags);
      }
      navigate(ADMIN_PATH);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar artigo');
      setSubmitting(false);
    }
  }

  return (
    <div className="py-12 md:py-24 px-6 max-w-5xl mx-auto min-h-[80vh] flex flex-col gap-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/40 dark:bg-black/20 p-6 md:p-8 rounded-3xl border border-neutral-200/60 dark:border-neutral-800/60 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-5">
          <Link
            to={ADMIN_PATH}
            className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors"
            title="Voltar ao Painel"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-3xl">edit_document</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-1">
              {isEditing ? 'Editar Artigo' : 'Criar Novo Artigo'}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              Escreva o conteúdo em Markdown e organize com tags.
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="material-symbols-outlined text-4xl animate-spin text-purple-500">progress_activity</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 p-6 md:p-8 rounded-3xl bg-white/50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 backdrop-blur-xl shadow-sm"
          >
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest pl-1">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Como configurei meu home lab..."
                className="w-full px-5 py-4 text-base rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/40 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:ring-purple-400/20 dark:focus:border-purple-400 transition-all placeholder:text-neutral-400"
              />
            </div>

            {availableTags.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest pl-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const active = selectedTags.includes(tag.name);
                    return (
                      <button
                        key={tag._id}
                        type="button"
                        onClick={() => toggleTag(tag.name)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all shadow-sm ${
                          active
                            ? 'bg-purple-500/10 border-purple-400/60 text-purple-700 dark:text-purple-300'
                            : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-purple-300 dark:hover:border-purple-700'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">{tag.icon}</span>
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
              <div className="space-y-2 flex flex-col h-full">
                <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest pl-1">
                  Conteúdo (Markdown)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={'## Título\n\nEscreva seu artigo em **markdown**...'}
                  className="w-full flex-1 min-h-[400px] px-5 py-4 text-sm font-mono rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/40 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:ring-purple-400/20 dark:focus:border-purple-400 transition-all placeholder:text-neutral-400 resize-none"
                />
              </div>

              <div className="space-y-2 flex flex-col h-full">
                <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest pl-1">
                  Pré-visualização
                </label>
                <div className="flex-1 min-h-[400px] overflow-y-auto px-6 py-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/40 prose prose-neutral dark:prose-invert max-w-none">
                  {content.trim() ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  ) : (
                    <p className="text-neutral-400 text-sm not-prose">A pré-visualização aparecerá aqui...</p>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="px-5 py-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400 flex items-center gap-3 animate-in slide-in-from-top-1">
                <span className="material-symbols-outlined text-xl">error</span>
                {error}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className={`material-symbols-outlined text-xl ${submitting ? 'animate-spin' : ''}`}>
                  {submitting ? 'progress_activity' : isEditing ? 'save' : 'publish'}
                </span>
                {submitting ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Publicar Artigo'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
