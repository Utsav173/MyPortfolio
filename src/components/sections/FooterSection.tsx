"use client";

import React from "react";

const FooterSection = () => {
  return (
    <footer className="py-8 footer-gradient relative z-10">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row mx-auto">
        <p className="text-balance text-center text-md max-sm:text-sm leading-loose text-white dark:text-black font-bold">
          Designed & Built by Utsav Khatri. © {new Date().getFullYear()}. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
