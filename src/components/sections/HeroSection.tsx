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

const nameContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.3 },
  },
};

const nameCharVariants: Variants = {
  hidden: { opacity: 0, y: 25, scale: 0.9, rotateX: -30 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
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
    scale: 1.02,
    y: -2,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

const buttonVariants = {
  initial: {
    scale: 1,
    rotateX: 0,
  },
  hover: {
    scale: 1.02,
    rotateX: -2,
    transition: {
      type: 'tween',
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      type: 'tween',
      duration: 0.1,
    },
  },
} as unknown as Variants;

const shimmerVariants = {
  initial: { x: '-100%', opacity: 0 },
  animate: {
    x: '100%',
    opacity: [0, 1, 0],
    transition: {
      duration: 1.2,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 2,
    },
  },
} as unknown as Variants;

export function HeroSection({ className, id }: { className?: string; id?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const nameParts = 'Utsav Khatri'.split('');

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
          aria-label="Utsav Khatri"
          variants={shouldReduceMotion ? undefined : nameContainerVariants}
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
          <div className="hero-name-gradient relative z-10">
            {nameParts.map((char, index) => (
              <motion.span
                key={index}
                variants={shouldReduceMotion ? undefined : nameCharVariants}
                className="inline-block"
                style={char === ' ' ? { width: '0.25em' } : {}}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
        </motion.h1>
        <motion.p
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:mt-8 md:text-xl"
        >
          A <span className="font-semibold text-primary">Full Stack Developer</span> based in
          Gujarat, India, crafting high-performance web experiences.
        </motion.p>

        <motion.div
          variants={shouldReduceMotion ? undefined : itemVariants}
          className={cn(
            'mt-8 flex select-none flex-col items-center justify-center gap-4 sm:flex-row md:mt-10'
          )}
          role="group"
          aria-label="Primary actions"
        >
          <motion.div
            variants={shouldReduceMotion ? undefined : buttonHoverVariants}
            whileHover={shouldReduceMotion ? undefined : 'hover'}
            whileTap={shouldReduceMotion ? undefined : 'tap'}
          >
            <Button
              asChild
              className={cn(
                'group relative h-auto overflow-hidden rounded-full border px-8 py-4 text-base font-semibold transition-all duration-500 ease-out sm:px-10 sm:py-4',
                'bg-zinc-200 dark:bg-transparent',
                'max-sm:px-4 max-sm:py-2.5 max-sm:text-sm'
              )}
            >
              <Link
                href="#projects"
                onClick={handleProjectScroll}
                className="relative z-20 flex items-center justify-center"
                aria-label="Explore my projects"
              >
                <div
                  className={cn(
                    'absolute inset-0 rounded-full',
                    'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
                    'opacity-60 group-hover:opacity-100',
                    'blur-sm transition-all duration-500 ease-out',
                    'group-hover:blur-none group-hover:scale-105'
                  )}
                />

                <div
                  className={cn(
                    'absolute inset-0 rounded-full',
                    'bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500',
                    'opacity-0 group-hover:opacity-40',
                    'blur transition-all duration-700 ease-out',
                    'group-hover:animate-pulse'
                  )}
                />

                <div className="relative z-10 flex items-center justify-center text-white dark:text-zinc-300">
                  <Sparkles className="mr-2 size-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  Explore Projects
                  <ArrowRight className="ml-2.5 size-5 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:scale-110" />
                </div>
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={shouldReduceMotion ? undefined : buttonVariants}
            initial="initial"
            whileHover={shouldReduceMotion ? undefined : 'hover'}
            whileTap={shouldReduceMotion ? undefined : 'tap'}
            style={{ perspective: 1000 }}
          >
            <Button
              variant="outline"
              asChild
              className={cn(
                'group relative h-auto overflow-hidden rounded-full px-8 py-4 text-base font-semibold',
                'transition-all duration-300 ease-out will-change-transform',

                'border border-white/20 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/5',

                'hover:border-white/30 hover:bg-white/10 hover:shadow-xl hover:shadow-black/10',

                'dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10',

                'max-sm:px-4 max-sm:py-2.5 max-sm:text-sm sm:px-10 sm:py-4',

                'before:absolute before:inset-0 before:rounded-full before:opacity-0',
                'before:bg-gradient-to-r before:from-emerald-400/10 before:via-teal-400/10 before:to-cyan-400/10',
                'before:transition-opacity before:duration-300 hover:before:opacity-100'
              )}
            >
              <a
                href="/resume_utsav_khatri.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="resume_utsav_khatri.pdf"
                className="relative z-10 flex items-center justify-center"
                aria-label="Download Utsav Khatri's Resume"
              >
                <div
                  className={cn(
                    'absolute inset-0 rounded-full opacity-0 transition-opacity duration-300',
                    'group-hover:opacity-100',
                    'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 p-[1px]',
                    'before:absolute before:inset-[1px] before:rounded-full before:bg-background/90'
                  )}
                />

                {!shouldReduceMotion && (
                  <motion.div
                    className={cn(
                      'absolute inset-0 rounded-full pointer-events-none',
                      'bg-gradient-to-r from-transparent via-white/30 to-transparent',
                      'opacity-0 group-hover:opacity-100'
                    )}
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    style={{
                      transform: 'translate3d(-100%, 0, 0)',
                      willChange: 'transform, opacity',
                    }}
                  />
                )}

                <div className="relative z-20 flex items-center justify-center">
                  <DownloadCloud
                    className={cn(
                      'mr-2.5 size-5 transition-all duration-300 ease-out',
                      'text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                    )}
                  />

                  <span
                    className={cn(
                      'relative transition-colors duration-300',
                      'text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                    )}
                  >
                    Download Resume
                    <span
                      className={cn(
                        'absolute -bottom-1 left-0 h-0.5 w-0 rounded-full',
                        'bg-gradient-to-r from-emerald-400 to-cyan-400',
                        'transition-all duration-300 ease-out group-hover:w-full'
                      )}
                    />
                  </span>

                  <div
                    className={cn(
                      'ml-2 opacity-0 transition-all duration-300 ease-out',
                      'group-hover:opacity-100 group-hover:translate-x-1'
                    )}
                  >
                    <div
                      className={cn(
                        'size-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400',
                        !shouldReduceMotion && 'animate-pulse'
                      )}
                    />
                  </div>
                </div>
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        variants={shouldReduceMotion ? {} : scrollIndicatorVariants}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-pulse" />
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
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </div>
      </motion.div>
    </motion.section>
  );
}
