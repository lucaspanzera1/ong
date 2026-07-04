import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, FileText, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectsData } from '../data/projects';
import { listArticles, articleExcerpt, articleTitle, articleBody } from '../lib/articles';
import { listTags, translateTagLabel, type Tag } from '../lib/tags';

interface ProjectsProps {
  lang: 'EN' | 'PT';
}

interface CardItem {
  key: string;
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
  tags: string[];
  link: string;
}

export function Projects({ lang }: ProjectsProps) {
  const currentContent = projectsData[lang];
  const [articleItems, setArticleItems] = useState<CardItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    listTags().then(setTags).catch(() => {});
  }, []);

  useEffect(() => {
    listArticles()
      .then(articles =>
        setArticleItems(
          articles.map(article => ({
            key: `article-${article._id}`,
            title: articleTitle(article, lang),
            description: articleExcerpt(articleBody(article, lang)),
            category: lang === 'EN' ? 'Article' : 'Artigo',
            icon: FileText,
            tags: article.tags.map(tag => translateTagLabel(tags, tag, lang)),
            link: `/articles/${article.slug}`,
          })),
        ),
      )
      .catch(() => {});
  }, [lang, tags]);

  const items = articleItems;

  return (
    <section id="projects" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="mb-16 border-b border-black/10 dark:border-white/10 pb-8 transition-colors duration-300">
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2 transition-colors duration-300">{currentContent.sectionTitle}</h2>
        <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm transition-colors duration-300">{currentContent.sectionSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={item.link}
                className="group relative flex flex-col justify-between h-full p-6 bg-white dark:bg-[#151515] border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-300 transition-colors duration-300"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-0 h-[2px] bg-neutral-900 dark:bg-white transition-all duration-300 group-hover:w-full" />

                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-neutral-100 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 group-hover:bg-neutral-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-neutral-900 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs tracking-widest uppercase text-neutral-500 dark:text-neutral-400 transition-colors">
                        {item.category}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                  </div>

                  <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-3 group-hover:underline decoration-1 underline-offset-4 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm mb-8 transition-colors">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-mono text-[10px] uppercase tracking-wider transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
