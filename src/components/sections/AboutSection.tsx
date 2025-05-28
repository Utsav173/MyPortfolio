"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function AboutSection({ className }: { className?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
  const p3Ref = useRef<HTMLParagraphElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const currentSectionRef = sectionRef.current;
    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, []);

  const getTransitionClass = (baseDelay: string): string => {
    return `transition-all ease-out duration-700 ${
      isInView
        ? `opacity-100 translate-y-0 ${baseDelay}`
        : "opacity-0 translate-y-10"
    }`;
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className={cn(
        className,
        "bg-transparent dark:bg-transparent content-section"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div
            ref={imageContainerRef}
            className={getTransitionClass("delay-100")}
          >
            <div className="w-full max-w-[400px] md:max-w-full aspect-square bg-muted/30 dark:bg-card/30 backdrop-blur-sm rounded-2xl shadow-2xl mx-auto flex items-center justify-center overflow-hidden border-4 border-primary/10 hover:border-primary/50 transition-all duration-300 ease-out hover:shadow-primary/20 group">
              <Image
                src="/images/utsav-khatri.webp"
                alt="Utsav Khatri"
                width={450}
                height={450}
                className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                priority={false}
              />
            </div>
          </div>
          <div className="md:col-span-1">
            <h2
              ref={headingRef}
              className={`mb-10 text-3xl sm:text-4xl md:text-[2.8rem] lg:text-[3.2rem] font-bold tracking-tighter text-left ${getTransitionClass(
                "delay-200"
              )}`}
            >
              A Little More <span className="text-primary">About Me</span>
            </h2>
            <div className="text-lg text-muted-foreground space-y-7">
              <p ref={p1Ref} className={getTransitionClass("delay-300")}>
                I'm a dynamic and results-oriented Full Stack Developer with
                comprehensive experience in designing, developing, and deploying
                scalable, cloud-native web applications and robust APIs. My
                journey in tech is driven by a passion for solving complex
                problems and building impactful solutions.
              </p>
              <p ref={p2Ref} className={getTransitionClass("delay-[450ms]")}>
                With proven expertise in React.js, Next.js, Node.js, and various
                cloud services (AWS, Cloudflare), I consistently aim to deliver
                high-impact digital products. I'm particularly excited about the
                intersection of web development and Artificial Intelligence,
                exploring ways to create more intelligent and intuitive user
                experiences.
              </p>
              <p ref={p3Ref} className={getTransitionClass("delay-[600ms]")}>
                Beyond coding, I believe in collaborative growth and enjoy
                mentoring, sharing knowledge, and continuously learning in the
                ever-evolving tech landscape. My technical interests span
                advanced microservices, serverless architectures, and the
                practical application of AI/ML models.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
