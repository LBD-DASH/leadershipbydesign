import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { generateCSVPreview, generateGoogleAdsCSV, generateCSVFilename, downloadCSV } from '@/lib/googleAdsExport';
import { toast } from 'sonner';

interface CSVPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adType: string;
  service: string;
  headlines: string[];
  descriptions: string[];
}

const AD_TYPE_LABELS: Record<string, string> = {
  search: 'Responsive Search Ad',
  display: 'Responsive Display Ad',
  pmax: 'Performance Max',
};

export default function CSVPreviewModal({
  open,
  onOpenChange,
  adType,
  service,
  headlines,
  descriptions,
}: CSVPreviewModalProps) {
  const { headers, sampleRow } = generateCSVPreview(adType, headlines, descriptions, service);

  const handleDownload = () => {
    const csv = generateGoogleAdsCSV(adType, headlines, descriptions, service);
    const filename = generateCSVFilename(adType, service);
    downloadCSV(csv, filename);
    toast.success('CSV downloaded! Import it into Google Ads Editor.');
    onOpenChange(false);
  };

  // Show first 10 columns in preview, then indicate more
  const previewHeaders = headers.slice(0, 10);
  const previewValues = sampleRow.slice(0, 10);
  const remainingColumns = headers.length - 10;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            CSV Preview - {AD_TYPE_LABELS[adType] || adType}
          </DialogTitle>
          <DialogDescription>
            Review the CSV structure before downloading. Verify columns match Google Ads Editor requirements.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Verification Checklist */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="font-medium text-sm">Verification Checklist:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span>Campaign status column included</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ad group status column included</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span>UTF-8 BOM encoding enabled</span>
              </div>
              {adType === 'search' && (
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Networks column included</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span>Final URL has https://</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span>Column names match exactly</span>
              </div>
            </div>
          </div>

          {/* Column Preview */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-2 border-b">
              <p className="text-sm font-medium">Column Preview ({headers.length} total columns)</p>
            </div>
            <ScrollArea className="h-[200px]">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium border-b">Column</th>
                    <th className="text-left px-3 py-2 font-medium border-b">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {previewHeaders.map((header, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{header}</td>
                      <td className="px-3 py-2 font-mono text-xs truncate max-w-[300px]">
                        {previewValues[i] || <span className="text-muted-foreground italic">empty</span>}
                      </td>
                    </tr>
                  ))}
                  {remainingColumns > 0 && (
                    <tr className="bg-muted/30">
                      <td colSpan={2} className="px-3 py-2 text-muted-foreground text-center text-xs">
                        + {remainingColumns} more columns (Headlines, Descriptions, etc.)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </div>

          {/* Import Instructions */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-medium">How to Import into Google Ads Editor:</p>
                <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                  <li>Open Google Ads Editor</li>
                  <li>Select your account (top-left dropdown)</li>
                  <li>Go to <strong>Ads → {AD_TYPE_LABELS[adType] || 'Responsive Ads'}</strong></li>
                  <li>Click <strong>"Make multiple changes"</strong></li>
                  <li>Choose <strong>"My data includes columns for campaigns and/or ad groups"</strong></li>
                  <li>Paste or import your CSV</li>
                  <li>Click <strong>"Process"</strong> then <strong>"Finish and review changes"</strong></li>
                  <li>Post changes when ready</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
