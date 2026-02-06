import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Loader2 } from "lucide-react";

const colors = {
  navy: "#1B2A4A",
  gold: "#C8A864",
  cream: "#F8F6F1",
};

const PDF_DOWNLOAD_URL = "/difficult-conversations-playbook.pdf";

export default function DifficultConversationsSuccess() {
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
    link.download = "Difficult-Conversations-Playbook.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isVerifying) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.navy }}
      >
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: colors.gold }} />
          <p className="text-white text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: colors.navy }}
      >
        <div className="text-center max-w-md">
          <p className="text-white text-xl mb-4">Unable to verify payment</p>
          <p className="text-white/70 mb-6">
            If you completed the payment, please contact support with your payment reference.
          </p>
          <Button
            asChild
            style={{ backgroundColor: colors.gold, color: colors.navy }}
          >
            <a href="/difficult-conversations">Return to Product Page</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.cream }}>
      <SEO
        title="Thank You - Download Your Difficult Conversations Playbook"
        description="Your purchase is complete. Download your Difficult Conversations Playbook now."
        canonicalUrl="/difficult-conversations/success"
      />

      <div className="container mx-auto max-w-2xl px-4 py-16 md:py-24">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: `${colors.gold}20` }}
          >
            <CheckCircle className="w-10 h-10" style={{ color: colors.gold }} />
          </div>
          
          <h1 
            className="text-3xl md:text-4xl font-serif mb-4"
            style={{ color: colors.navy }}
          >
            Thank You for Your Purchase!
          </h1>
          
          <p className="text-gray-600 text-lg">
            Your payment was successful. Your Difficult Conversations Playbook is ready for download.
          </p>
        </div>

        {/* Download Card */}
        <div 
          className="bg-white rounded-xl shadow-lg p-8 text-center"
          style={{ borderTop: `4px solid ${colors.gold}` }}
        >
          <h2 
            className="text-2xl font-serif mb-4"
            style={{ color: colors.navy }}
          >
            The Difficult Conversations Playbook
          </h2>
          
          <p className="text-gray-600 mb-2">
            Scripts, Frameworks & Templates
          </p>
          
          <p className="text-sm text-gray-500 mb-8">
            18 pages • PDF Format
          </p>

          <Button
            onClick={handleDownload}
            size="lg"
            className="text-lg px-8 py-6 font-semibold transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: colors.gold, color: colors.navy }}
          >
            <Download className="w-5 h-5 mr-2" />
            Download Your Playbook
          </Button>

          <p className="text-sm text-gray-500 mt-6">
            Your download will start automatically. If it doesn't,{" "}
            <button 
              onClick={handleDownload}
              className="underline hover:no-underline"
              style={{ color: colors.gold }}
            >
              click here
            </button>
            .
          </p>
        </div>

        {/* Next Steps */}
        <div className="mt-12 text-center">
          <h3 
            className="text-xl font-semibold mb-4"
            style={{ color: colors.navy }}
          >
            What's Next?
          </h3>
          <ul className="text-gray-600 space-y-2">
            <li>✓ Review the CLEAR Framework on page 4</li>
            <li>✓ Find the script that matches your situation</li>
            <li>✓ Use the Pre-Conversation Planner before your next tough talk</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Questions? Contact us at{" "}
            <a 
              href="mailto:support@leadershipbydesign.co.za" 
              className="underline"
              style={{ color: colors.gold }}
            >
              support@leadershipbydesign.co.za
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
