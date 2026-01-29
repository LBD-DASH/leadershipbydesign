import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Sparkles, MessageCircle, Clock, User } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";

const leadCaptureSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(30, "Phone must be less than 30 characters").optional(),
  organisation: z.string().trim().max(200, "Organisation must be less than 200 characters").optional(),
  role: z.string().trim().max(100, "Role must be less than 100 characters").optional(),
});

export type LeadCaptureData = z.infer<typeof leadCaptureSchema> & {
  followUpPreference: FollowUpPreference;
};

export type FollowUpPreference = "yes" | "maybe" | "no";

interface LeadCaptureGateProps {
  onSubmit: (data: LeadCaptureData) => void;
  isSubmitting?: boolean;
  variant: 'leadership' | 'team' | 'shift';
}

const followUpOptions: { 
  value: FollowUpPreference; 
  label: string; 
  icon: React.ElementType;
}[] = [
  {
    value: "yes",
    label: "Yes — add me to the Priority Insight Waiting List for a short follow-up",
    icon: MessageCircle,
  },
  {
    value: "maybe",
    label: "Maybe later — keep me on the waiting list for insights and updates",
    icon: Clock,
  },
  {
    value: "no",
    label: "No — I'll reflect independently",
    icon: User,
  },
];

export default function LeadCaptureGate({ onSubmit, isSubmitting = false, variant }: LeadCaptureGateProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organisation: "",
    role: "",
  });
  const [followUpPreference, setFollowUpPreference] = useState<FollowUpPreference>("maybe");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = leadCaptureSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit({
      ...result.data,
      followUpPreference,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-[60vh] flex items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Your results are ready.
            </h2>
            
            <p className="text-muted-foreground text-sm sm:text-base">
              Enter your details to unlock your insights and join the{" "}
              <span className="text-primary font-medium">Priority Insight Waiting List</span>.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange("name")}
                  className={errors.name ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange("email")}
                  className={errors.email ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+27 82 123 4567"
                value={formData.phone}
                onChange={handleChange("phone")}
                className={errors.phone ? "border-destructive" : ""}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organisation" className="text-sm font-medium">
                  Organisation <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Input
                  id="organisation"
                  type="text"
                  placeholder="Your company"
                  value={formData.organisation}
                  onChange={handleChange("organisation")}
                  className={errors.organisation ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Role <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Input
                  id="role"
                  type="text"
                  placeholder="Your current role"
                  value={formData.role}
                  onChange={handleChange("role")}
                  className={errors.role ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Follow-up Preference */}
            <div className="pt-4 border-t border-border">
              <Label className="text-sm font-medium mb-3 block">
                Your Next Step (Optional)
              </Label>
              <p className="text-xs text-muted-foreground mb-3">
                Would you like support interpreting or acting on these insights?
              </p>
              
              <div className="space-y-2">
                {followUpOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = followUpPreference === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFollowUpPreference(option.value)}
                      disabled={isSubmitting}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-all duration-200",
                        "hover:border-primary/50 hover:bg-primary/5",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20",
                        "disabled:opacity-60 disabled:cursor-not-allowed",
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : "border-border bg-background"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                          isSelected 
                            ? "border-primary bg-primary" 
                            : "border-muted-foreground/40"
                        )}>
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Icon className={cn(
                            "w-4 h-4 flex-shrink-0",
                            isSelected ? "text-primary" : "text-muted-foreground"
                          )} />
                          <span className={cn(
                            "text-xs sm:text-sm",
                            isSelected ? "text-foreground" : "text-foreground/80"
                          )}>
                            {option.label}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Unlocking..." : "Unlock My Results"}
            </Button>
          </form>

          {/* Trust Text */}
          <div className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <p>
              We review submissions personally and only reach out when there's clear value. 
              No spam. No pressure.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
