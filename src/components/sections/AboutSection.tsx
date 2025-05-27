"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { createTimeline, stagger, createScope } from "animejs";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const animatedOnce = useRef(false);
  const animationScopeRef = useRef<any>(null);

  useEffect(() => {
    paragraphRefs.current = paragraphRefs.current.slice(0, 3);
    const currentSectionRef = sectionRef.current;

    const elementsToInitialize = [
      imageContainerRef.current,
      headingRef.current,
      ...paragraphRefs.current,
    ];
    elementsToInitialize.forEach((el) => {
      if (el) el.style.opacity = "0";
    });

    if (currentSectionRef) {
      animationScopeRef.current = createScope({ root: currentSectionRef }).add(
        (scope: any) => {
          scope.add("triggerAboutAnimation", () => {
            if (animatedOnce.current || !currentSectionRef) return;

            const tl = createTimeline({
              defaults: {
                ease: "outExpo",
              },
              onComplete: () => {
                animatedOnce.current = true;
              },
            });

            if (imageContainerRef.current) {
              tl.add(imageContainerRef.current, {
                opacity: [0, 1],
                translateX: [-60, 0],
                scale: [0.9, 1],
                filter: ["blur(4px) grayscale(20%)", "blur(0px) grayscale(0%)"],
                duration: 900,
              });
            }

            if (headingRef.current) {
              const existingSpans = Array.from(
                headingRef.current.querySelectorAll("span.text-primary")
              );
              const originalHTMLMap = new Map<HTMLElement, string>();
              existingSpans.forEach((span) =>
                originalHTMLMap.set(span as HTMLElement, span.outerHTML)
              );

              const textNodesAndWords: (string | HTMLElement)[] = [];
              Array.from(headingRef.current.childNodes).forEach((node) => {
                if (
                  node.nodeType === Node.TEXT_NODE &&
                  node.textContent?.trim()
                ) {
                  node.textContent
                    .trim()
                    .split(/(\s+)/)
                    .filter(Boolean)
                    .forEach((word) => textNodesAndWords.push(word));
                } else if (
                  node instanceof HTMLElement &&
                  node.classList.contains("text-primary")
                ) {
                  textNodesAndWords.push(node);
                } else if (node instanceof HTMLElement) {
                  textNodesAndWords.push(node.outerHTML);
                }
              });

              headingRef.current.innerHTML = "";
              const animatableWordSpans: HTMLElement[] = [];

              textNodesAndWords.forEach((item) => {
                if (typeof item === "string") {
                  if (item.match(/^\s+$/)) {
                    headingRef.current?.appendChild(
                      document.createTextNode(item)
                    );
                  } else {
                    const span = document.createElement("span");
                    span.textContent = item;
                    span.style.display = "inline-block";
                    span.style.opacity = "0";
                    headingRef.current?.appendChild(span);
                    animatableWordSpans.push(span);
                  }
                } else if (item instanceof HTMLElement) {
                  headingRef.current?.appendChild(item);
                  item.style.display = "inline-block";
                  item.style.opacity = "0";
                  animatableWordSpans.push(item);
                }
              });

              if (animatableWordSpans.length > 0) {
                tl.add(
                  animatableWordSpans,
                  {
                    opacity: [0, 1],
                    translateY: [20, 0],
                    skewX: [-5, 0],
                    duration: 700,
                    delay: stagger(50),
                  },
                  imageContainerRef.current ? "-=700" : 0
                );
              }

              if (headingRef.current) headingRef.current.style.opacity = "1";
            }

            const validParagraphs = paragraphRefs.current.filter(
              (el) => el !== null
            ) as HTMLParagraphElement[];
            if (validParagraphs.length > 0) {
              tl.add(
                validParagraphs,
                {
                  opacity: [0, 1],
                  translateY: [15, 0],
                  filter: ["blur(1px)", "blur(0px)"],
                  duration: 750,
                  delay: stagger(80),
                },
                "-=600"
              );
            }
          });
        }
      );
    }

    const animateAboutSection = () => {
      if (
        animationScopeRef.current &&
        animationScopeRef.current.methods.triggerAboutAnimation
      ) {
        animationScopeRef.current.methods.triggerAboutAnimation();
      }
    };

    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateAboutSection();
        }
      });
    }, observerOptions);

    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
      if (animationScopeRef.current) {
        animationScopeRef.current.revert();
      }
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-gradient-to-b from-transparent via-primary/75 to-primary"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div ref={imageContainerRef}>
            <div className="w-full max-w-[400px] md:max-w-full aspect-square bg-muted/30 dark:bg-card/30 backdrop-blur-sm rounded-2xl shadow-2xl mx-auto flex items-center justify-center overflow-hidden border-4 border-primary/10 hover:border-primary/50 transition-all duration-300 ease-out hover:shadow-primary/20">
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
              className="mb-10 text-3xl sm:text-4xl md:text-[2.8rem] lg:text-[3.2rem] font-bold tracking-tighter text-left"
            >
              A Little More <span className="text-primary">About Me</span>
            </h2>
            <div className="text-lg text-muted-foreground space-y-7">
              <p
                ref={(el) => {
                  paragraphRefs.current[0] = el;
                }}
              >
                I'm a dynamic and results-oriented Full Stack Developer with
                comprehensive experience in designing, developing, and deploying
                scalable, cloud-native web applications and robust APIs. My
                journey in tech is driven by a passion for solving complex
                problems and building impactful solutions.
              </p>
              <p
                ref={(el) => {
                  paragraphRefs.current[1] = el;
                }}
              >
                With proven expertise in React.js, Next.js, Node.js, and various
                cloud services (AWS, Cloudflare), I consistently aim to deliver
                high-impact digital products. I'm particularly excited about the
                intersection of web development and Artificial Intelligence,
                exploring ways to create more intelligent and intuitive user
                experiences.
              </p>
              <p
                ref={(el) => {
                  paragraphRefs.current[2] = el;
                }}
              >
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
