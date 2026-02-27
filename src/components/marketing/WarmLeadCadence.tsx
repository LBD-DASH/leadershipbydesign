import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Users, Phone, Mail, Clock, CheckCircle2, CalendarCheck,
  MessageSquare, TrendingUp, Flame, AlertCircle, Archive
} from 'lucide-react';

type SequenceStatus = 'awaiting_first_contact' | 'contacted' | 'day_2_sent' | 'day_5_sent' | 'day_10_sent' | 'engaged' | 'booked_call' | 'dormant';

const STATUS_CONFIG: Record<SequenceStatus, { label: string; color: string; icon: typeof Clock }> = {
  awaiting_first_contact: { label: 'Awaiting Contact', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
  contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Mail },
  day_2_sent: { label: 'Day 2 Sent', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Clock },
  day_5_sent: { label: 'Day 5 Sent', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Clock },
  day_10_sent: { label: 'Day 10 Sent', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
  engaged: { label: 'Engaged', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
  booked_call: { label: 'Booked Call', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CalendarCheck },
  dormant: { label: 'Dormant', color: 'bg-gray-100 text-gray-600 border-gray-200', icon: Archive },
};

export default function WarmLeadCadence() {
  const queryClient = useQueryClient();
  const [notesId, setNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const { data: sequences, isLoading } = useQuery({
    queryKey: ['warm-lead-sequences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warm_lead_sequences')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, extras }: { id: string; status: string; extras?: Record<string, any> }) => {
      const now = new Date().toISOString();
      const update: Record<string, any> = { status, ...extras };

      if (status === 'contacted') {
        update.contacted_at = now;
        // Schedule Day 2 reminder: 2 days from now
        const day2 = new Date();
        day2.setDate(day2.getDate() + 2);
        update.next_reminder_at = day2.toISOString();
      } else if (status === 'engaged') {
        update.engaged_at = now;
        update.next_reminder_at = null;
      } else if (status === 'booked_call') {
        update.booked_at = now;
        update.next_reminder_at = null;
      } else if (status === 'dormant') {
        update.dormant_at = now;
        update.next_reminder_at = null;
      }

      const { error } = await supabase
        .from('warm_lead_sequences')
        .update(update)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warm-lead-sequences'] });
      toast.success('Status updated');
    },
  });

  const saveNotes = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase
        .from('warm_lead_sequences')
        .update({ notes })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warm-lead-sequences'] });
      setNotesId(null);
      setNoteText('');
      toast.success('Notes saved');
    },
  });

  // Calculate metrics
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = sequences?.filter(s => new Date(s.created_at) >= monthStart) || [];
  const activeInSequence = sequences?.filter(s =>
    ['contacted', 'day_2_sent', 'day_5_sent', 'day_10_sent'].includes(s.status)
  ) || [];
  const bookedCalls = thisMonth.filter(s => s.status === 'booked_call');
  const respondedIn2h = thisMonth.filter(s => {
    if (!s.contacted_at) return false;
    const diff = new Date(s.contacted_at).getTime() - new Date(s.created_at).getTime();
    return diff <= 2 * 60 * 60 * 1000;
  });
  const warmTotal = thisMonth.length;
  const conversionRate = warmTotal > 0 ? ((bookedCalls.length / warmTotal) * 100).toFixed(0) : '0';
  const responseRate = warmTotal > 0 ? ((respondedIn2h.length / warmTotal) * 100).toFixed(0) : '0';

  function daysSince(dateStr: string) {
    return Math.floor((now.getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Warm Leads (Month)</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              {isLoading ? '...' : warmTotal}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Responded &lt;2h</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              {isLoading ? '...' : `${responseRate}%`}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Sequence</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-500" />
              {isLoading ? '...' : activeInSequence.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Booked Calls</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-green-500" />
              {isLoading ? '...' : bookedCalls.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversion</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {isLoading ? '...' : `${conversionRate}%`}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Active Sequences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Warm Lead Cadence
          </CardTitle>
          <CardDescription>Track and manage follow-up sequences for warm and hot leads</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading sequences...</p>
          ) : !sequences?.length ? (
            <p className="text-muted-foreground text-center py-8">No warm lead sequences yet. They'll appear automatically when warm/hot leads come in.</p>
          ) : (
            <div className="space-y-3">
              {sequences.map(seq => {
                const config = STATUS_CONFIG[seq.status as SequenceStatus] || STATUS_CONFIG.awaiting_first_contact;
                const StatusIcon = config.icon;
                const isActive = ['awaiting_first_contact', 'contacted', 'day_2_sent', 'day_5_sent', 'day_10_sent'].includes(seq.status);

                return (
                  <div
                    key={seq.id}
                    className={`border rounded-lg p-4 ${isActive ? 'border-border' : 'border-border/50 opacity-75'}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground truncate">{seq.lead_name || 'Unknown'}</span>
                          <Badge variant="outline" className={`text-xs ${config.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                          {seq.lead_temperature === 'hot' && (
                            <Badge variant="destructive" className="text-xs">🔥 Hot</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          {seq.lead_company && <span>{seq.lead_company}</span>}
                          {seq.lead_email && (
                            <a href={`mailto:${seq.lead_email}`} className="text-primary hover:underline flex items-center gap-1">
                              <Mail className="w-3 h-3" />{seq.lead_email}
                            </a>
                          )}
                          {seq.lead_phone && (
                            <a href={`tel:${seq.lead_phone}`} className="text-primary hover:underline flex items-center gap-1">
                              <Phone className="w-3 h-3" />{seq.lead_phone}
                            </a>
                          )}
                          <span className="text-xs">{daysSince(seq.created_at)}d ago · {seq.lead_source_type}</span>
                        </div>
                        {seq.notes && (
                          <p className="text-xs text-muted-foreground mt-1 italic">"{seq.notes}"</p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {seq.status === 'awaiting_first_contact' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateStatus.mutate({ id: seq.id, status: 'contacted' })}
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Contacted
                          </Button>
                        )}
                        {isActive && seq.status !== 'awaiting_first_contact' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-700 border-green-300 hover:bg-green-50"
                              onClick={() => updateStatus.mutate({ id: seq.id, status: 'engaged' })}
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Engaged
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                              onClick={() => updateStatus.mutate({ id: seq.id, status: 'booked_call' })}
                            >
                              <CalendarCheck className="w-3 h-3 mr-1" />
                              Booked
                            </Button>
                          </>
                        )}
                        {isActive && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setNotesId(notesId === seq.id ? null : seq.id);
                              setNoteText(seq.notes || '');
                            }}
                          >
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Notes Editor */}
                    {notesId === seq.id && (
                      <div className="mt-3 flex gap-2">
                        <Textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add notes..."
                          className="min-h-[60px]"
                        />
                        <Button
                          size="sm"
                          onClick={() => saveNotes.mutate({ id: seq.id, notes: noteText })}
                        >
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
