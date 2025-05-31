"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export function AboutSection({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
  const p3Ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const currentSectionRef = sectionRef.current;
      const currentImageContainerRef = imageContainerRef.current;
      const currentImageRef = imageRef.current;
      const currentHeadingRef = headingRef.current;
      const currentP1Ref = p1Ref.current;
      const currentP2Ref = p2Ref.current;
      const currentP3Ref = p3Ref.current;

      const elementsToAnimate = [
        currentImageContainerRef,
        currentHeadingRef,
        currentP1Ref,
        currentP2Ref,
        currentP3Ref,
      ].filter(Boolean);

      elementsToAnimate.forEach((el) => {
        if (el) {
          gsap.set(el, { opacity: 0, y: 30 });
        }
      });

      if (currentImageRef) {
        gsap.set(currentImageRef, { scale: 1.1 });
      }

      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: currentSectionRef,
          start: "top 70%",
          once: true,
        },
      });

      if (currentImageContainerRef) {
        mainTimeline.to(currentImageContainerRef, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      if (currentImageRef) {
        mainTimeline.to(
          currentImageRef,
          {
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=0.6"
        );
      }

      if (currentHeadingRef) {
        mainTimeline.to(
          currentHeadingRef,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.5"
        );
      }

      const paragraphs = [currentP1Ref, currentP2Ref, currentP3Ref].filter(
        Boolean
      );
      if (paragraphs.length > 0) {
        mainTimeline.to(
          paragraphs,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.15,
          },
          "-=0.4"
        );
      }

      if (currentImageContainerRef) {
        ScrollTrigger.create({
          trigger: currentSectionRef,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
          onUpdate: (self) => {
            const progress = self.progress;
            const yPos = Math.sin(progress * Math.PI * 2) * 5;
            gsap.to(currentImageContainerRef, {
              y: yPos,
              duration: 0.3,
              ease: "none",
            });
          },
        });
      }

      paragraphs.forEach((p, index) => {
        if (p) {
          ScrollTrigger.create({
            trigger: p,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            onUpdate: (self) => {
              const yPos = self.progress * 15 * (index + 1);
              gsap.to(p, {
                y: -yPos,
                duration: 0.1,
                ease: "none",
              });
            },
          });
        }
      });

      const imageElement = currentImageRef;
      const imageContainerElement = currentImageContainerRef;

      if (imageElement && imageContainerElement) {
        const handleMouseEnter = () => {
          gsap.to(imageElement, {
            scale: 1.05,
            duration: 0.4,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(imageElement, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        };

        imageContainerElement.addEventListener("mouseenter", handleMouseEnter);
        imageContainerElement.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          imageContainerElement.removeEventListener(
            "mouseenter",
            handleMouseEnter
          );
          imageContainerElement.removeEventListener(
            "mouseleave",
            handleMouseLeave
          );
        };
      }
    },
    { scope: sectionRef, revertOnUpdate: true }
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn(
        className,
        "bg-transparent dark:bg-transparent content-section py-20 md:py-28 lg:py-32"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div ref={imageContainerRef}>
            <div className="w-full max-w-[400px] md:max-w-full aspect-square bg-muted/30 dark:bg-card/30 backdrop-blur-sm rounded-2xl shadow-2xl mx-auto flex items-center justify-center overflow-hidden border-4 border-primary/10 hover:border-primary/50 transition-all duration-300 ease-out hover:shadow-primary/20 group cursor-pointer">
              <Image
                ref={imageRef}
                src="/images/utsav-khatri.webp"
                alt="Utsav Khatri"
                width={450}
                height={450}
                className="object-cover w-full h-full"
                priority={false}
              />
            </div>
          </div>
          <div className="md:col-span-1">
            <h2
              ref={headingRef}
              className="mb-10 text-3xl sm:text-4xl md:text-[2.8rem] lg:text-[3.2rem] font-bold tracking-tighter text-left"
            >
              A Little More <span className="text-primary">About Me</span>
            </h2>
            <div className="text-lg text-muted-foreground space-y-7">
              <p ref={p1Ref}>
                I'm a dynamic and results-oriented Full Stack Developer with
                comprehensive experience in designing, developing, and deploying
                scalable, cloud-native web applications and robust APIs. My
                journey in tech is driven by a passion for solving complex
                problems and building impactful solutions.
              </p>
              <p ref={p2Ref}>
                With proven expertise in React.js, Next.js, Node.js, and various
                cloud services (AWS, Cloudflare), I consistently aim to deliver
                high-impact digital products. I'm particularly excited about the
                intersection of web development and Artificial Intelligence,
                exploring ways to create more intelligent and intuitive user
                experiences.
              </p>
              <p ref={p3Ref}>
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
