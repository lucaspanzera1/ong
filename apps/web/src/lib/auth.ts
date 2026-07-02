const API_URL = import.meta.env.VITE_API_URL;

export interface Session {
  email: string;
}

export async function getSession(): Promise<Session | null> {
  const res = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
  if (!res.ok) return null;
  return res.json();
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
}
