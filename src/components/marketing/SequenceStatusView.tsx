import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Play, Pause, SkipForward, Check, Clock, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Sequence {
  id: string;
  prospect_id: string;
  sequence_step: number;
  next_send_at: string | null;
  status: string;
  template_variant: string | null;
  original_subject: string | null;
  created_at: string;
  prospect: {
    company_name: string;
    contact_name: string | null;
    contact_email: string | null;
    industry: string | null;
  };
}

interface SequenceStatusViewProps {
  className?: string;
}

export default function SequenceStatusView({ className = '' }: SequenceStatusViewProps) {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSequences();
  }, []);

  const loadSequences = async () => {
    try {
      const { data, error } = await supabase
        .from('prospect_sequences')
        .select(`
          *,
          prospect:prospect_companies(
            company_name,
            contact_name,
            contact_email,
            industry
          )
        `)
        .order('next_send_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      setSequences((data || []) as unknown as Sequence[]);
    } catch (error) {
      console.error('Error loading sequences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sequences',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async (sequenceId: string) => {
    setActionLoading(sequenceId);
    try {
      const { error } = await supabase
        .from('prospect_sequences')
        .update({ 
          status: 'paused',
          paused_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', sequenceId);

      if (error) throw error;
      toast({ title: 'Sequence paused' });
      loadSequences();
    } catch (error) {
      console.error('Error pausing sequence:', error);
      toast({ title: 'Error', description: 'Failed to pause sequence', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleResume = async (sequenceId: string) => {
    setActionLoading(sequenceId);
    try {
      // Calculate next send date
      const nextSendAt = new Date();
      nextSendAt.setDate(nextSendAt.getDate() + 1);
      nextSendAt.setUTCHours(6, 0, 0, 0);

      const { error } = await supabase
        .from('prospect_sequences')
        .update({ 
          status: 'active',
          paused_at: null,
          next_send_at: nextSendAt.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', sequenceId);

      if (error) throw error;
      toast({ title: 'Sequence resumed' });
      loadSequences();
    } catch (error) {
      console.error('Error resuming sequence:', error);
      toast({ title: 'Error', description: 'Failed to resume sequence', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSkip = async (sequenceId: string, currentStep: number) => {
    setActionLoading(sequenceId);
    try {
      if (currentStep >= 4) {
        // Complete the sequence
        await supabase
          .from('prospect_sequences')
          .update({ 
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', sequenceId);
      } else {
        // Advance to next step
        const nextSendAt = new Date();
        nextSendAt.setDate(nextSendAt.getDate() + 1);
        nextSendAt.setUTCHours(6, 0, 0, 0);

        await supabase
          .from('prospect_sequences')
          .update({ 
            sequence_step: currentStep + 1,
            next_send_at: nextSendAt.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', sequenceId);
      }

      toast({ title: currentStep >= 4 ? 'Sequence completed' : 'Skipped to next step' });
      loadSequences();
    } catch (error) {
      console.error('Error skipping step:', error);
      toast({ title: 'Error', description: 'Failed to skip step', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Paused</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Completed</Badge>;
      case 'replied':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Replied</Badge>;
      case 'engaged':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Engaged</Badge>;
      case 'unsubscribed':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Unsubscribed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStepLabel = (step: number) => {
    switch (step) {
      case 1: return 'Initial';
      case 2: return 'Follow-up 1';
      case 3: return 'Value-add';
      case 4: return 'Final';
      default: return `Step ${step}`;
    }
  };

  const formatNextSend = (dateStr: string | null) => {
    if (!dateStr) return 'Not scheduled';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  if (loading) {
    return (
      <div className={`bg-card rounded-xl border border-border p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const activeSequences = sequences.filter(s => s.status === 'active');
  const otherSequences = sequences.filter(s => s.status !== 'active');

  return (
    <div className={`bg-card rounded-xl border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Email Sequences</h3>
          <Badge variant="secondary">{activeSequences.length} active</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={loadSequences}>
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      {sequences.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No active sequences</p>
          <p className="text-sm">Sequences are created when you send outreach emails</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Active Sequences */}
          {activeSequences.map(seq => (
            <div
              key={seq.id}
              className="flex items-center justify-between p-4 bg-green-50/50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-800/30"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground truncate">
                    {seq.prospect?.company_name || 'Unknown'}
                  </span>
                  {getStatusBadge(seq.status)}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{seq.prospect?.contact_name || 'No contact'}</span>
                  <span>•</span>
                  <span className="font-medium text-primary">{getStepLabel(seq.sequence_step)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatNextSend(seq.next_send_at)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePause(seq.id)}
                  disabled={actionLoading === seq.id}
                >
                  {actionLoading === seq.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSkip(seq.id, seq.sequence_step)}
                  disabled={actionLoading === seq.id}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Other Sequences */}
          {otherSequences.slice(0, 10).map(seq => (
            <div
              key={seq.id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground truncate">
                    {seq.prospect?.company_name || 'Unknown'}
                  </span>
                  {getStatusBadge(seq.status)}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{seq.prospect?.contact_name || 'No contact'}</span>
                  <span>•</span>
                  <span>{getStepLabel(seq.sequence_step)}</span>
                </div>
              </div>
              {seq.status === 'paused' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResume(seq.id)}
                  disabled={actionLoading === seq.id}
                >
                  {actionLoading === seq.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              )}
              {(seq.status === 'replied' || seq.status === 'engaged') && (
                <Check className="w-5 h-5 text-green-600" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
