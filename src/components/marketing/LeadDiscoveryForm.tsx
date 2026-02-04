import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Building2, MapPin, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { prospectsApi, DiscoveredCompany, DiscoverySearchParams } from '@/lib/api/prospects';

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

interface LeadDiscoveryFormProps {
  onResearchCompany: (url: string) => void;
}

export default function LeadDiscoveryForm({ onResearchCompany }: LeadDiscoveryFormProps) {
  const { toast } = useToast();
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [companySize, setCompanySize] = useState('50-200');
  const [targetContacts, setTargetContacts] = useState<'hr' | 'csuite' | 'both'>('both');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<DiscoveredCompany[]>([]);

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
                  <div 
                    key={idx}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{company.company_name}</span>
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
                        onClick={() => onResearchCompany(company.website_url)}
                      >
                        Research
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
