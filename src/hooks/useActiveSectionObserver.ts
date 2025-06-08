import { useState, useEffect, useCallback } from "react";

const DEFAULT_OPTIONS: IntersectionObserverInit = {
  root: null,
  rootMargin: "-20% 0px -80% 0px",
  threshold: 0,
};

export function useActiveSectionObserver(
  sectionSelector: string,
  options: IntersectionObserverInit = DEFAULT_OPTIONS,
) {
  const [activeSection, setActiveSection] = useState<string>("hero");

  const handleActiveSectionChange = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    },
    [],
  );

  useEffect(() => {
    const sectionElements = document.querySelectorAll(sectionSelector);
    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      handleActiveSectionChange,
      options,
    );

    sectionElements.forEach((section) => observer.observe(section));

    return () => {
      sectionElements.forEach((section) => observer.unobserve(section));
    };
  }, [sectionSelector, options, handleActiveSectionChange]);

  return activeSection;
}
