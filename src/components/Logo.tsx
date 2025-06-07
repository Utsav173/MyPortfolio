import { memo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const LogoComponent = ({ className }: LogoProps) => {
  return (
    <Link
      href="/"
      aria-label="Utsav Khatri - Homepage"
      className={cn(
        "group flex items-center rounded-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <span className="text-xl font-bold text-primary transition-colors duration-200 group-hover:text-primary/80">
        UK
      </span>
    </Link>
  );
};

export const Logo = memo(LogoComponent);
