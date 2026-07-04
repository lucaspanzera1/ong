import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { deleteMyData } from '../lib/analytics';
import { setConsent } from '../lib/consent';

interface FooterProps {
  lang: 'EN' | 'PT';
  onOpenCookiePreferences: () => void;
}

const COPY = {
  PT: {
    privacy: 'Privacidade',
    cookiePreferences: 'Preferências de cookies',
    deleteData: 'Excluir meus dados',
    deleted: 'Dados excluídos',
    cookies: 'Cookies',
    about: 'Sobre',
    github: 'GitHub',
    linkedin: 'LinkedIn',
  },
  EN: {
    privacy: 'Privacy',
    cookiePreferences: 'Cookie preferences',
    deleteData: 'Delete my data',
    deleted: 'Data deleted',
    cookies: 'Cookies',
    about: 'About',
    github: 'GitHub',
    linkedin: 'LinkedIn',
  },
};

function IconTooltip({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 origin-bottom opacity-0 scale-95 translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0">
      <div className="whitespace-nowrap rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 shadow-xl">
        {label}
      </div>
    </div>
  );
}

function PixelCookieIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      <rect x="5" y="1" width="6" height="1" />
      <rect x="11" y="2" width="2" height="1" />
      <rect x="13" y="3" width="1" height="2" />
      <rect x="14" y="5" width="1" height="6" />
      <rect x="13" y="11" width="1" height="2" />
      <rect x="11" y="13" width="2" height="1" />
      <rect x="5" y="14" width="6" height="1" />
      <rect x="3" y="13" width="2" height="1" />
      <rect x="2" y="11" width="1" height="2" />
      <rect x="1" y="5" width="1" height="6" />
      <rect x="2" y="3" width="1" height="2" />
      <rect x="3" y="2" width="2" height="1" />
      <rect x="5" y="4" width="2" height="2" />
      <rect x="9" y="3" width="2" height="2" />
      <rect x="10" y="7" width="2" height="2" />
      <rect x="4" y="8" width="2" height="2" />
      <rect x="7" y="10" width="2" height="2" />
    </svg>
  );
}

export function PixelCodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      {/* < */}
      <rect x="5" y="3" width="2" height="2" />
      <rect x="3" y="5" width="2" height="2" />
      <rect x="1" y="7" width="2" height="2" />
      <rect x="3" y="9" width="2" height="2" />
      <rect x="5" y="11" width="2" height="2" />
      
      {/* > */}
      <rect x="9" y="3" width="2" height="2" />
      <rect x="11" y="5" width="2" height="2" />
      <rect x="13" y="7" width="2" height="2" />
      <rect x="11" y="9" width="2" height="2" />
      <rect x="9" y="11" width="2" height="2" />
    </svg>
  );
}

export function PixelLinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      <rect x="1" y="1" width="14" height="1" />
      <rect x="1" y="14" width="14" height="1" />
      <rect x="1" y="2" width="1" height="12" />
      <rect x="14" y="2" width="1" height="12" />
      
      <rect x="3" y="4" width="2" height="2" />
      <rect x="3" y="7" width="2" height="5" />
      
      <rect x="6" y="7" width="2" height="5" />
      <rect x="8" y="7" width="2" height="1" />
      <rect x="10" y="8" width="2" height="4" />
    </svg>
  );
}

function PixelInfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      {/* Circle outline */}
      <rect x="5" y="1" width="6" height="1" />
      <rect x="11" y="2" width="2" height="1" />
      <rect x="13" y="3" width="1" height="2" />
      <rect x="14" y="5" width="1" height="6" />
      <rect x="13" y="11" width="1" height="2" />
      <rect x="11" y="13" width="2" height="1" />
      <rect x="5" y="14" width="6" height="1" />
      <rect x="3" y="13" width="2" height="1" />
      <rect x="2" y="11" width="1" height="2" />
      <rect x="1" y="5" width="1" height="6" />
      <rect x="2" y="3" width="1" height="2" />
      <rect x="3" y="2" width="2" height="1" />

      {/* "i" dot */}
      <rect x="7" y="4" width="2" height="2" />
      {/* "i" stem */}
      <rect x="7" y="7" width="2" height="5" />
    </svg>
  );
}

export function Footer({ lang, onOpenCookiePreferences }: FooterProps) {
  const copy = COPY[lang];
  const [deleted, setDeleted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [uptime, setUptime] = useState(0);
  const [brtTime, setBrtTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setUptime(prev => prev + 1);
      setBrtTime(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    setBrtTime(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleDeleteData() {
    await deleteMyData();
    setConsent('denied');
    setDeleted(true);
  }

  return (
    <footer id="contact" className="border-t border-black/5 dark:border-white/5 mt-20 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs font-mono text-neutral-400 dark:text-neutral-500">
          <div>© {new Date().getFullYear()} Panzera.</div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>SYS.UP {formatUptime(uptime)}</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <div>BRT {brtTime}</div>
        </div>

        <div className="flex flex-wrap items-center gap-6 mt-2 lg:mt-0">
          <div className="relative group" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center justify-center p-1 -m-1"
              aria-label="Cookie settings"
            >
              <PixelCookieIcon className="w-5 h-5" />
            </button>

            {!menuOpen && <IconTooltip label={copy.cookies} />}

            <AnimatePresence>
              {menuOpen && (
                <div className="absolute bottom-full left-0 md:left-1/2 md:-translate-x-1/2 mb-2 z-50">
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="w-48 bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden flex flex-col origin-bottom"
                  >
                    <Link
                      to="/privacy"
                      onClick={() => setMenuOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white transition-colors block"
                    >
                      {copy.privacy}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenCookiePreferences();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      {copy.cookiePreferences}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleDeleteData();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      {deleted ? copy.deleted : copy.deleteData}
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
          <Link to="/about" aria-label="About" className="relative group text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center justify-center p-1 -m-1">
            <IconTooltip label={copy.about} />
            <PixelInfoIcon className="w-5 h-5" />
          </Link>
          <a href="https://github.com/lucaspanzera1" aria-label="GitHub" className="relative group text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center justify-center p-1 -m-1">
            <IconTooltip label={copy.github} />
            <PixelCodeIcon className="w-5 h-5" />
          </a>
          <a href="https://www.linkedin.com/in/lucas-panzera/" aria-label="LinkedIn" className="relative group text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center justify-center p-1 -m-1">
            <IconTooltip label={copy.linkedin} />
            <PixelLinkedinIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
