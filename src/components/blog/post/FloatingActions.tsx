'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Twitter, Linkedin, Facebook, Link2, Check, Share2, ArrowUp, Heart } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { SITE_URL } from '@/lib/config';
import { cn } from '@/lib/utils';

interface FloatingActionsProps {
  post: {
    slug: string;
    title: string;
  };
}

export function FloatingActions({ post }: FloatingActionsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isNativeShareSupported, setIsNativeShareSupported] = useState(false);

  useEffect(() => {
    if ('share' in navigator) {
      setIsNativeShareSupported(true);
    }
    const handleScroll = () => {
      const shouldShow = window.scrollY > 300;
      setShowActions(shouldShow);
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shareUrl = `${SITE_URL}/${post.slug}`;
  const shareText = `Check out this article: ${post.title}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link.');
      console.error('Failed to copy: ', err);
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: shareText,
        url: shareUrl,
      });
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
        toast.error('Could not open share dialog.');
      }
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? 'Removed from favorites' : 'Added to favorites!');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ShareButton = () => {
    if (isNativeShareSupported) {
      return (
        <Button
          size="icon"
          variant="outline"
          aria-label="Share this post"
          onClick={handleNativeShare}
          className="h-12 w-12 rounded-full shadow-lg backdrop-blur-sm border-border/50 bg-background/95 hover:bg-background"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      );
    }
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            aria-label="Share this post"
            className="h-12 w-12 rounded-full shadow-lg backdrop-blur-sm border-border/50 bg-background/95 hover:bg-background"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="left" className="w-auto p-3">
          <div className="flex gap-2">
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Twitter"
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'h-10 w-10')}
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'h-10 w-10')}
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'h-10 w-10')}
            >
              <Facebook className="h-4 w-4" />
            </a>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10"
              onClick={copyLink}
              aria-label="Copy link"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <AnimatePresence>
      {showActions && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed right-4 sm:right-8 bottom-20 z-40 flex flex-col gap-3"
        >
          {/* Like Button */}
          <Button
            size="icon"
            variant="outline"
            onClick={handleLike}
            aria-label={liked ? 'Unlike this post' : 'Like this post'}
            className={cn(
              'h-12 w-12 rounded-full shadow-lg backdrop-blur-sm border-border/50',
              'bg-background/95 hover:bg-background',
              liked && 'text-red-500 border-red-500/50'
            )}
          >
            <Heart className={cn('h-5 w-5', liked && 'fill-current')} />
          </Button>

          {/* Share Button/Popover */}
          <ShareButton />

          {/* Scroll to Top */}
          {showScrollTop && (
            <Button
              size="icon"
              variant="outline"
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="h-12 w-12 rounded-full shadow-lg backdrop-blur-sm border-border/50 bg-background/95 hover:bg-background"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
