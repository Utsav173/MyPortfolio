'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Twitter, Linkedin, Link2, Check, ThumbsUp, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { SITE_URL } from '@/lib/config';
import { cn } from '@/lib/utils';
import { slug } from 'github-slugger';

interface PostFooterProps {
  post: {
    slug: string;
    title: string;
    tags?: string[];
  };
}

export function PostFooter({ post }: PostFooterProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42);
  const [isNativeShareSupported, setIsNativeShareSupported] = useState(false);

  useEffect(() => {
    if ('share' in navigator) {
      setIsNativeShareSupported(true);
    }
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
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    toast.success(liked ? 'Like removed' : 'Thanks for the like!');
  };

  const ShareOptions = () => {
    if (isNativeShareSupported) {
      return (
        <Button size="sm" variant="outline" onClick={handleNativeShare} className="h-9">
          <Share2 className="mr-2 h-3.5 w-3.5" />
          Share
        </Button>
      );
    }
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-2 font-mono uppercase tracking-wider">
          Share:
        </span>
        <a
          href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'h-8 w-8')}
        >
          <Twitter className="h-3.5 w-3.5" />
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'h-8 w-8')}
        >
          <Linkedin className="h-3.5 w-3.5" />
        </a>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={copyLink}
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Link2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-20 space-y-12 max-w-4xl mx-auto"
    >
      <Separator />

      {/* Engagement Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant={liked ? 'default' : 'outline'}
            onClick={handleLike}
            className={cn(
              'transition-all h-9',
              liked && 'bg-primary text-primary-foreground border-primary'
            )}
          >
            <ThumbsUp className={cn('mr-2 h-3.5 w-3.5', liked && 'fill-current')} />
            {liked ? 'Liked' : 'Like'} <span className="ml-1 opacity-60">({likeCount})</span>
          </Button>
          <p className="text-sm text-muted-foreground hidden sm:block">Found this helpful?</p>
        </div>

        <ShareOptions />
      </div>

      <Separator />

      {/* Tags Section */}
      {post.tags && post.tags.length > 0 && (
        <div className="py-4 max-sm:mx-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Filed Under
          </h3>
          <div className="flex flex-wrap gap-4">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tags=${slug(tag)}`}
                className="text-sm font-mono text-foreground hover:text-primary transition-colors border-b border-border/40 hover:border-primary pb-0.5"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
