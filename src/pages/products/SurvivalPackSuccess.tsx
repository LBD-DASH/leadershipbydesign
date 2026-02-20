import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Loader2 } from "lucide-react";

const PDF_DOWNLOAD_URL = "/new-manager-kit.pdf"; // Reuses same PDF or a separate one

export default function SurvivalPackSuccess() {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");

  useEffect(() => {
    if (reference || trxref) {
      setIsValid(true);
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
          <p className="text-white text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-primary">
        <div className="text-center max-w-md">
          <p className="text-white text-xl mb-4">Unable to verify payment</p>
          <p className="text-white/70 mb-6">
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

          <h1 className="text-2xl sm:text-3xl font-serif mb-3 text-foreground">
            You're In! 🎉
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base">
            Your New Manager Survival Pack is ready for download.
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6 sm:p-8 text-center border border-border border-t-4 border-t-primary">
          <h2 className="text-xl font-serif mb-2 text-foreground">
            New Manager Survival Pack
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            3 Conversation Scripts + Team Expectations Sheet
          </p>

          <Button
            onClick={handleDownload}
            size="lg"
            className="text-base px-8 py-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Your Pack
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Download didn't start?{" "}
            <button onClick={handleDownload} className="underline text-primary hover:no-underline">
              Click here
            </button>
          </p>
        </div>

        {/* Upsell to full kit */}
        <div className="mt-8 p-5 bg-primary/5 rounded-xl border border-primary/20 text-center">
          <p className="text-sm font-semibold text-foreground mb-2">
            Want the complete 90-day system?
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            The New Manager Survival Kit includes 5 conversation scripts, a 30-60-90 day plan, self-assessment, and templates — everything for your first quarter.
          </p>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/new-manager-kit">
              Upgrade to Full Kit — R497 →
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
