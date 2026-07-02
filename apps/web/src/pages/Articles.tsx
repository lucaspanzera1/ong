import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { listArticles, type Article } from '../lib/articles';

interface ArticlesProps {
  lang: 'EN' | 'PT';
}

const content = {
  EN: {
    title: 'Articles',
    description: 'Notes and write-ups on things I have been working on.',
    empty: 'No articles found.',
  },
  PT: {
    title: 'Artigos',
    description: 'Anotações e textos sobre coisas em que tenho trabalhado.',
    empty: 'Nenhum artigo encontrado.',
  },
};

export function Articles({ lang }: ArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const currentContent = content[lang];

  useEffect(() => {
    listArticles().then(setArticles).catch(() => {});
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="py-24 px-6 max-w-4xl mx-auto"
    >
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-4">
          {currentContent.title}
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          {currentContent.description}
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {articles.map(article => (
          <Link
            key={article._id}
            to={`/articles/${article.slug}`}
            className="group flex items-center justify-between gap-4 px-6 py-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/50 bg-white dark:bg-neutral-900/80 hover:border-blue-500/40 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex flex-col gap-2 min-w-0">
              <span className="text-lg font-medium text-neutral-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 truncate">
                {article.title}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span className="material-symbols-outlined text-neutral-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0">
              arrow_forward
            </span>
          </Link>
        ))}
        {articles.length === 0 && (
          <p className="text-neutral-400 text-sm">{currentContent.empty}</p>
        )}
      </div>
    </motion.section>
  );
}
