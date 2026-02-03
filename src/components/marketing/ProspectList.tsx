import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, ExternalLink, MessageSquare, Trash2, RefreshCw, CheckCircle, Clock, Send, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { prospectsApi, ProspectCompany } from '@/lib/api/prospects';
import { format } from 'date-fns';

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  'researched': { label: 'Researched', icon: Clock, color: 'bg-blue-100 text-blue-700' },
  'contacted': { label: 'Contacted', icon: Send, color: 'bg-amber-100 text-amber-700' },
  'responded': { label: 'Responded', icon: MessageSquare, color: 'bg-green-100 text-green-700' },
  'converted': { label: 'Converted', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700' },
  'not_interested': { label: 'Not Interested', icon: XCircle, color: 'bg-gray-100 text-gray-700' },
};

export default function ProspectList() {
  const { toast } = useToast();
  const [prospects, setProspects] = useState<ProspectCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProspect, setSelectedProspect] = useState<ProspectCompany | null>(null);
  const [notes, setNotes] = useState('');

  const fetchProspects = async () => {
    setIsLoading(true);
    const response = await prospectsApi.getProspects();
    if (response.success && response.data) {
      setProspects(response.data);
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to load prospects",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProspects();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const response = await prospectsApi.updateProspectStatus(id, newStatus);
    if (response.success) {
      setProspects(prev => 
        prev.map(p => p.id === id ? { 
          ...p, 
          status: newStatus,
          contacted_at: newStatus === 'contacted' ? new Date().toISOString() : p.contacted_at 
        } : p)
      );
      toast({ title: "Status Updated", description: `Prospect marked as ${statusConfig[newStatus]?.label || newStatus}` });
    } else {
      toast({ title: "Error", description: response.error || "Failed to update status", variant: "destructive" });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedProspect) return;
    
    const response = await prospectsApi.updateProspectStatus(selectedProspect.id, selectedProspect.status, notes);
    if (response.success) {
      setProspects(prev => prev.map(p => p.id === selectedProspect.id ? { ...p, notes } : p));
      toast({ title: "Notes Saved" });
      setSelectedProspect(null);
    } else {
      toast({ title: "Error", description: response.error || "Failed to save notes", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prospect?')) return;
    
    const response = await prospectsApi.deleteProspect(id);
    if (response.success) {
      setProspects(prev => prev.filter(p => p.id !== id));
      toast({ title: "Prospect Deleted" });
    } else {
      toast({ title: "Error", description: response.error || "Failed to delete prospect", variant: "destructive" });
    }
  };

  const filteredProspects = statusFilter === 'all' 
    ? prospects 
    : prospects.filter(p => p.status === statusFilter);

  const stats = {
    total: prospects.length,
    researched: prospects.filter(p => p.status === 'researched').length,
    contacted: prospects.filter(p => p.status === 'contacted').length,
    responded: prospects.filter(p => p.status === 'responded').length,
    converted: prospects.filter(p => p.status === 'converted').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-foreground' },
          { label: 'Researched', value: stats.researched, color: 'text-blue-600' },
          { label: 'Contacted', value: stats.contacted, color: 'text-amber-600' },
          { label: 'Responded', value: stats.responded, color: 'text-green-600' },
          { label: 'Converted', value: stats.converted, color: 'text-emerald-600' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prospects</SelectItem>
            {Object.entries(statusConfig).map(([value, config]) => (
              <SelectItem key={value} value={value}>{config.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={fetchProspects} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Prospect List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading prospects...</div>
      ) : filteredProspects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {statusFilter === 'all' 
                ? "No prospects yet. Use the Research tab to add companies."
                : `No prospects with status "${statusConfig[statusFilter]?.label}"`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProspects.map((prospect, idx) => {
            const StatusIcon = statusConfig[prospect.status]?.icon || Clock;
            
            return (
              <motion.div
                key={prospect.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{prospect.company_name}</h3>
                          <a 
                            href={prospect.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          {prospect.industry && <Badge variant="secondary" className="text-xs">{prospect.industry}</Badge>}
                          {prospect.company_size && <Badge variant="outline" className="text-xs">{prospect.company_size}</Badge>}
                          {prospect.suggested_approach && (
                            <Badge variant="outline" className="text-xs text-primary border-primary/30">
                              {prospect.suggested_approach.replace(/_/g, ' ')}
                            </Badge>
                          )}
                        </div>
                        
                        {prospect.about_summary && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {prospect.about_summary}
                          </p>
                        )}
                        
                        <p className="text-xs text-muted-foreground">
                          Added {format(new Date(prospect.created_at), 'MMM d, yyyy')}
                          {prospect.contacted_at && ` • Contacted ${format(new Date(prospect.contacted_at), 'MMM d, yyyy')}`}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Select 
                          value={prospect.status} 
                          onValueChange={(value) => handleStatusChange(prospect.id, value)}
                        >
                          <SelectTrigger className="w-36">
                            <div className="flex items-center gap-2">
                              <StatusIcon className="w-4 h-4" />
                              <span>{statusConfig[prospect.status]?.label || prospect.status}</span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusConfig).map(([value, config]) => (
                              <SelectItem key={value} value={value}>
                                <div className="flex items-center gap-2">
                                  <config.icon className="w-4 h-4" />
                                  {config.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setSelectedProspect(prospect);
                                setNotes(prospect.notes || '');
                              }}
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{prospect.company_name} - Notes</DialogTitle>
                              <DialogDescription>
                                Add notes about your interactions with this prospect
                              </DialogDescription>
                            </DialogHeader>
                            <Textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Meeting notes, follow-up reminders, key contacts..."
                              rows={6}
                            />
                            {prospect.personalised_pitch && (
                              <div className="bg-muted p-3 rounded-md">
                                <p className="text-xs font-medium mb-1">AI-Generated Pitch:</p>
                                <p className="text-sm text-muted-foreground">{prospect.personalised_pitch}</p>
                              </div>
                            )}
                            <div className="flex justify-end gap-2">
                              <Button onClick={handleSaveNotes}>Save Notes</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(prospect.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
