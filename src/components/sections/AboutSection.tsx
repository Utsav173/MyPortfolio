'use client';

import { memo } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, Variants } from 'motion/react';
import { cn } from '@/lib/utils';

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const AboutSectionComponent = ({ className, id }: { className?: string; id?: string }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={cn('bg-transparent min-h-dvh py-20 md:py-28 lg:py-32', className)}
      variants={shouldReduceMotion ? undefined : sectionVariants}
      initial={shouldReduceMotion ? undefined : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.2 }}
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-24">
          <motion.div
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="flex justify-center"
          >
            <motion.div
              className="group w-full max-w-[380px] cursor-pointer overflow-hidden rounded-2xl border-4 border-primary/10 shadow-2xl transition-all duration-300 ease-out hover:border-primary/50 hover:shadow-primary/20 md:max-w-full"
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 1.02,
                      transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 15,
                      },
                    }
              }
            >
              <Image
                src="/images/utsav-khatri.webp"
                alt="Professional headshot of Utsav Khatri, Full Stack Developer"
                width={375}
                height={375}
                className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 375px"
                priority
              />
            </motion.div>
          </motion.div>
          <div>
            <motion.h2
              id="about-heading"
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="mb-8 text-3xl font-bold tracking-tighter sm:text-4xl md:text-[2.8rem] lg:text-[3.2rem]"
            >
              A Little More <span className="text-primary">About Me</span>
            </motion.h2>
            <motion.div
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="space-y-6 text-base text-muted-foreground md:text-lg"
            >
              <p>
                I'm a dynamic and results-oriented Full Stack Developer with comprehensive
                experience in designing, developing, and deploying scalable, cloud-native web
                applications and robust APIs. My journey in tech is driven by a passion for solving
                complex problems and building impactful solutions.
              </p>
              <p>
                With proven expertise in React.js, Next.js, Node.js, and TypeScript, I consistently
                aim to deliver high-impact digital products. I'm particularly excited about the
                intersection of web development and Artificial Intelligence, exploring ways to
                create more intelligent and intuitive user experiences.
              </p>
              <p>
                Beyond coding, I believe in collaborative growth and enjoy mentoring, sharing
                knowledge, and continuously learning in the ever-evolving tech landscape.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export const AboutSection = memo(AboutSectionComponent);
