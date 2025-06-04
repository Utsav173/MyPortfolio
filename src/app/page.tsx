"use client";

import React, { useRef } from "react";
import { useTheme } from "next-themes";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import FooterSection from "@/components/sections/FooterSection";
import MatrixRain from "@/components/threed/matrix-rain";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const matrixContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!scrollContainerRef.current || !matrixContainerRef.current) {
        return;
      }

      const sections = gsap.utils.toArray(".content-section") as HTMLElement[];
      gsap.set(matrixContainerRef.current, { opacity: 1 });

      if (sections.length >= 1) {
        const heroSection = sections[0];
        let endFadeTriggerElement = heroSection;
        let startFadePosition = "bottom center";
        let endFadePosition = "bottom top";

        if (sections.length >= 2) {
          const aboutSection = sections[1];
          endFadeTriggerElement = aboutSection;
        }

        gsap.to(matrixContainerRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: endFadeTriggerElement,
            start: startFadePosition,
            end: endFadePosition,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
      } else {
        gsap.set(matrixContainerRef.current, { opacity: 1 });
      }

      if (sections.length >= 3) {
        const mainTimeline = gsap.timeline({
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

        mainTimeline
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
              yPos: 25,
              lookAtY: 30,
              zPos: 115,
              ease: commonEase,
              duration: durationSegment,
            },
            durationSegment * 2
          );
      }

      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);

      return () => {
        clearTimeout(refreshTimeout);
      };
    },
    { scope: scrollContainerRef, dependencies: [resolvedTheme] }
  );

  return (
    <div
      ref={scrollContainerRef}
      className="flex min-h-dvh flex-col w-full overflow-x-hidden"
    >
      <div
        ref={matrixContainerRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
      >
        <MatrixRain
          cameraControls={cameraControlsRef.current}
          currentTheme={resolvedTheme}
        />
      </div>

      <Navbar className="z-10" />

      <main className="flex-grow relative z-0 w-full">
        <HeroSection id="hero" className="content-section" />
        <AboutSection id="about" className="content-section" />
        <SkillsSection id="skills" className="content-section" />
        <ExperienceSection id="experience" className="content-section" />
        <ProjectsSection id="projects" className="content-section" />
        <ContactSection id="contact" className="content-section" />
        <FooterSection />
      </main>
    </div>
  );
}
