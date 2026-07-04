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
  },
  EN: {
    privacy: 'Privacy',
    cookiePreferences: 'Cookie preferences',
    deleteData: 'Delete my data',
    deleted: 'Data deleted',
  },
};

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

function PixelCodeIcon(props: React.SVGProps<SVGSVGElement>) {
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

function PixelLinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
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

export function Footer({ lang, onOpenCookiePreferences }: FooterProps) {
  const copy = COPY[lang];
  const [deleted, setDeleted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div className="text-sm text-neutral-500 dark:text-neutral-500">
          © {new Date().getFullYear()} Panzera.
        </div>

        <div className="flex flex-wrap items-center gap-6 mt-2 md:mt-0">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center justify-center p-1 -m-1"
              aria-label="Cookie settings"
            >
              <PixelCookieIcon className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <div className="absolute bottom-full right-0 md:left-1/2 md:-translate-x-1/2 mb-2 z-50">
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
          <a href="https://github.com/lucaspanzera1" aria-label="GitHub" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center justify-center p-1 -m-1">
            <PixelCodeIcon className="w-5 h-5" />
          </a>
          <a href="https://www.linkedin.com/in/lucas-panzera/" aria-label="LinkedIn" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center justify-center p-1 -m-1">
            <PixelLinkedinIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
