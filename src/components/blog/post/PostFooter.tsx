// src/components/blog/post/PostFooter.tsx
'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Twitter, Linkedin, Facebook, Link2, Check, Github, Mail, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { SITE_URL } from '@/lib/config';
import { cn } from '@/lib/utils';

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

  const shareUrl = `${SITE_URL}${post.slug}`;
  const shareText = encodeURIComponent(post.title);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    toast.success(liked ? 'Like removed' : 'Thanks for the like!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-16 space-y-12"
    >
      {/* Engagement Section */}
      <div className="rounded-2xl bg-gradient-to-r from-primary/5 via-background to-primary/5 border p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Did you find this article helpful?</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Consider sharing it with others who might benefit from it
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Like Button */}
          <Button
            size="lg"
            variant={liked ? 'default' : 'outline'}
            onClick={handleLike}
            className={cn(
              'min-w-[120px] transition-all',
              liked &&
                'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
            )}
          >
            <ThumbsUp className={cn('mr-2 h-4 w-4', liked && 'fill-current')} />
            {liked ? 'Liked' : 'Like'} ({likeCount})
          </Button>

          {/* Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Share:</span>
            <Button size="icon" variant="outline" className="h-10 w-10" asChild>
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
            <Button size="icon" variant="outline" className="h-10 w-10" asChild>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
            <Button size="icon" variant="outline" className="h-10 w-10" asChild>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </Button>
            <Button size="icon" variant="outline" className="h-10 w-10" onClick={copyLink}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Author Bio Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-2xl border bg-card p-8 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Author Image */}
          <div className="flex-shrink-0">
            <div className="relative h-24 w-24 sm:h-32 sm:w-32">
              <Image
                src="/images/utsav-khatri.webp"
                alt="Utsav Khatri"
                fill
                className="rounded-full object-cover ring-4 ring-primary/10"
              />
              <div className="absolute -bottom-2 -right-2 rounded-full bg-primary p-2">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-bold">Utsav Khatri</h3>
              <p className="text-muted-foreground">Full Stack Developer & Technical Writer</p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Passionate about building high-performance web applications and sharing knowledge
              through technical writing. I specialize in React, Next.js, and modern web
              technologies. Always exploring new tools and techniques to create better digital
              experiences.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link
                  href="https://www.linkedin.com/in/utsav-khatri-in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://github.com/utsav173" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="mailto:contact@utsavkhatri.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tags Section */}
      {post.tags && post.tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold">Explore More Topics</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog?tag=${tag.toLowerCase().replace(/ /g, '-')}`}>
                <Badge
                  variant="secondary"
                  className="px-3 py-1.5 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
