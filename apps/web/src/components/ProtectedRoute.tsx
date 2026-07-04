import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession, refreshSession } from '../lib/auth';

const REFRESH_THROTTLE_MS = 5 * 60 * 1000;
const ACTIVITY_EVENTS = ['keydown', 'input', 'mousedown', 'pointerdown'] as const;

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

  const lastRefreshRef = useRef(0);

  useEffect(() => {
    if (status !== 'authorized') return;

    function handleActivity() {
      const now = Date.now();
      if (now - lastRefreshRef.current < REFRESH_THROTTLE_MS) return;
      lastRefreshRef.current = now;
      refreshSession().catch(() => {});
    }

    ACTIVITY_EVENTS.forEach(event => window.addEventListener(event, handleActivity));
    return () => {
      ACTIVITY_EVENTS.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [status]);

  if (status === 'checking') return null;
  if (status === 'unauthorized') return <Navigate to="/" replace />;
  return <>{children}</>;
}
