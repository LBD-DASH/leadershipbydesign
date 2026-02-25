import { useEffect, useState, useCallback } from 'react';
import { Users, Search, Edit2, Loader2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ADMIN_AUTH_KEY, MASTER_TOKEN } from '@/lib/adminAuth';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  tags: string[] | null;
  status: string | null;
  source: string | null;
  created_at: string;
}

async function adminInvoke(action: string, extra: Record<string, unknown> = {}) {
  const token = sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true' ? MASTER_TOKEN : '';
  const { data, error } = await supabase.functions.invoke('admin-subscribers', {
    body: { action, ...extra },
    headers: { 'x-admin-token': token },
  });
  if (error) throw error;
  if (!data.success) throw new Error(data.error || 'Unknown error');
  return data;
}

export default function SubscriberManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editTags, setEditTags] = useState('');

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminInvoke('list', {
        search: search || undefined,
        tag: tagFilter || undefined,
      });
      const subs = result.data || [];
      setSubscribers(subs);
      const tags = new Set<string>();
      subs.forEach((s: Subscriber) => s.tags?.forEach((t: string) => tags.add(t)));
      setAllTags(Array.from(tags).sort());
    } catch (err: any) {
      console.error('Fetch subscribers error:', err);
    }
    setLoading(false);
  }, [search, tagFilter]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const startEdit = (sub: Subscriber) => {
    setEditingId(sub.id);
    setEditName(sub.name || '');
    setEditCompany(sub.company || '');
    setEditTags((sub.tags || []).join(', '));
  };

  const saveEdit = async (id: string) => {
    const tags = editTags.split(',').map(t => t.trim()).filter(Boolean);
    try {
      await adminInvoke('update', { id, name: editName || null, company: editCompany || null, tags });
      toast({ title: 'Subscriber updated' });
      setEditingId(null);
      fetchSubscribers();
    } catch (err: any) {
      toast({ title: 'Update failed', description: err.message, variant: 'destructive' });
    }
  };

  const toggleStatus = async (sub: Subscriber) => {
    const newStatus = sub.status === 'active' ? 'unsubscribed' : 'active';
    try {
      await adminInvoke('toggle_status', { id: sub.id, new_status: newStatus });
      toast({ title: `Contact ${newStatus === 'active' ? 'reactivated' : 'unsubscribed'}` });
      fetchSubscribers();
    } catch (err: any) {
      toast({ title: 'Update failed', description: err.message, variant: 'destructive' });
    }
  };

  const activeCount = subscribers.filter(s => s.status === 'active').length;
  const totalCount = subscribers.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Contact List
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {activeCount} active / {totalCount} total
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by email, name, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : subscribers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No contacts found.</p>
        ) : (
          <div className="border rounded-lg overflow-auto max-h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-mono text-sm">{sub.email}</TableCell>
                    <TableCell>
                      {editingId === sub.id ? (
                        <Input value={editName} onChange={e => setEditName(e.target.value)} className="h-8 w-32" />
                      ) : sub.name || '—'}
                    </TableCell>
                    <TableCell>
                      {editingId === sub.id ? (
                        <Input value={editCompany} onChange={e => setEditCompany(e.target.value)} className="h-8 w-32" />
                      ) : sub.company || '—'}
                    </TableCell>
                    <TableCell>
                      {editingId === sub.id ? (
                        <Input value={editTags} onChange={e => setEditTags(e.target.value)} placeholder="tag1, tag2" className="h-8 w-40" />
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {sub.tags?.map(t => (
                            <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{sub.source || '—'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(sub.created_at), 'dd MMM yy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {editingId === sub.id ? (
                          <>
                            <Button size="icon" variant="ghost" onClick={() => saveEdit(sub.id)}>
                              <Check className="w-4 h-4 text-green-500" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="icon" variant="ghost" onClick={() => startEdit(sub)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => toggleStatus(sub)}>
                              {sub.status === 'active' ? (
                                <X className="w-4 h-4 text-destructive" />
                              ) : (
                                <Check className="w-4 h-4 text-green-500" />
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
