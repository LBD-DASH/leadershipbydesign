import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Building2, MapPin, ExternalLink, ChevronDown, ChevronUp, Mail, Phone, Linkedin, Users, AlertCircle, Lightbulb, Target, MessageSquare, Save, CheckCircle, Send, UserSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { prospectsApi, DiscoveredCompany, DiscoverySearchParams, CompanyResearchResult, ProspectCompany } from '@/lib/api/prospects';
import OutreachComposer from './OutreachComposer';

const INDUSTRIES = [
  'Engineering',
  'Mining',
  'Manufacturing',
  'Technology',
  'Finance',
  'Construction',
  'Logistics',
  'Professional Services',
];

const LOCATIONS = [
  'Johannesburg',
  'Pretoria',
  'Midrand',
  'East Rand',
  'West Rand',
  'Centurion',
  'Sandton',
];

const COMPANY_SIZES = [
  { value: '50-200', label: 'SME (50-200 employees)' },
  { value: '200-500', label: 'Mid-market (200-500 employees)' },
  { value: '500+', label: 'Enterprise (500+ employees)' },
];

interface ResearchedData {
  result: CompanyResearchResult;
  saved: boolean;
  savedProspect: ProspectCompany | null;
}

export default function LeadDiscoveryForm() {
  const { toast } = useToast();
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [companySize, setCompanySize] = useState('50-200');
  const [targetContacts, setTargetContacts] = useState<'hr' | 'csuite' | 'both'>('both');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<DiscoveredCompany[]>([]);
  
  // Research state per company (keyed by website URL)
  const [researchingUrls, setResearchingUrls] = useState<Set<string>>(new Set());
  const [researchedData, setResearchedData] = useState<Record<string, ResearchedData>>({});
  const [expandedUrls, setExpandedUrls] = useState<Set<string>>(new Set());
  const [savingUrls, setSavingUrls] = useState<Set<string>>(new Set());
  
  // Outreach state - can be for saved prospect OR direct from research
  const [outreachProspect, setOutreachProspect] = useState<ProspectCompany | null>(null);
  const [outreachResearchData, setOutreachResearchData] = useState<CompanyResearchResult | null>(null);
  const [showOutreach, setShowOutreach] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!industry || !location) {
      toast({
        title: 'Missing fields',
        description: 'Please select both industry and location',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    setResults([]);
    setResearchedData({});
    setExpandedUrls(new Set());

    try {
      const params: DiscoverySearchParams = {
        industry,
        location,
        companySize,
        targetContacts,
      };

      const response = await prospectsApi.discoverCompanies(params);

      if (response.success && response.data) {
        setResults(response.data);
        toast({
          title: 'Discovery Complete',
          description: `Found ${response.data.length} companies matching your criteria`,
        });
      } else {
        toast({
          title: 'Discovery Failed',
          description: response.error || 'Could not find companies',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Discovery error:', error);
      toast({
        title: 'Error',
        description: 'Failed to discover companies. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleResearch = async (url: string) => {
    // If already researched, just toggle expansion
    if (researchedData[url]) {
      toggleExpanded(url);
      return;
    }

    setResearchingUrls(prev => new Set(prev).add(url));

    try {
      const response = await prospectsApi.researchCompany(url);

      if (response.success && response.data) {
        setResearchedData(prev => ({
          ...prev,
          [url]: { result: response.data!, saved: false, savedProspect: null }
        }));
        setExpandedUrls(prev => new Set(prev).add(url));
        toast({
          title: "Research Complete",
          description: `Successfully analyzed ${response.data.company_name}`,
        });
      } else {
        toast({
          title: "Research Failed",
          description: response.error || "Could not analyze the company website",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Research error:', error);
      toast({
        title: "Error",
        description: "Failed to research company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResearchingUrls(prev => {
        const next = new Set(prev);
        next.delete(url);
        return next;
      });
    }
  };

  const handleSave = async (url: string) => {
    const data = researchedData[url];
    if (!data) return;

    setSavingUrls(prev => new Set(prev).add(url));

    try {
      const result = data.result;
      const response = await prospectsApi.saveProspect({
        company_name: result.company_name,
        website_url: result.website_url,
        industry: result.industry,
        company_size: result.company_size,
        about_summary: result.about_summary,
        leadership_team: result.leadership_team,
        pain_points: result.pain_points,
        opportunity_signals: result.opportunity_signals,
        personalised_pitch: result.personalised_pitch,
        suggested_approach: result.suggested_approach,
        status: 'researched',
        contacted_at: null,
        notes: null,
        contact_email: result.contact_email || null,
        contact_phone: result.contact_phone || null,
        contact_name: result.contact_name || null,
        contact_role: result.contact_role || null,
        physical_address: result.physical_address || null,
        linkedin_url: result.linkedin_url || null,
        hr_contacts: result.hr_contacts || null,
      });

      if (response.success) {
        setResearchedData(prev => ({
          ...prev,
          [url]: { ...prev[url], saved: true, savedProspect: response.data || null }
        }));
        toast({
          title: "Prospect Saved",
          description: `${result.company_name} added to your prospect list`,
        });
      } else {
        toast({
          title: "Save Failed",
          description: response.error || "Could not save prospect",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save prospect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingUrls(prev => {
        const next = new Set(prev);
        next.delete(url);
        return next;
      });
    }
  };

  const toggleExpanded = (url: string) => {
    setExpandedUrls(prev => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      return next;
    });
  };

  const getApproachLabel = (approach: string | null) => {
    const approaches: Record<string, string> = {
      'executive_coaching': 'Executive Coaching',
      'team_workshop': 'Team Workshop',
      'shift_programme': 'SHIFT Programme',
      'leadership_diagnostic': 'Leadership Diagnostic',
      'discovery_call': 'Discovery Call',
    };
    return approaches[approach || ''] || approach || 'Discovery Call';
  };

  const isResearching = (url: string) => researchingUrls.has(url);
  const isExpanded = (url: string) => expandedUrls.has(url);
  const hasResearchData = (url: string) => !!researchedData[url];
  const isSaving = (url: string) => savingUrls.has(url);

  return (
    <div className="space-y-6">
      {/* Discovery Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Lead Discovery
          </CardTitle>
          <CardDescription>
            Find companies matching your target criteria using AI-powered search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((loc) => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company Size</label>
                <Select value={companySize} onValueChange={setCompanySize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Contacts</label>
                <Select value={targetContacts} onValueChange={(v) => setTargetContacts(v as 'hr' | 'csuite' | 'both')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">HR / People Contacts</SelectItem>
                    <SelectItem value="csuite">C-Suite Executives</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isSearching} className="w-full md:w-auto">
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Find Companies
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Found {results.length} Companies
              </CardTitle>
              <CardDescription>
                Click "Research" to deep-dive into a company and extract contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.map((company, idx) => (
                  <Collapsible
                    key={idx}
                    open={isExpanded(company.website_url)}
                    onOpenChange={() => hasResearchData(company.website_url) && toggleExpanded(company.website_url)}
                  >
                    <div className="border rounded-lg overflow-hidden">
                      {/* Company Header Row */}
                      <div className="flex items-start justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{company.company_name}</span>
                            {hasResearchData(company.website_url) && (
                              <Badge variant="secondary" className="text-xs">Researched</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{company.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {company.location}
                            </span>
                            <Badge variant="outline" className="text-xs">{company.industry}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(company.website_url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleResearch(company.website_url)}
                            disabled={isResearching(company.website_url)}
                          >
                            {isResearching(company.website_url) ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Researching...
                              </>
                            ) : hasResearchData(company.website_url) ? (
                              <>
                                {isExpanded(company.website_url) ? (
                                  <ChevronUp className="w-3 h-3 mr-1" />
                                ) : (
                                  <ChevronDown className="w-3 h-3 mr-1" />
                                )}
                                {isExpanded(company.website_url) ? 'Hide' : 'Show'} Details
                              </>
                            ) : (
                              'Research'
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Expandable Research Results */}
                      <CollapsibleContent>
                        <AnimatePresence>
                          {researchedData[company.website_url] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border-t bg-muted/30 p-4 space-y-4"
                            >
                              {(() => {
                                const data = researchedData[company.website_url];
                                const result = data.result;
                                return (
                                  <>
                                    {/* About Summary */}
                                    {result.about_summary && (
                                      <div>
                                        <p className="text-sm text-muted-foreground">{result.about_summary}</p>
                                      </div>
                                    )}

                                    {/* Contact Information */}
                                    {(result.contact_email || result.contact_phone || result.physical_address || result.contact_name) && (
                                      <div className="bg-background border rounded-lg p-3">
                                        <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                                          <Users className="w-4 h-4 text-primary" />
                                          Contact Information
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-2 text-sm">
                                          {result.contact_name && (
                                            <div className="flex items-center gap-2">
                                              <Users className="w-3 h-3 text-muted-foreground" />
                                              <span className="font-medium">{result.contact_name}</span>
                                              {result.contact_role && (
                                                <span className="text-muted-foreground">— {result.contact_role}</span>
                                              )}
                                            </div>
                                          )}
                                          {result.contact_email && (
                                            <div className="flex items-center gap-2">
                                              <Mail className="w-3 h-3 text-muted-foreground" />
                                              <a href={`mailto:${result.contact_email}`} className="text-primary hover:underline">
                                                {result.contact_email}
                                              </a>
                                            </div>
                                          )}
                                          {result.contact_phone && (
                                            <div className="flex items-center gap-2">
                                              <Phone className="w-3 h-3 text-muted-foreground" />
                                              <a href={`tel:${result.contact_phone}`} className="hover:underline">
                                                {result.contact_phone}
                                              </a>
                                            </div>
                                          )}
                                          {result.linkedin_url && (
                                            <div className="flex items-center gap-2">
                                              <Linkedin className="w-3 h-3 text-muted-foreground" />
                                              <a href={result.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">
                                                LinkedIn Profile
                                              </a>
                                            </div>
                                          )}
                                          {result.physical_address && (
                                            <div className="flex items-center gap-2 md:col-span-2">
                                              <MapPin className="w-3 h-3 text-muted-foreground" />
                                              <span className="text-muted-foreground">{result.physical_address}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Intelligence Grid */}
                                    <div className="grid md:grid-cols-2 gap-3">
                                      {/* Leadership Team */}
                                      {result.leadership_team && result.leadership_team.length > 0 && (
                                        <div className="bg-background border rounded-lg p-3">
                                          <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                                            <Users className="w-4 h-4" />
                                            Leadership Team
                                          </h4>
                                          <ul className="space-y-1 text-sm">
                                            {result.leadership_team.slice(0, 4).map((person, idx) => (
                                              <li key={idx}>
                                                <span className="font-medium">{person.name}</span>
                                                <span className="text-muted-foreground"> — {person.role}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Pain Points */}
                                      {result.pain_points && result.pain_points.length > 0 && (
                                        <div className="bg-background border rounded-lg p-3">
                                          <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                                            <AlertCircle className="w-4 h-4 text-amber-500" />
                                            Pain Points
                                          </h4>
                                          <ul className="space-y-1 text-sm">
                                            {result.pain_points.slice(0, 3).map((point, idx) => (
                                              <li key={idx} className="text-muted-foreground flex items-start gap-2">
                                                <span className="text-amber-500 mt-0.5">•</span>
                                                {point}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Opportunity Signals */}
                                      {result.opportunity_signals && result.opportunity_signals.length > 0 && (
                                        <div className="bg-background border rounded-lg p-3">
                                          <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                                            <Lightbulb className="w-4 h-4 text-green-500" />
                                            Opportunities
                                          </h4>
                                          <ul className="space-y-1 text-sm">
                                            {result.opportunity_signals.slice(0, 3).map((signal, idx) => (
                                              <li key={idx} className="text-muted-foreground flex items-start gap-2">
                                                <span className="text-green-500 mt-0.5">•</span>
                                                {signal}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Suggested Approach */}
                                      <div className="bg-background border rounded-lg p-3">
                                        <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                                          <Target className="w-4 h-4 text-primary" />
                                          Recommended Approach
                                        </h4>
                                        <Badge>{getApproachLabel(result.suggested_approach)}</Badge>
                                      </div>
                                    </div>

                                    {/* HR/L&D Contacts for LinkedIn */}
                                    {result.hr_contacts && result.hr_contacts.length > 0 && (
                                      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                        <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                                          <UserSearch className="w-4 h-4 text-blue-600" />
                                          HR / L&D Contacts (for LinkedIn)
                                        </h4>
                                        <div className="space-y-2">
                                          {result.hr_contacts.map((contact, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                              <div className="text-sm">
                                                <span className="font-medium">{contact.name}</span>
                                                <span className="text-muted-foreground"> — {contact.role}</span>
                                              </div>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="ml-2"
                                                onClick={() => window.open(contact.linkedin_search_url, '_blank')}
                                              >
                                                <Linkedin className="w-3 h-3 mr-1" />
                                                Find on LinkedIn
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Personalized Pitch */}
                                    {result.personalised_pitch && (
                                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                                        <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                                          <MessageSquare className="w-4 h-4 text-primary" />
                                          Personalised Pitch
                                        </h4>
                                        <p className="text-sm text-foreground whitespace-pre-wrap">
                                          {result.personalised_pitch}
                                        </p>
                                      </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          navigator.clipboard.writeText(result.personalised_pitch || '');
                                          toast({ title: "Copied!", description: "Pitch copied to clipboard" });
                                        }}
                                      >
                                        Copy Pitch
                                      </Button>
                                      
                                      {/* Direct Email Button - available even before saving */}
                                      {result.contact_email && (
                                        <Button
                                          size="sm"
                                          onClick={() => {
                                            setOutreachProspect(null);
                                            setOutreachResearchData(result);
                                            setShowOutreach(true);
                                          }}
                                        >
                                          <Send className="w-4 h-4 mr-2" />
                                          Send Cold Email
                                        </Button>
                                      )}
                                      
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => handleSave(company.website_url)}
                                        disabled={isSaving(company.website_url) || data.saved}
                                      >
                                        {data.saved ? (
                                          <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Saved
                                          </>
                                        ) : isSaving(company.website_url) ? (
                                          <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                          </>
                                        ) : (
                                          <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save to Prospects
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </>
                                );
                              })()}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Outreach Composer Modal */}
      <OutreachComposer
        prospect={outreachProspect}
        researchData={outreachResearchData}
        isOpen={showOutreach}
        onClose={() => {
          setShowOutreach(false);
          setOutreachProspect(null);
          setOutreachResearchData(null);
        }}
        onSent={(prospectId) => {
          toast({ title: "Email sent!", description: "Prospect saved and marked as contacted" });
          // If we sent from research data, mark it as saved
          if (outreachResearchData && prospectId) {
            const url = outreachResearchData.website_url;
            setResearchedData(prev => ({
              ...prev,
              [url]: { ...prev[url], saved: true }
            }));
          }
        }}
      />
    </div>
  );
}
