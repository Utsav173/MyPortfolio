"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import MatrixRain from "@/components/threed/matrix-rain";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { resolvedTheme } = useTheme();
  const cameraControlsRef = useRef({
    xPos: 0,
    yPos: 35,
    zPos: 130,
    lookAtX: 0,
    lookAtY: 10,
    lookAtZ: 0,
  });
  const mainTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const matrixContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollContainerRef.current || !matrixContainerRef.current) return;

    const sections = gsap.utils.toArray(".content-section") as HTMLElement[];
    console.log(
      "Found sections with '.content-section':",
      sections.map((s) => s.id || s.className.split(" ")[0])
    );
    console.log("Number of sections found:", sections.length);

    if (mainTimelineRef.current) {
      mainTimelineRef.current.kill();
    }
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.killTweensOf(cameraControlsRef.current);
    gsap.killTweensOf(matrixContainerRef.current);

    gsap.set(matrixContainerRef.current, { opacity: 1 }); // Default to visible

    if (sections.length >= 1) {
      const heroSection = sections[0];
      let endFadeTriggerElement = heroSection;
      let startFadePosition = "bottom center";
      let endFadePosition = "bottom top";

      if (sections.length >= 2) {
        const aboutSection = sections[1];
        endFadeTriggerElement = aboutSection; // Fade out based on AboutSection
      }

      console.log(
        "Fade out trigger element:",
        endFadeTriggerElement.id ||
          endFadeTriggerElement.className.split(" ")[0]
      );

      gsap.to(matrixContainerRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: endFadeTriggerElement,
          start: startFadePosition, // Start fading when bottom of trigger element is at viewport center
          end: endFadePosition, // Fully faded when bottom of trigger element leaves top of viewport
          scrub: 0.5,
          invalidateOnRefresh: true,
          // markers: true, // IMPORTANT: Uncomment this to see GSAP markers for debugging
        },
      });
    } else {
      console.warn(
        "No sections with '.content-section' found. MatrixRain opacity not animated."
      );
      gsap.set(matrixContainerRef.current, { opacity: 1 }); // Or 0 if it should be hidden
    }

    if (sections.length >= 3) {
      mainTimelineRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: "top top",
          end: () =>
            `+=${
              scrollContainerRef.current!.scrollHeight - window.innerHeight
            }`,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      const commonEase = "power1.inOut";
      const durationSegment = 1;

      mainTimelineRef.current
        .to(
          cameraControlsRef.current,
          {
            yPos: 40,
            lookAtY: 12,
            zPos: 125,
            ease: commonEase,
            duration: durationSegment,
          },
          0
        )
        .to(
          cameraControlsRef.current,
          {
            yPos: 45,
            lookAtY: 15,
            zPos: 120,
            ease: commonEase,
            duration: durationSegment,
          },
          durationSegment
        )
        .to(
          cameraControlsRef.current,
          {
            yPos: 50,
            lookAtY: 18,
            zPos: 115,
            ease: commonEase,
            duration: durationSegment,
          },
          durationSegment * 2
        );
    }

    return () => {
      if (mainTimelineRef.current) {
        mainTimelineRef.current.kill();
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf(cameraControlsRef.current);
      if (matrixContainerRef.current) {
        // Ensure ref is still valid
        gsap.killTweensOf(matrixContainerRef.current);
      }
    };
  }, []);

  return (
    <div ref={scrollContainerRef} className="flex min-h-screen flex-col">
      <div
        ref={matrixContainerRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
      >
        <MatrixRain
          cameraControls={cameraControlsRef.current}
          currentTheme={resolvedTheme}
        />
      </div>

      <Navbar className="relative z-10" />

      <main className="flex-grow relative z-0">
        <HeroSection className="content-section" />
        <AboutSection className="content-section" />
        <SkillsSection className="content-section" />
        <ExperienceSection className="content-section" />
        <ProjectsSection className="content-section" />
        <ContactSection className="content-section" />

        <footer className="py-8 border-t border-border/40 bg-background dark:bg-neutral-900 relative z-10">
          <div className="container flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row mx-auto">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
              Designed & Built by Utsav Khatri. © {new Date().getFullYear()}.
              All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
