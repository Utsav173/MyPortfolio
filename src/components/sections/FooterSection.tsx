"use client";

import { memo } from "react";

const FooterSectionComponent = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative z-10 py-8 footer-gradient">
      <div className="container mx-auto flex h-16 flex-col items-center justify-center gap-4 md:flex-row">
        <p className="text-balance text-center text-sm font-bold text-white dark:text-black md:text-base">
          Designed & Built by Utsav Khatri. © {currentYear}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

const FooterSection = memo(FooterSectionComponent);
export default FooterSection;
