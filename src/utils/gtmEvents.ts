/**
 * Centralized GTM/GA4 dataLayer event helpers.
 * Each function pushes a structured event that GTM forwards to GA4.
 * Mark these as "Key Events" (conversions) in GA4 Admin → Events.
 */

function push(payload: Record<string, unknown>) {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push(payload);
  }
}

/** Fires when a contact / enquiry form is submitted */
export function trackContactFormSubmit(meta?: { service_interest?: string; source?: string }) {
  push({
    event: 'contact_form_submit',
    event_category: 'conversion',
    ...meta,
  });
}

/** Fires on a successful product purchase */
export function trackPurchaseComplete(meta: { product_name: string; value?: number; currency?: string }) {
  push({
    event: 'purchase_complete',
    event_category: 'conversion',
    ecommerce: {
      currency: meta.currency ?? 'ZAR',
      value: meta.value ?? 0,
      items: [{ item_name: meta.product_name }],
    },
  });
}

/** Fires when a user completes any diagnostic */
export function trackDiagnosticComplete(meta: { diagnostic_type: string }) {
  push({
    event: 'diagnostic_complete',
    event_category: 'conversion',
    diagnostic_type: meta.diagnostic_type,
  });
}

/** Fires when a user downloads a lead magnet */
export function trackLeadMagnetDownload(meta: { lead_magnet: string }) {
  push({
    event: 'lead_magnet_download',
    event_category: 'conversion',
    lead_magnet: meta.lead_magnet,
  });
}

/** Fires when a CTA to schedule a call is clicked (already used in Leader as Coach) */
export function trackScheduleCallClick(meta?: { source?: string }) {
  push({
    event: 'schedule_call_click',
    event_category: 'engagement',
    ...meta,
  });
}

/** Fires when any CTA button is clicked — generic engagement event */
export function trackCTAClick(meta: { cta_label: string; cta_location?: string; destination?: string }) {
  push({
    event: 'cta_click',
    event_category: 'engagement',
    ...meta,
  });
}
