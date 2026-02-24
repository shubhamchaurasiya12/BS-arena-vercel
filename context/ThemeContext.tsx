// context/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeName, DEFAULT_THEME } from '@/lib/themes';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  // Initialize with the theme already applied to HTML
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (typeof window !== 'undefined') {
      const htmlTheme = document.documentElement.getAttribute('data-theme');
      if (htmlTheme === 'light' || htmlTheme === 'dark' || htmlTheme === 'terminal') {
        return htmlTheme;
      }
    }
    return DEFAULT_THEME;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apply theme to DOM and sync with server
  const setTheme = useCallback(
    async (newTheme: ThemeName) => {
      try {
        setError(null);
        setIsLoading(true);

        console.log('🎨 Applying theme:', newTheme);
        
        // Apply immediately for instant feedback
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setThemeState(newTheme);

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('themechange', { detail: newTheme }));

        // Sync with server
        const response = await fetch('/api/theme', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme: newTheme }),
        });

        if (!response.ok) {
          throw new Error(`Failed to save theme: ${response.statusText}`);
        }

        console.log('✅ Theme saved successfully');
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to change theme';
        setError(errorMessage);
        console.error('❌ Theme change error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Listen for theme changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        const newTheme = e.newValue as ThemeName;
        if (newTheme === 'light' || newTheme === 'dark' || newTheme === 'terminal') {
          if (newTheme !== theme) {
            console.log('🔄 Theme changed in another tab:', newTheme);
            setThemeState(newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [theme]);

  const contextValue = {
    theme,
    setTheme,
    isLoading,
    error,
    clearError,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}