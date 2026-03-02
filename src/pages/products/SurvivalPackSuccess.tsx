import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PDF_DOWNLOAD_URL = "/new-manager-kit.pdf";

export default function SurvivalPackSuccess() {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");

  useEffect(() => {
    if (reference || trxref) {
      setIsValid(true);

      const email = sessionStorage.getItem("checkout_email");
      const name = sessionStorage.getItem("checkout_name");
      if (email) {
        supabase.from("product_purchases").insert({
          email,
          name,
          product_name: "survival-pack",
          amount_zar: 147,
          payment_reference: reference || trxref,
        } as any).then(() => console.log("Purchase recorded"));

        // Fire GA4 conversion event
        import('@/utils/gtmEvents').then(({ trackPurchaseComplete }) => {
          trackPurchaseComplete({ product_name: 'survival-pack', value: 147, currency: 'ZAR' });
        });

        supabase.functions.invoke("send-purchase-email", {
          body: { email, name, product: "survival-pack", paymentReference: reference || trxref },
        }).then(() => console.log("Purchase email sent"));
      }
    }
    setIsVerifying(false);
  }, [reference, trxref]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = PDF_DOWNLOAD_URL;
    link.download = "New-Manager-Survival-Pack.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary-foreground" />
          <p className="text-primary-foreground text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-primary">
        <div className="text-center max-w-md">
          <p className="text-primary-foreground text-xl mb-4">Unable to verify payment</p>
          <p className="text-primary-foreground/70 mb-6">
            If you completed the payment, please contact support with your payment reference.
          </p>
          <Button asChild className="bg-primary-foreground text-primary hover:bg-white">
            <Link to="/survival-pack">Return to Product Page</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <SEO
        title="Thank You — Download Your Survival Pack"
        description="Your purchase is complete. Download your New Manager Survival Pack now."
        canonicalUrl="/survival-pack/success"
      />

      <div className="container mx-auto max-w-2xl px-4 py-16 md:py-24">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center bg-primary/10">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif mb-3 text-foreground">You're In! 🎉</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your New Manager Survival Pack is ready for download.
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6 sm:p-8 text-center border border-border border-t-4 border-t-primary">
          <h2 className="text-xl font-serif mb-2 text-foreground">New Manager Survival Pack</h2>
          <p className="text-muted-foreground text-sm mb-6">3 Conversation Scripts + Team Expectations Sheet</p>

          <Button onClick={handleDownload} size="lg" className="text-base px-8 py-6 font-semibold">
            <Download className="w-5 h-5 mr-2" />
            Download Your Pack
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Download didn't start?{" "}
            <button onClick={handleDownload} className="underline text-primary hover:no-underline">Click here</button>
          </p>
        </div>

        {/* Enhanced Upsell to Kit */}
        <div className="mt-8 p-5 bg-primary/5 rounded-xl border border-primary/20 text-center">
          <p className="text-sm font-semibold text-foreground mb-2">
            Complete your toolkit — upgrade to the full Kit for R350
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            You already have the scripts (R147). The full Kit adds a 30-60-90 day plan, self-assessment, 2 more scripts & templates — for just R350 more instead of R497.
          </p>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/new-manager-kit">
              Upgrade to Full Kit — R497 →
            </Link>
          </Button>
        </div>

        {/* Bundle Upsell */}
        <div className="mt-4 p-5 bg-card rounded-xl border border-border text-center">
          <p className="text-sm font-semibold text-foreground mb-2">
            Or get the Bundle and save even more
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Kit + Difficult Conversations Playbook for R597 (save 20%). Everything you need for your first year as a manager.
          </p>
          <Button asChild variant="ghost" className="text-primary">
            <Link to="/products">
              View Bundle <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Leadership Diagnostic */}
        <div className="mt-4 p-4 bg-card rounded-xl border border-border text-center">
          <p className="text-xs text-muted-foreground">
            Curious where you stand as a leader?{" "}
            <Link to="/leadership-diagnostic" className="text-primary underline hover:no-underline font-medium">
              Take the free 5-min Leadership Diagnostic →
            </Link>
          </p>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-xs">
            Questions?{" "}
            <a href="mailto:support@leadershipbydesign.co.za" className="underline text-primary">
              support@leadershipbydesign.co.za
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
