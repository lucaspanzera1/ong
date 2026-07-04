import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface AboutRedirectProps {
  lang: 'EN' | 'PT';
}

export function AboutRedirect({ lang }: AboutRedirectProps) {
  const location = useLocation();

  if (location.pathname !== '/') {
    return null;
  }

  return (
    <section className="w-full border-t border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#111] py-24 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 mb-8 flex items-center justify-center rounded-full bg-white dark:bg-[#151515] text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <span className="material-symbols-outlined text-[28px]">person</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-10">
            {lang === 'PT' 
              ? 'Um pouco mais sobre mim' 
              : 'A little more about me'}
          </h2>
          
          <Link 
            to="/about"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-neutral-800 dark:bg-neutral-200 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative flex items-center gap-3 font-medium">
              {lang === 'PT' ? 'Ler Sobre Mim' : 'Read About Me'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
