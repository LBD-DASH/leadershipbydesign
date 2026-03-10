import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackHighIntentPageView, trackBookingIntent, trackDiagnosticStarted, trackDiagnosticAbandoned } from '@/utils/gtmEvents';

/**
 * Tracks high-intent page views (repeat visits to /leader-as-coach in same session).
 */
export function useHighIntentTracking() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/leader-as-coach') return;

    const key = 'lbd_lac_views';
    const count = parseInt(sessionStorage.getItem(key) || '0', 10) + 1;
    sessionStorage.setItem(key, String(count));

    if (count >= 2) {
      trackHighIntentPageView({ page: '/leader-as-coach', view_count: count });
    }
  }, [location.pathname]);
}

/**
 * Fires booking_intent when user scrolls past 80% of the page without clicking book.
 */
export function useBookingIntentTracking() {
  const fired = useRef(false);

  useEffect(() => {
    const handler = () => {
      if (fired.current) return;
      const scrollPct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrollPct >= 0.8) {
        fired.current = true;
        trackBookingIntent({ page: '/leader-as-coach' });
      }
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
}

/**
 * Fires diagnostic_started when user begins the LAC diagnostic,
 * and diagnostic_abandoned if they don't complete within 10 minutes.
 */
export function useDiagnosticTracking(diagnosticType: string, hasStarted: boolean, hasCompleted: boolean) {
  const abandonTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hasStarted && !hasCompleted) {
      trackDiagnosticStarted({ diagnostic_type: diagnosticType });

      abandonTimer.current = setTimeout(() => {
        if (!hasCompleted) {
          trackDiagnosticAbandoned({ diagnostic_type: diagnosticType });
        }
      }, 10 * 60 * 1000); // 10 minutes
    }

    return () => {
      if (abandonTimer.current) clearTimeout(abandonTimer.current);
    };
  }, [hasStarted, hasCompleted, diagnosticType]);
}
