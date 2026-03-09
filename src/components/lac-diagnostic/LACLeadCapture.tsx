import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Sparkles } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  company: z.string().trim().min(1, "Company is required").max(200),
  jobTitle: z.string().trim().min(1, "Job title is required").max(100),
});

export type LACLeadData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: LACLeadData) => void;
  isSubmitting?: boolean;
}

export default function LACLeadCapture({ onSubmit, isSubmitting = false }: Props) {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", jobTitle: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
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
      className="min-h-[60vh] flex items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Your results are ready.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Enter your details to unlock your coaching readiness profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lac-name">Name <span className="text-destructive">*</span></Label>
              <Input id="lac-name" placeholder="Your full name" value={formData.name} onChange={handleChange("name")} className={errors.name ? "border-destructive" : ""} disabled={isSubmitting} />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lac-email">Email <span className="text-destructive">*</span></Label>
              <Input id="lac-email" type="email" placeholder="you@company.com" value={formData.email} onChange={handleChange("email")} className={errors.email ? "border-destructive" : ""} disabled={isSubmitting} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lac-company">Company <span className="text-destructive">*</span></Label>
              <Input id="lac-company" placeholder="Your company" value={formData.company} onChange={handleChange("company")} className={errors.company ? "border-destructive" : ""} disabled={isSubmitting} />
              {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lac-title">Job Title <span className="text-destructive">*</span></Label>
              <Input id="lac-title" placeholder="Your role" value={formData.jobTitle} onChange={handleChange("jobTitle")} className={errors.jobTitle ? "border-destructive" : ""} disabled={isSubmitting} />
              {errors.jobTitle && <p className="text-xs text-destructive">{errors.jobTitle}</p>}
            </div>

            <Button type="submit" className="w-full mt-4" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Unlocking..." : "Unlock My Results"}
            </Button>
          </form>

          <div className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <p>We review submissions personally and only reach out when there's clear value. No spam. No pressure.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
