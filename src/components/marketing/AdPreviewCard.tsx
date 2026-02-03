import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

interface AdPreviewCardProps {
  adType: string;
  content: any;
  service: string;
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(label ? `${label} copied!` : 'Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} className="h-6 w-6">
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
}

function HeadlinesList({ headlines, maxChars }: { headlines: string[]; maxChars: number }) {
  return (
    <div className="space-y-2">
      {headlines.map((headline, index) => {
        const isOverLimit = headline.length > maxChars;
        return (
          <div
            key={index}
            className={`flex items-center justify-between p-2 rounded-md border ${
              isOverLimit ? 'border-destructive bg-destructive/10' : 'border-border bg-muted/50'
            }`}
          >
            <div className="flex-1 min-w-0">
              <span className="text-sm">{headline}</span>
              <span className={`text-xs ml-2 ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                ({headline.length}/{maxChars})
              </span>
            </div>
            <CopyButton text={headline} />
          </div>
        );
      })}
    </div>
  );
}

function KeywordsList({ keywords, type }: { keywords: string[]; type: 'positive' | 'negative' }) {
  const [isOpen, setIsOpen] = useState(false);
  const allKeywords = keywords.join('\n');

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-2 h-auto">
          <span className="text-sm font-medium">
            {type === 'positive' ? 'Keywords' : 'Negative Keywords'} ({keywords.length})
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pt-2">
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Badge 
              key={index} 
              variant={type === 'positive' ? 'secondary' : 'outline'}
              className="text-xs"
            >
              {keyword}
            </Badge>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => {
          navigator.clipboard.writeText(allKeywords);
          toast.success('All keywords copied!');
        }}>
          <Copy className="h-3 w-3 mr-2" />
          Copy All
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function AdPreviewCard({ adType, content, service }: AdPreviewCardProps) {
  const copyAllContent = () => {
    const formattedContent = JSON.stringify(content, null, 2);
    navigator.clipboard.writeText(formattedContent);
    toast.success('All content copied as JSON!');
  };

  if (adType === 'search') {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Headlines (15)</CardTitle>
              <Badge variant="outline">Max 30 chars</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <HeadlinesList headlines={content.headlines || []} maxChars={30} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Descriptions (4)</CardTitle>
              <Badge variant="outline">Max 90 chars</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <HeadlinesList headlines={content.descriptions || []} maxChars={90} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Targeting Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.keywords && <KeywordsList keywords={content.keywords} type="positive" />}
            {content.negativeKeywords && <KeywordsList keywords={content.negativeKeywords} type="negative" />}
            
            {content.audienceSignals && (
              <div className="space-y-2 pt-2 border-t">
                <p className="text-sm font-medium">Audience Signals</p>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  {content.audienceSignals.jobTitles && (
                    <p><span className="font-medium text-foreground">Job Titles:</span> {content.audienceSignals.jobTitles.join(', ')}</p>
                  )}
                  {content.audienceSignals.industries && (
                    <p><span className="font-medium text-foreground">Industries:</span> {content.audienceSignals.industries.join(', ')}</p>
                  )}
                  {content.audienceSignals.interests && (
                    <p><span className="font-medium text-foreground">Interests:</span> {content.audienceSignals.interests.join(', ')}</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (adType === 'display') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Display Ad Assets</CardTitle>
            <Button variant="outline" size="sm" onClick={copyAllContent}>
              <Copy className="h-3 w-3 mr-2" />
              Copy All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Short Headline (25 chars)</p>
            <div className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
              <span className="text-sm">{content.headlines?.short}</span>
              <CopyButton text={content.headlines?.short || ''} />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Long Headline (90 chars)</p>
            <div className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
              <span className="text-sm">{content.headlines?.long}</span>
              <CopyButton text={content.headlines?.long || ''} />
            </div>
          </div>

          {content.descriptions?.map((desc: string, index: number) => (
            <div key={index} className="space-y-2">
              <p className="text-sm font-medium">Description {index + 1}</p>
              <div className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                <span className="text-sm">{desc}</span>
                <CopyButton text={desc} />
              </div>
            </div>
          ))}

          {content.ctaOptions && (
            <div className="space-y-2">
              <p className="text-sm font-medium">CTA Options</p>
              <div className="flex flex-wrap gap-2">
                {content.ctaOptions.map((cta: string, index: number) => (
                  <Badge key={index} variant="secondary">{cta}</Badge>
                ))}
              </div>
            </div>
          )}

          {content.imageConceptSuggestions && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-sm font-medium">Image Concepts</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {content.imageConceptSuggestions.map((concept: string, index: number) => (
                  <li key={index}>{concept}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Performance Max
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Short Headlines (5)</CardTitle>
        </CardHeader>
        <CardContent>
          <HeadlinesList headlines={content.headlines?.short || []} maxChars={30} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Long Headlines (5)</CardTitle>
        </CardHeader>
        <CardContent>
          <HeadlinesList headlines={content.headlines?.long || []} maxChars={90} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Descriptions (5)</CardTitle>
        </CardHeader>
        <CardContent>
          <HeadlinesList headlines={content.descriptions?.short || []} maxChars={90} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Additional Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.descriptions?.long && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Long Description</p>
              <div className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                <span className="text-sm">{content.descriptions.long}</span>
                <CopyButton text={content.descriptions.long} />
              </div>
            </div>
          )}

          {content.callToActions && (
            <div className="space-y-2">
              <p className="text-sm font-medium">CTAs</p>
              <div className="flex flex-wrap gap-2">
                {content.callToActions.map((cta: string, index: number) => (
                  <Badge key={index} variant="secondary">{cta}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Targeting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.keywords && <KeywordsList keywords={content.keywords} type="positive" />}
          {content.negativeKeywords && <KeywordsList keywords={content.negativeKeywords} type="negative" />}
          
          {content.audienceSignals && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-sm font-medium">Audience Signals</p>
              <div className="grid gap-2 text-sm text-muted-foreground">
                {content.audienceSignals.jobTitles && (
                  <p><span className="font-medium text-foreground">Job Titles:</span> {content.audienceSignals.jobTitles.join(', ')}</p>
                )}
                {content.audienceSignals.industries && (
                  <p><span className="font-medium text-foreground">Industries:</span> {content.audienceSignals.industries.join(', ')}</p>
                )}
                {content.audienceSignals.interests && (
                  <p><span className="font-medium text-foreground">Interests:</span> {content.audienceSignals.interests.join(', ')}</p>
                )}
                {content.audienceSignals.demographics && (
                  <p><span className="font-medium text-foreground">Demographics:</span> {content.audienceSignals.demographics.join(', ')}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
