import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GA_PROPERTY_URL = 'https://analytics.google.com/analytics/web/#/p';

export default function GoogleAnalyticsCard() {
  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-4">Google Analytics</h2>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="font-semibold text-foreground">GTM Container: GTM-TV3SFR3G</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Google Tag Manager is installed and firing on all pages. SPA virtual page views are pushed via <code className="text-xs bg-muted px-1 py-0.5 rounded">dataLayer</code> on every route change.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Tracked Events</p>
                  <ul className="mt-1 space-y-0.5 text-foreground text-xs">
                    <li>• page_view (every route)</li>
                    <li>• schedule_call_click</li>
                    <li>• contact_form_submit</li>
                    <li>• purchase_complete</li>
                    <li>• diagnostic_complete</li>
                    <li>• lead_magnet_download</li>
                    <li>• cta_click</li>
                  </ul>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Integration Status</p>
                  <ul className="mt-1 space-y-0.5 text-xs">
                    <li className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> GTM installed</li>
                    <li className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> SPA page views</li>
                    <li className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Conversion events</li>
                    <li className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> CTA click tracking</li>
                    <li className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> GA4 property linked</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" asChild>
                  <a href="https://tagmanager.google.com/#/container/accounts/6107801386/containers/196693736/workspaces" target="_blank" rel="noopener noreferrer">
                    Open GTM <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={GA_PROPERTY_URL} target="_blank" rel="noopener noreferrer">
                    Open GA4 <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
