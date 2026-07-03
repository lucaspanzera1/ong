import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getArticle, articleExcerpt, articleTitle, articleBody, type Article } from '../lib/articles';
import { listTags, translateTagLabel, type Tag } from '../lib/tags';

interface ArticleDetailsProps {
  lang: 'EN' | 'PT';
}

function formatDate(iso: string, lang: 'EN' | 'PT'): string {
  return new Intl.DateTimeFormat(lang === 'EN' ? 'en-US' : 'pt-BR', { dateStyle: 'long' }).format(new Date(iso));
}

export function ArticleDetails({ lang }: ArticleDetailsProps) {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getArticle(slug)
      .then(setArticle)
      .catch(() => setNotFound(true));
    listTags().then(setTags).catch(() => {});
  }, [slug]);

  if (notFound) {
    return (
      <div className="py-24 px-6 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
          {lang === 'EN' ? 'Article not found' : 'Artigo não encontrado'}
        </h2>
        <Link to="/" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline transition-colors">
          {lang === 'EN' ? 'Return home' : 'Voltar ao início'}
        </Link>
      </div>
    );
  }

  if (!article) return null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="py-24 px-6 max-w-4xl mx-auto"
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-mono text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white mb-12 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {lang === 'EN' ? 'cd ..' : 'cd ..'}
      </Link>

      <header className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800/50 text-neutral-900 dark:text-white">
            <FileText className="w-6 h-6" />
          </div>
          <span className="font-mono text-sm tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
            {lang === 'EN' ? 'Article' : 'Artigo'}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-6">
          {articleTitle(article, lang)}
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
          {articleExcerpt(articleBody(article, lang), 220)}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono text-xs uppercase tracking-wider">
                {translateTagLabel(tags, tag, lang)}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-6 font-mono text-xs text-neutral-400 dark:text-neutral-600">
          {lang === 'EN' ? 'Published on' : 'Publicado em'} {formatDate(article.createdAt, lang)}
          {article.updatedAt !== article.createdAt &&
            ` · ${lang === 'EN' ? 'Last edited on' : 'Última edição em'} ${formatDate(article.updatedAt, lang)}`}
        </p>
      </header>

      <div className="border-t border-black/10 dark:border-white/10 py-12 prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{articleBody(article, lang)}</ReactMarkdown>
      </div>
    </motion.article>
  );
}
