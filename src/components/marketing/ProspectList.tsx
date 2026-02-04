import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, ExternalLink, MessageSquare, Trash2, RefreshCw, CheckCircle, Clock, Send, XCircle,
  ChevronDown, ChevronUp, Mail, Phone, MapPin, Linkedin, Users, Target, Lightbulb, Copy, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { prospectsApi, ProspectCompany } from '@/lib/api/prospects';
import { format } from 'date-fns';
import OutreachComposer from './OutreachComposer';

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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [emailProspect, setEmailProspect] = useState<ProspectCompany | null>(null);

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

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Text copied to clipboard" });
  };

  const handleEmailSent = (prospectId?: string) => {
    if (prospectId) {
      setProspects(prev => 
        prev.map(p => p.id === prospectId ? { 
          ...p, 
          status: 'contacted',
          contacted_at: new Date().toISOString() 
        } : p)
      );
    }
    setEmailProspect(null);
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
            const isExpanded = expandedIds.has(prospect.id);
            
            return (
              <motion.div
                key={prospect.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(prospect.id)}>
                  <Card className="overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <CardContent className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{prospect.company_name}</h3>
                              <a 
                                href={prospect.website_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
                              )}
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
                            
                            {!isExpanded && prospect.about_summary && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {prospect.about_summary}
                              </p>
                            )}
                            
                            <p className="text-xs text-muted-foreground">
                              Added {format(new Date(prospect.created_at), 'MMM d, yyyy')}
                              {prospect.contacted_at && ` • Contacted ${format(new Date(prospect.contacted_at), 'MMM d, yyyy')}`}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t"
                          >
                            <div className="p-4 bg-muted/30 space-y-4">
                              {/* About Summary */}
                              {prospect.about_summary && (
                                <div className="bg-background p-4 rounded-lg border">
                                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-primary" />
                                    About
                                  </h4>
                                  <p className="text-sm text-muted-foreground">{prospect.about_summary}</p>
                                </div>
                              )}

                              {/* Contact Information */}
                              {(prospect.contact_email || prospect.contact_phone || prospect.physical_address || prospect.linkedin_url || prospect.contact_name) && (
                                <div className="bg-background p-4 rounded-lg border">
                                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" />
                                    Contact Information
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {prospect.contact_name && (
                                      <div className="flex items-center gap-2 text-sm">
                                        <Users className="w-4 h-4 text-muted-foreground" />
                                        <span>{prospect.contact_name}</span>
                                        {prospect.contact_role && (
                                          <Badge variant="outline" className="text-xs">{prospect.contact_role}</Badge>
                                        )}
                                      </div>
                                    )}
                                    {prospect.contact_email && (
                                      <a 
                                        href={`mailto:${prospect.contact_email}`}
                                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                                      >
                                        <Mail className="w-4 h-4" />
                                        {prospect.contact_email}
                                      </a>
                                    )}
                                    {prospect.contact_phone && (
                                      <a 
                                        href={`tel:${prospect.contact_phone}`}
                                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                                      >
                                        <Phone className="w-4 h-4" />
                                        {prospect.contact_phone}
                                      </a>
                                    )}
                                    {prospect.physical_address && (
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <span className="truncate">{prospect.physical_address}</span>
                                      </div>
                                    )}
                                    {prospect.linkedin_url && (
                                      <a 
                                        href={prospect.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                                      >
                                        <Linkedin className="w-4 h-4" />
                                        LinkedIn Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* HR/L&D Decision Makers */}
                              {prospect.hr_contacts && prospect.hr_contacts.length > 0 && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                                    HR/L&D Decision Makers
                                  </h4>
                                  <div className="space-y-2">
                                    {prospect.hr_contacts.map((contact, i) => (
                                      <div key={i} className="flex items-center justify-between bg-background/80 p-3 rounded-md border">
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-full bg-[#0A66C2]/10 flex items-center justify-center">
                                            <Users className="w-4 h-4 text-[#0A66C2]" />
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium">{contact.name}</p>
                                            <p className="text-xs text-muted-foreground">{contact.role}</p>
                                          </div>
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          asChild
                                          className="border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2]/10"
                                        >
                                          <a 
                                            href={contact.linkedin_search_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                          >
                                            <Linkedin className="w-4 h-4 mr-1" />
                                            Find on LinkedIn
                                          </a>
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Strategic Insights Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Leadership Team */}
                                {prospect.leadership_team && prospect.leadership_team.length > 0 && (
                                  <div className="bg-background p-4 rounded-lg border">
                                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                      <Users className="w-4 h-4 text-primary" />
                                      Leadership Team
                                    </h4>
                                    <ul className="space-y-1">
                                      {prospect.leadership_team.map((member, i) => (
                                        <li key={i} className="text-sm text-muted-foreground">
                                          <span className="font-medium text-foreground">{member.name}</span>
                                          {member.role && ` - ${member.role}`}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Pain Points */}
                                {prospect.pain_points && prospect.pain_points.length > 0 && (
                                  <div className="bg-background p-4 rounded-lg border">
                                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                      <Target className="w-4 h-4 text-destructive" />
                                      Pain Points
                                    </h4>
                                    <ul className="space-y-1">
                                      {prospect.pain_points.map((point, i) => (
                                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                          <span className="text-destructive">•</span>
                                          {point}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Opportunity Signals */}
                                {prospect.opportunity_signals && prospect.opportunity_signals.length > 0 && (
                                  <div className="bg-background p-4 rounded-lg border md:col-span-2">
                                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                      <Lightbulb className="w-4 h-4 text-amber-500" />
                                      Opportunity Signals
                                    </h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                      {prospect.opportunity_signals.map((signal, i) => (
                                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                          <span className="text-amber-500">✓</span>
                                          {signal}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>

                              {/* Personalized Pitch */}
                              {prospect.personalised_pitch && (
                                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium flex items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-primary" />
                                      AI-Generated Pitch
                                    </h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(prospect.personalised_pitch || '')}
                                    >
                                      <Copy className="w-4 h-4 mr-1" />
                                      Copy
                                    </Button>
                                  </div>
                                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                                    {prospect.personalised_pitch}
                                  </p>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-2 pt-2">
                                {prospect.contact_email && (
                                  <Button
                                    size="sm"
                                    onClick={() => setEmailProspect(prospect)}
                                  >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Send Cold Email
                                  </Button>
                                )}
                                {prospect.linkedin_url && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                  >
                                    <a href={prospect.linkedin_url} target="_blank" rel="noopener noreferrer">
                                      <Linkedin className="w-4 h-4 mr-2" />
                                      View on LinkedIn
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Outreach Composer Modal */}
      <OutreachComposer
        prospect={emailProspect}
        isOpen={!!emailProspect}
        onClose={() => setEmailProspect(null)}
        onSent={handleEmailSent}
      />
    </div>
  );
}
