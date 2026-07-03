import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  createArticle,
  listArticlesForAdmin,
  updateArticle,
  uploadImage,
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
  const [titleEn, setTitleEn] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [activeLang, setActiveLang] = useState<'PT' | 'EN'>('PT');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  
  // Drag and Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toolbarButtons = [
    { icon: 'format_bold', label: 'Negrito', before: '**', after: '**' },
    { icon: 'format_italic', label: 'Itálico', before: '_', after: '_' },
    { icon: 'format_h1', label: 'Título 1', before: '# ', after: '' },
    { icon: 'format_h2', label: 'Título 2', before: '## ', after: '' },
    { icon: 'format_quote', label: 'Citação', before: '> ', after: '' },
    { icon: 'code', label: 'Código', before: '`', after: '`' },
    { icon: 'data_object', label: 'Bloco de Código', before: '```\n', after: '\n```' },
    { icon: 'link', label: 'Link', before: '[', after: '](url)' },
    { icon: 'image', label: 'Imagem', before: '![alt](', after: ')' },
    { icon: 'format_list_bulleted', label: 'Lista', before: '- ', after: '' },
    { icon: 'format_list_numbered', label: 'Lista Numerada', before: '1. ', after: '' },
  ];

  function insertMarkdown(before: string, after: string = '') {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = currentContent.substring(start, end);
    const newText = currentContent.substring(0, start) + before + selectedText + after + currentContent.substring(end);
    setCurrentContent(newText);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + before.length, start + before.length + selectedText.length);
      }
    }, 0);
  }

  async function uploadAndInsertImage(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Por favor, faça upload apenas de imagens.');
      return;
    }
    setIsUploadingImage(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      insertMarkdown(`![${file.name}](${url})`, '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao fazer upload da imagem');
    } finally {
      setIsUploadingImage(false);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      uploadAndInsertImage(file);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      e.preventDefault();
      const file = e.clipboardData.files[0];
      uploadAndInsertImage(file);
    }
  }

  useEffect(() => {
    listTags().then(setAvailableTags).catch(() => {});
    if (isEditing && slug) {
      listArticlesForAdmin()
        .then((articles) => {
          const article = articles.find((a) => a.slug === slug);
          if (article) {
            setTitle(article.title);
            setContent(article.content);
            setTitleEn(article.titleEn ?? '');
            setContentEn(article.contentEn ?? '');
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

  const currentTitle = activeLang === 'PT' ? title : titleEn;
  const setCurrentTitle = activeLang === 'PT' ? setTitle : setTitleEn;
  const currentContent = activeLang === 'PT' ? content : contentEn;
  const setCurrentContent = activeLang === 'PT' ? setContent : setContentEn;

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
          titleEn: titleEn.trim(),
          contentEn: contentEn.trim(),
          tags: selectedTags,
        });
      } else {
        await createArticle(title.trim(), content.trim(), selectedTags, titleEn.trim(), contentEn.trim());
      }
      navigate(ADMIN_PATH);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar artigo');
      setSubmitting(false);
    }
  }

  return (
    <div className="py-24 px-6 w-full max-w-[95%] xl:max-w-[1400px] mx-auto min-h-[80vh] flex flex-col gap-10 animate-in fade-in duration-500">
      <header className="mb-8 border-b border-black/10 dark:border-white/10 pb-8 transition-colors duration-300">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to={ADMIN_PATH}
            className="p-2 bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-colors"
            title="Voltar ao Painel"
          >
            <span className="material-symbols-outlined text-lg block">arrow_back</span>
          </Link>
          <span className="font-mono text-xs tracking-widest uppercase text-neutral-500 dark:text-neutral-400 transition-colors">
            {isEditing ? 'Editor' : 'Novo Artigo'}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-4 transition-colors duration-300">
          {isEditing ? 'Editar Artigo' : 'Criar Novo Artigo'}
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 transition-colors">
          Escreva o conteúdo em Markdown e organize com tags.
        </p>
      </header>

      <main className="flex flex-col gap-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="material-symbols-outlined text-4xl animate-spin text-neutral-900 dark:text-white">progress_activity</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
              {(['PT', 'EN'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest border transition-colors ${
                    activeLang === lang
                      ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white'
                      : 'bg-neutral-50 dark:bg-[#1a1a1a] border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-neutral-900 dark:hover:border-neutral-300'
                  }`}
                >
                  {lang === 'PT' ? 'Português' : 'English'}
                  {lang === 'EN' && !titleEn.trim() && !contentEn.trim() && (
                    <span className="ml-2 opacity-60">(opcional)</span>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <label className="font-mono text-[10px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
                Título {activeLang === 'EN' && '(Inglês)'}
              </label>
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder={activeLang === 'PT' ? 'Ex: Como configurei meu home lab...' : 'Ex: How I set up my home lab...'}
                className="w-full px-5 py-4 text-lg bg-white dark:bg-[#151515] border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-300 text-neutral-900 dark:text-white focus:outline-none transition-colors placeholder:text-neutral-400"
              />
            </div>

            {availableTags.length > 0 && (
              <div className="space-y-3">
                <label className="font-mono text-[10px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
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
                        className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border transition-colors ${
                          active
                            ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white'
                            : 'bg-neutral-50 dark:bg-[#1a1a1a] border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-neutral-900 dark:hover:border-neutral-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">{tag.icon}</span>
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
              <div className="space-y-3 flex flex-col h-full">
                <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3 transition-colors duration-300">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
                    Conteúdo (Markdown) {activeLang === 'EN' && '(Inglês)'}
                  </label>
                  <div className="flex flex-wrap items-center gap-1">
                    {toolbarButtons.map((btn, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => insertMarkdown(btn.before, btn.after)}
                        title={btn.label}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] block">{btn.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="relative w-full flex-1 flex flex-col min-h-[400px]">
                  <textarea
                    ref={textareaRef}
                    value={currentContent}
                    onChange={(e) => setCurrentContent(e.target.value)}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onPaste={handlePaste}
                    placeholder={
                      activeLang === 'PT'
                        ? '## Título\n\nEscreva seu artigo em **markdown**...\n\n(Arraste e solte ou cole imagens aqui para fazer upload)'
                        : '## Title\n\nWrite your article in **markdown**...\n\n(Drag & drop or paste images here to upload)'
                    }
                    className={`w-full h-full flex-1 px-5 py-5 text-sm font-mono leading-relaxed bg-white dark:bg-[#151515] border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-300 text-neutral-900 dark:text-neutral-200 focus:outline-none transition-all placeholder:text-neutral-400 resize-none ${
                      isDragging ? 'opacity-50 ring-2 ring-neutral-900 dark:ring-white border-transparent' : ''
                    }`}
                  />
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center backdrop-blur-sm pointer-events-none z-10 transition-all">
                      <span className="material-symbols-outlined text-4xl animate-spin text-neutral-900 dark:text-white">progress_activity</span>
                    </div>
                  )}
                  {isDragging && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 border-2 border-dashed border-neutral-900 dark:border-white bg-neutral-900/5 dark:bg-white/5 transition-all">
                      <span className="font-mono text-sm tracking-widest uppercase text-neutral-900 dark:text-white bg-white/90 dark:bg-[#151515]/90 px-6 py-3 shadow-sm border border-neutral-200 dark:border-neutral-800 backdrop-blur-md">
                        Solte a imagem aqui
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 flex flex-col h-full">
                <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3 transition-colors duration-300">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
                    Pré-visualização
                  </label>
                </div>
                <div className="flex-1 min-h-[400px] overflow-y-auto px-6 py-6 bg-white dark:bg-[#151515] border border-neutral-200 dark:border-neutral-800 prose prose-neutral dark:prose-invert max-w-none transition-colors">
                  {currentContent.trim() ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentContent}</ReactMarkdown>
                  ) : (
                    <p className="text-neutral-400 text-sm not-prose font-mono">A pré-visualização aparecerá aqui...</p>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="px-5 py-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400 flex items-center gap-3">
                <span className="material-symbols-outlined text-xl">error</span>
                {error}
              </div>
            )}

            <div className="flex justify-end pt-8 border-t border-black/10 dark:border-white/10 transition-colors duration-300">
              <button
                type="submit"
                disabled={submitting || isUploadingImage}
                className="w-full sm:w-auto px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium tracking-wide uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <span className={`material-symbols-outlined text-xl ${submitting || isUploadingImage ? 'animate-spin' : ''}`}>
                  {submitting || isUploadingImage ? 'progress_activity' : isEditing ? 'save' : 'publish'}
                </span>
                {submitting ? 'Salvando...' : isUploadingImage ? 'Aguardando Upload...' : isEditing ? 'Salvar Alterações' : 'Publicar Artigo'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
