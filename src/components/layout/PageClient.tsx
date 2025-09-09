'use client';

import { useRef, useState, type ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';
import MatrixRain from '../threed/matrix-rain';
import { useTheme } from 'next-themes';
import { useActiveSectionObserver } from '@/hooks/useActiveSectionObserver';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const CommandPalette = dynamic(() => import('../CommandPalette').then((mod) => mod.default));

interface CameraControlsRef {
  xPos: number;
  yPos: number;
  zPos: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
}

export default function PageClient({ children }: { children: ReactNode }) {
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isMatrixMounted, setIsMatrixMounted] = useState(true);
  const { resolvedTheme } = useTheme();
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
      if (sections.length < 2) return;

      const cameraTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: mainContainerRef.current,
          start: 'top top',
          endTrigger: sections[2],
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
          ease: 'power2.inOut',
        })
        .to(cameraControlsRef.current, {
          xPos: 15,
          yPos: 0,
          zPos: 150,
          lookAtY: 20,
          lookAtZ: -70,
          ease: 'power2.inOut',
        });

      const opacityTrigger = ScrollTrigger.create({
        trigger: sections[2],
        start: 'top bottom',
        end: 'top center',
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
        {isMatrixMounted && (
          <MatrixRain cameraControls={cameraControlsRef.current} currentTheme={resolvedTheme} />
        )}
      </div>

      <Navbar className="z-50" activeSection={activeSection} />
      <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setCommandPaletteOpen} />
      <main id="main-content" className="relative z-0 flex-grow w-full">
        {children}
      </main>
    </div>
  );
}
