import { ReactNode, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import ldbLogo from '@/assets/ldb-logo.png';

interface ProgrammeOverviewTemplateProps {
  title: string;
  children: ReactNode;
  backLink?: string;
  backLabel?: string;
}

export default function ProgrammeOverviewTemplate({
  title,
  children,
  backLink = '/admin/overviews',
  backLabel = 'Back to Programme Overviews'
}: ProgrammeOverviewTemplateProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Action Bar - hidden when printing */}
      <div className="print:hidden pt-8 pb-6 bg-muted/30 border-b">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Link to={backLink} className="text-primary hover:underline text-sm flex items-center gap-1 mb-2">
                <ArrowLeft className="w-4 h-4" />
                {backLabel}
              </Link>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground">Programme Overview</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handlePrint} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={handlePrint}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Content */}
      <div ref={contentRef} className="print:p-0">
        {children}
      </div>
    </div>
  );
}

// Reusable page wrapper for print pages
interface OverviewPageProps {
  children: ReactNode;
  className?: string;
  isFirstPage?: boolean;
}

export function OverviewPage({ children, className = '', isFirstPage = false }: OverviewPageProps) {
  return (
    <div className={`print-page bg-white p-8 md:p-12 min-h-[11in] print:min-h-[10.5in] ${className}`}>
      {children}
    </div>
  );
}

// Header component for overview pages
interface OverviewHeaderProps {
  subtitle?: string;
  title: string;
  tagline?: string;
}

export function OverviewHeader({ subtitle, title, tagline }: OverviewHeaderProps) {
  return (
    <div className="text-center mb-8">
      <p className="text-primary uppercase tracking-widest text-sm font-medium mb-2">Leadership by Design</p>
      {subtitle && <p className="text-muted-foreground text-sm mb-4">{subtitle}</p>}
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{title}</h1>
      {tagline && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{tagline}</p>}
      <div className="w-24 h-1 bg-primary mx-auto mt-6"></div>
    </div>
  );
}

// Stats grid component
interface StatItem {
  value: string;
  label: string;
}

interface OverviewStatsProps {
  stats: StatItem[];
}

export function OverviewStats({ stats }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary text-center">
          <p className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// Section header component
interface OverviewSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function OverviewSection({ title, children, className = '' }: OverviewSectionProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b-2 border-primary/30">{title}</h2>
      {children}
    </div>
  );
}

// Footer component for overview pages
export function OverviewFooter() {
  return (
    <div className="mt-auto pt-8 border-t border-muted text-center text-sm text-muted-foreground">
      <p className="font-medium text-foreground mb-1">Leadership by Design</p>
      <p>kevin@kevinbritz.com | leadershipbydesign.co</p>
      <p className="mt-2 text-xs">© {new Date().getFullYear()} Leadership by Design. All rights reserved.</p>
    </div>
  );
}
