"use client";

import {
  useEffect,
  useRef,
  useState,
  memo,
  type ReactNode,
  useCallback,
} from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Navbar } from "@/components/layout/Navbar";

const MatrixRain = dynamic(() => import("@/components/threed/matrix-rain"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 h-full w-full" />,
});

interface CameraControlsRef {
  xPos: number;
  yPos: number;
  zPos: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
}

const MemoizedNavbar = memo(Navbar);

export default function PageClient({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const cameraControlsRef = useRef<CameraControlsRef>({
    xPos: 0,
    yPos: 35,
    zPos: 130,
    lookAtX: 0,
    lookAtY: 10,
    lookAtZ: 0,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const matrixContainerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useGSAP(
    () => {
      if (!scrollContainerRef.current || !matrixContainerRef.current) return;

      const sections = gsap.utils.toArray<HTMLElement>(".content-section");
      gsap.set(matrixContainerRef.current, { opacity: 1 });

      if (sections.length > 1) {
        gsap.to(matrixContainerRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sections[1],
            start: "top bottom",
            end: "center center",
            scrub: 0.5,
          },
        });
      }

      if (sections.length >= 3) {
        const mainTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          },
        });

        mainTimeline
          .to(cameraControlsRef.current, {
            yPos: 40,
            lookAtY: 12,
            zPos: 125,
            ease: "power1.inOut",
          })
          .to(cameraControlsRef.current, {
            yPos: 25,
            lookAtY: 30,
            zPos: 115,
            ease: "power1.inOut",
          });
      }
    },
    { scope: scrollContainerRef, dependencies: [resolvedTheme] }
  );

  const handleActiveSectionChange = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    },
    []
  );

  useEffect(() => {
    const sectionElements = document.querySelectorAll(".content-section");
    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(handleActiveSectionChange, {
      root: null,
      rootMargin: "-15% 0px -85% 0px",
      threshold: 0,
    });

    sectionElements.forEach((section) => observer.observe(section));

    return () =>
      sectionElements.forEach((section) => observer.unobserve(section));
  }, [handleActiveSectionChange]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex min-h-dvh w-full flex-col overflow-x-hidden"
    >
      <div
        ref={matrixContainerRef}
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      >
        <MatrixRain
          cameraControls={cameraControlsRef.current}
          currentTheme={resolvedTheme}
        />
      </div>

      <MemoizedNavbar className="z-10" activeSection={activeSection} />
      {children}
    </div>
  );
}
