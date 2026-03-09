import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Pushes a virtual page_view event to dataLayer on every SPA route change.
 * GTM picks this up via a "History Change" or custom event trigger.
 */
export default function GTMPageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'page_view',
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location.pathname, location.search]);

  return null;
}
