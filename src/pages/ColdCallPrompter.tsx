import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Phone, RotateCcw, Lock, Loader2, LogOut, ChevronLeft, FileText, X, Upload, ChevronRight, Users } from "lucide-react";
import { Label as FormLabel } from "@/components/ui/label";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

type Screen =
  | "REP_NAME"
  | "CALL_START"
  | "PITCH"
  | "BOOK_MEETING"
  | "NEED_INFO"
  | "NOT_INTERESTED"
  | "NO_RESPONSE"
  | "VOICEMAIL"
  | "GATEKEEPER"
  | "GATEKEEPER_BLOCKED"
  | "SUCCESS";

interface FormData {
  repName: string;
  contactName: string;
  company: string;
  phone: string;
  email: string;
  initialResponse: string;
  pitchOutcome: string;
  gatekeeperOutcome: string;
  programmeInterest: string;
  objectionReason: string;
  proposedMeetingDate: Date | undefined;
  followUpDate: Date | undefined;
  notes: string;
}

const initialFormData: FormData = {
  repName: "",
  contactName: "",
  company: "",
  phone: "",
  email: "",
  initialResponse: "",
  pitchOutcome: "",
  gatekeeperOutcome: "",
  programmeInterest: "",
  objectionReason: "",
  proposedMeetingDate: undefined,
  followUpDate: undefined,
  notes: "",
};

const ScriptBlock = ({ children }: { children: React.ReactNode }) => (
  <div className="text-lg md:text-xl leading-relaxed text-foreground font-serif italic border-l-4 border-primary/30 pl-5 py-2">
    {children}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{children}</p>
);

const Pause = () => (
  <div className="flex items-center gap-2 py-3">
    <div className="h-px flex-1 bg-border" />
    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pause</span>
    <div className="h-px flex-1 bg-border" />
  </div>
);

// Map each screen to its parent screen for back navigation
const screenParent: Partial<Record<Screen, Screen>> = {
  CALL_START: "REP_NAME",
  PITCH: "CALL_START",
  BOOK_MEETING: "PITCH",
  NEED_INFO: "PITCH",
  NOT_INTERESTED: "PITCH",
  NO_RESPONSE: "CALL_START",
  VOICEMAIL: "CALL_START",
  GATEKEEPER: "CALL_START",
  GATEKEEPER_BLOCKED: "GATEKEEPER",
};

const screenLabel: Partial<Record<Screen, string>> = {
  REP_NAME: "Welcome",
  CALL_START: "Opening",
  PITCH: "Pitch",
  BOOK_MEETING: "Book Meeting",
  NEED_INFO: "More Info",
  NOT_INTERESTED: "Not Interested",
  NO_RESPONSE: "No Response",
  VOICEMAIL: "Voicemail",
  GATEKEEPER: "Gatekeeper",
  GATEKEEPER_BLOCKED: "Gatekeeper Details",
  SUCCESS: "Saved",
};

const BackButton = ({ screen, onBack }: { screen: Screen; onBack: (target: Screen) => void }) => {
  const parent = screenParent[screen];
  if (!parent) return null;
  return (
    <button
      onClick={() => onBack(parent)}
      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
    >
      <ChevronLeft className="w-4 h-4" />
      Back to {screenLabel[parent]}
    </button>
  );
};

interface Prospect {
  name: string;
  surname: string;
  email: string;
  company: string;
  phone?: string;
}

export default function ColdCallPrompter() {
  const { user, loading: authLoading, signIn, signOut, isAuthenticated } = useAuth();
  const [screen, setScreen] = useState<Screen>("REP_NAME");
  const [form, setForm] = useState<FormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [currentProspectIndex, setCurrentProspectIndex] = useState<number>(-1);

  useEffect(() => {
    if (!isAuthenticated) return;
    const savedRep = localStorage.getItem("cold-call-rep-name");
    if (savedRep) {
      setForm((f) => ({ ...f, repName: savedRep }));
      setScreen("CALL_START");
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setLoginLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="border-b bg-background">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-sm md:text-base">Leader as Coach – Cold Call Prompter</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Call Centre Login</CardTitle>
              <CardDescription>Sign in to access the cold call prompter</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <FormLabel htmlFor="cc-email">Email</FormLabel>
                  <Input id="cc-email" type="email" placeholder="you@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="cc-password">Password</FormLabel>
                  <Input id="cc-password" type="password" placeholder="Enter your password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const update = (field: keyof FormData, value: string | Date | undefined) =>
    setForm((f) => ({ ...f, [field]: value }));

  const setRepAndContinue = () => {
    if (!form.repName.trim()) return;
    localStorage.setItem("cold-call-rep-name", form.repName.trim());
    setScreen("CALL_START");
  };

  const handleInitial = (response: string) => {
    update("initialResponse", response);
    if (response === "yes") setScreen("PITCH");
    else if (response === "no") setScreen("NO_RESPONSE");
    else if (response === "voicemail") setScreen("VOICEMAIL");
    else if (response === "gatekeeper") setScreen("GATEKEEPER");
  };

  const handlePitch = (outcome: string) => {
    update("pitchOutcome", outcome);
    if (outcome === "book_meeting") setScreen("BOOK_MEETING");
    else if (outcome === "need_info") setScreen("NEED_INFO");
    else if (outcome === "not_interested") setScreen("NOT_INTERESTED");
  };

  const handleGatekeeper = (outcome: string) => {
    update("gatekeeperOutcome", outcome);
    if (outcome === "transferred") setScreen("CALL_START");
    else if (outcome === "blocked") setScreen("GATEKEEPER_BLOCKED");
    else if (outcome === "need_email") setScreen("GATEKEEPER_BLOCKED");
  };

  const goBack = (target: Screen) => setScreen(target);

  const saveCall = async () => {
    setSaving(true);
    const { error } = await supabase.from("cold_call_logs").insert({
      rep_name: form.repName,
      contact_name: form.contactName || null,
      company: form.company || null,
      phone: form.phone || null,
      email: form.email || null,
      initial_response: form.initialResponse,
      pitch_outcome: form.pitchOutcome || null,
      gatekeeper_outcome: form.gatekeeperOutcome || null,
      programme_interest: form.programmeInterest || null,
      objection_reason: form.objectionReason || null,
      proposed_meeting_date: form.proposedMeetingDate
        ? format(form.proposedMeetingDate, "yyyy-MM-dd")
        : null,
      follow_up_date: form.followUpDate
        ? format(form.followUpDate, "yyyy-MM-dd")
        : null,
      notes: form.notes || null,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Error saving call", description: error.message, variant: "destructive" });
    } else {
      setScreen("SUCCESS");
    }
  };

  const resetCall = () => {
    // Move to next prospect automatically
    if (prospects.length > 0 && currentProspectIndex < prospects.length - 1) {
      const nextIdx = currentProspectIndex + 1;
      setCurrentProspectIndex(nextIdx);
      const p = prospects[nextIdx];
      setForm({
        ...initialFormData,
        repName: form.repName,
        contactName: `${p.name} ${p.surname}`.trim(),
        company: p.company,
        email: p.email,
        phone: p.phone || "",
      });
    } else {
      setForm({ ...initialFormData, repName: form.repName });
    }
    setScreen("CALL_START");
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) {
        toast({ title: "Empty CSV", description: "No data rows found.", variant: "destructive" });
        return;
      }
      const headers = lines[0].toLowerCase().split(",").map((h) => h.trim().replace(/"/g, ""));
      const nameIdx = headers.findIndex((h) => h === "name" || h === "first name" || h === "firstname");
      const surnameIdx = headers.findIndex((h) => h === "surname" || h === "last name" || h === "lastname");
      const emailIdx = headers.findIndex((h) => h.includes("email"));
      const companyIdx = headers.findIndex((h) => h === "company" || h === "company name" || h === "organisation");
      const phoneIdx = headers.findIndex((h) => h === "phone" || h === "tel" || h === "mobile");

      if (nameIdx === -1 || emailIdx === -1) {
        toast({ title: "Missing columns", description: "CSV needs at least 'Name' and 'Email' columns.", variant: "destructive" });
        return;
      }

      const parsed: Prospect[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        if (!cols[emailIdx]) continue;
        parsed.push({
          name: cols[nameIdx] || "",
          surname: surnameIdx >= 0 ? cols[surnameIdx] || "" : "",
          email: cols[emailIdx] || "",
          company: companyIdx >= 0 ? cols[companyIdx] || "" : "",
          phone: phoneIdx >= 0 ? cols[phoneIdx] || "" : "",
        });
      }
      setProspects(parsed);
      if (parsed.length > 0) {
        setCurrentProspectIndex(0);
        const p = parsed[0];
        setForm((f) => ({
          ...f,
          contactName: `${p.name} ${p.surname}`.trim(),
          company: p.company,
          email: p.email,
          phone: p.phone || "",
        }));
        toast({ title: `${parsed.length} prospects loaded`, description: "First prospect selected." });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const selectProspect = (idx: number) => {
    setCurrentProspectIndex(idx);
    const p = prospects[idx];
    setForm((f) => ({
      ...f,
      contactName: `${p.name} ${p.surname}`.trim(),
      company: p.company,
      email: p.email,
      phone: p.phone || "",
    }));
  };

  const DatePicker = ({
    value,
    onChange,
    label,
  }: {
    value: Date | undefined;
    onChange: (d: Date | undefined) => void;
    label: string;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-sm md:text-base">Leader as Coach – Cold Call Prompter v1</h1>
          </div>
          <div className="flex items-center gap-2">
            {screen !== "REP_NAME" && (
              <span className="text-xs text-muted-foreground">{form.repName}</span>
            )}
            <Button
              variant={showPdf ? "default" : "outline"}
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setShowPdf(!showPdf)}
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{showPdf ? "Hide" : "Show"} Reference</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-xs text-muted-foreground">
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main layout with optional PDF sidebar */}
      <div className="flex-1 flex">
        {/* Prompter content */}
        <div className={cn("flex-1 flex items-start justify-center px-4 py-8 transition-all", showPdf ? "lg:w-1/2" : "w-full")}>
          <Card className="w-full max-w-2xl shadow-sm">
            <CardContent className="p-6 md:p-8 space-y-6">

              {/* Screen breadcrumb */}
              {screen !== "REP_NAME" && screen !== "SUCCESS" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Opening</span>
                  {["PITCH", "BOOK_MEETING", "NEED_INFO", "NOT_INTERESTED"].includes(screen) && (
                    <><span>›</span><span>Pitch</span></>
                  )}
                  {["BOOK_MEETING", "NEED_INFO", "NOT_INTERESTED"].includes(screen) && (
                    <><span>›</span><span className="text-foreground font-medium">{screenLabel[screen]}</span></>
                  )}
                  {screen === "PITCH" && (
                    <><span>›</span><span className="text-foreground font-medium">Pitch</span></>
                  )}
                  {["NO_RESPONSE", "VOICEMAIL"].includes(screen) && (
                    <><span>›</span><span className="text-foreground font-medium">{screenLabel[screen]}</span></>
                  )}
                  {["GATEKEEPER", "GATEKEEPER_BLOCKED"].includes(screen) && (
                    <><span>›</span><span>Gatekeeper</span></>
                  )}
                  {screen === "GATEKEEPER_BLOCKED" && (
                    <><span>›</span><span className="text-foreground font-medium">Details</span></>
                  )}
                </div>
              )}

              {/* Back button */}
              <BackButton screen={screen} onBack={goBack} />

              {/* REP NAME */}
              {screen === "REP_NAME" && (
                <>
                  <h2 className="text-xl font-semibold">Welcome</h2>
                  <p className="text-muted-foreground">Enter your name to get started.</p>
                  <Input
                    placeholder="Your name"
                    value={form.repName}
                    onChange={(e) => update("repName", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && setRepAndContinue()}
                    autoFocus
                  />
                  <Button onClick={setRepAndContinue} className="w-full" size="lg">
                    Start Calling
                  </Button>
                </>
              )}

              {/* CALL START */}
              {screen === "CALL_START" && (
                <>
                  <Label>Say this:</Label>
                  <ScriptBlock>
                    "Hi [First Name], it's Kevin Britz from Leadership by Design.
                    <br /><br />
                    I know I'm calling out of the blue — can I take 60 seconds to explain why I'm calling?"
                  </ScriptBlock>
                  <Pause />
                  <div className="grid grid-cols-2 gap-3">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleInitial("yes")}>
                      YES
                    </Button>
                    <Button size="lg" variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-50" onClick={() => handleInitial("no")}>
                      NO
                    </Button>
                    <Button size="lg" variant="outline" className="text-muted-foreground" onClick={() => handleInitial("voicemail")}>
                      VOICEMAIL
                    </Button>
                    <Button size="lg" variant="outline" className="text-muted-foreground" onClick={() => handleInitial("gatekeeper")}>
                      GATEKEEPER
                    </Button>
                  </div>
                </>
              )}

              {/* PITCH */}
              {screen === "PITCH" && (
                <>
                  <Label>Say this:</Label>
                  <ScriptBlock>
                    "We work with financial services and insurance firms who are spending their Skills Development Levy and CSI budgets on leadership training that isn't changing behaviour.
                    <br /><br />
                    Managers still avoid hard conversations, culture lives on the wall, and SDL spend ticks compliance but doesn't build capability.
                    <br /><br />
                    We've built a structured Leader as Coach programme that transforms managers into culture architects over 3, 6, or 10 months — and it's fully eligible for SDL and B-BBEE spend."
                  </ScriptBlock>
                  <Pause />
                  <Label>Then ask:</Label>
                  <ScriptBlock>
                    "Would it be worth a 20-minute conversation to see if this fits what you're trying to solve?"
                  </ScriptBlock>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handlePitch("book_meeting")}>
                      BOOK MEETING
                    </Button>
                    <Button size="lg" variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-50" onClick={() => handlePitch("need_info")}>
                      NEED INFO
                    </Button>
                    <Button size="lg" variant="outline" className="border-red-400 text-red-600 hover:bg-red-50" onClick={() => handlePitch("not_interested")}>
                      NOT INTERESTED
                    </Button>
                  </div>
                </>
              )}

              {/* BOOK MEETING */}
              {screen === "BOOK_MEETING" && (
                <>
                  <Label>Say this:</Label>
                  <ScriptBlock>
                    "Great. I'll keep it practical — we'll look at whether the 3-month Accelerator, the 6-month Transformation, or the full 10-month Culture Architecture fits your leadership layer."
                  </ScriptBlock>
                  <div className="space-y-3 pt-2">
                    <Input placeholder="Contact name" value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />
                    <Input placeholder="Company" value={form.company} onChange={(e) => update("company", e.target.value)} />
                    <Input placeholder="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
                    <Input placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                    <a href="https://calendar.app.google/DRewMsaisLeh1J319" target="_blank" rel="noopener noreferrer">
                      <Button type="button" variant="outline" className="w-full gap-2 border-primary text-primary hover:bg-primary/5">
                        <CalendarIcon className="w-4 h-4" />
                        Open Calendar — Book a Time
                      </Button>
                    </a>
                    <Textarea placeholder="Notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
                    <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={saveCall} disabled={saving}>
                      {saving ? "Saving…" : "SAVE CALL"}
                    </Button>
                  </div>
                </>
              )}

              {/* NEED INFO */}
              {screen === "NEED_INFO" && (
                <>
                  <Label>Say this:</Label>
                  <ScriptBlock>
                    "The programme installs what we call the SHIFT Skills Framework — Self-Management, Human Intelligence, Innovation, Focus, Thinking, and AI Edge — as a behavioural operating system for managers."
                  </ScriptBlock>
                  <Pause />
                  <Label>Then ask:</Label>
                  <ScriptBlock>
                    "Are you more focused on quick coaching skills for managers, or a deeper culture shift across your leadership layer?"
                  </ScriptBlock>
                  <div className="space-y-3 pt-2">
                    <Select value={form.programmeInterest} onValueChange={(v) => update("programmeInterest", v)}>
                      <SelectTrigger><SelectValue placeholder="Programme interest" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-month">3-Month Accelerator</SelectItem>
                        <SelectItem value="6-month">6-Month Transformation</SelectItem>
                        <SelectItem value="10-month">10-Month Culture Architecture</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
                    <Textarea placeholder="Notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
                    <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={saveCall} disabled={saving}>
                      {saving ? "Saving…" : "SAVE CALL"}
                    </Button>
                  </div>
                </>
              )}

              {/* NOT INTERESTED */}
              {screen === "NOT_INTERESTED" && (
                <>
                  <Label>Say this:</Label>
                  <ScriptBlock>
                    "Understood. Just so I close the loop properly — are you already running a structured leadership coaching programme internally, or is this not a focus right now?"
                  </ScriptBlock>
                  <div className="space-y-3 pt-2">
                    <Select value={form.objectionReason} onValueChange={(v) => update("objectionReason", v)}>
                      <SelectTrigger><SelectValue placeholder="Reason" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal_provider">Internal provider</SelectItem>
                        <SelectItem value="budget_timing">Budget timing</SelectItem>
                        <SelectItem value="not_priority">Not priority</SelectItem>
                        <SelectItem value="wrong_contact">Wrong contact</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea placeholder="Notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
                    <Button size="lg" className="w-full" onClick={saveCall} disabled={saving}>
                      {saving ? "Saving…" : "SAVE CALL"}
                    </Button>
                  </div>
                </>
              )}

              {/* NO RESPONSE */}
              {screen === "NO_RESPONSE" && (
                <>
                  <Label>Say this:</Label>
                  <ScriptBlock>
                    "No problem at all. When would be a better time to reconnect?"
                  </ScriptBlock>
                  <div className="space-y-3 pt-2">
                    <DatePicker value={form.followUpDate} onChange={(d) => update("followUpDate", d)} label="Follow-up date" />
                    <Textarea placeholder="Notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
                    <Button size="lg" className="w-full" onClick={saveCall} disabled={saving}>
                      {saving ? "Saving…" : "SAVE CALL"}
                    </Button>
                  </div>
                </>
              )}

              {/* VOICEMAIL */}
              {screen === "VOICEMAIL" && (
                <>
                  <Label>Say this:</Label>
                  <ScriptBlock>
                    "Hi [First Name], Kevin Britz from Leadership by Design.
                    <br /><br />
                    We help organisations turn their Skills Development Levy and CSI spend into measurable leadership capability.
                    <br /><br />
                    I'll send a short overview by email. My number is [number]."
                  </ScriptBlock>
                  <div className="space-y-3 pt-2">
                    <Input placeholder="Contact name" value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />
                    <Input placeholder="Company" value={form.company} onChange={(e) => update("company", e.target.value)} />
                    <Input placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                    <Input placeholder="Email (if known)" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
                    <Textarea placeholder="Quick summary" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
                    <Button size="lg" className="w-full" onClick={saveCall} disabled={saving}>
                      {saving ? "Saving…" : "SAVE CALL"}
                    </Button>
                  </div>
                </>
              )}

              {/* GATEKEEPER */}
              {screen === "GATEKEEPER" && (
                <>
                  <Label>Say this:</Label>
                  <ScriptBlock>
                    "Hi, it's Kevin Britz calling regarding leadership development and Skills Levy allocation. Is [First Name] available?"
                  </ScriptBlock>
                  <div className="grid grid-cols-3 gap-3 pt-4">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleGatekeeper("transferred")}>
                      TRANSFERRED
                    </Button>
                    <Button size="lg" variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-50" onClick={() => { update("gatekeeperOutcome", "need_email"); setScreen("GATEKEEPER_BLOCKED"); }}>
                      NEED EMAIL
                    </Button>
                    <Button size="lg" variant="outline" className="border-red-400 text-red-600 hover:bg-red-50" onClick={() => handleGatekeeper("blocked")}>
                      BLOCKED
                    </Button>
                  </div>
                </>
              )}

              {/* GATEKEEPER BLOCKED / NEED EMAIL */}
              {screen === "GATEKEEPER_BLOCKED" && (
                <>
                  <h2 className="text-lg font-semibold">
                    {form.gatekeeperOutcome === "need_email" ? "Capture Email" : "Blocked — Capture Details"}
                  </h2>
                  <div className="space-y-3">
                    <Input placeholder="Alternate contact / name" value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />
                    {form.gatekeeperOutcome === "need_email" && (
                      <Input placeholder="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
                    )}
                    <Textarea placeholder="Notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
                    <Button size="lg" className="w-full" onClick={saveCall} disabled={saving}>
                      {saving ? "Saving…" : "SAVE CALL"}
                    </Button>
                  </div>
                </>
              )}

              {/* SUCCESS */}
              {screen === "SUCCESS" && (
                <div className="text-center space-y-4 py-8">
                  <div className="text-4xl">✅</div>
                  <h2 className="text-xl font-semibold">Call Saved</h2>
                  <p className="text-muted-foreground">Ready for the next one.</p>
                  <Button size="lg" onClick={resetCall} className="gap-2">
                    <RotateCcw className="h-4 w-4" /> Start New Call
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Reference Sidebar */}
        {showPdf && (
          <div className="hidden lg:flex w-1/2 border-l border-border flex-col bg-muted/30">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Quick Reference</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowPdf(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              {/* One-liner */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <p className="font-semibold text-primary text-xs uppercase tracking-wide mb-1">What We Do</p>
                <p className="text-foreground">Structured coaching programme that transforms managers into culture architects — 3, 6, or 10 months. SDL & CSI eligible.</p>
              </div>

              {/* The Problem */}
              <div className="bg-background border border-border rounded-lg p-3">
                <p className="font-semibold text-xs uppercase tracking-wide mb-2 text-muted-foreground">The Problem We Solve</p>
                <ul className="space-y-1 text-foreground">
                  <li>• Training budgets spent — behaviour doesn't change</li>
                  <li>• Managers avoid hard conversations</li>
                  <li>• Culture on the wall, not in the corridor</li>
                  <li>• SDL/CSI spend ticks compliance, not capability</li>
                </ul>
              </div>

              {/* 3 Programmes */}
              <div className="bg-background border border-border rounded-lg p-3">
                <p className="font-semibold text-xs uppercase tracking-wide mb-2 text-muted-foreground">3 Programme Options</p>
                <div className="space-y-2">
                  <div className="border-l-2 border-amber-500 pl-2">
                    <p className="font-medium text-foreground">Accelerator — 3 months</p>
                    <p className="text-muted-foreground text-xs">Coaching fundamentals, self-awareness, communication. Best for new managers.</p>
                  </div>
                  <div className="border-l-2 border-green-500 pl-2">
                    <p className="font-medium text-foreground">Transformation — 6 months ⭐</p>
                    <p className="text-muted-foreground text-xs">Coaching identity, accountability, performance standards, 360° feedback. Most popular.</p>
                  </div>
                  <div className="border-l-2 border-primary pl-2">
                    <p className="font-medium text-foreground">Culture Architecture — 10 months</p>
                    <p className="text-muted-foreground text-xs">Full 5-phase programme: strategy, AI edge, succession, mentoring capability.</p>
                  </div>
                </div>
              </div>

              {/* SHIFT Framework */}
              <div className="bg-background border border-border rounded-lg p-3">
                <p className="font-semibold text-xs uppercase tracking-wide mb-2 text-muted-foreground">SHIFT Skills Framework</p>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className="flex gap-2"><span className="font-bold text-primary w-4">S</span><span className="text-foreground">Self-Management — emotional regulation, accountability</span></div>
                  <div className="flex gap-2"><span className="font-bold text-primary w-4">H</span><span className="text-foreground">Human Intelligence — empathy, cultural intelligence</span></div>
                  <div className="flex gap-2"><span className="font-bold text-primary w-4">I</span><span className="text-foreground">Innovation — creative problem-solving, design thinking</span></div>
                  <div className="flex gap-2"><span className="font-bold text-primary w-4">F</span><span className="text-foreground">Focus — prioritisation, time mastery, strategic clarity</span></div>
                  <div className="flex gap-2"><span className="font-bold text-primary w-4">T</span><span className="text-foreground">Thinking — critical thinking, decision-making, systems</span></div>
                </div>
              </div>

              {/* CSI & B-BBEE */}
              <div className="bg-background border border-border rounded-lg p-3">
                <p className="font-semibold text-xs uppercase tracking-wide mb-2 text-muted-foreground">CSI & B-BBEE Alignment</p>
                <ul className="space-y-1 text-foreground text-xs">
                  <li>✅ Skills Development Levy eligible</li>
                  <li>✅ B-BBEE Scorecard: Skills Dev & SED</li>
                  <li>✅ Measurable outcomes for SETA reporting</li>
                </ul>
              </div>

              {/* Assessments */}
              <div className="bg-background border border-border rounded-lg p-3">
                <p className="font-semibold text-xs uppercase tracking-wide mb-2 text-muted-foreground">Assessments Included</p>
                <p className="text-foreground text-xs">Values Blueprint · DISC Profile · 6 Human Needs · Find My Purpose · Monthly Pulse · Quarterly 360°</p>
              </div>

              {/* Credibility */}
              <div className="bg-muted/50 border border-border rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">11 Years · 4,000+ Leaders · 750+ Programmes · 50+ Organisations</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
