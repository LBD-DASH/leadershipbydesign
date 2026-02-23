import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Loader2, Package, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const BUNDLE_PRODUCTS = [
  {
    id: "new-manager-kit",
    title: "The New Manager Survival Kit",
    subtitle: "Your First 90 Days",
    pages: "21 pages",
    downloadUrl: "/new-manager-kit.pdf",
    filename: "The-New-Manager-Survival-Kit.pdf",
  },
  {
    id: "difficult-conversations",
    title: "The Difficult Conversations Playbook",
    subtitle: "Scripts, Frameworks & Templates",
    pages: "18 pages",
    downloadUrl: "/difficult-conversations-playbook.pdf",
    filename: "Difficult-Conversations-Playbook.pdf",
  },
];

export default function BundleSuccess() {
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
          product_name: "bundle",
          amount_zar: 597,
          payment_reference: reference || trxref,
        } as any).then(() => console.log("Purchase recorded"));

        supabase.functions.invoke("send-purchase-email", {
          body: { email, name, product: "bundle", paymentReference: reference || trxref },
        }).then(() => console.log("Purchase email sent"));
      }
    }
    setIsVerifying(false);
  }, [reference, trxref]);

  const handleDownload = (downloadUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    BUNDLE_PRODUCTS.forEach((product, index) => {
      setTimeout(() => {
        handleDownload(product.downloadUrl, product.filename);
      }, index * 500);
    });
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
            <Link to="/products">Return to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <SEO
        title="Thank You — Download Your New Manager Bundle"
        description="Your purchase is complete. Download your New Manager Bundle now."
        canonicalUrl="/bundle/success"
      />

      <div className="container mx-auto max-w-2xl px-4 py-16 md:py-24">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center bg-primary/10">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif mb-3 text-foreground">Thank You for Your Purchase! 🎉</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your New Manager Bundle is ready for download.
          </p>
        </div>

        {/* Download All */}
        <div className="mb-6">
          <Button onClick={handleDownloadAll} size="lg" className="w-full text-lg py-6 font-semibold">
            <Package className="w-5 h-5 mr-2" />
            Download Complete Bundle
          </Button>
        </div>

        {/* Individual Downloads */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center mb-3">Or download individually:</p>
          {BUNDLE_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-xl shadow-lg p-5 flex items-center justify-between gap-4 border-l-4 border-l-primary border border-border"
            >
              <div>
                <h3 className="text-base font-serif font-semibold mb-1 text-foreground">{product.title}</h3>
                <p className="text-xs text-muted-foreground">{product.subtitle} • {product.pages} • PDF</p>
              </div>
              <Button
                onClick={() => handleDownload(product.downloadUrl, product.filename)}
                variant="outline"
                size="sm"
                className="shrink-0 border-primary text-primary"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold mb-4 text-foreground">What's Next?</h3>
          <ul className="text-muted-foreground space-y-2 text-sm text-left max-w-md mx-auto">
            <li>✓ Start with the Survival Kit's Self-Assessment on page 3</li>
            <li>✓ Map out your first 30-60-90 days using the roadmap</li>
            <li>✓ Reference the Conversations Playbook when tough talks arise</li>
            <li>✓ Use the Pre-Conversation Planner before challenging meetings</li>
          </ul>
        </div>

        {/* Upsell: Leader as Coach */}
        <div className="mt-8 p-5 bg-primary/5 rounded-xl border border-primary/20 text-center">
          <p className="text-sm font-semibold text-foreground mb-2">
            Ready to go deeper?
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            The Leader as Coach Programme teaches you how to develop your team — not just manage them. 8 modules, templates, and coaching frameworks.
          </p>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/leader-as-coach-programme">
              Explore Leader as Coach — R2,497 →
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

        {/* Contact for corporate */}
        <div className="mt-4 p-4 bg-card rounded-xl border border-border text-center">
          <p className="text-xs text-muted-foreground">
            Need training for your whole team?{" "}
            <Link to="/contact" className="text-primary underline hover:no-underline font-medium">
              Book a free 15-minute strategy call →
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
