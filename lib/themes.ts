// lib/themes.ts
export type ThemeName = 'light' | 'dark' | 'terminal';

export interface Theme {
  name: ThemeName;
  label: string;
  icon: string;
  description: string;
}

export const THEMES: Record<ThemeName, Theme> = {
  light: {
    name: 'light',
    label: 'Light Mode',
    icon: '☀️',
    description: 'Warm and accessible light theme',
  },
  dark: {
    name: 'dark',
    label: 'Dark Mode',
    icon: '🌙',
    description: 'Easy on the eyes dark theme',
  },
  terminal: {
    name: 'terminal',
    label: 'Terminal Mode',
    icon: '💻',
    description: 'Cyberpunk terminal aesthetic with matrix green',
  },
};

export const THEME_NAMES = Object.keys(THEMES) as ThemeName[];
export const DEFAULT_THEME: ThemeName = 'light';