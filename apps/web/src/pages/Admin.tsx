import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, logout } from '../lib/auth';

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
    <div className="py-24 px-6 max-w-5xl mx-auto min-h-[70vh]">
      <h1 className="text-2xl font-medium tracking-tight text-neutral-900 dark:text-white mb-2">
        Painel
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-10">
        {email ? `Autenticado como ${email}` : 'Carregando sessão...'}
      </p>
      <button
        onClick={handleLogout}
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white transition-colors"
      >
        [ sair ]
      </button>
    </div>
  );
}
