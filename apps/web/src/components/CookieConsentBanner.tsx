import { motion, AnimatePresence } from 'framer-motion';
import { sendConsent, deleteMyData, trackPageview, parseReferrerHost } from '../lib/analytics';
import { getConsent, setConsent } from '../lib/consent';

interface CookieConsentBannerProps {
  lang: 'EN' | 'PT';
  open: boolean;
  onClose: () => void;
}

const COPY = {
  PT: {
    text:
      'Usamos um cookie opcional para entender como o site é usado (páginas mais acessadas, visitas ao longo do tempo). Ele só é ativado se você aceitar, e você pode mudar de ideia a qualquer momento.',
    privacyLink: 'Saiba mais',
    accept: 'Aceitar',
    reject: 'Recusar',
  },
  EN: {
    text:
      'We use an optional cookie to understand how the site is used (most visited pages, visits over time). It only activates if you accept, and you can change your mind anytime.',
    privacyLink: 'Learn more',
    accept: 'Accept',
    reject: 'Reject',
  },
};

export function CookieConsentBanner({ lang, open, onClose }: CookieConsentBannerProps) {
  const copy = COPY[lang];

  async function handleAccept() {
    setConsent('granted');
    onClose();
    await sendConsent();
    await trackPageview(window.location.pathname, parseReferrerHost(document.referrer));
  }

  async function handleReject() {
    const previous = getConsent();
    setConsent('denied');
    onClose();
    if (previous?.status === 'granted') {
      await deleteMyData();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 inset-x-0 z-50 backdrop-blur-md bg-[#FAFAFA]/90 dark:bg-[#111111]/90 border-t border-black/5 dark:border-white/5"
        >
          <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 flex-1">
              {copy.text}{' '}
              <a href="/privacy" className="underline hover:text-neutral-900 dark:hover:text-white transition-colors">
                {copy.privacyLink}
              </a>
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600 font-mono text-xs uppercase tracking-wider transition-colors"
              >
                {copy.reject}
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="px-4 py-2 border border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 font-mono text-xs uppercase tracking-wider transition-colors"
              >
                {copy.accept}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
