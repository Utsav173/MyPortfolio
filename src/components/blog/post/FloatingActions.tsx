// src/components/blog/post/FloatingActions.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      setShowActions(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shareUrl = `${SITE_URL}/${post.slug}`;

  const shareText = encodeURIComponent(post.title);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? 'Removed from favorites' : 'Added to favorites!');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            className={cn(
              'h-12 w-12 rounded-full shadow-lg backdrop-blur-sm border-border/50',
              'bg-background/95 hover:bg-background',
              liked && 'text-red-500 border-red-500/50'
            )}
          >
            <Heart className={cn('h-5 w-5', liked && 'fill-current')} />
          </Button>

          {/* Share Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-12 w-12 rounded-full shadow-lg backdrop-blur-sm border-border/50 bg-background/95 hover:bg-background"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="left" className="w-auto p-3">
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" className="h-10 w-10" asChild>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button size="icon" variant="ghost" className="h-10 w-10" asChild>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
                <Button size="icon" variant="ghost" className="h-10 w-10" asChild>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
                <Button size="icon" variant="ghost" className="h-10 w-10" onClick={copyLink}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Scroll to Top */}
          {showScrollTop && (
            <Button
              size="icon"
              variant="outline"
              onClick={scrollToTop}
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
