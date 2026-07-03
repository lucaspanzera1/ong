import { CURRENT_POLICY_VERSION } from './consent';

const API_URL = import.meta.env.VITE_API_URL;

export interface DailyPoint {
  date: string;
  visits: number;
  uniqueVisitors: number;
}

export interface AnalyticsSummary {
  range: number;
  totals: { visits: number; uniqueVisitors: number };
  daily: DailyPoint[];
  topPages: { path: string; visits: number }[];
  referrers: { referrerHost: string; visits: number }[];
  devices: { device: string; visits: number }[];
  browsers: { browser: string; visits: number }[];
  countries: { country: string; visits: number }[];
}

export async function sendConsent(): Promise<void> {
  await fetch(`${API_URL}/analytics/consent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ policyVersion: CURRENT_POLICY_VERSION }),
  });
}

export async function trackPageview(path: string, referrerHost?: string): Promise<void> {
  await fetch(`${API_URL}/analytics/pageview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ path, referrerHost }),
  });
}

export async function deleteMyData(): Promise<void> {
  await fetch(`${API_URL}/analytics/me`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export async function getAnalyticsSummary(range: 7 | 30 | 90): Promise<AnalyticsSummary> {
  const res = await fetch(`${API_URL}/analytics/summary?range=${range}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Falha ao carregar analytics');
  return res.json();
}

export function parseReferrerHost(referrer: string): string | undefined {
  if (!referrer) return undefined;
  try {
    const host = new URL(referrer).hostname;
    return host === window.location.hostname ? undefined : host;
  } catch {
    return undefined;
  }
}
