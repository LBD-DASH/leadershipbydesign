import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PDF_DOWNLOAD_URL = "/new-manager-kit.pdf";

export default function NewManagerKitSuccess() {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");

  useEffect(() => {
    if (reference || trxref) {
      setIsValid(true);

      // Record purchase & send email
      const email = sessionStorage.getItem("checkout_email");
      const name = sessionStorage.getItem("checkout_name");
      if (email) {
        supabase.from("product_purchases").insert({
          email,
          name,
          product_name: "new-manager-kit",
          amount_zar: 497,
          payment_reference: reference || trxref,
        } as any).then(() => console.log("Purchase recorded"));

        // Fire GA4 conversion event
        import('@/utils/gtmEvents').then(({ trackPurchaseComplete }) => {
          trackPurchaseComplete({ product_name: 'new-manager-kit', value: 497, currency: 'ZAR' });
        });

        supabase.functions.invoke("send-purchase-email", {
          body: { email, name, product: "new-manager-kit", paymentReference: reference || trxref },
        }).then(() => console.log("Purchase email sent"));
      }
    }
    setIsVerifying(false);
  }, [reference, trxref]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = PDF_DOWNLOAD_URL;
    link.download = "The-New-Manager-Survival-Kit.pdf";
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
            <Link to="/new-manager-kit">Return to Product Page</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <SEO
        title="Thank You — Download Your New Manager Survival Kit"
        description="Your purchase is complete. Download your New Manager Survival Kit now."
        canonicalUrl="/new-manager-kit/success"
      />

      <div className="container mx-auto max-w-2xl px-4 py-16 md:py-24">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center bg-primary/10">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif mb-3 text-foreground">Thank You for Your Purchase! 🎉</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your New Manager Survival Kit is ready for download.
          </p>
        </div>

        {/* Download Card */}
        <div className="bg-card rounded-xl shadow-lg p-6 sm:p-8 text-center border border-border border-t-4 border-t-primary">
          <h2 className="text-xl font-serif mb-2 text-foreground">The New Manager Survival Kit</h2>
          <p className="text-muted-foreground text-sm mb-1">Your First 90 Days</p>
          <p className="text-xs text-muted-foreground mb-6">21 pages • PDF Format</p>

          <Button
            onClick={handleDownload}
            size="lg"
            className="text-base px-8 py-6 font-semibold"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Your Kit
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Download didn't start?{" "}
            <button onClick={handleDownload} className="underline text-primary hover:no-underline">
              Click here
            </button>
          </p>
        </div>

        {/* Next Steps */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold mb-4 text-foreground">What's Next?</h3>
          <ul className="text-muted-foreground space-y-2 text-sm text-left max-w-md mx-auto">
            <li>✓ Open your PDF and complete the Self-Assessment on page 3</li>
            <li>✓ Identify your first conversation from the 5 Critical Scripts</li>
            <li>✓ Use the 30-60-90 Day Plan to map your first quarter</li>
          </ul>
        </div>

        {/* Upsell: Add Playbook for R100 */}
        <div className="mt-8 p-5 bg-primary/5 rounded-xl border border-primary/20 text-center">
          <p className="text-sm font-semibold text-foreground mb-2">
            Add the Difficult Conversations Playbook for just R100 more
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            You paid R497 for the Kit. The Bundle (Kit + Playbook) is R597 — that's the Playbook for R100 instead of R247. 18 pages of scripts, frameworks & templates.
          </p>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/difficult-conversations">
              Add Playbook for R100 →
            </Link>
          </Button>
        </div>

        {/* Leadership Diagnostic CTA */}
        <div className="mt-4 p-5 bg-card rounded-xl border border-border text-center">
          <p className="text-sm font-semibold text-foreground mb-2">
            Where do you stand as a leader?
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Take our free 5-minute Leadership Diagnostic and get a personalised development report.
          </p>
          <Button asChild variant="ghost" className="text-primary">
            <Link to="/leadership-diagnostic">
              Take Free Diagnostic <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
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
