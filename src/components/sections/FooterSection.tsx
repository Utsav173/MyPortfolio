"use client";

import React from "react";

const FooterSection = () => {
  return (
    <footer className="py-8 border-t border-border/40 bg-primary/15  dark:bg-neutral-900 relative z-10">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row mx-auto">
        <p className="text-balance text-center text-md max-sm:text-sm leading-loose text-primary/90 font-bold">
          Designed & Built by Utsav Khatri. © {new Date().getFullYear()}. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
