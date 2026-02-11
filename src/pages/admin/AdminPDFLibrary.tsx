import { Link, Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText, Loader2 } from 'lucide-react';

interface PDFAsset {
  name: string;
  fileName: string;
  path: string;
  category: string;
  description: string;
}

const pdfAssets: PDFAsset[] = [
  {
    name: "New Manager Survival Kit",
    fileName: "New-Manager-Survival-Kit.pdf",
    path: "/new-manager-kit.pdf",
    category: "Product",
    description: "90-day roadmap, scripts, templates, and 30-60-90 plan for first-time managers.",
  },
  {
    name: "Difficult Conversations Playbook",
    fileName: "Difficult-Conversations-Playbook.pdf",
    path: "/difficult-conversations-playbook.pdf",
    category: "Product",
    description: "12 word-for-word scripts using the CLEAR Framework for tough workplace talks.",
  },
  {
    name: "Contagious Identity Workbook",
    fileName: "Contagious-Identity-Workbook.pdf",
    path: "/contagious-identity-workbook.pdf",
    category: "Product",
    description: "Identity discovery process, self-coaching prompts, and executive coaching preview.",
  },
  {
    name: "The Feedback Formula",
    fileName: "The-Feedback-Formula.pdf",
    path: "/feedback-formula.pdf",
    category: "Product",
    description: "4-step proprietary feedback system with 10 scripts and preparation worksheets.",
  },
  {
    name: "Leader as Coach Programme",
    fileName: "Leader-As-Coach-Programme.pdf",
    path: "/leader-as-coach-programme.pdf",
    category: "Programme",
    description: "10-month SHIFT-based leadership transformation programme guide.",
  },
];

const handleDownload = (asset: PDFAsset) => {
  const link = document.createElement("a");
  link.href = asset.path;
  link.download = asset.fileName;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function AdminPDFLibrary() {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/marketing" replace />;
  }

  return (
    <>
      <SEO
        title="PDF Library | Admin | Leadership by Design"
        description="Quick-access library for all downloadable PDF assets"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-32 pb-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="mb-8">
              <Link
                to="/marketing"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-foreground">PDF Library</h1>
              <p className="text-muted-foreground mt-1">
                All product and programme PDFs — one click to download
              </p>
            </div>

            <div className="space-y-3">
              {pdfAssets.map((asset) => (
                <Card key={asset.path} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-foreground truncate">{asset.name}</h3>
                        <Badge variant="outline" className="flex-shrink-0 text-xs">{asset.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{asset.description}</p>
                    </div>
                    <Button
                      onClick={() => handleDownload(asset)}
                      size="sm"
                      className="flex-shrink-0 gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                {pdfAssets.length} PDFs available • Add new PDFs to <code className="text-xs bg-muted px-1.5 py-0.5 rounded">public/</code> and update this page
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
