"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getFeaturedProjects } from "@/lib/github";
import MatrixRain from "@/components/threed/matrix-rain";
import { defaultConfig } from "@/components/threed/matrix-rain-config";
import { Project } from "@/components/sections/ProjectCard";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const matrixWrapperRef = useRef<HTMLDivElement>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getFeaturedProjects();
        setFeaturedProjects(projects);
      } catch (error) {
        console.error("Failed to fetch featured projects on client:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const matrixWrapper = matrixWrapperRef.current;
    const heroElement = document.getElementById("hero");
    const aboutElement = document.getElementById("about");

    if (!matrixWrapper || !heroElement || !aboutElement) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = heroElement.offsetHeight;
      const aboutHeight = aboutElement.offsetHeight;

      const heroEffectEndScrollPos = heroHeight;
      const aboutEffectStartScrollPos = aboutElement.offsetTop;
      const aboutEffectEndMatrixScrollPos =
        aboutEffectStartScrollPos + aboutHeight * 0.4;

      let targetOpacity = 0;
      let transformYValue = scrollY * 0.3;

      if (scrollY < heroEffectEndScrollPos) {
        targetOpacity = 1;
        matrixWrapper.style.visibility = "visible";
      } else if (scrollY < aboutEffectEndMatrixScrollPos) {
        const fadeProgress =
          (scrollY - heroEffectEndScrollPos) /
          (aboutEffectEndMatrixScrollPos - heroEffectEndScrollPos);
        targetOpacity = 1 - Math.min(1, fadeProgress);
        matrixWrapper.style.visibility = "visible";
      } else {
        targetOpacity = 0;
        matrixWrapper.style.visibility = "hidden";
      }

      matrixWrapper.style.opacity = `${Math.max(
        0,
        Math.min(1, targetOpacity)
      )}`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <div
        ref={matrixWrapperRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "160vh",
          zIndex: -10,
          overflow: "hidden",
        }}
      >
        <MatrixRain
          className="absolute inset-0 w-full h-full"
          config={defaultConfig}
          theme={resolvedTheme}
        />
      </div>

      <Navbar />
      <main ref={mainContentRef} className="flex-grow relative z-0">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection projects={featuredProjects} />
        <ContactSection />
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
