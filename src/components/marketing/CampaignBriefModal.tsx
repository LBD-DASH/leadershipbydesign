import { Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface CampaignBriefModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: {
    adType: string;
    service: string;
    content: any;
    generatedAt: string;
  } | null;
}

const SERVICE_LABELS: Record<string, string> = {
  'executive-coaching': 'Executive Coaching',
  'shift-programme': 'SHIFT Programme',
  'leadership-workshop': 'Leadership Workshop',
  'motivation-workshop': 'Motivation Workshop',
  'alignment-workshop': 'Alignment Workshop',
  'ai-leadership': 'AI Leadership Programme',
};

const AD_TYPE_LABELS: Record<string, string> = {
  'search': 'Responsive Search Ads',
  'display': 'Display Ads',
  'pmax': 'Performance Max',
};

function formatCampaignBrief(content: any, service: string, adType: string): string {
  const lines: string[] = [];
  const serviceLabel = SERVICE_LABELS[service] || service;
  const adTypeLabel = AD_TYPE_LABELS[adType] || adType;
  
  lines.push(`CAMPAIGN BRIEF: ${serviceLabel}`);
  lines.push('='.repeat(50));
  lines.push(`Ad Type: ${adTypeLabel}`);
  lines.push(`Generated: ${new Date().toLocaleDateString('en-ZA')}`);
  lines.push('');
  lines.push('OBJECTIVE');
  lines.push('-'.repeat(30));
  lines.push('Lead generation for diagnostic completions');
  lines.push('Target CPA: R500-R1000 per qualified lead');
  lines.push('');

  // Headlines
  if (content.headlines) {
    if (Array.isArray(content.headlines)) {
      lines.push(`HEADLINES (${content.headlines.length})`);
      lines.push('-'.repeat(30));
      content.headlines.forEach((h: string, i: number) => {
        lines.push(`${i + 1}. "${h}" (${h.length} chars)`);
      });
    } else {
      if (content.headlines.short) {
        if (Array.isArray(content.headlines.short)) {
          lines.push('SHORT HEADLINES');
          lines.push('-'.repeat(30));
          content.headlines.short.forEach((h: string, i: number) => {
            lines.push(`${i + 1}. "${h}" (${h.length} chars)`);
          });
        } else {
          lines.push(`SHORT HEADLINE: "${content.headlines.short}" (${content.headlines.short.length} chars)`);
        }
        lines.push('');
      }
      if (content.headlines.long) {
        if (Array.isArray(content.headlines.long)) {
          lines.push('LONG HEADLINES');
          lines.push('-'.repeat(30));
          content.headlines.long.forEach((h: string, i: number) => {
            lines.push(`${i + 1}. "${h}" (${h.length} chars)`);
          });
        } else {
          lines.push(`LONG HEADLINE: "${content.headlines.long}" (${content.headlines.long.length} chars)`);
        }
      }
    }
    lines.push('');
  }

  // Descriptions
  if (content.descriptions) {
    if (Array.isArray(content.descriptions)) {
      lines.push(`DESCRIPTIONS (${content.descriptions.length})`);
      lines.push('-'.repeat(30));
      content.descriptions.forEach((d: string, i: number) => {
        lines.push(`${i + 1}. "${d}" (${d.length} chars)`);
      });
    } else {
      if (content.descriptions.short) {
        lines.push('DESCRIPTIONS');
        lines.push('-'.repeat(30));
        content.descriptions.short.forEach((d: string, i: number) => {
          lines.push(`${i + 1}. "${d}" (${d.length} chars)`);
        });
      }
      if (content.descriptions.long) {
        lines.push('');
        lines.push(`LONG DESCRIPTION: "${content.descriptions.long}"`);
      }
    }
    lines.push('');
  }

  // Keywords
  if (content.keywords && content.keywords.length > 0) {
    lines.push('KEYWORDS');
    lines.push('-'.repeat(30));
    content.keywords.forEach((k: string) => {
      lines.push(`• ${k}`);
    });
    lines.push('');
  }

  // Negative Keywords
  if (content.negativeKeywords && content.negativeKeywords.length > 0) {
    lines.push('NEGATIVE KEYWORDS');
    lines.push('-'.repeat(30));
    content.negativeKeywords.forEach((k: string) => {
      lines.push(`• ${k}`);
    });
    lines.push('');
  }

  // Audience Signals
  if (content.audienceSignals) {
    lines.push('AUDIENCE SIGNALS');
    lines.push('-'.repeat(30));
    if (content.audienceSignals.jobTitles) {
      lines.push(`Job Titles: ${content.audienceSignals.jobTitles.join(', ')}`);
    }
    if (content.audienceSignals.industries) {
      lines.push(`Industries: ${content.audienceSignals.industries.join(', ')}`);
    }
    if (content.audienceSignals.interests) {
      lines.push(`Interests: ${content.audienceSignals.interests.join(', ')}`);
    }
    if (content.audienceSignals.demographics) {
      lines.push(`Demographics: ${content.audienceSignals.demographics.join(', ')}`);
    }
    lines.push('');
  }

  // CTAs
  if (content.ctaOptions) {
    lines.push('CALL TO ACTIONS');
    lines.push('-'.repeat(30));
    content.ctaOptions.forEach((cta: string) => {
      lines.push(`• ${cta}`);
    });
    lines.push('');
  }

  if (content.callToActions) {
    lines.push('CALL TO ACTIONS');
    lines.push('-'.repeat(30));
    content.callToActions.forEach((cta: string) => {
      lines.push(`• ${cta}`);
    });
    lines.push('');
  }

  // Image Concepts
  if (content.imageConceptSuggestions) {
    lines.push('IMAGE CONCEPTS');
    lines.push('-'.repeat(30));
    content.imageConceptSuggestions.forEach((concept: string) => {
      lines.push(`• ${concept}`);
    });
    lines.push('');
  }

  lines.push('='.repeat(50));
  lines.push('Generated by Leadership by Design Marketing Engine');

  return lines.join('\n');
}

export default function CampaignBriefModal({ open, onOpenChange, content }: CampaignBriefModalProps) {
  if (!content) return null;

  const briefText = formatCampaignBrief(content.content, content.service, content.adType);

  const handleCopy = () => {
    navigator.clipboard.writeText(briefText);
    toast.success('Campaign brief copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([briefText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-brief-${content.service}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Campaign brief downloaded!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Campaign Brief</DialogTitle>
          <DialogDescription>
            Copy this brief to paste into Google Ads or share with your team
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy All
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        <ScrollArea className="h-[400px] rounded-md border p-4">
          <pre className="text-sm font-mono whitespace-pre-wrap">{briefText}</pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
