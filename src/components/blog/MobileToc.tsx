'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TableOfContents } from './table-of-contents';
import { PanelLeft } from 'lucide-react';
import { Toc } from '@/types';

interface MobileTocProps {
  toc: Toc;
}

export function MobileToc({ toc }: MobileTocProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden fixed bottom-4 right-4 z-50 shadow-lg"
        >
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Table of Contents</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-3/4 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>On This Page</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <TableOfContents toc={toc} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
