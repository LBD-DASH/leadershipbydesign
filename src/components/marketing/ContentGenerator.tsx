import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Linkedin, Twitter, FileText, Mail, Loader2, Copy, Check, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContentVariation {
  title?: string;
  content: string;
  hashtags?: string[];
  notes?: string;
}

const CONTENT_TYPES = [
  { value: 'social_linkedin', label: 'LinkedIn Post', icon: Linkedin },
  { value: 'social_twitter', label: 'Twitter/X Post', icon: Twitter },
  { value: 'blog_outline', label: 'Blog Outline', icon: FileText },
  { value: 'email', label: 'Email', icon: Mail },
];

const SOURCE_OPTIONS = [
  { value: 'executive-coaching', label: 'Executive Coaching' },
  { value: 'shift-leadership', label: 'SHIFT Leadership Development' },
  { value: 'team-diagnostic', label: 'Team Diagnostic' },
  { value: 'leadership-diagnostic', label: 'Leadership Diagnostic' },
  { value: 'shift-diagnostic', label: 'SHIFT Diagnostic' },
  { value: 'alignment-workshop', label: 'Alignment Workshop' },
  { value: 'motivation-workshop', label: 'Motivation Workshop' },
  { value: 'leadership-workshop', label: 'Leadership Workshop' },
];

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'inspiring', label: 'Inspiring' },
  { value: 'educational', label: 'Educational' },
];

export default function ContentGenerator() {
  const [contentType, setContentType] = useState<string>('social_linkedin');
  const [sourceType, setSourceType] = useState<string>('service');
  const [sourceReference, setSourceReference] = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [tone, setTone] = useState<string>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [variations, setVariations] = useState<ContentVariation[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (sourceType === 'service' && !sourceReference) {
      toast.error('Please select a service or topic');
      return;
    }
    if (sourceType === 'topic' && !customTopic.trim()) {
      toast.error('Please enter a custom topic');
      return;
    }

    setIsGenerating(true);
    setVariations([]);

    try {
      const { data, error } = await supabase.functions.invoke('generate-marketing-content', {
        body: {
          contentType,
          sourceType,
          sourceReference: sourceType === 'service' ? sourceReference : undefined,
          customTopic: sourceType === 'topic' ? customTopic : undefined,
          tone,
          count: 3,
        },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setVariations(data.variations || []);
      toast.success(`Generated ${data.variations?.length || 0} content variations`);
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveToQueue = async (variation: ContentVariation, index: number) => {
    setSavingIndex(index);
    try {
      const { error } = await supabase
        .from('marketing_content')
        .insert({
          content_type: contentType,
          title: variation.title || null,
          content: variation.content,
          hashtags: variation.hashtags || [],
          source_type: sourceType,
          source_reference: sourceType === 'service' ? sourceReference : customTopic,
          status: 'pending_review',
        });

      if (error) throw error;

      toast.success('Saved to content queue');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save content');
    } finally {
      setSavingIndex(null);
    }
  };

  const ContentTypeIcon = CONTENT_TYPES.find(t => t.value === contentType)?.icon || FileText;

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Generate marketing content powered by AI. Choose your platform, topic, and tone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Type Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CONTENT_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setContentType(type.value)}
                className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                  contentType === type.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <type.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Source Type */}
            <div className="space-y-2">
              <Label>Content Source</Label>
              <Select value={sourceType} onValueChange={setSourceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">From Service/Programme</SelectItem>
                  <SelectItem value="topic">Custom Topic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Source Reference or Custom Topic */}
          {sourceType === 'service' ? (
            <div className="space-y-2">
              <Label>Select Service/Programme</Label>
              <Select value={sourceReference} onValueChange={setSourceReference}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service..." />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Custom Topic</Label>
              <Textarea
                placeholder="E.g., 'The importance of self-management in remote teams' or 'How leaders can build psychological safety'"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="lg"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Content...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate {contentType === 'social_linkedin' ? 'LinkedIn Posts' : 
                          contentType === 'social_twitter' ? 'Tweets' :
                          contentType === 'blog_outline' ? 'Blog Outlines' : 'Emails'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Variations */}
      <AnimatePresence mode="wait">
        {variations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Generated Variations ({variations.length})
              </h3>
              <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isGenerating}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            </div>

            <div className="grid gap-4">
              {variations.map((variation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <ContentTypeIcon className="w-5 h-5 text-primary" />
                          <span className="font-medium text-foreground">
                            {variation.title || `Variation ${index + 1}`}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(variation.content, index)}
                          >
                            {copiedIndex === index ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleSaveToQueue(variation, index)}
                            disabled={savingIndex === index}
                          >
                            {savingIndex === index ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-1" />
                                Save
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <p className="text-foreground whitespace-pre-wrap">{variation.content}</p>
                      </div>

                      {variation.hashtags && variation.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {variation.hashtags.map((tag, i) => (
                            <Badge key={i} variant="secondary">
                              #{tag.replace('#', '')}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {variation.notes && (
                        <p className="text-sm text-muted-foreground italic">
                          💡 {variation.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
