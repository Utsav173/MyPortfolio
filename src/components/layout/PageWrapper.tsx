'use client';

import { type ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import FooterSection from '@/components/sections/FooterSection';
import dynamic from 'next/dynamic';

const CommandPalette = dynamic(() => import('@/components/CommandPalette'));

export function PageWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const activeSection = pathname.split('/')[1] || 'hero';

  return (
    <div className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-background">
      <Navbar activeSection={activeSection} />
      <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setCommandPaletteOpen} />
      <main
        id="main-content"
        className="relative z-0 flex-grow w-full flex flex-1 items-center justify-center pt-10"
      >
        {children}
      </main>
      <FooterSection />
    </div>
  );
}
