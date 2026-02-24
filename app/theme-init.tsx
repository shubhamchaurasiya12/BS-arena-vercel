// app/theme-init.tsx
'use client';

import { useEffect } from 'react';

export function ThemeInit() {
  useEffect(() => {
    // This runs after hydration to catch any edge cases
    // But the main theme is already set by the inline script
    try {
      const htmlTheme = document.documentElement.getAttribute('data-theme');
      const stored = localStorage.getItem('theme');
      
      // Double-check sync
      if (htmlTheme !== stored && (stored === 'light' || stored === 'dark' || stored === 'terminal')) {
        document.documentElement.setAttribute('data-theme', stored);
      }
    } catch (err) {
      // Ignore
    }
  }, []);
  
  return null;
}