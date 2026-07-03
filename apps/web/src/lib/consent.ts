export const CURRENT_POLICY_VERSION = 1;

const STORAGE_KEY = 'ong_consent';

export type ConsentStatus = 'granted' | 'denied';

export interface ConsentState {
  status: ConsentStatus;
  policyVersion: number;
  updatedAt: string;
}

export function getConsent(): ConsentState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function setConsent(status: ConsentStatus): ConsentState {
  const state: ConsentState = {
    status,
    policyVersion: CURRENT_POLICY_VERSION,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function hasDecided(): boolean {
  const consent = getConsent();
  return consent !== null && consent.policyVersion === CURRENT_POLICY_VERSION;
}

export function hasAnalyticsConsent(): boolean {
  return getConsent()?.status === 'granted';
}
