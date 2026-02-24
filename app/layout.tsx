// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PomodoroProvider } from "@/context/PomodoroContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import Providers from "./provider";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "BS Arena",
  description: "Study platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical inline script to prevent theme flash - runs before any rendering */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Get theme from localStorage
                  const stored = localStorage.getItem('theme');
                  
                  // Validate theme (must be one of the three)
                  const theme = stored === 'light' || stored === 'dark' || stored === 'terminal' 
                    ? stored 
                    : 'light';
                  
                  // Apply to HTML element immediately - this runs before any paint
                  document.documentElement.setAttribute('data-theme', theme);
                  
                  // Also set a data attribute for any CSS that might use it
                  document.documentElement.setAttribute('data-color-mode', theme);
                  
                  // Store default if none existed
                  if (!stored) {
                    localStorage.setItem('theme', 'light');
                  }
                  
                  // Optional: Add a class for theme-specific styles
                  document.documentElement.classList.add('theme-' + theme);
                } catch (e) {
                  // Fallback if localStorage is not available (rare)
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.setAttribute('data-color-mode', 'light');
                  document.documentElement.classList.add('theme-light');
                }
              })();
            `,
          }}
        />
        {/* Optional: Add theme-color meta tags for browser UI */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0d0d0d" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="min-h-screen text-gray-900" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <PomodoroProvider>
              <Providers>
                <main className="pt-5">
                  {children}
                </main>
              </Providers>
            </PomodoroProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}