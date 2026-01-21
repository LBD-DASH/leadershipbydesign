import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface UtmParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

const UTM_STORAGE_KEY = 'lbd_utm_params';

export function useUtmParams(): UtmParams {
  const [searchParams] = useSearchParams();
  const [utmParams, setUtmParams] = useState<UtmParams>(() => {
    // Try to get from sessionStorage first (persists across page navigations)
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Invalid JSON, continue to check URL
      }
    }
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
    };
  });

  useEffect(() => {
    // Check URL for UTM params
    const source = searchParams.get('utm_source');
    const medium = searchParams.get('utm_medium');
    const campaign = searchParams.get('utm_campaign');
    const content = searchParams.get('utm_content');
    const term = searchParams.get('utm_term');

    // Only update if we have at least one UTM param in the URL
    if (source || medium || campaign || content || term) {
      const newParams: UtmParams = {
        utm_source: source,
        utm_medium: medium,
        utm_campaign: campaign,
        utm_content: content,
        utm_term: term,
      };
      setUtmParams(newParams);
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(newParams));
    }
  }, [searchParams]);

  return utmParams;
}
