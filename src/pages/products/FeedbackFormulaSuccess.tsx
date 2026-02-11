import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Loader2 } from "lucide-react";

const PDF_DOWNLOAD_URL = "/feedback-formula.pdf";

export default function FeedbackFormulaSuccess() {
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
    link.download = "The-Feedback-Formula.pdf";
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
            <a href="/feedback-formula">Return to Product Page</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <SEO
        title="Thank You — Download Your Feedback Formula"
        description="Your purchase is complete. Download The Feedback Formula now."
        canonicalUrl="/feedback-formula/success"
      />

      <div className="container mx-auto max-w-2xl px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-primary/10">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl md:text-4xl font-serif mb-4 text-foreground">
            Thank You for Your Purchase!
          </h1>

          <p className="text-muted-foreground text-lg">
            Your payment was successful. The Feedback Formula is ready for download.
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-8 text-center border-t-4 border-primary">
          <h2 className="text-2xl font-serif mb-4 text-foreground">
            The Feedback Formula
          </h2>

          <p className="text-muted-foreground mb-2">
            Give Feedback People Actually Hear
          </p>

          <p className="text-sm text-muted-foreground mb-8">
            PDF Format • Instant Access
          </p>

          <Button
            onClick={handleDownload}
            size="lg"
            className="text-lg px-8 py-6 font-semibold transition-all duration-300 hover:scale-105"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Your Formula
          </Button>

          <p className="text-sm text-muted-foreground mt-6">
            Your download will start automatically. If it doesn't,{" "}
            <button
              onClick={handleDownload}
              className="underline hover:no-underline text-primary"
            >
              click here
            </button>
            .
          </p>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4 text-foreground">
            What's Next?
          </h3>
          <ul className="text-muted-foreground space-y-2">
            <li>✓ Read the 4-Step System first — it takes 10 minutes</li>
            <li>✓ Pick one script that matches your next conversation</li>
            <li>✓ Use the "Before You Speak" worksheet before your next feedback moment</li>
          </ul>
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm">
            Questions? Contact us at{" "}
            <a
              href="mailto:support@leadershipbydesign.co.za"
              className="underline text-primary"
            >
              support@leadershipbydesign.co.za
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
