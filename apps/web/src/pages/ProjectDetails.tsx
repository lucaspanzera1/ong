import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { projectsData } from '../data/projects';

interface ProjectDetailsProps {
  lang: 'EN' | 'PT';
}

export function ProjectDetails({ lang }: ProjectDetailsProps) {
  const { id } = useParams();
  const currentContent = projectsData[lang];
  const project = currentContent.projects.find(p => p.id === Number(id));

  if (!project) {
    return (
      <div className="py-24 px-6 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
          {lang === 'EN' ? 'Project not found' : 'Projeto não encontrado'}
        </h2>
        <Link to="/" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline transition-colors">
          {lang === 'EN' ? 'Return home' : 'Voltar ao início'}
        </Link>
      </div>
    );
  }

  const Icon = project.icon;

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
            <Icon className="w-6 h-6" />
          </div>
          <span className="font-mono text-sm tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
            {project.category}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-6">
          {project.title}
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a 
            href="#" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium text-sm"
          >
            <span>{lang === 'EN' ? 'View Repository' : 'Ver Repositório'}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono text-xs uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="border-t border-black/10 dark:border-white/10 py-12 prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {project.content}
        </ReactMarkdown>
      </div>
    </motion.article>
  );
}
