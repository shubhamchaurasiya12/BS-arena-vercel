// components/ThemeProvider.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { ThemeContextProvider } from '@/context/ThemeContext';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Theme is already applied by the inline script
    // Just verify it's set correctly
    try {
      const htmlTheme = document.documentElement.getAttribute('data-theme');
      const stored = localStorage.getItem('theme');
      
      // If there's a mismatch, sync them
      if (htmlTheme !== stored && (stored === 'light' || stored === 'dark' || stored === 'terminal')) {
        document.documentElement.setAttribute('data-theme', stored);
      }
    } catch (err) {
      // Ignore errors
    }
    setMounted(true);
  }, []);

  return (
    <ThemeContextProvider>
      {/* Render children immediately, no mounted check needed since theme is already set */}
      {children}
    </ThemeContextProvider>
  );
}