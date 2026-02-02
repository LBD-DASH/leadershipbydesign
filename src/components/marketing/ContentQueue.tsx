import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Linkedin, Twitter, FileText, Mail, Trash2, Edit2, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MarketingContent {
  id: string;
  created_at: string;
  updated_at: string;
  content_type: string;
  title: string | null;
  content: string;
  hashtags: string[] | null;
  source_type: string | null;
  source_reference: string | null;
  status: string;
  scheduled_for: string | null;
  published_at: string | null;
  review_notes: string | null;
  reviewed_at: string | null;
}

const CONTENT_TYPE_ICONS: Record<string, typeof Linkedin> = {
  social_linkedin: Linkedin,
  social_twitter: Twitter,
  blog_outline: FileText,
  email: Mail,
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  pending_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  scheduled: 'bg-blue-100 text-blue-700',
  published: 'bg-primary/10 text-primary',
  rejected: 'bg-red-100 text-red-700',
};

export default function ContentQueue() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>('all');
  const [editingContent, setEditingContent] = useState<MarketingContent | null>(null);
  const [editedText, setEditedText] = useState('');

  const { data: content, isLoading } = useQuery({
    queryKey: ['marketing-content', filter],
    queryFn: async () => {
      let query = supabase
        .from('marketing_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MarketingContent[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MarketingContent> }) => {
      const { error } = await supabase
        .from('marketing_content')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-content'] });
      queryClient.invalidateQueries({ queryKey: ['marketing-stats'] });
      toast.success('Content updated');
    },
    onError: () => {
      toast.error('Failed to update content');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('marketing_content')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-content'] });
      queryClient.invalidateQueries({ queryKey: ['marketing-stats'] });
      toast.success('Content deleted');
    },
    onError: () => {
      toast.error('Failed to delete content');
    },
  });

  const handleApprove = (item: MarketingContent) => {
    updateMutation.mutate({ id: item.id, updates: { status: 'approved', reviewed_at: new Date().toISOString() } });
  };

  const handleReject = (item: MarketingContent) => {
    updateMutation.mutate({ id: item.id, updates: { status: 'rejected', reviewed_at: new Date().toISOString() } });
  };

  const handleEdit = (item: MarketingContent) => {
    setEditingContent(item);
    setEditedText(item.content);
  };

  const handleSaveEdit = () => {
    if (!editingContent) return;
    updateMutation.mutate({ 
      id: editingContent.id, 
      updates: { content: editedText } 
    });
    setEditingContent(null);
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleMarkPublished = (item: MarketingContent) => {
    updateMutation.mutate({ 
      id: item.id, 
      updates: { status: 'published', published_at: new Date().toISOString() } 
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Content</SelectItem>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {content?.length || 0} items
        </span>
      </div>

      {/* Content List */}
      {content && content.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {content.map((item) => {
              const Icon = CONTENT_TYPE_ICONS[item.content_type] || FileText;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {item.title || item.content_type.replace('_', ' ').replace('social ', '')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString()} • {item.source_reference || 'Custom topic'}
                            </p>
                          </div>
                        </div>
                        <Badge className={STATUS_COLORS[item.status] || ''}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <p className="text-foreground whitespace-pre-wrap line-clamp-4">
                          {item.content}
                        </p>
                      </div>

                      {item.hashtags && item.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.hashtags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              #{tag.replace('#', '')}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 border-t pt-4">
                        {item.status === 'pending_review' && (
                          <>
                            <Button size="sm" onClick={() => handleApprove(item)}>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleReject(item)}>
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {item.status === 'approved' && (
                          <Button size="sm" onClick={() => handleMarkPublished(item)}>
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Mark as Published
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleCopy(item.content)}>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Content Yet</h3>
            <p className="text-muted-foreground">
              Generate some content to start building your marketing queue.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingContent} onOpenChange={() => setEditingContent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={10}
            className="font-mono"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingContent(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
