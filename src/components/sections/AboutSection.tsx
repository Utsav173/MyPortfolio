"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  Variants,
} from "motion/react";

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const imageContainerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
  },
};

const imageVariantsInner: Variants = {
  // Renamed to avoid conflict if used elsewhere
  hidden: { scale: 1.1 },
  visible: {
    scale: 1,
    transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] },
  },
};

const textElementVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
  },
};

export function AboutSection({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0px", "0px"] : ["-5px", "5px"]
  );
  const p1Y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0px", "0px"] : ["0px", "-15px"]
  );
  const p2Y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0px", "0px"] : ["0px", "-30px"]
  );
  const p3Y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0px", "0px"] : ["0px", "-45px"]
  );

  return (
    <motion.section
      id={id}
      ref={sectionRef}
      className={cn(
        className,
        "bg-transparent dark:bg-transparent content-section py-20 md:py-28 lg:py-32"
      )}
      initial={shouldReduceMotion ? undefined : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      variants={shouldReduceMotion ? {} : sectionVariants}
      viewport={{ once: true, amount: 0.2 }}
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
          <motion.div
            variants={shouldReduceMotion ? {} : imageContainerVariants}
            style={shouldReduceMotion ? {} : { y: imageY }}
            className="flex justify-center md:justify-start"
          >
            <motion.div
              className="w-full max-w-[360px] sm:max-w-[400px] md:max-w-full aspect-square bg-muted/30 dark:bg-card/30 backdrop-blur-sm rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden border-4 border-primary/10 hover:border-primary/50 transition-all duration-300 ease-out hover:shadow-primary/20 group cursor-pointer"
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: 1.02,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      },
                    }
              }
            >
              <motion.div
                className="w-full h-full"
                variants={shouldReduceMotion ? {} : imageVariantsInner}
              >
                <Image
                  src="/images/utsav-khatri.webp"
                  alt="Utsav Khatri, Full Stack Developer" // Enhanced alt text
                  width={450}
                  height={450}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 450px"
                />
              </motion.div>
            </motion.div>
          </motion.div>
          <div className="md:col-span-1">
            <motion.h2
              id="about-heading"
              variants={shouldReduceMotion ? {} : textElementVariants}
              className="mb-8 sm:mb-10 text-3xl sm:text-4xl md:text-[2.8rem] lg:text-[3.2rem] font-bold tracking-tighter text-left"
            >
              A Little More <span className="text-primary">About Me</span>
            </motion.h2>
            <div className="text-lg text-muted-foreground space-y-6 sm:space-y-7">
              <motion.p
                variants={shouldReduceMotion ? {} : textElementVariants}
                style={shouldReduceMotion ? {} : { y: p1Y }}
                className="max-w-prose"
              >
                I'm a dynamic and results-oriented Full Stack Developer with
                comprehensive experience in designing, developing, and deploying
                scalable, cloud-native web applications and robust APIs. My
                journey in tech is driven by a passion for solving complex
                problems and building impactful solutions.
              </motion.p>
              <motion.p
                variants={shouldReduceMotion ? {} : textElementVariants}
                style={shouldReduceMotion ? {} : { y: p2Y }}
                className="max-w-prose"
              >
                With proven expertise in React.js, Next.js, Node.js, TypeScript,
                and various cloud services (AWS, Cloudflare), I consistently aim
                to deliver high-impact digital products. I'm particularly
                excited about the intersection of web development and Artificial
                Intelligence, exploring ways to create more intelligent and
                intuitive user experiences.
              </motion.p>
              <motion.p
                variants={shouldReduceMotion ? {} : textElementVariants}
                style={shouldReduceMotion ? {} : { y: p3Y }}
                className="max-w-prose"
              >
                Beyond coding, I believe in collaborative growth and enjoy
                mentoring, sharing knowledge, and continuously learning in the
                ever-evolving tech landscape. My technical interests span
                advanced microservices, serverless architectures, and the
                practical application of AI/ML models.
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
