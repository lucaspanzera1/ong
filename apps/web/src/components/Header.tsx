import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  lang: 'EN' | 'PT';
  setLang: (lang: 'EN' | 'PT') => void;
}

export function Header({ lang, setLang }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    // Re-enable transitions on body after initial render to avoid flash of white (FOUC)
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.body.classList.add('transition-colors', 'duration-300');
      }, 0);
    });
  }, []);

  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Check if it's mobile (md breakpoint in tailwind is 768px)
          const isMobile = window.innerWidth < 768;
          
          if (!isMobile) {
            if (hidden) setHidden(false);
            lastScrollY = window.scrollY;
            ticking = false;
            return;
          }

          if (window.scrollY > lastScrollY && window.scrollY > 100) {
            setHidden(true);
          } else if (window.scrollY < lastScrollY) {
            setHidden(false);
          }
          
          lastScrollY = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once to catch initial state if mounted halfway down the page
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hidden]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: hidden ? '-100%' : 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#FAFAFA]/70 dark:bg-[#111111]/70 border-b border-black/5 dark:border-white/5 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="/" className="text-xl font-medium tracking-tight hover:opacity-70 transition-opacity text-neutral-900 dark:text-white">
          panzera.
        </a>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === 'EN' ? 'PT' : 'EN')}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white transition-colors"
            aria-label="Toggle language"
          >
            [ {lang === 'EN' ? 'PT-BR' : 'EN'} ]
          </button>
          <button
            onClick={toggleTheme}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white transition-colors"
            aria-label="Toggle theme"
          >
            [ {isDark ? 'dark' : 'light'} ]
          </button>
        </div>
      </div>
    </motion.header>
  );
}
