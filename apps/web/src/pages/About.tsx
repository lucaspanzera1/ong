import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Globe, Mail } from 'lucide-react';
import { PixelCodeIcon, PixelLinkedinIcon } from '../components/Footer';
import { ScrambleText, ScrambleChildren } from '../components/ScrambleText';
import { getAbout, aboutBody, type About as AboutContent } from '../lib/about';

interface AboutProps {
  lang: 'EN' | 'PT';
}

const CONTACT_LABEL = { PT: 'Contato / Links', EN: 'Contact / Links' };

const markdownComponents = {
  p: (props: any) => <p {...props}><ScrambleChildren>{props.children}</ScrambleChildren></p>,
  h1: (props: any) => <h1 {...props}><ScrambleChildren>{props.children}</ScrambleChildren></h1>,
  h2: (props: any) => <h2 {...props}><ScrambleChildren>{props.children}</ScrambleChildren></h2>,
  h3: (props: any) => <h3 {...props}><ScrambleChildren>{props.children}</ScrambleChildren></h3>,
  li: (props: any) => <li {...props}><ScrambleChildren>{props.children}</ScrambleChildren></li>,
  a: (props: any) => <a {...props}><ScrambleChildren>{props.children}</ScrambleChildren></a>,
  strong: (props: any) => <strong {...props}><ScrambleChildren>{props.children}</ScrambleChildren></strong>,
  em: (props: any) => <em {...props}><ScrambleChildren>{props.children}</ScrambleChildren></em>,
};

export function About({ lang }: AboutProps) {
  const [about, setAbout] = useState<AboutContent | null>(null);

  useEffect(() => {
    getAbout()
      .then(setAbout)
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 w-full flex-1">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          <div className="flex-1 space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
              <ScrambleText text="Lucas Panzera" trigger={lang} />
            </h1>

            {about && (
              <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:text-neutral-900 dark:prose-headings:text-white prose-p:text-neutral-600 dark:prose-p:text-neutral-300 prose-p:text-lg prose-p:leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {aboutBody(about, lang)}
                </ReactMarkdown>
              </div>
            )}

            <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
                <ScrambleText text={CONTACT_LABEL[lang]} trigger={lang} />
              </h2>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com/in/lucas-panzera/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-neutral-100 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-105" aria-label="LinkedIn">
                  <PixelLinkedinIcon className="w-5 h-5" />
                </a>
                <a href="https://github.com/lucaspanzera1" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-neutral-100 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-105" aria-label="GitHub">
                  <PixelCodeIcon className="w-5 h-5" />
                </a>
                <a href="https://www.lucaspanzera.com/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-neutral-100 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-105" aria-label="Website">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="mailto:lucassouzapanzera@gmail.com" className="p-3 rounded-xl bg-neutral-100 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-105" aria-label="Email">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
