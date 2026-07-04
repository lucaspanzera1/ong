import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { buildTagTree, listTags, tagName, type Tag, type TagNode } from '../lib/tags';

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

      <div className="flex flex-col gap-6">
        {buildTagTree(tags).map(node => (
          <TagGroup key={node._id} node={node} lang={lang} />
        ))}
        {tags.length === 0 && (
          <p className="text-neutral-400 text-sm">{currentContent.empty}</p>
        )}
      </div>
    </motion.section>
  );
}

function TagGroup({ node, lang }: { node: TagNode; lang: 'EN' | 'PT' }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="group flex items-center gap-2.5 px-4 py-2 rounded-xl border border-neutral-200/80 dark:border-neutral-700/50 bg-white dark:bg-neutral-900/80 text-sm text-neutral-700 dark:text-neutral-300 hover:border-blue-500/40 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-300 transition-all cursor-default shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-300 w-fit"
      >
        <span className="material-symbols-outlined text-[20px] text-neutral-400 group-hover:text-blue-500 transition-colors">
          {node.icon}
        </span>
        <span className="font-medium pr-1">{tagName(node, lang)}</span>
      </div>
      {node.children.length > 0 && (
        <div className="flex flex-wrap gap-3 pl-6 border-l-2 border-neutral-200/60 dark:border-neutral-800/60">
          {node.children.map(child => (
            <TagGroup key={child._id} node={child} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
