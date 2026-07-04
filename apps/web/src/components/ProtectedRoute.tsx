import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../lib/auth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    let wasCreated = false;
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      meta.setAttribute('content', 'noindex, nofollow');
      document.head.appendChild(meta);
      wasCreated = true;
    } else {
      meta.setAttribute('content', 'noindex, nofollow');
    }

    return () => {
      if (meta && wasCreated) {
        meta.remove();
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getSession().then(session => {
      if (!cancelled) setStatus(session ? 'authorized' : 'unauthorized');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'checking') return null;
  if (status === 'unauthorized') return <Navigate to="/" replace />;
  return <>{children}</>;
}
