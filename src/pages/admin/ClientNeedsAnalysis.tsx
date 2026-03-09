import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Copy, Download, Save, Check, Loader2, ClipboardCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

const PAIN_POINTS = {
  'Leadership': [
    'Managers are technically strong but struggle to lead people',
    'New managers promoted without leadership preparation',
    'Senior leaders not developing the next layer below them',
    'Leadership style is inconsistent across the business',
    'Leaders avoid difficult conversations',
  ],
  'Team & Culture': [
    'Teams are misaligned — everyone pulling in different directions',
    'Low trust between managers and their teams',
    'High turnover in middle management',
    'Culture is talk — not lived in day-to-day behaviour',
    'Teams struggling through change or restructuring',
  ],
  'Performance & Coaching': [
    'Managers manage tasks but don\'t coach people',
    'No internal coaching capability — everything escalates up',
    'Performance conversations are avoided or handled badly',
    'Staff feel underdeveloped and disengaged',
  ],
  'AI & Future Readiness': [
    'Leadership team unprepared for AI-driven workplace',
    'No framework for leading hybrid or remote teams',
    'Business scaling faster than people capability',
  ],
};

type Step = 1 | 2 | 3;

export default function ClientNeedsAnalysis() {
  const { isAuthenticated, loading, authenticate } = useAdminAuth();
  const [step, setStep] = useState<Step>(1);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Step 1
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactTitle, setContactTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');

  // Step 2
  const [selectedPains, setSelectedPains] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Step 3
  const [summary, setSummary] = useState('');

  const togglePain = (pain: string) => {
    setSelectedPains(prev =>
      prev.includes(pain) ? prev.filter(p => p !== pain) : [...prev, pain]
    );
  };

  const canProceedStep1 = companyName && contactName && industry && companySize;
  const canProceedStep2 = selectedPains.length > 0;

  const generateRecommendation = async () => {
    setGenerating(true);
    try {
      const painsByCategory: Record<string, string[]> = {};
      for (const [cat, pains] of Object.entries(PAIN_POINTS)) {
        const matched = pains.filter(p => selectedPains.includes(p));
        if (matched.length > 0) painsByCategory[cat] = matched;
      }

      const userPrompt = `Client: ${companyName}
Contact: ${contactName}, ${contactTitle || 'N/A'}
Industry: ${industry}
Company Size: ${companySize} employees

Pain points identified:
${Object.entries(painsByCategory).map(([cat, pains]) => `\n${cat}:\n${pains.map(p => `- ${p}`).join('\n')}`).join('\n')}
${additionalNotes ? `\nAdditional context: ${additionalNotes}` : ''}`;

      const systemPrompt = `You are a senior leadership development consultant at Leadership by Design, a South African firm with 11 years experience developing 4,000+ leaders across 50+ organisations. Your single commercial offer is the Leader as Coach — 90-Day Manager Coaching Accelerator.

Based on the client's pain points, generate a concise, boardroom-ready proposal summary that includes:

1. **What we heard** — 2–3 sentences reflecting their situation back to them in their language
2. **The real problem underneath** — the root cause driving their pain points (1 paragraph, sharp and insightful)
3. **What we recommend** — Leader as Coach 90-Day Manager Coaching Accelerator, with a specific explanation of why it fits their situation
4. **What changes in 90 days** — 3–4 specific outcomes tied to their checked pain points
5. **Suggested next step** — one clear call to action

Tone: direct, warm, no corporate fluff. Write as Kevin Britz would — straight-talking South African leadership coach. No clichés. Under 400 words total.`;

      const { data, error } = await supabase.functions.invoke('anthropic-chat', {
        body: {
          messages: [{ role: 'user', content: userPrompt }],
          system: systemPrompt,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to generate');

      setSummary(data.content);
      toast.success('Proposal summary generated');
    } catch (err) {
      console.error('Generation error:', err);
      toast.error('Failed to generate recommendation');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Client Needs Analysis', 20, 20);
    doc.setFontSize(11);
    doc.text(`Company: ${companyName}`, 20, 32);
    doc.text(`Contact: ${contactName}${contactTitle ? `, ${contactTitle}` : ''}`, 20, 39);
    doc.text(`Industry: ${industry} | Size: ${companySize}`, 20, 46);
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(summary, 170);
    doc.text(lines, 20, 58);
    doc.save(`needs-analysis-${companyName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    toast.success('PDF downloaded');
  };

  const saveToCRM = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('needs_analysis' as any).insert({
        company_name: companyName,
        contact_name: contactName,
        contact_title: contactTitle || null,
        industry,
        company_size: companySize,
        pain_points: selectedPains,
        additional_notes: additionalNotes || null,
        generated_summary: summary,
      });
      if (error) throw error;
      toast.success('Saved to CRM');
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
                <ClipboardCheck className="w-4 h-4" />
                <span className="text-sm font-medium">Client Needs Analysis</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Sign In</h1>
            </div>
            <AdminLoginForm onAuthenticate={authenticate} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Client Needs Analysis</h1>
            <p className="text-sm text-muted-foreground mt-1">Discovery call → proposal-ready summary in minutes</p>
          </motion.div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
            <span className="text-sm text-muted-foreground ml-2">
              {step === 1 ? 'Client Details' : step === 2 ? 'Pain Points' : 'Recommendation'}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Client Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Company Name *</label>
                      <Input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Old Mutual" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Contact Name *</label>
                        <Input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="e.g. Sarah van der Merwe" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Title</label>
                        <Input value={contactTitle} onChange={e => setContactTitle(e.target.value)} placeholder="e.g. Head of L&D" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Industry *</label>
                        <Select value={industry} onValueChange={setIndustry}>
                          <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                          <SelectContent>
                            {['Financial Services', 'Insurance', 'Banking', 'Accounting', 'Legal', 'Professional Services', 'Other'].map(i => (
                              <SelectItem key={i} value={i}>{i}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Company Size *</label>
                        <Select value={companySize} onValueChange={setCompanySize}>
                          <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                          <SelectContent>
                            {['100–200', '200–350', '350–500'].map(s => (
                              <SelectItem key={s} value={s}>{s} employees</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button onClick={() => setStep(2)} disabled={!canProceedStep1} className="gap-2">
                        Next <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Pain Points Checklist</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(PAIN_POINTS).map(([category, pains]) => (
                      <div key={category}>
                        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">{category}</h3>
                        <div className="space-y-2.5">
                          {pains.map(pain => (
                            <label key={pain} className="flex items-start gap-3 cursor-pointer group">
                              <Checkbox
                                checked={selectedPains.includes(pain)}
                                onCheckedChange={() => togglePain(pain)}
                                className="mt-0.5"
                              />
                              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{pain}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Anything else the client mentioned</label>
                      <Textarea
                        value={additionalNotes}
                        onChange={e => setAdditionalNotes(e.target.value)}
                        placeholder="Optional — free text notes from the call..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back
                      </Button>
                      <Button onClick={() => { setStep(3); generateRecommendation(); }} disabled={!canProceedStep2} className="gap-2">
                        <Sparkles className="w-4 h-4" /> Generate Recommendation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Proposal Summary — {companyName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generating ? (
                      <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Generating proposal summary...</p>
                      </div>
                    ) : summary ? (
                      <div className="space-y-6">
                        <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap bg-muted/30 rounded-lg p-6 border border-border">
                          {summary}
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Button variant="outline" onClick={copyToClipboard} className="gap-2">
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Copy to Clipboard'}
                          </Button>
                          <Button variant="outline" onClick={downloadPdf} className="gap-2">
                            <Download className="w-4 h-4" /> Download PDF
                          </Button>
                          <Button onClick={saveToCRM} disabled={saving} className="gap-2">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save to CRM
                          </Button>
                        </div>

                        <div className="flex justify-between pt-4 border-t border-border">
                          <Button variant="ghost" onClick={() => setStep(2)} className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Edit Pain Points
                          </Button>
                          <Button variant="outline" onClick={generateRecommendation} className="gap-2">
                            <Sparkles className="w-4 h-4" /> Regenerate
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No summary generated yet.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
