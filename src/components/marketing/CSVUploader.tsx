import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ParsedContact {
  email: string;
  name?: string;
  company?: string;
}

export default function CSVUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<ParsedContact[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null);

  const parseCSV = useCallback((text: string): ParsedContact[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
    const emailIdx = headers.indexOf('email');
    if (emailIdx === -1) return [];

    const nameIdx = headers.indexOf('name');
    const companyIdx = headers.indexOf('company');

    return lines.slice(1).map(line => {
      const cols = line.split(',').map(c => c.trim().replace(/"/g, ''));
      return {
        email: cols[emailIdx] || '',
        name: nameIdx >= 0 ? cols[nameIdx] : undefined,
        company: companyIdx >= 0 ? cols[companyIdx] : undefined,
      };
    }).filter(c => c.email && c.email.includes('@'));
  }, []);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContacts(parseCSV(text));
    };
    reader.readAsText(f);
  }, [parseCSV]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && (f.type === 'text/csv' || f.name.endsWith('.csv'))) {
      handleFile(f);
    }
  }, [handleFile]);

  const handleImport = async () => {
    if (!contacts.length) return;
    setImporting(true);

    let imported = 0;
    let skipped = 0;

    // Process in batches of 50
    for (let i = 0; i < contacts.length; i += 50) {
      const batch = contacts.slice(i, i + 50);
      const rows = batch.map(c => ({
        email: c.email.toLowerCase().trim(),
        name: c.name || null,
        company: c.company || null,
        source: 'csv-import',
        tags: ['imported'],
        status: 'active',
      }));

      const { error } = await supabase
        .from('email_subscribers')
        .insert(rows);

      if (error) {
        // Duplicates will cause unique constraint errors - try one by one
        console.warn('Batch insert had conflicts, inserting individually:', error.message);
        for (const row of rows) {
          const { error: singleErr } = await supabase
            .from('email_subscribers')
            .insert(row);
          if (singleErr) {
            skipped += 1;
          } else {
            imported += 1;
          }
        }
      } else {
        imported += batch.length;
      }
    }

    setResult({ imported, skipped });
    setImporting(false);
    toast({
      title: 'Import complete',
      description: `${imported} contacts imported, ${skipped} skipped (duplicates or errors).`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import Contacts from CSV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drop zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => document.getElementById('csv-file-input')?.click()}
        >
          <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-foreground font-medium mb-1">
            {file ? file.name : 'Drop your CSV here or click to browse'}
          </p>
          <p className="text-sm text-muted-foreground">
            Required column: email. Optional: name, company
          </p>
          <input
            id="csv-file-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>

        {/* Preview */}
        {contacts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <strong>{contacts.length}</strong> contacts found in file
              </p>
              <Button onClick={handleImport} disabled={importing}>
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import {contacts.length} Contacts
                  </>
                )}
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.slice(0, 5).map((c, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm">{c.email}</TableCell>
                      <TableCell>{c.name || '—'}</TableCell>
                      <TableCell>{c.company || '—'}</TableCell>
                    </TableRow>
                  ))}
                  {contacts.length > 5 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground text-sm">
                        ... and {contacts.length - 5} more contacts
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-foreground">{result.imported} contacts imported</p>
              {result.skipped > 0 && (
                <p className="text-sm text-muted-foreground">{result.skipped} skipped (duplicates)</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
