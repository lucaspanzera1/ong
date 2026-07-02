import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, logout } from '../lib/auth';
import { TagManager } from '../components/TagManager';
import { ArticleManager } from '../components/ArticleManager';

export function Admin() {
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getSession().then(session => setEmail(session?.email ?? null));
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <div className="py-12 md:py-24 px-6 max-w-6xl mx-auto min-h-[80vh] flex flex-col gap-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/40 dark:bg-black/20 p-6 md:p-8 rounded-3xl border border-neutral-200/60 dark:border-neutral-800/60 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-1">
              Painel Administrativo
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              {email ? `Autenticado como ${email}` : 'Verificando sessão...'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="group relative px-5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 transition-all flex items-center justify-center gap-2 text-sm font-medium shadow-sm hover:shadow-md w-full md:w-auto"
        >
          <span>Sair da conta</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">logout</span>
        </button>
      </header>

      <main className="grid grid-cols-1 gap-8 transition-all duration-500">
        <TagManager />
        <ArticleManager />
      </main>
    </div>
  );
}
