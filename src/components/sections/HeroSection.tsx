'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, Variants } from 'motion/react';
import { ArrowRight, DownloadCloud, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useScrollToSection } from '@/hooks/use-scroll-to-section';

const heroVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] },
  },
};

const scrollIndicatorVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 0.6,
    y: 10,
    transition: {
      opacity: { duration: 0.5, ease: 'easeOut', delay: 2 },
      y: {
        from: 0,
        duration: 0.75,
        ease: 'circInOut',
        delay: 2.5,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  },
};

const buttonHoverVariants: Variants = {
  hover: {
    opacity: 0.88,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    opacity: 0.75,
    transition: { duration: 0.1 },
  },
};

const buttonVariants = {
  initial: { opacity: 1 },
  hover: {
    opacity: 0.92,
    transition: { type: 'tween', duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    opacity: 0.75,
    transition: { type: 'tween', duration: 0.1 },
  },
} as unknown as Variants;

export function HeroSection({ className, id }: { className?: string; id?: string }) {
  const shouldReduceMotion = useReducedMotion();

  const { scrollTo } = useScrollToSection();

  const handleProjectScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      scrollTo('#projects');
    },
    [scrollTo]
  );

  return (
    <motion.section
      id={id}
      className={cn(
        'relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-transparent px-4 text-center ',
        className
      )}
      variants={shouldReduceMotion ? undefined : heroVariants}
      initial={shouldReduceMotion ? undefined : 'hidden'}
      animate={shouldReduceMotion ? undefined : 'visible'}
      aria-labelledby="hero-heading"
    >
      <div className="container relative z-10 mx-auto max-sm:mt-10">
        <motion.p
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="mb-3 text-base font-semibold text-primary md:text-lg"
        >
          Hello, I&apos;m
        </motion.p>
        <motion.h1
          id="hero-heading"
          aria-label="Khatri Utsav"
          variants={shouldReduceMotion ? undefined : itemVariants}
          style={{ perspective: '800px' }}
          className={cn(
            'my-2 select-none font-bold tracking-tighter relative',
            'text-[3rem] leading-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl'
          )}
        >
          <div
            className="hero-name-glow absolute inset-0 -z-10 pointer-events-none"
            aria-hidden="true"
          >
            Utsav Khatri
          </div>
          <div className="relative z-10 flex items-center justify-center">
            <span className="hero-name-gradient">Utsav Khatri</span>
          </div>
        </motion.h1>
        <motion.p
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="mx-auto mt-6 max-w-2xl text-sm text-muted-foreground md:mt-8 sm:text-md md:text-xl"
        >
          A{' '}
          <span className="font-semibold text-primary dark:text-foreground">
            Full Stack Developer
          </span>{' '}
          and{' '}
          <span className="font-semibold text-primary dark:text-foreground">Software Engineer</span>{' '}
          based in Gujarat, India, specializing in modern web development with React, Next.js,
          TypeScript, Node.js, and AI-powered applications.
        </motion.p>

        <motion.div
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="mt-8 flex select-none flex-col items-center justify-center gap-4 sm:flex-row md:mt-10"
          role="group"
          aria-label="Primary navigation actions"
        >
          <motion.div
            variants={shouldReduceMotion ? undefined : buttonHoverVariants}
            whileHover={shouldReduceMotion ? undefined : 'hover'}
            whileTap={shouldReduceMotion ? undefined : 'tap'}
          >
            <Link
              href="#projects"
              onClick={handleProjectScroll}
              className="luxe-button-uiverse"
              aria-label="Explore my projects"
            >
              <div className="wrapper">
                <span className="flex items-center justify-center font-semibold text-white">
                  <Sparkles className="mr-2 size-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  Explore Projects
                  <ArrowRight className="ml-2.5 size-5 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:scale-110" />
                </span>
                <div className="circle circle-12"></div>
                <div className="circle circle-11"></div>
                <div className="circle circle-10"></div>
                <div className="circle circle-9"></div>
                <div className="circle circle-8"></div>
                <div className="circle circle-7"></div>
                <div className="circle circle-6"></div>
                <div className="circle circle-5"></div>
                <div className="circle circle-4"></div>
                <div className="circle circle-3"></div>
                <div className="circle circle-2"></div>
                <div className="circle circle-1"></div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            variants={shouldReduceMotion ? undefined : buttonVariants}
            initial="initial"
            whileHover={shouldReduceMotion ? undefined : 'hover'}
            whileTap={shouldReduceMotion ? undefined : 'tap'}
            style={{ perspective: 1000 }}
          >
            <Button
              variant="ghost"
              asChild
              className="group relative h-auto rounded-full px-6 py-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground hover:bg-transparent"
            >
              <a
                href="/resume_utsav_khatri.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="resume_utsav_khatri.pdf"
                className="flex items-center gap-2"
                aria-label="Download Utsav Khatri's Resume"
              >
                <span className="relative">
                  Download Resume
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-foreground transition-all duration-300 ease-out group-hover:w-full" />
                </span>
                <DownloadCloud className="size-4 opacity-60 transition-opacity duration-200 group-hover:opacity-100" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        variants={shouldReduceMotion ? {} : scrollIndicatorVariants}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        aria-hidden="true"
        role="presentation"
      >
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative lucide lucide-arrow-down text-muted-foreground/70 transition-colors hover:text-primary"
            aria-label="Scroll down to view more content"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </div>
      </motion.div>
    </motion.section>
  );
}
