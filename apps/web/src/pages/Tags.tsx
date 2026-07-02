import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { listTags, type Tag } from '../lib/tags';

interface TagsProps {
  lang: 'EN' | 'PT';
}

const content = {
  EN: {
    title: 'Tags',
    description: 'Browse all the tags used to categorize projects.',
    empty: 'No tags found.',
  },
  PT: {
    title: 'Tags',
    description: 'Veja todas as tags usadas para categorizar os projetos.',
    empty: 'Nenhuma tag encontrada.',
  },
};

export function Tags({ lang }: TagsProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const currentContent = content[lang];

  useEffect(() => {
    listTags().then(setTags).catch(() => {});
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

      <div className="flex flex-wrap gap-3">
        {tags.map(tag => (
          <div
            key={tag._id}
            className="group flex items-center gap-2.5 px-4 py-2 rounded-xl border border-neutral-200/80 dark:border-neutral-700/50 bg-white dark:bg-neutral-900/80 text-sm text-neutral-700 dark:text-neutral-300 hover:border-blue-500/40 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-300 transition-all cursor-default shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-300"
          >
            <span className="material-symbols-outlined text-[20px] text-neutral-400 group-hover:text-blue-500 transition-colors">
              {tag.icon}
            </span>
            <span className="font-medium pr-1">{tag.name}</span>
          </div>
        ))}
        {tags.length === 0 && (
          <p className="text-neutral-400 text-sm">{currentContent.empty}</p>
        )}
      </div>
    </motion.section>
  );
}
