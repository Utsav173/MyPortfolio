'use client';

import { useHasScrollbar } from '@/hooks/use-has-scrollbar';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useHasScrollbar();

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
