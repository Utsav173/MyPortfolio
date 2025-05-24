import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Utsav Khatri - Homepage"
      className={cn(
        "flex items-center group outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm transition-colors duration-200",
        className
      )}
    >
      <span className="ml-2.5 text-xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 hidden sm:inline-block">
        Utsav Khatri
      </span>
    </Link>
  );
}
