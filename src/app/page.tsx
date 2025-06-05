"use client";

import { useEffect, useRef, useState } from "react";
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
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

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
          endFadeTriggerElement = sections[1];
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
            end: () => {
              if (typeof window !== "undefined" && scrollContainerRef.current) {
                return `+=${
                  scrollContainerRef.current.scrollHeight - window.innerHeight
                }`;
              }
              return "+=0";
            },
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
    },
    { scope: scrollContainerRef, dependencies: [resolvedTheme] }
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const sectionElements = Array.from(
      document.querySelectorAll(".content-section")
    ) as HTMLElement[];
    if (!sectionElements.length) return;

    const heroEl = document.getElementById("hero");
    if (heroEl) {
      const rect = heroEl.getBoundingClientRect();
      if (rect.top >= 0 && rect.top < window.innerHeight * 0.5) {
        setActiveSection("hero");
      }
    }

    let observer: IntersectionObserver | null = null;
    const setupObserver = () => {
      if (observer) {
        observer.disconnect();
      }

      const observerOptions = {
        root: null,
        rootMargin: `-80px 0px -55% 0px`,
        threshold: 0.01,
      };

      observer = new IntersectionObserver((entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
          setActiveSection(visibleEntries[0].target.id);
        }
      }, observerOptions);

      sectionElements.forEach((section) => {
        if (observer) observer.observe(section);
      });
    };

    setupObserver();
    window.addEventListener("resize", setupObserver);

    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", setupObserver);
      }
    };
  }, [resolvedTheme]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex min-h-dvh flex-col w-full overflow-x-hidden"
    >
      <div
        ref={matrixContainerRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
      >
        {typeof window !== "undefined" && (
          <MatrixRain
            cameraControls={cameraControlsRef.current}
            currentTheme={resolvedTheme}
          />
        )}
      </div>

      <Navbar className="z-10" activeSection={activeSection} />

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
