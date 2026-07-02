import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getArticle, type Article } from '../lib/articles';

interface ArticleDetailsProps {
  lang: 'EN' | 'PT';
}

export function ArticleDetails({ lang }: ArticleDetailsProps) {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getArticle(slug)
      .then(setArticle)
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="py-24 px-6 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
          {lang === 'EN' ? 'Article not found' : 'Artigo não encontrado'}
        </h2>
        <Link to="/articles" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline transition-colors">
          {lang === 'EN' ? 'Back to articles' : 'Voltar aos artigos'}
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
        to="/articles"
        className="inline-flex items-center gap-2 text-sm font-mono text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white mb-12 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {lang === 'EN' ? 'cd ..' : 'cd ..'}
      </Link>

      <header className="mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-6">
          {article.title}
        </h1>
        <div className="flex flex-wrap gap-2">
          {article.tags.map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono text-xs uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="border-t border-black/10 dark:border-white/10 py-12 prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
      </div>
    </motion.article>
  );
}
