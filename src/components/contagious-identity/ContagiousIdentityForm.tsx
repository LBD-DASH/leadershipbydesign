import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Download, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUtmParams } from "@/hooks/useUtmParams";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  role: z.string().trim().max(100).optional(),
  company: z.string().trim().max(200).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ContagiousIdentityForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const utmParams = useUtmParams();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      company: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Store in database
      const { error } = await supabase
        .from("contagious_identity_interests")
        .insert({
          name: data.name,
          email: data.email,
          role: data.role || null,
          company: data.company || null,
          submission_type: "workbook_download",
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
          utm_content: utmParams.utm_content,
          utm_term: utmParams.utm_term,
        });

      if (error) throw error;

      // Send email with workbook
      await supabase.functions.invoke("send-lead-magnet-email", {
        body: {
          name: data.name,
          email: data.email,
          leadMagnet: "Contagious Identity Workbook",
          pdfUrl: `${window.location.origin}/contagious-identity-workbook.pdf`,
        },
      });

      // Open PDF in new tab immediately (dual delivery)
      window.open("/contagious-identity-workbook.pdf", "_blank");

      setIsSuccess(true);
      toast({
        title: "Workbook sent!",
        description: "Check your email. The PDF also opened in a new tab.",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Workbook Sent
        </h3>
        <p className="text-muted-foreground">
          The PDF opened in a new tab. Check your email for the backup link.
        </p>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your full name"
                  className="bg-background border-border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-background border-border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Role</FormLabel>
                <FormControl>
                  <Input
                    placeholder="CEO, Founder, etc."
                    className="bg-background border-border"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Company</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your organisation"
                    className="bg-background border-border"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isSubmitting ? "Sending..." : "Download Workbook"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          We respect your privacy. No spam, ever.
        </p>
      </form>
    </Form>
  );
}
