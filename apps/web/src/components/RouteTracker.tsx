import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageview, sendConsent, parseReferrerHost } from '../lib/analytics';
import { getConsent, hasAnalyticsConsent, CURRENT_POLICY_VERSION } from '../lib/consent';

interface RouteTrackerProps {
  adminPath: string;
}

export function RouteTracker({ adminPath }: RouteTrackerProps) {
  const location = useLocation();
  const repairedRef = useRef(false);

  useEffect(() => {
    if (repairedRef.current) return;
    repairedRef.current = true;
    const consent = getConsent();
    if (consent?.status === 'granted' && consent.policyVersion === CURRENT_POLICY_VERSION) {
      void sendConsent();
    }
  }, []);

  useEffect(() => {
    if (adminPath && location.pathname.startsWith(adminPath)) return;
    if (!hasAnalyticsConsent()) return;
    void trackPageview(location.pathname, parseReferrerHost(document.referrer));
  }, [location.pathname, adminPath]);

  return null;
}
