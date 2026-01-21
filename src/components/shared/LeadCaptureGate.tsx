import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Sparkles } from "lucide-react";
import { z } from "zod";

const leadCaptureSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  organisation: z.string().trim().max(200, "Organisation must be less than 200 characters").optional(),
  role: z.string().trim().max(100, "Role must be less than 100 characters").optional(),
});

export type LeadCaptureData = z.infer<typeof leadCaptureSchema>;

interface LeadCaptureGateProps {
  onSubmit: (data: LeadCaptureData) => void;
  isSubmitting?: boolean;
  variant: 'leadership' | 'team';
}

export default function LeadCaptureGate({ onSubmit, isSubmitting = false, variant }: LeadCaptureGateProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organisation: "",
    role: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
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

    onSubmit(result.data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-[60vh] flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
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

            <div className="space-y-2">
              <Label htmlFor="organisation" className="text-sm font-medium">
                Organisation <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="organisation"
                type="text"
                placeholder="Your company or organisation"
                value={formData.organisation}
                onChange={handleChange("organisation")}
                className={errors.organisation ? "border-destructive" : ""}
                disabled={isSubmitting}
              />
              {errors.organisation && (
                <p className="text-xs text-destructive">{errors.organisation}</p>
              )}
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
              {errors.role && (
                <p className="text-xs text-destructive">{errors.role}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
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
