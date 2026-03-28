import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Phone, Flame, Eye, MousePointer, MessageSquare, ChevronRight, 
  RefreshCw, Loader2, CheckCircle2, Clock, ArrowRight, Mail,
  Building, User, Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QueueItem {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  phone: string;
  sequence_name: string;
  offer_type: string;
  industry: string;
  campaign_intent: string;
  emails_sent: Array<{
    step: number;
    subject: string;
    sent_at: string;
    opened: boolean;
    clicked: boolean;
    replied: boolean;
  }>;
  current_step: number;
  total_steps: number;
  total_opens: number;
  total_clicks: number;
  total_replies: number;
  last_activity: string;
  priority_score: number;
  priority_reason: string;
  suggested_opener: string;
  assigned_agent: string;
  called_at: string;
  call_outcome: string;
}

interface CallQueueProps {
  agentName: string;
  adminToken: string;
}

export default function CallQueue({ agentName, adminToken }: CallQueueProps) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState({ total: 0, hot: 0, warm: 0 });
  const [loading, setLoading] = useState(false);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [callOutcome, setCallOutcome] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const [savingCall, setSavingCall] = useState(false);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('apollo-call-queue', {
        body: { action: 'get_queue', agent_name: agentName, limit: 50 },
        
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setQueue(data.queue || []);
      setStats(data.stats || { total: 0, hot: 0, warm: 0 });
    } catch (err: any) {
      toast({ title: 'Failed to load queue', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [agentName, adminToken]);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const handleCompleteCall = async (leadId: string) => {
    if (!callOutcome) {
      toast({ title: 'Select outcome', description: 'Choose a call outcome before saving.', variant: 'destructive' });
      return;
    }
    setSavingCall(true);
    try {
      const { data, error } = await supabase.functions.invoke('apollo-call-queue', {
        body: { action: 'complete_call', lead_id: leadId, outcome: callOutcome, notes: callNotes },
        
      });
      if (error) throw error;
      toast({ title: 'Call logged', description: `Outcome: ${callOutcome}` });
      setActiveLeadId(null);
      setCallOutcome('');
      setCallNotes('');
      fetchQueue();
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' });
    } finally {
      setSavingCall(false);
    }
  };

  const getPriorityColor = (score: number) => {
    if (score >= 70) return 'destructive';
    if (score >= 40) return 'default';
    return 'secondary';
  };

  const getPriorityIcon = (score: number) => {
    if (score >= 100) return <MessageSquare className="w-4 h-4" />;
    if (score >= 80) return <Eye className="w-4 h-4" />;
    if (score >= 70) return <MousePointer className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const activeLead = queue.find(q => q.id === activeLeadId);

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <Flame className="w-4 h-4 text-destructive" />
              <span className="text-2xl font-bold text-destructive">{stats.hot}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Hot Leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold">{stats.warm}</div>
            <p className="text-xs text-muted-foreground mt-1">Warm Leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Total Queue</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Lead Detail */}
      {activeLead && (
        <Card className="border-2 border-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Calling: {activeLead.name}
              </CardTitle>
              <Badge variant={getPriorityColor(activeLead.priority_score)}>
                {activeLead.priority_reason}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{activeLead.company || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{activeLead.title || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs">{activeLead.email}</span>
              </div>
              {activeLead.industry && (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <span>{activeLead.industry}</span>
                </div>
              )}
            </div>

            {/* WHY we emailed */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Why we emailed them</p>
              <p className="font-medium">{activeLead.sequence_name}</p>
              {activeLead.offer_type && <p className="text-sm text-muted-foreground">Offer: {activeLead.offer_type}</p>}
            </div>

            {/* WHAT they received */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">What they received</p>
              {activeLead.emails_sent.length > 0 ? (
                <div className="space-y-1">
                  {activeLead.emails_sent.map((email, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm py-1 border-b border-border/50 last:border-0">
                      <span className="text-xs font-mono text-muted-foreground w-8">#{email.step}</span>
                      <span className="flex-1 truncate">{email.subject || '(no subject)'}</span>
                      <div className="flex items-center gap-1">
                        {email.opened && <Eye className="w-3.5 h-3.5 text-blue-500" />}
                        {email.clicked && <MousePointer className="w-3.5 h-3.5 text-green-500" />}
                        {email.replied && <MessageSquare className="w-3.5 h-3.5 text-orange-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No email step data available yet</p>
              )}
            </div>

            {/* Engagement Summary */}
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {activeLead.total_opens} opens</span>
              <span className="flex items-center gap-1"><MousePointer className="w-3.5 h-3.5" /> {activeLead.total_clicks} clicks</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {activeLead.total_replies} replies</span>
            </div>

            {/* Suggested Opener */}
            {activeLead.suggested_opener && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Suggested Opening Line</p>
                <p className="text-sm italic leading-relaxed">{activeLead.suggested_opener}</p>
              </div>
            )}

            {/* Call Outcome */}
            <div className="border-t pt-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Log Call Outcome</p>
              <Select value={callOutcome} onValueChange={setCallOutcome}>
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="booked">📅 Meeting Booked</SelectItem>
                  <SelectItem value="interested">👍 Interested - Follow Up</SelectItem>
                  <SelectItem value="callback">📞 Callback Requested</SelectItem>
                  <SelectItem value="not_interested">👎 Not Interested</SelectItem>
                  <SelectItem value="no_answer">📵 No Answer</SelectItem>
                  <SelectItem value="wrong_number">❌ Wrong Number</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Call notes..."
                value={callNotes}
                onChange={e => setCallNotes(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Button onClick={() => handleCompleteCall(activeLead.id)} disabled={savingCall} className="flex-1 gap-1.5">
                  {savingCall ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Save & Next
                </Button>
                <Button variant="outline" onClick={() => { setActiveLeadId(null); setCallOutcome(''); setCallNotes(''); }}>
                  Skip
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Queue List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Call Queue</CardTitle>
            <Button variant="outline" size="sm" onClick={fetchQueue} disabled={loading} className="gap-1.5">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {queue.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Phone className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No leads in queue. Waiting for Apollo engagement signals.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {queue.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                    activeLeadId === item.id ? 'border-primary bg-primary/5' : 'border-border'
                  } ${item.called_at ? 'opacity-50' : ''}`}
                  onClick={() => setActiveLeadId(item.id)}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{item.name || 'Unknown'}</span>
                      <Badge variant={getPriorityColor(item.priority_score)} className="text-[10px] px-1.5 py-0">
                        {getPriorityIcon(item.priority_score)}
                        <span className="ml-1">{item.priority_score}</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.company} · {item.sequence_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {item.total_replies > 0 && <MessageSquare className="w-3.5 h-3.5 text-orange-500" />}
                    {item.total_opens > 0 && <Eye className="w-3.5 h-3.5 text-blue-500" />}
                    {item.total_clicks > 0 && <MousePointer className="w-3.5 h-3.5 text-green-500" />}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
