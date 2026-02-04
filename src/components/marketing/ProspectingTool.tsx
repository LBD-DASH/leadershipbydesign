import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Building2, Users, Target, MessageSquare, Lightbulb, AlertCircle, Save, CheckCircle, Mail, Phone, MapPin, Linkedin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { prospectsApi, CompanyResearchResult, ProspectCompany } from '@/lib/api/prospects';
import LeadDiscoveryForm from './LeadDiscoveryForm';
import OutreachComposer from './OutreachComposer';

export default function ProspectingTool() {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<CompanyResearchResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [savedProspect, setSavedProspect] = useState<ProspectCompany | null>(null);
  const [showOutreach, setShowOutreach] = useState(false);

  const handleResearch = async (targetUrl?: string) => {
    const urlToResearch = targetUrl || url;
    if (!urlToResearch.trim()) return;

    // Lightweight client-side validation (server also validates)
    const candidate = urlToResearch.trim();
    const looksLikeUrl = /\./.test(candidate) && !/\s/.test(candidate);
    if (!looksLikeUrl) {
      toast({
        title: 'Please enter a website URL',
        description: 'Use a domain like company.co.za (not the company name).',
        variant: 'destructive',
      });
      return;
    }

    setIsResearching(true);
    setResult(null);
    setSaved(false);
    setSavedProspect(null);

    try {
      const response = await prospectsApi.researchCompany(urlToResearch);

      if (response.success && response.data) {
        setResult(response.data);
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
      setIsResearching(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    setIsSaving(true);

    try {
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
      });

      if (response.success) {
        setSaved(true);
        setSavedProspect(response.data || null);
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
      setIsSaving(false);
    }
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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="discovery" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="discovery">Lead Discovery</TabsTrigger>
          <TabsTrigger value="research">Single URL Research</TabsTrigger>
        </TabsList>

        <TabsContent value="discovery" className="mt-6">
          <LeadDiscoveryForm 
            onResearchCompany={(researchUrl) => {
              setUrl(researchUrl);
              handleResearch(researchUrl);
            }}
            isResearching={isResearching}
            researchingUrl={url}
          />
        </TabsContent>

        <TabsContent value="research" className="mt-6">
          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Company Research
              </CardTitle>
              <CardDescription>
                Enter a company website URL to get AI-powered intelligence, contact details, and personalized pitch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleResearch(); }} className="flex gap-3">
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g., company.co.za or https://example.com"
                  className="flex-1"
                  disabled={isResearching}
                />
                <Button type="submit" disabled={isResearching || !url.trim()}>
                  {isResearching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Research
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results (shown for both tabs when available) */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Company Overview */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {result.company_name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    <a 
                      href={result.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {result.website_url}
                    </a>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {result.industry && (
                    <Badge variant="secondary">{result.industry}</Badge>
                  )}
                  {result.company_size && (
                    <Badge variant="outline">{result.company_size}</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {result.about_summary && (
                <p className="text-muted-foreground">{result.about_summary}</p>
              )}
            </CardContent>
          </Card>

          {/* Contact Information Card - New! */}
          {(result.contact_email || result.contact_phone || result.physical_address || result.contact_name) && (
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.contact_name && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">{result.contact_name}</span>
                        {result.contact_role && (
                          <span className="text-muted-foreground text-sm"> — {result.contact_role}</span>
                        )}
                      </div>
                    </div>
                  )}
                  {result.contact_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${result.contact_email}`} className="text-primary hover:underline">
                        {result.contact_email}
                      </a>
                    </div>
                  )}
                  {result.contact_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${result.contact_phone}`} className="hover:underline">
                        {result.contact_phone}
                      </a>
                    </div>
                  )}
                  {result.physical_address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{result.physical_address}</span>
                    </div>
                  )}
                  {result.linkedin_url && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-muted-foreground" />
                      <a href={result.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Intelligence Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Leadership Team */}
            {result.leadership_team && result.leadership_team.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Leadership Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {result.leadership_team.map((person, idx) => (
                      <li key={idx} className="text-sm">
                        <span className="font-medium">{person.name}</span>
                        <span className="text-muted-foreground"> — {person.role}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Pain Points */}
            {result.pain_points && result.pain_points.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Likely Pain Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {result.pain_points.map((point, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Opportunity Signals */}
            {result.opportunity_signals && result.opportunity_signals.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-green-500" />
                    Opportunity Signals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {result.opportunity_signals.map((signal, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {signal}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Suggested Approach */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Recommended Approach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="text-sm">{getApproachLabel(result.suggested_approach)}</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Personalized Pitch */}
          {result.personalised_pitch && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Personalised Pitch
                </CardTitle>
                <CardDescription>
                  Copy and adapt for LinkedIn message or email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {result.personalised_pitch}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
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
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving || saved}
                  >
                    {saved ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Saved
                      </>
                    ) : isSaving ? (
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
                  {saved && result.contact_email && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setShowOutreach(true)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {/* Outreach Composer Modal */}
      <OutreachComposer
        prospect={savedProspect}
        isOpen={showOutreach}
        onClose={() => setShowOutreach(false)}
        onSent={() => {
          toast({ title: "Email sent!", description: "Prospect marked as contacted" });
        }}
      />
    </div>
  );
}
