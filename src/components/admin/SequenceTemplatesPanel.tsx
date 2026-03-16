import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Copy, Save, Mail, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface SequenceTemplate {
  id: string;
  sequence_name: string;
  step_number: number;
  day_number: number;
  subject: string;
  body: string;
  cta_type: string;
  note: string | null;
  status: string;
  updated_at: string;
  created_at: string;
}

export default function SequenceTemplatesPanel() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editStatus, setEditStatus] = useState('Active');

  const { data: templates, isLoading } = useQuery({
    queryKey: ['sequence-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apollo_sequence_templates' as any)
        .select('*')
        .order('step_number', { ascending: true });
      if (error) throw error;
      return (data as any[]) as SequenceTemplate[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, subject, body, status }: { id: string; subject: string; body: string; status: string }) => {
      const { error } = await supabase
        .from('apollo_sequence_templates' as any)
        .update({ subject, body, status, updated_at: new Date().toISOString() } as any)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sequence-templates'] });
      setEditingId(null);
      toast({ title: 'Template updated' });
    },
  });

  const copyToClipboard = (template: SequenceTemplate) => {
    const text = `Subject: ${template.subject}\n\n${template.body}`;
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard', description: `Step ${template.step_number} ready to paste into Apollo` });
  };

  const startEdit = (t: SequenceTemplate) => {
    setEditingId(t.id);
    setEditSubject(t.subject);
    setEditBody(t.body);
    setEditStatus(t.status);
  };

  const ctaBadgeColor = (type: string) => {
    switch (type) {
      case 'question': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'diagnostic': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'close': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return '';
    }
  };

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default' as const;
      case 'Draft': return 'secondary' as const;
      case 'Retired': return 'outline' as const;
      default: return 'secondary' as const;
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground text-sm py-8 text-center">Loading templates…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Leader as Coach — 5-Step Email Sequence</h2>
          <p className="text-sm text-muted-foreground">Approved copy for Apollo. Click Copy to paste directly.</p>
        </div>
      </div>

      {(templates || []).map((t) => (
        <Card key={t.id} className="border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {t.step_number}
                </div>
                <div>
                  <CardTitle className="text-base">Step {t.step_number} — Day {t.day_number}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={statusBadgeVariant(t.status)}>{t.status}</Badge>
                    <Badge variant="outline" className={ctaBadgeColor(t.cta_type)}>{t.cta_type}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Updated {format(new Date(t.updated_at), 'dd MMM yyyy HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(t)} className="gap-1.5">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </Button>
                {editingId !== t.id && (
                  <Button variant="ghost" size="sm" onClick={() => startEdit(t)}>Edit</Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {editingId === t.id ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Subject</label>
                  <Input value={editSubject} onChange={(e) => setEditSubject(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Body</label>
                  <Textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={12} className="font-mono text-sm" />
                </div>
                <div className="w-48">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateMutation.mutate({ id: t.id, subject: editSubject, body: editBody, status: editStatus })} className="gap-1.5">
                    <Save className="w-3.5 h-3.5" /> Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{t.subject}</span>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted/50 rounded-md p-4 font-sans leading-relaxed">
                  {t.body}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
