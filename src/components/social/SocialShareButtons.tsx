import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  Share2, Twitter, Facebook, Linkedin, Link2, 
  CheckCircle2, Mail 
} from 'lucide-react';

interface SocialShareButtonsProps {
  title: string;
  description?: string;
  text?: string;
  url?: string;
  image?: string;
  type?: 'certificate' | 'achievement' | 'project' | 'leaderboard';
  co2Offset?: number;
  certificateId?: string;
}

export function SocialShareButtons({
  title,
  description = '',
  text,
  url = window.location.href,
  image,
  type = 'project',
  co2Offset,
  certificateId,
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareDescription = text || description;
  
  const getShareText = () => {
    if (type === 'certificate') {
      return `🌍 I just retired ${co2Offset?.toFixed(1) || ''} tonnes of CO₂ through Atlas Sanctum! Certificate: ${certificateId}\n\n${shareDescription}\n\n#CarbonNeutral #ClimateAction #Sustainability`;
    }
    if (type === 'achievement') {
      return `🏆 ${title}\n\n${shareDescription}\n\n#AtlasSanctum #ClimateAction #Sustainability`;
    }
    if (type === 'leaderboard') {
      return `🏆 ${title}\n\n${shareDescription}\n\n#AtlasSanctum #ClimateAction #Sustainability`;
    }
    return `🌱 ${title}\n\n${shareDescription}\n\n#CarbonCredits #Sustainability`;
  };

  const shareText = getShareText();
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%0A%0A${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${url}`);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  // Check if native share is available
  const canNativeShare = typeof navigator.share === 'function';

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        text: shareText,
        url,
      });
    } catch (err) {
      // User cancelled or error
      if ((err as Error).name !== 'AbortError') {
        toast.error('Failed to share');
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card border-border z-50">
        {canNativeShare && (
          <DropdownMenuItem onClick={handleNativeShare} className="gap-3 cursor-pointer">
            <Share2 className="w-4 h-4 text-muted-foreground" />
            <span>Share...</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={() => handleShare('twitter')} className="gap-3 cursor-pointer">
          <Twitter className="w-4 h-4 text-[#1DA1F2]" />
          <span>Twitter / X</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('facebook')} className="gap-3 cursor-pointer">
          <Facebook className="w-4 h-4 text-[#4267B2]" />
          <span>Facebook</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('linkedin')} className="gap-3 cursor-pointer">
          <Linkedin className="w-4 h-4 text-[#0A66C2]" />
          <span>LinkedIn</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('email')} className="gap-3 cursor-pointer">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span>Email</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleCopyLink} className="gap-3 cursor-pointer">
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </motion.span>
            ) : (
              <motion.span
                key="link"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Link2 className="w-4 h-4 text-muted-foreground" />
              </motion.span>
            )}
          </AnimatePresence>
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Compact inline version for cards
export function ShareButton({
  title,
  description,
  url = window.location.href,
  type = 'project',
  co2Offset,
  certificateId,
}: Omit<SocialShareButtonsProps, 'image'>) {
  return (
    <SocialShareButtons
      title={title}
      description={description}
      url={url}
      type={type}
      co2Offset={co2Offset}
      certificateId={certificateId}
    />
  );
}
