import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, MessageCircle } from 'lucide-react';

interface SocialShareButtonsProps {
  title: string;
  description: string;
  url?: string;
}

export default function SocialShareButtons({ title, description, url }: SocialShareButtonsProps) {
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}%0A%0A${encodedDescription}&url=${encodedUrl}`;
  const whatsappMessage = `${title} — ${description} ${shareUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  const handleShare = (platform: 'linkedin' | 'twitter' | 'whatsapp') => {
    const links = { linkedin: linkedInUrl, twitter: twitterUrl, whatsapp: whatsappUrl };
    window.open(links[platform], '_blank', 'width=600,height=400,noopener,noreferrer');
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-sm text-muted-foreground">Share with a colleague:</span>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('whatsapp')}
          className="gap-2 bg-[#25D366] hover:bg-[#1da851] text-white border-[#25D366] hover:border-[#1da851]"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('linkedin')}
          className="gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white border-[#0A66C2] hover:border-[#004182]"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('twitter')}
          className="gap-2 bg-black hover:bg-neutral-800 text-white border-black hover:border-neutral-800"
        >
          <Twitter className="w-4 h-4" />
          Twitter
        </Button>
      </div>
    </div>
  );
}
