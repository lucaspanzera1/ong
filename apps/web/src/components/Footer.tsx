import { useState } from 'react';
import { Link } from 'react-router-dom';
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

export function Footer({ lang, onOpenCookiePreferences }: FooterProps) {
  const copy = COPY[lang];
  const [deleted, setDeleted] = useState(false);

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
          <Link to="/privacy" className="text-sm font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
            {copy.privacy}
          </Link>
          <button
            type="button"
            onClick={onOpenCookiePreferences}
            className="text-sm font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {copy.cookiePreferences}
          </button>
          <button
            type="button"
            onClick={handleDeleteData}
            className="text-sm font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {deleted ? copy.deleted : copy.deleteData}
          </button>
          <a href="https://github.com/lucaspanzera1" className="text-sm font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/lucas-panzera/" className="text-sm font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
