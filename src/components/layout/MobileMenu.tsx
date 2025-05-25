"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="text-left text-lg font-semibold">
            Utsav Khatri
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-1 p-6">
          {navLinks.map((link) => (
            <SheetClose asChild key={link.label}>
              <Link
                href={link.href}
                className="block px-3 py-3 text-lg font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <a
              href="/resume_utsav_khatri.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-3 text-lg font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors mt-4 border-t pt-5"
            >
              Download Resume
            </a>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
