import { Link, Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Image, Loader2, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface InfographicAsset {
  name: string;
  fileName: string;
  path: string;
  category: string;
  description: string;
}

const infographicAssets: InfographicAsset[] = [
  {
    name: "Strategic Ambiguity: The Leader's Balancing Act",
    fileName: "strategic-ambiguity.png",
    path: "/infographics/strategic-ambiguity.png",
    category: "Leadership",
    description: "Strengths vs risks of strategic ambiguity with quick-reference deployment guide.",
  },
  {
    name: "Contagious Identity: Leading with Intent in the Age of AI",
    fileName: "contagious-identity.png",
    path: "/infographics/contagious-identity.png",
    category: "Coaching",
    description: "Human-centric future, engineering identity, reactive vs intentional leadership.",
  },
];

const handleDownload = (asset: InfographicAsset) => {
  const link = document.createElement("a");
  link.href = asset.path;
  link.download = asset.fileName;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function AdminInfographicsLibrary() {
  const { isAuthenticated, loading } = useAdminAuth();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
        title="Infographics Library | Admin | Leadership by Design"
        description="Quick-access library for all leadership infographics"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-32 pb-16">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="mb-8">
              <Link
                to="/marketing"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">Infographics Library</h1>
                <Link to="/admin/pdf-library">
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    PDF Library →
                  </Badge>
                </Link>
              </div>
              <p className="text-muted-foreground mt-1">
                Leadership infographics for presentations, social media, and client materials
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {infographicAssets.map((asset) => (
                <Card key={asset.path} className="overflow-hidden hover:border-primary/30 transition-colors">
                  <div
                    className="relative aspect-video bg-muted cursor-pointer group"
                    onClick={() => setPreviewImage(previewImage === asset.path ? null : asset.path)}
                  >
                    <img
                      src={asset.path}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-sm">{asset.name}</h3>
                      <Badge variant="outline" className="flex-shrink-0 text-xs">{asset.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{asset.description}</p>
                    <Button
                      onClick={() => handleDownload(asset)}
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {previewImage && (
              <div
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
                onClick={() => setPreviewImage(null)}
              >
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />
              </div>
            )}

            <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                {infographicAssets.length} infographics available • Add new images to <code className="text-xs bg-muted px-1.5 py-0.5 rounded">public/infographics/</code> and update this page
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
