import { Button } from '@/components/ui/button';
import { Linkedin, Twitter } from 'lucide-react';

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

  const handleShare = (platform: 'linkedin' | 'twitter') => {
    const shareLink = platform === 'linkedin' ? linkedInUrl : twitterUrl;
    window.open(shareLink, '_blank', 'width=600,height=400,noopener,noreferrer');
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <span className="text-sm text-muted-foreground">Share your results:</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('linkedin')}
        className="gap-2"
      >
        <Linkedin className="w-4 h-4" />
        LinkedIn
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="gap-2"
      >
        <Twitter className="w-4 h-4" />
        Twitter
      </Button>
    </div>
  );
}
