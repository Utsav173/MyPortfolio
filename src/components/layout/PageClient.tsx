'use client';

import React, { useRef, useState, type ReactNode, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useActiveSectionObserver } from '@/hooks/useActiveSectionObserver';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LuxeBackground = dynamic(
  () => import('../threed/LuxeBackground').then((mod) => mod.default),
  {
    ssr: false,
  }
);

const Aurora = dynamic(() => import('../threed/Aurora').then((mod) => mod.default), {
  ssr: false,
});

const CommandPalette = dynamic(() => import('../CommandPalette').then((mod) => mod.default), {
  ssr: false,
});

interface CameraControlsRef {
  xPos: number;
  yPos: number;
  zPos: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
}

export default function PageClient({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isMatrixMounted, setIsMatrixMounted] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cameraControlsRef = useRef<CameraControlsRef>({
    xPos: 0,
    yPos: 100,
    zPos: 200,
    lookAtX: 0,
    lookAtY: 0,
    lookAtZ: 0,
  });

  const mainContainerRef = useRef<HTMLDivElement>(null);
  const matrixContainerRef = useRef<HTMLDivElement>(null);
  const activeSection = useActiveSectionObserver('.content-section');

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      if (!mainContainerRef.current) return;
      const sections = gsap.utils.toArray<HTMLElement>('.content-section');
      if (sections.length < 3) return;

      const cameraTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: mainContainerRef.current,
          start: 'top top',
          endTrigger: sections[3],
          end: 'bottom bottom',
          scrub: 1.5,
        },
      });

      cameraTimeline
        .to(cameraControlsRef.current, {
          xPos: -25,
          yPos: 30,
          zPos: 140,
          lookAtY: 10,
          lookAtZ: -40,
          ease: 'power2.in',
        })
        .to(cameraControlsRef.current, {
          xPos: 15,
          yPos: 0,
          zPos: 150,
          lookAtY: 20,
          lookAtZ: -70,
          ease: 'power2.inOut',
        })
        .to(cameraControlsRef.current, {
          xPos: 30,
          yPos: -20,
          zPos: 100,
          lookAtY: 20,
          lookAtZ: -70,
          ease: 'power2.out',
        });

      const opacityTrigger = ScrollTrigger.create({
        trigger: sections[2],
        start: '90% bottom',
        end: 'bottom center',
        scrub: true,
        onUpdate: (self) => {
          if (matrixContainerRef.current) {
            gsap.set(matrixContainerRef.current, {
              opacity: 1 - self.progress,
            });
          }
        },
        onLeave: () => setIsMatrixMounted(false),
        onLeaveBack: () => setIsMatrixMounted(true),
        preventOverlaps: true,
      });

      return () => {
        cameraTimeline.scrollTrigger?.kill();
        opacityTrigger.kill();
      };
    },
    { scope: mainContainerRef }
  );

  return (
    <div ref={mainContainerRef} className="flex min-h-dvh w-full flex-col overflow-x-hidden">
      <div
        ref={matrixContainerRef}
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      >
        {isMatrixMounted &&
          (mounted && isMobile ? (
            <div className="relative w-full h-full overflow-hidden bg-background">
              {/* Aurora — subtle ambient depth layer, no interaction needed */}
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  opacity: resolvedTheme === 'dark' ? 0.55 : 0.35,
                }}
              >
                <Aurora
                  colorStops={
                    resolvedTheme === 'dark'
                      ? ['#0d0d0f', '#1a1f2e', '#0d0d0f'] // Graphite-navy: sits on top of OLED black
                      : ['#f5f6fa', '#dde2ef', '#f5f6fa'] // Graphite-blue: barely-there on white
                  }
                  blend={0.35}
                  amplitude={0.7}
                  speed={0.18}
                />
              </div>
              {/* Radial vignette to prevent hard edges bleeding into content */}
              <div
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  background:
                    resolvedTheme === 'dark'
                      ? 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, oklch(0.060 0.003 250 / 0.65) 100%)'
                      : 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, oklch(0.980 0.003 250 / 0.60) 100%)',
                }}
              />
            </div>
          ) : (
            <LuxeBackground
              cameraControls={cameraControlsRef.current}
              currentTheme={resolvedTheme}
            />
          ))}
      </div>

      <Navbar className="z-50" activeSection={activeSection} />
      <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setCommandPaletteOpen} />
      <main id="main-content" className="relative z-0 flex-grow w-full">
        {children}
      </main>
    </div>
  );
}
