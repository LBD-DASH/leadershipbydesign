import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Loader2, Package } from "lucide-react";

const colors = {
  navy: "#1B2A4A",
  gold: "#C8A864",
  cream: "#F8F6F1",
};

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
      // Stagger downloads to avoid browser blocking
      setTimeout(() => {
        handleDownload(product.downloadUrl, product.filename);
      }, index * 500);
    });
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
            <a href="/products">Return to Products</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.cream }}>
      <SEO
        title="Thank You - Download Your New Manager Bundle"
        description="Your purchase is complete. Download your New Manager Bundle now."
        canonicalUrl="/bundle/success"
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
            Your payment was successful. Your New Manager Bundle is ready for download.
          </p>
        </div>

        {/* Download All Button */}
        <div className="mb-8">
          <Button
            onClick={handleDownloadAll}
            size="lg"
            className="w-full text-lg py-6 font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{ backgroundColor: colors.gold, color: colors.navy }}
          >
            <Package className="w-5 h-5 mr-2" />
            Download Complete Bundle
          </Button>
        </div>

        {/* Individual Downloads */}
        <div className="space-y-4">
          <p className="text-sm text-gray-500 text-center mb-4">Or download individually:</p>
          
          {BUNDLE_PRODUCTS.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between gap-4"
              style={{ borderLeft: `4px solid ${colors.gold}` }}
            >
              <div>
                <h3 
                  className="text-lg font-serif font-semibold mb-1"
                  style={{ color: colors.navy }}
                >
                  {product.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {product.subtitle} • {product.pages} • PDF
                </p>
              </div>
              
              <Button
                onClick={() => handleDownload(product.downloadUrl, product.filename)}
                variant="outline"
                size="sm"
                className="shrink-0"
                style={{ borderColor: colors.gold, color: colors.navy }}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div className="mt-12 text-center">
          <h3 
            className="text-xl font-semibold mb-4"
            style={{ color: colors.navy }}
          >
            What's Next?
          </h3>
          <ul className="text-gray-600 space-y-2 text-left max-w-md mx-auto">
            <li>✓ Start with the New Manager Survival Kit's Self-Assessment</li>
            <li>✓ Map out your first 30-60-90 days using the roadmap</li>
            <li>✓ Reference the Difficult Conversations Playbook when tough talks arise</li>
            <li>✓ Use the Pre-Conversation Planner before challenging meetings</li>
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
