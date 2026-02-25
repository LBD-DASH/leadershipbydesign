import { useState, useEffect } from 'react';
import { Send, Eye, Loader2, Users, Megaphone, Save, FileText, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/RichTextEditor';
import NewsletterAdvertPicker from './NewsletterAdvertPicker';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ADMIN_AUTH_KEY, MASTER_TOKEN } from '@/lib/adminAuth';

interface Draft {
  id: string;
  subject: string;
  body_html: string;
  tag_filter: string | null;
  created_at: string;
}

export default function NewsletterComposer() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [preview, setPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [advertsOpen, setAdvertsOpen] = useState(false);
  const [tagFilter, setTagFilter] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftsOpen, setDraftsOpen] = useState(false);

  const handleInsertAdvert = (html: string) => {
    setBody(prev => prev + html);
    toast({ title: 'Advert inserted', description: 'Scroll down to see it in the editor.' });
  };

  const getAdminToken = () => {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true' ? MASTER_TOKEN : '';
  };

  // Fetch active count, tags via edge function, and drafts
  useEffect(() => {
    const fetchData = async () => {
      // Count + tags via admin-subscribers edge function
      try {
        const { data: countData } = await supabase.functions.invoke('admin-subscribers', {
          body: { action: 'count', tag: tagFilter || undefined },
          headers: { 'x-admin-token': getAdminToken() },
        });
        if (countData?.success) {
          setActiveCount(countData.count ?? 0);
          setAllTags(countData.allTags || []);
        }
      } catch (err) {
        console.error('Failed to fetch subscriber count:', err);
      }

      // Drafts (newsletter_sends uses same RLS pattern - fetch via edge function too if needed)
      // For now drafts use direct query since newsletter_sends may have different access
      const { data: draftData } = await supabase
        .from('newsletter_sends')
        .select('id, subject, body_html, tag_filter, created_at')
        .eq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(20);
      setDrafts((draftData as Draft[]) || []);
    };
    fetchData();
  }, [tagFilter]);

  const handleSaveDraft = async () => {
    if (!subject.trim() || !body.trim()) {
      toast({ title: 'Missing fields', description: 'Subject and body are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('newsletter_sends').insert({
      subject,
      body_html: body,
      tag_filter: tagFilter || null,
      status: 'draft',
      sent_by: 'admin',
      recipient_count: 0,
    });
    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Draft saved!' });
      const { data } = await supabase
        .from('newsletter_sends')
        .select('id, subject, body_html, tag_filter, created_at')
        .eq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(20);
      setDrafts((data as Draft[]) || []);
    }
    setSaving(false);
  };

  const handleSchedule = async () => {
    if (!subject.trim() || !body.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('newsletter_sends').insert({
      subject,
      body_html: body,
      tag_filter: tagFilter || null,
      status: 'scheduled',
      sent_by: 'admin',
      recipient_count: 0,
    });
    if (error) {
      toast({ title: 'Schedule failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Newsletter scheduled!', description: 'It will be sent automatically every Monday at 8am.' });
    }
    setSaving(false);
  };

  const loadDraft = (draft: Draft) => {
    setSubject(draft.subject);
    setBody(draft.body_html);
    setTagFilter(draft.tag_filter || '');
    setDraftsOpen(false);
    toast({ title: 'Draft loaded' });
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast({ title: 'Missing fields', description: 'Subject and body are required.', variant: 'destructive' });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: { subject, body_html: body, tag_filter: tagFilter || undefined },
      });

      if (error) throw error;

      toast({
        title: 'Newsletter sent!',
        description: `Sent to ${data?.recipient_count || 0} contacts.`,
      });
      setSubject('');
      setBody('');
      setTagFilter('');
      // Refresh count via edge function
      try {
        const { data: countData } = await supabase.functions.invoke('admin-subscribers', {
          body: { action: 'count' },
          headers: { 'x-admin-token': getAdminToken() },
        });
        if (countData?.success) setActiveCount(countData.count ?? 0);
      } catch {}
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
                {activeCount} {tagFilter ? `"${tagFilter}"` : 'active'} contacts
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Segment Filter */}
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm whitespace-nowrap">Send to segment:</Label>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm flex-1"
            >
              <option value="">All active contacts</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            {tagFilter && (
              <Badge variant="secondary" className="gap-1">
                {tagFilter}
              </Badge>
            )}
          </div>

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

          {/* Saved Drafts */}
          <Collapsible open={draftsOpen} onOpenChange={setDraftsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 w-full justify-start">
                <FileText className="w-4 h-4" />
                {draftsOpen ? 'Hide' : 'Load'} Saved Drafts ({drafts.length})
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              {drafts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No saved drafts yet.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-auto">
                  {drafts.map(d => (
                    <button
                      key={d.id}
                      onClick={() => loadDraft(d)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <p className="font-medium text-sm text-foreground">{d.subject}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(d.created_at).toLocaleDateString()}
                        {d.tag_filter && ` • Segment: ${d.tag_filter}`}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          <div className="flex items-center gap-3 pt-2">
            <Button variant="outline" onClick={() => setPreview(!preview)} className="gap-2">
              <Eye className="w-4 h-4" />
              {preview ? 'Hide Preview' : 'Preview'}
            </Button>
            <Button variant="secondary" onClick={handleSaveDraft} disabled={!subject.trim() || !body.trim() || saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </Button>
            <Button variant="outline" onClick={() => handleSchedule()} disabled={!subject.trim() || !body.trim() || saving} className="gap-2">
              <FileText className="w-4 h-4" />
              Schedule Weekly
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={!subject.trim() || !body.trim() || sending} className="gap-2">
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send{tagFilter ? ` to "${tagFilter}"` : ' to All'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Send Newsletter?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will send "{subject}" to <strong>{activeCount}</strong> {tagFilter ? `"${tagFilter}"` : 'active'} contacts.
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
                {tagFilter && <p className="text-sm text-gray-500">Segment: <Badge variant="outline">{tagFilter}</Badge></p>}
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
