import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../lib/auth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');

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
