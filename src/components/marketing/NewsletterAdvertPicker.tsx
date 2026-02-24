import { useState } from 'react';
import { ExternalLink, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const SITE_URL = 'https://leadershipbydesign.lovable.app';

export interface AdvertItem {
  title: string;
  description: string;
  url: string;
  category: string;
  ctaText: string;
}

const adverts: AdvertItem[] = [
  // Diagnostics
  { title: 'Team Diagnostic', description: 'Free team health assessment — clarity, leadership & motivation scores', url: '/team-diagnostic', category: 'Diagnostic', ctaText: 'Take the Free Diagnostic →' },
  { title: 'Leadership Diagnostic', description: 'Discover your leadership level across 5 dimensions', url: '/leadership-diagnostic', category: 'Diagnostic', ctaText: 'Assess Your Leadership →' },
  { title: 'AI Readiness Diagnostic', description: 'How ready is your organisation for AI-driven change?', url: '/ai-readiness-diagnostic', category: 'Diagnostic', ctaText: 'Check AI Readiness →' },
  { title: 'SHIFT Diagnostic', description: 'Measure your team\'s future-readiness across 5 critical skills', url: '/shift-diagnostic', category: 'Diagnostic', ctaText: 'Run the SHIFT Diagnostic →' },

  // Products
  { title: 'Leader as Coach Programme', description: '6-month group coaching programme for managers who want to lead through coaching', url: '/leader-as-coach', category: 'Programme', ctaText: 'Request a Proposal →' },
  { title: 'Contagious Identity Coaching', description: '1-on-1 executive coaching to unlock your leadership identity', url: '/contagious-identity-coaching', category: 'Programme', ctaText: 'Learn More →' },
  { title: 'SHIFT Leadership Development', description: 'Build future-ready teams with the SHIFT methodology', url: '/shift-leadership-development', category: 'Programme', ctaText: 'Explore SHIFT →' },
  { title: 'Corporate Mind Reset', description: 'Team resilience and mental performance programme', url: '/corporate-mind-reset', category: 'Programme', ctaText: 'Explore the Programme →' },

  // Workshops
  { title: 'Leadership Workshop', description: 'Interactive half-day workshop on leadership fundamentals', url: '/workshops/leadership', category: 'Workshop', ctaText: 'Book This Workshop →' },
  { title: 'Team Alignment Workshop', description: 'Get your team aligned on vision, roles, and priorities', url: '/workshops/alignment', category: 'Workshop', ctaText: 'Book This Workshop →' },
  { title: 'Motivation Workshop', description: 'Reignite team motivation and purpose', url: '/workshops/motivation', category: 'Workshop', ctaText: 'Book This Workshop →' },

  // Digital Products
  { title: 'New Manager Survival Kit', description: 'Essential toolkit for first-time managers', url: '/products/new-manager-kit', category: 'Product', ctaText: 'Get the Kit →' },
  { title: 'Difficult Conversations Playbook', description: 'Step-by-step guide to navigating tough workplace conversations', url: '/products/difficult-conversations-playbook', category: 'Product', ctaText: 'Get the Playbook →' },
  { title: 'Feedback Formula', description: 'Master the art of giving and receiving feedback', url: '/products/feedback-formula', category: 'Product', ctaText: 'Get the Formula →' },
  { title: 'Contagious Identity Workbook', description: 'Self-paced workbook for identity-driven leadership', url: '/products/contagious-identity-workbook', category: 'Product', ctaText: 'Get the Workbook →' },
  { title: 'Bespoke Meditations', description: 'Custom-recorded guided meditations for performance', url: '/products/bespoke-meditations', category: 'Product', ctaText: 'Order Yours →' },

  // Other pages
  { title: 'Podcast — The Lunchtime Series', description: 'Weekly conversations with leaders, thinkers, and change-makers', url: '/podcast', category: 'Content', ctaText: 'Listen Now →' },
  { title: 'Blog', description: 'Leadership insights, frameworks, and practical strategies', url: '/blog', category: 'Content', ctaText: 'Read the Blog →' },
  { title: 'Book — The Future of Work is Human', description: 'Kevin Britz\'s book on building human-centred organisations', url: '/book', category: 'Content', ctaText: 'Get the Book →' },
  { title: 'Contact Us', description: 'Get in touch for a tailored proposal or discovery call', url: '/contact', category: 'General', ctaText: 'Get in Touch →' },
];

const categoryColors: Record<string, string> = {
  Diagnostic: 'bg-blue-100 text-blue-800',
  Programme: 'bg-emerald-100 text-emerald-800',
  Workshop: 'bg-amber-100 text-amber-800',
  Product: 'bg-purple-100 text-purple-800',
  Content: 'bg-rose-100 text-rose-800',
  General: 'bg-gray-100 text-gray-800',
};

function generateAdvertHtml(advert: AdvertItem): string {
  const fullUrl = `${SITE_URL}${advert.url}`;
  return `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden;">
  <tr>
    <td style="padding:24px 28px; background:#f8fafc;">
      <h3 style="margin:0 0 8px 0; font-size:18px; font-weight:700; color:#1a202c;">${advert.title}</h3>
      <p style="margin:0 0 16px 0; font-size:15px; color:#4a5568; line-height:1.5;">${advert.description}</p>
      <a href="${fullUrl}" style="display:inline-block; padding:10px 24px; background:#c8a97e; color:#ffffff; text-decoration:none; border-radius:6px; font-size:14px; font-weight:600;">${advert.ctaText}</a>
    </td>
  </tr>
</table>`;
}

interface Props {
  onInsert: (html: string) => void;
}

export default function NewsletterAdvertPicker({ onInsert }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(adverts.map(a => a.category))];

  const filtered = adverts.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !selectedCategory || a.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search adverts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge
          variant={selectedCategory === null ? 'default' : 'outline'}
          className="cursor-pointer text-xs"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Badge>
        {categories.map(cat => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            className="cursor-pointer text-xs"
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      <ScrollArea className="h-[300px] border rounded-md">
        <div className="p-2 space-y-1">
          {filtered.map((advert, i) => (
            <button
              key={i}
              onClick={() => onInsert(generateAdvertHtml(advert))}
              className="w-full text-left p-3 rounded-md hover:bg-muted/50 transition-colors group flex items-start gap-3"
            >
              <Plus className="w-4 h-4 mt-0.5 text-muted-foreground group-hover:text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm text-foreground truncate">{advert.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${categoryColors[advert.category] || ''}`}>
                    {advert.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{advert.description}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 mt-0.5" />
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No adverts match your search</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
