import { useState, useEffect } from 'react';
import { Send, Eye, Loader2, Users, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/RichTextEditor';
import NewsletterAdvertPicker from './NewsletterAdvertPicker';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function NewsletterComposer() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [preview, setPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [advertsOpen, setAdvertsOpen] = useState(false);

  const handleInsertAdvert = (html: string) => {
    setBody(prev => prev + html);
    toast({ title: 'Advert inserted', description: 'Scroll down to see it in the editor.' });
  };

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('email_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      setActiveCount(count ?? 0);
    };
    fetchCount();
  }, []);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast({ title: 'Missing fields', description: 'Subject and body are required.', variant: 'destructive' });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: { subject, body_html: body },
      });

      if (error) throw error;

      toast({
        title: 'Newsletter sent!',
        description: `Sent to ${data?.recipient_count || 0} contacts.`,
      });
      setSubject('');
      setBody('');
      // Refresh count
      const { count } = await supabase
        .from('email_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      setActiveCount(count ?? 0);
    } catch (err: any) {
      console.error('Send newsletter error:', err);
      toast({
        title: 'Send failed',
        description: err.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Compose Newsletter
            </span>
            {activeCount !== null && (
              <span className="flex items-center gap-1.5 text-sm font-normal text-muted-foreground">
                <Users className="w-4 h-4" />
                {activeCount} active contacts
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject Line</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Your newsletter subject..."
              className="mt-1"
            />
          </div>

          <div>
            <Label>Email Body</Label>
            <div className="mt-1">
              <RichTextEditor
                content={body}
                onChange={setBody}
                placeholder="Write your newsletter content..."
              />
            </div>
          </div>

          {/* Advert Inserter */}
          <Collapsible open={advertsOpen} onOpenChange={setAdvertsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 w-full justify-start">
                <Megaphone className="w-4 h-4" />
                {advertsOpen ? 'Hide' : 'Insert'} Website Advert
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <NewsletterAdvertPicker onInsert={handleInsertAdvert} />
            </CollapsibleContent>
          </Collapsible>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setPreview(!preview)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              {preview ? 'Hide Preview' : 'Preview'}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={!subject.trim() || !body.trim() || sending} className="gap-2">
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send to All Active Contacts
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Send Newsletter?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will send "{subject}" to <strong>{activeCount}</strong> active contacts.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSend}>
                    Yes, Send Newsletter
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {preview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Email Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto border">
              <div className="border-b pb-3 mb-4">
                <p className="text-sm text-gray-500">From: hello@leadershipbydesign.co</p>
                <p className="text-sm text-gray-500">Subject: <strong className="text-gray-900">{subject || '(no subject)'}</strong></p>
              </div>
              <div
                className="prose prose-sm max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: body || '<p class="text-gray-400">Start writing to see preview...</p>' }}
              />
              <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
                <p>Leadership by Design • hello@leadershipbydesign.co</p>
                <p className="mt-1">
                  <a href="#" className="underline">Unsubscribe</a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
