import { useState } from "react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackLeadMagnetDownload } from "@/utils/gtmEvents";

const roles = [
  "HR Director",
  "CHRO",
  "Chief People Officer",
  "Head of L&D",
  "L&D Manager",
  "COO",
  "Other",
];

const bullets = [
  "What disengaged managers actually cost your organisation",
  "Why behaviour change requires more than training",
  "The five things high-performance organisations do differently",
];

export default function CoachingGapReport() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organisation: "",
    role: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = "Required";
    if (!formData.lastName.trim()) e.lastName = "Required";
    if (!formData.email.trim() || !formData.email.includes("@"))
      e.email = "Valid work email required";
    if (!formData.organisation.trim()) e.organisation = "Required";
    if (!formData.role) e.role = "Please select a role";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const email = formData.email.trim().toLowerCase();

    try {
      await supabase.from("lead_captures").insert({
        email,
        name: fullName,
        company: formData.organisation.trim(),
        resource_slug: "coaching-gap-report",
        resource_title: "The Coaching Gap Report",
        source: "gated_lead_magnet",
      });

      await supabase
        .from("email_subscribers")
        .insert({
          email,
          name: fullName,
          company: formData.organisation.trim(),
          source: "lead_magnet:coaching-gap-report",
          tags: ["lead-magnet", "coaching-gap-report"],
        })
        .select()
        .maybeSingle();

      trackLeadMagnetDownload({ lead_magnet: "coaching-gap-report" });

      try {
        await supabase.functions.invoke("slack-notify", {
          body: {
            channel: "#leads-and-signups",
            text: `📥 Coaching Gap Report Download\n*${fullName}* (${email})\nOrg: ${formData.organisation.trim()}\nRole: ${formData.role}`,
          },
        });
      } catch {}

      setIsDownloaded(true);
      toast.success("Report unlocked! Your download will start shortly.");
      window.open("/downloads/coaching-gap-report.pdf", "_blank");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "bg-white border border-gray-200 rounded-lg px-4 py-3 text-[15px] focus:ring-2 focus:ring-[#C8A864]/40 focus:border-[#C8A864] transition-colors";

  return (
    <>
      <SEO
        title="The Coaching Gap Report | Leadership by Design"
        description="Free research report: Why manager development fails and what high-performance organisations do differently. International research meets 11 years of South African practice."
      />
      <Header />

      {/* HERO */}
      <section
        style={{ backgroundColor: "#0F1F2E" }}
        className="relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="pt-2 lg:pt-8"
            >
              <p
                className="text-xs sm:text-sm tracking-[0.2em] uppercase mb-5"
                style={{
                  color: "#C8A864",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontWeight: 600,
                }}
              >
                Free Research Report
              </p>

              <h1
                className="text-3xl sm:text-4xl lg:text-[48px] leading-[1.15] mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#FFFFFF",
                }}
              >
                The Coaching Gap
              </h1>

              <p
                className="text-lg sm:text-xl lg:text-2xl mb-6 italic"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#FFFFFF",
                  opacity: 0.92,
                }}
              >
                Why Manager Development Fails and What High-Performance
                Organisations Do Differently
              </p>

              <p
                className="text-base sm:text-[17px] mb-8 leading-[1.8]"
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  color: "#F8F6F1",
                }}
              >
                International research meets 11 years of South African practice.
                This report shows why most manager development produces no
                lasting change — and what the organisations that get it right do
                differently.
              </p>

              <ul className="space-y-4">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: "#C8A864" }}
                    />
                    <span
                      className="text-[15px] sm:text-[16px]"
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        color: "#F8F6F1",
                      }}
                    >
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right column — form card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div
                className="rounded-2xl shadow-2xl p-7 sm:p-10"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                {isDownloaded ? (
                  <div className="text-center py-8">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{ backgroundColor: "#2A7B88" }}
                    >
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3
                      className="text-xl mb-2"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: "#0F1F2E",
                      }}
                    >
                      Your report is on its way
                    </h3>
                    <p
                      className="text-sm"
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        color: "#666",
                      }}
                    >
                      If the download didn't start,{" "}
                      <a
                        href="/downloads/coaching-gap-report.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: "#2A7B88" }}
                      >
                        click here
                      </a>
                      .
                    </p>
                  </div>
                ) : (
                  <>
                    <h2
                      className="text-xl sm:text-[22px] mb-1"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: "#0F1F2E",
                      }}
                    >
                      Get the free report
                    </h2>
                    <p
                      className="text-sm mb-6"
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        color: "#666666",
                      }}
                    >
                      Instant download. No spam. Unsubscribe any time.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* First / Last name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="firstName"
                            className="text-sm mb-1 block"
                            style={{
                              fontFamily: "'Source Sans 3', sans-serif",
                              color: "#0F1F2E",
                            }}
                          >
                            First name *
                          </Label>
                          <Input
                            id="firstName"
                            className={inputClass}
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                          />
                          {errors.firstName && (
                            <p className="text-xs text-red-500 mt-1">
                              {errors.firstName}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label
                            htmlFor="lastName"
                            className="text-sm mb-1 block"
                            style={{
                              fontFamily: "'Source Sans 3', sans-serif",
                              color: "#0F1F2E",
                            }}
                          >
                            Last name *
                          </Label>
                          <Input
                            id="lastName"
                            className={inputClass}
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                          />
                          {errors.lastName && (
                            <p className="text-xs text-red-500 mt-1">
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-sm mb-1 block"
                          style={{
                            fontFamily: "'Source Sans 3', sans-serif",
                            color: "#0F1F2E",
                          }}
                        >
                          Work email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className={inputClass}
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Organisation */}
                      <div>
                        <Label
                          htmlFor="organisation"
                          className="text-sm mb-1 block"
                          style={{
                            fontFamily: "'Source Sans 3', sans-serif",
                            color: "#0F1F2E",
                          }}
                        >
                          Organisation *
                        </Label>
                        <Input
                          id="organisation"
                          className={inputClass}
                          value={formData.organisation}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              organisation: e.target.value,
                            })
                          }
                        />
                        {errors.organisation && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.organisation}
                          </p>
                        )}
                      </div>

                      {/* Role dropdown */}
                      <div>
                        <Label
                          htmlFor="role"
                          className="text-sm mb-1 block"
                          style={{
                            fontFamily: "'Source Sans 3', sans-serif",
                            color: "#0F1F2E",
                          }}
                        >
                          Role *
                        </Label>
                        <select
                          id="role"
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                          }
                          className={`${inputClass} w-full appearance-none`}
                          style={{
                            fontFamily: "'Source Sans 3', sans-serif",
                          }}
                        >
                          <option value="">Select your role</option>
                          {roles.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        {errors.role && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.role}
                          </p>
                        )}
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 text-base font-bold rounded-lg transition-all duration-200 hover:opacity-90"
                        style={{
                          backgroundColor: "#C8A864",
                          color: "#0F1F2E",
                          fontFamily: "'Source Sans 3', sans-serif",
                          height: "auto",
                        }}
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Download the Report"
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
