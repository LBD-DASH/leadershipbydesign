import { useState } from 'react';
import { Loader2, Wand2, Save, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import AdPreviewCard from './AdPreviewCard';
import CampaignBriefModal from './CampaignBriefModal';
import { generateGoogleAdsCSV, generateCSVFilename, downloadCSV } from '@/lib/googleAdsExport';

const AD_TYPES = [
  { value: 'search', label: 'Responsive Search Ads', description: '15 headlines + 4 descriptions' },
  { value: 'display', label: 'Display Ads', description: 'Headlines, descriptions, CTAs' },
  { value: 'pmax', label: 'Performance Max', description: 'Full asset group' },
];

const SERVICES = [
  { value: 'executive-coaching', label: 'Executive Coaching', description: 'High-ticket 1:1 coaching for C-Suite' },
  { value: 'team-workshops', label: 'Team Workshops', description: 'Alignment, Motivation & Leadership workshops' },
  { value: 'shift-programme', label: 'SHIFT Leadership Development', description: '5-skill transformation programme' },
];

interface GeneratedContent {
  adType: string;
  service: string;
  content: any;
  generatedAt: string;
}

export default function GoogleAdsGenerator() {
  const [adType, setAdType] = useState<string>('search');
  const [service, setService] = useState<string>('executive-coaching');
  const [additionalContext, setAdditionalContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showBriefModal, setShowBriefModal] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-google-ads', {
        body: { adType, service, additionalContext }
      });

      if (error) throw error;

      setGeneratedContent(data);
      toast.success('Ad content generated successfully!');
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate ad content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('google_ads_content').insert({
        campaign_type: generatedContent.adType,
        service_reference: generatedContent.service,
        headlines: generatedContent.content.headlines || [],
        descriptions: generatedContent.content.descriptions || [],
        keywords: generatedContent.content.keywords || null,
        negative_keywords: generatedContent.content.negativeKeywords || null,
        audience_signals: generatedContent.content.audienceSignals || null,
        status: 'draft',
      });

      if (error) throw error;

      toast.success('Ad content saved to drafts!');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save ad content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            AI Ad Copy Generator
          </CardTitle>
          <CardDescription>
            Generate Google Ads copy optimised with buyer psychology and SA market targeting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adType">Ad Type</Label>
              <Select value={adType} onValueChange={setAdType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ad type" />
                </SelectTrigger>
                <SelectContent>
                  {AD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <span className="font-medium">{type.label}</span>
                        <span className="text-muted-foreground text-xs ml-2">({type.description})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service / Programme</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map((svc) => (
                    <SelectItem key={svc.value} value={svc.value}>
                      {svc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Additional Context (Optional)</Label>
            <Textarea
              id="context"
              placeholder="Add specific campaign goals, promotions, or targeting notes..."
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Ad Copy
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {generatedContent && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Content</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowBriefModal(true)}>
                View Campaign Brief
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const csv = generateGoogleAdsCSV(
                    generatedContent.adType,
                    generatedContent.content.headlines || [],
                    generatedContent.content.descriptions || [],
                    generatedContent.service
                  );
                  const filename = generateCSVFilename(generatedContent.adType, generatedContent.service);
                  downloadCSV(csv, filename);
                  toast.success('CSV downloaded! Import it into Google Ads Editor.');
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export for Google Ads Editor
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save to Drafts
              </Button>
            </div>
          </div>

          <AdPreviewCard 
            adType={generatedContent.adType} 
            content={generatedContent.content} 
            service={generatedContent.service}
          />

          <CampaignBriefModal
            open={showBriefModal}
            onOpenChange={setShowBriefModal}
            content={generatedContent}
          />
        </div>
      )}

      {/* Tips Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-medium">Tips for Best Results:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Generated copy uses Move Toward/Move Away buyer psychology</li>
                <li>Headlines are optimised for 30-character Google Ads limits</li>
                <li>Copy/paste directly into Google Ads Editor</li>
                <li>Save drafts to track and compare different versions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
