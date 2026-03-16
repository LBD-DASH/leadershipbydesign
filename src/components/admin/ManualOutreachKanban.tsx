import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  location: string;
  linkedin_url: string;
  tier: number;
  account_group: string;
  connection_status: string;
  message_sent: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const STATUSES = [
  { value: 'not_sent', label: 'Not Sent' },
  { value: 'request_sent', label: 'Request Sent' },
  { value: 'connected', label: 'Connected' },
  { value: 'messaged', label: 'Messaged' },
  { value: 'replied', label: 'Replied' },
  { value: 'meeting_booked', label: 'Meeting Booked' },
];

function isCOO(title: string): boolean {
  const t = title.toLowerCase();
  return t.includes('coo') || t.includes('chief operating');
}

function getConnectionRequest(firstName: string): string {
  return `Hi ${firstName} — I work with FSI firms on manager capability and coaching culture. Your background caught my attention. Would love to connect.`;
}

function getFirstMessage(firstName: string, company: string, title: string): string {
  if (isCOO(title)) {
    return `Hi ${firstName} — thanks for connecting.\n\nOne thing I keep hearing from COOs in financial services right now — the management layer is the bottleneck. Not strategy, not systems. The 15 to 40 people sitting between leadership and the front line.\n\nIs that something you are dealing with at ${company}?\n\n— Kevin`;
  }
  return `Hi ${firstName} — thanks for connecting.\n\nQuick question and genuinely curious — when you look at your management layer right now, is the gap more about capability or about managers not having the time or space to actually develop their people?\n\nI ask because the answer usually points to completely different interventions.\n\n— Kevin`;
}

function LeadCard({ lead, onStatusChange, onNotesChange }: {
  lead: Lead;
  onStatusChange: (id: string, status: string) => void;
  onNotesChange: (id: string, notes: string) => void;
}) {
  const [localNotes, setLocalNotes] = useState(lead.notes || '');
  const [notesTimeout, setNotesTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleNotesChange = (val: string) => {
    setLocalNotes(val);
    if (notesTimeout) clearTimeout(notesTimeout);
    setNotesTimeout(setTimeout(() => onNotesChange(lead.id, val), 800));
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied`, description: `Ready to paste for ${lead.first_name}` });
  };

  return (
    <div className="bg-white rounded-lg border border-border p-3 shadow-sm space-y-2">
      <p className="font-bold text-sm" style={{ color: '#1B2A4A', fontFamily: "'Playfair Display', serif" }}>
        {lead.first_name} {lead.last_name}
      </p>
      <p className="text-xs" style={{ color: '#666666', fontFamily: "'Source Sans 3', sans-serif" }}>
        {lead.title} · {lead.company}
      </p>
      <div className="flex items-center gap-2">
        <Badge
          className="text-[10px] px-1.5 py-0 border-0"
          style={lead.tier === 1
            ? { backgroundColor: '#C8A864', color: '#1B2A4A' }
            : { backgroundColor: '#2A7B88', color: '#fff' }
          }
        >
          Tier {lead.tier}
        </Badge>
        <span className="text-[11px] italic" style={{ color: '#888888' }}>{lead.account_group}</span>
      </div>

      <Select value={lead.connection_status} onValueChange={(v) => onStatusChange(lead.id, v)}>
        <SelectTrigger className="h-7 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Textarea
        value={localNotes}
        onChange={(e) => handleNotesChange(e.target.value)}
        placeholder="Add notes..."
        className="text-xs min-h-[40px] resize-none"
        rows={2}
      />

      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          className="text-[10px] h-6 px-2 gap-1 flex-1"
          onClick={() => copyText(getConnectionRequest(lead.first_name), 'Connection request')}
        >
          <Copy className="w-3 h-3" /> Connection
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-[10px] h-6 px-2 gap-1 flex-1"
          onClick={() => copyText(getFirstMessage(lead.first_name, lead.company, lead.title), 'First message')}
        >
          <Copy className="w-3 h-3" /> Message
        </Button>
      </div>
    </div>
  );
}

export default function ManualOutreachKanban() {
  const queryClient = useQueryClient();

  const { data: leads, isLoading } = useQuery({
    queryKey: ['manual-outreach-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manual_outreach_leads' as any)
        .select('*')
        .order('tier', { ascending: true });
      if (error) throw error;
      return (data as any[]) as Lead[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase
        .from('manual_outreach_leads' as any)
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manual-outreach-leads'] });
    },
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    const lead = leads?.find((l) => l.id === id);
    updateMutation.mutate({ id, updates: { connection_status: newStatus } });

    // Slack notifications for key status changes
    if (lead && (newStatus === 'meeting_booked' || newStatus === 'replied')) {
      try {
        const message = newStatus === 'meeting_booked'
          ? `MEETING BOOKED — ${lead.first_name} ${lead.last_name} from ${lead.company} (${lead.title}) — Sales Navigator manual outreach`
          : `REPLY RECEIVED — ${lead.first_name} ${lead.last_name} from ${lead.company} — check LinkedIn`;

        await supabase.functions.invoke('slack-notify', {
          body: {
            channel: 'leads-and-signups',
            eventType: 'system_error',
            data: {
              function: newStatus === 'meeting_booked' ? '📅 Sales Navigator' : '🔥 Sales Navigator',
              error: message,
            },
          },
        });
      } catch { /* best effort */ }
    }
  };

  const handleNotesChange = (id: string, notes: string) => {
    updateMutation.mutate({ id, updates: { notes } });
  };

  if (isLoading) {
    return <p className="text-muted-foreground text-sm py-8 text-center">Loading leads…</p>;
  }

  const allLeads = leads || [];
  const counts = {
    total: allLeads.length,
    tier1: allLeads.filter((l) => l.tier === 1).length,
    tier2: allLeads.filter((l) => l.tier === 2).length,
    connected: allLeads.filter((l) => ['connected', 'messaged', 'replied', 'meeting_booked'].includes(l.connection_status)).length,
    messaged: allLeads.filter((l) => ['messaged', 'replied', 'meeting_booked'].includes(l.connection_status)).length,
    booked: allLeads.filter((l) => l.connection_status === 'meeting_booked').length,
  };

  return (
    <div className="space-y-4">
      {/* Summary Bar */}
      <div className="bg-white rounded-lg px-6 py-3 flex items-center gap-6 flex-wrap" style={{ borderBottom: '2px solid #C8A864' }}>
        {[
          { label: 'Total', value: counts.total },
          { label: 'Tier 1', value: counts.tier1 },
          { label: 'Tier 2', value: counts.tier2 },
          { label: 'Connected', value: counts.connected },
          { label: 'Messaged', value: counts.messaged },
          { label: 'Meetings Booked', value: counts.booked },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className="text-xs font-medium" style={{ color: '#666', fontFamily: "'Source Sans 3', sans-serif" }}>{s.label}:</span>
            <span className="text-sm font-bold" style={{ color: '#1B2A4A' }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-6 gap-3 overflow-x-auto">
        {STATUSES.map((status) => {
          const columnLeads = allLeads.filter((l) => l.connection_status === status.value);
          return (
            <div key={status.value} className="min-w-[200px]">
              <div
                className="rounded-t-lg px-3 py-2 text-center"
                style={{
                  backgroundColor: '#1B2A4A',
                  color: '#fff',
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                {status.label} ({columnLeads.length})
              </div>
              <div className="bg-muted/30 rounded-b-lg p-2 space-y-2 min-h-[200px]">
                {columnLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onStatusChange={handleStatusChange}
                    onNotesChange={handleNotesChange}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
