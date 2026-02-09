import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Youtube, 
  Loader2, 
  FileText, 
  Linkedin, 
  Video, 
  Mail, 
  BookOpen, 
  Twitter,
  Download,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useContentAssets, ContentAsset } from '@/hooks/useContentAssets';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { generateLeadMagnetPdf } from '@/lib/generateLeadMagnetPdf';

export default function ContentEngine() {
  const { assets, loading, processing, processVideo, deleteAsset } = useContentAssets();
  const [videoUrl, setVideoUrl] = useState('');
  const [manualTranscript, setManualTranscript] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [expandedAssetId, setExpandedAssetId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!videoUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a YouTube URL',
        variant: 'destructive',
      });
      return;
    }

    if (!manualTranscript.trim()) {
      toast({
        title: 'Transcript required',
        description: 'Please paste the video transcript. On YouTube, click "..." → "Show transcript", then copy the text.',
        variant: 'destructive',
      });
      setShowManualInput(true);
      return;
    }

    await processVideo(videoUrl, manualTranscript);
    setVideoUrl('');
    setManualTranscript('');
    setShowManualInput(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'processing':
      case 'generating_pdf':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAssetCount = (asset: ContentAsset) => {
    let count = 0;
    if (asset.pdf_summary) count++;
    if (asset.linkedin_long) count++;
    if (asset.linkedin_short) count++;
    if (asset.short_form_scripts?.length) count += asset.short_form_scripts.length;
    if (asset.email_block) count++;
    if (asset.blog_post) count++;
    if (asset.twitter_thread?.length) count++;
    return count;
  };

  return (
    <div className="space-y-6">
      {/* Video Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-600" />
            Process YouTube Video
          </CardTitle>
          <CardDescription>
            Paste a YouTube URL and transcript to generate 9+ content assets automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="https://youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1"
              disabled={processing}
            />
            <Button
              onClick={handleProcess}
              disabled={processing || !videoUrl.trim()}
              className="min-w-[140px]"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Process Video'
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-sm font-medium text-foreground flex items-center gap-1"
            >
              {showManualInput ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Paste transcript {!manualTranscript && <span className="text-destructive ml-1">(required)</span>}
              {manualTranscript && <Check className="w-4 h-4 text-green-600 ml-1" />}
            </button>
            <p className="text-xs text-muted-foreground">
              On YouTube: click ⋯ below the video → "Show transcript" → Select all → Copy
            </p>
          </div>

          <AnimatePresence>
            {showManualInput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <Textarea
                  placeholder="Paste the full video transcript here..."
                  value={manualTranscript}
                  onChange={(e) => setManualTranscript(e.target.value)}
                  rows={6}
                  disabled={processing}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {processing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>This may take 1-2 minutes. Generating content with AI...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assets Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : assets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Youtube className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No videos processed yet</h3>
            <p className="text-muted-foreground">
              Paste a YouTube URL above to generate your first content package
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              expanded={expandedAssetId === asset.id}
              onToggle={() => setExpandedAssetId(
                expandedAssetId === asset.id ? null : asset.id
              )}
              onDelete={() => deleteAsset(asset.id)}
              onCopy={copyToClipboard}
              getStatusBadge={getStatusBadge}
              getAssetCount={getAssetCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface AssetCardProps {
  asset: ContentAsset;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onCopy: (text: string, label: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getAssetCount: (asset: ContentAsset) => number;
}

function AssetCard({ 
  asset, 
  expanded, 
  onToggle, 
  onDelete, 
  onCopy, 
  getStatusBadge, 
  getAssetCount 
}: AssetCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string, label: string) => {
    onCopy(text, label);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ text, field, label }: { text: string; field: string; label: string }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleCopy(text, field, label)}
      className="gap-1"
    >
      {copiedField === field ? (
        <Check className="w-3 h-3" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
      Copy
    </Button>
  );

  return (
    <Card className={expanded ? 'ring-2 ring-primary' : ''}>
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start gap-4">
          {asset.video_thumbnail ? (
            <img
              src={asset.video_thumbnail}
              alt={asset.video_title || 'Video thumbnail'}
              className="w-32 h-20 object-cover rounded-md flex-shrink-0"
            />
          ) : (
            <div className="w-32 h-20 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
              <Youtube className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg truncate">
                  {asset.video_title || 'Processing...'}
                </CardTitle>
                <CardDescription className="mt-1">
                  {asset.created_at && format(new Date(asset.created_at), 'MMM d, yyyy h:mm a')}
                  {asset.video_duration && ` • ${asset.video_duration}`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {getStatusBadge(asset.status)}
                {asset.status === 'completed' && (
                  <Badge variant="outline">{getAssetCount(asset)} assets</Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {expanded && asset.status === 'completed' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0">
              <Tabs defaultValue="pdf" className="w-full">
                <TabsList className="grid grid-cols-6 w-full">
                  <TabsTrigger value="pdf" className="gap-1">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">PDF</span>
                  </TabsTrigger>
                  <TabsTrigger value="linkedin" className="gap-1">
                    <Linkedin className="w-4 h-4" />
                    <span className="hidden sm:inline">LinkedIn</span>
                  </TabsTrigger>
                  <TabsTrigger value="shorts" className="gap-1">
                    <Video className="w-4 h-4" />
                    <span className="hidden sm:inline">Shorts</span>
                  </TabsTrigger>
                  <TabsTrigger value="email" className="gap-1">
                    <Mail className="w-4 h-4" />
                    <span className="hidden sm:inline">Email</span>
                  </TabsTrigger>
                  <TabsTrigger value="blog" className="gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">Blog</span>
                  </TabsTrigger>
                  <TabsTrigger value="twitter" className="gap-1">
                    <Twitter className="w-4 h-4" />
                    <span className="hidden sm:inline">X/Twitter</span>
                  </TabsTrigger>
                </TabsList>

                {/* PDF Tab */}
                <TabsContent value="pdf" className="mt-4 space-y-4">
                  {asset.pdf_summary && (
                    <>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg">{asset.pdf_summary.title}</h4>
                        <Button onClick={() => {
                          if (asset.pdf_summary) {
                            generateLeadMagnetPdf(asset.pdf_summary, asset.video_title);
                          }
                        }}>
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Key Takeaways:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                          {asset.pdf_summary.takeaways.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-2">
                        {asset.relevant_product && (
                          <Badge variant="outline">Recommended: {asset.relevant_product}</Badge>
                        )}
                        {asset.relevant_diagnostic && (
                          <Badge variant="secondary">Diagnostic: {asset.relevant_diagnostic}</Badge>
                        )}
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* LinkedIn Tab */}
                <TabsContent value="linkedin" className="mt-4 space-y-6">
                  {asset.linkedin_long && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Long-form Post ({asset.linkedin_long.length} chars)</h5>
                        <CopyButton text={asset.linkedin_long} field="linkedin_long" label="LinkedIn post" />
                      </div>
                      <pre className="text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap font-sans">
                        {asset.linkedin_long}
                      </pre>
                    </div>
                  )}

                  {asset.linkedin_short && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Short/Quote Post ({asset.linkedin_short.length} chars)</h5>
                        <CopyButton text={asset.linkedin_short} field="linkedin_short" label="LinkedIn quote" />
                      </div>
                      <pre className="text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap font-sans">
                        {asset.linkedin_short}
                      </pre>
                    </div>
                  )}
                </TabsContent>

                {/* Short-form Scripts Tab */}
                <TabsContent value="shorts" className="mt-4 space-y-4">
                  {asset.short_form_scripts?.map((script, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            Script {i + 1}: {script.title}
                          </CardTitle>
                          <CopyButton 
                            text={`HOOK:\n${script.hook}\n\nBODY:\n${script.body}\n\nCTA:\n${script.cta}\n\nON-SCREEN TEXT:\n${script.onscreen_text.join('\n')}`}
                            field={`script_${i}`}
                            label="Script"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-red-600">HOOK (0-3s):</span>
                          <p className="mt-1">{script.hook}</p>
                        </div>
                        <div>
                          <span className="font-medium text-blue-600">BODY (3-25s):</span>
                          <p className="mt-1">{script.body}</p>
                        </div>
                        <div>
                          <span className="font-medium text-green-600">CTA (25-30s):</span>
                          <p className="mt-1">{script.cta}</p>
                        </div>
                        <div>
                          <span className="font-medium text-purple-600">On-Screen Text:</span>
                          <ul className="mt-1 list-disc pl-5">
                            {script.onscreen_text.map((text, j) => (
                              <li key={j}>{text}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Email Tab */}
                <TabsContent value="email" className="mt-4 space-y-4">
                  {asset.email_block && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">Subject Line</h5>
                          <CopyButton text={asset.email_block.subject} field="email_subject" label="Subject" />
                        </div>
                        <p className="text-sm bg-muted p-3 rounded-lg">{asset.email_block.subject}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">Preview Text ({asset.email_block.preview.length} chars)</h5>
                          <CopyButton text={asset.email_block.preview} field="email_preview" label="Preview" />
                        </div>
                        <p className="text-sm bg-muted p-3 rounded-lg">{asset.email_block.preview}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">Email Body</h5>
                          <CopyButton text={asset.email_block.body} field="email_body" label="Email body" />
                        </div>
                        <pre className="text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap font-sans">
                          {asset.email_block.body}
                        </pre>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Blog Tab */}
                <TabsContent value="blog" className="mt-4 space-y-4">
                  {asset.blog_post && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">SEO Title</h5>
                          <CopyButton text={asset.blog_post.title} field="blog_title" label="Blog title" />
                        </div>
                        <p className="text-sm bg-muted p-3 rounded-lg">{asset.blog_post.title}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">Meta Description ({asset.blog_post.meta_description.length} chars)</h5>
                          <CopyButton text={asset.blog_post.meta_description} field="blog_meta" label="Meta description" />
                        </div>
                        <p className="text-sm bg-muted p-3 rounded-lg">{asset.blog_post.meta_description}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">Article Content</h5>
                          <div className="flex gap-2">
                            <CopyButton text={asset.blog_post.content} field="blog_content" label="Blog content" />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigator.clipboard.writeText(
                                `# ${asset.blog_post?.title}\n\n${asset.blog_post?.content}`
                              )}
                            >
                              Copy as Markdown
                            </Button>
                          </div>
                        </div>
                        <div className="prose prose-sm max-w-none bg-muted p-4 rounded-lg">
                          <pre className="whitespace-pre-wrap font-sans text-sm">
                            {asset.blog_post.content}
                          </pre>
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Twitter Tab */}
                <TabsContent value="twitter" className="mt-4 space-y-4">
                  {asset.twitter_thread && (
                    <>
                      <div className="flex justify-end">
                        <CopyButton 
                          text={asset.twitter_thread.join('\n\n---\n\n')} 
                          field="twitter_thread" 
                          label="Twitter thread" 
                        />
                      </div>
                      {asset.twitter_thread.map((tweet, i) => (
                        <Card key={i}>
                          <CardContent className="py-3">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                {i + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">{tweet}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {tweet.length}/280 characters
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show error state */}
      {expanded && asset.status === 'error' && (
        <CardContent>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p>{asset.error_message || 'An error occurred during processing'}</p>
          </div>
        </CardContent>
      )}

      {/* Show processing state */}
      {expanded && (asset.status === 'processing' || asset.status === 'generating_pdf') && (
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p>Processing video... This may take 1-2 minutes.</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
