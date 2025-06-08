import { useCallback } from 'react';

const SCROLL_OFFSET = -80;

export function useScrollToSection() {
  const scrollTo = useCallback((selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href');
      if (href) {
        scrollTo(href);
      }
    },
    [scrollTo]
  );

  return { scrollTo, handleNavClick };
}
