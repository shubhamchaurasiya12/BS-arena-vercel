// app/settings/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { THEMES, type ThemeName } from '@/lib/themes';
import { useSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { FiCopy, FiCheck } from 'react-icons/fi';
import styles from '@/app/settings/settings.module.css';
import Dock from '@/app/components/Dock';

interface SettingsClientProps {
  initialUser?: {
    id: string;
    name: string;
    email: string;
    theme: string;
  };
}

// Injected once — all responsive breakpoints live here
const RESPONSIVE_CSS = `
  .settings-layout {
    max-width: 960px;
    margin: 0 auto;
    padding: 2rem 1rem 6rem 1rem;
  }
  .account-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .notifications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }
  .danger-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  /* Tablet: 641–768px */
  @media (min-width: 641px) and (max-width: 768px) {
    .settings-layout { padding: 1.5rem 1rem 6rem 1rem; }
    .account-grid { grid-template-columns: 1fr; }
    .notifications-grid { grid-template-columns: 1fr 1fr; }
  }

  /* Mobile: ≤ 640px */
  @media (max-width: 640px) {
    .settings-layout {
      padding: 0 0 5rem 0;
    }
    .account-grid { grid-template-columns: 1fr; }
    .notifications-grid { grid-template-columns: 1fr; }
    .danger-row { flex-direction: column; align-items: flex-start; }

    /* Give sections breathing room on mobile */
    .settings-main-content {
      padding: 0 0.75rem;
    }
  }

  /* Small Mobile: ≤ 400px */
  @media (max-width: 400px) {
    .settings-layout {
      padding: 0 0 4.5rem 0;
    }
  }
`;

function SettingsContent({ initialUser }: SettingsClientProps) {
  const { theme, setTheme, isLoading: themeLoading, error: themeError, clearError } = useTheme();
  const { data: session } = useSession();
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>('light'); // Default to light
  const [isSaving, setIsSaving] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync selected theme with current theme after mount
  useEffect(() => {
    if (isMounted) {
      setSelectedTheme((theme as ThemeName) || 'light');
    }
  }, [theme, isMounted]);

  // Handle theme save
  const handleThemeSave = async () => {
    try {
      console.log('🎨 Starting theme save...');
      console.log('Selected theme:', selectedTheme);
      console.log('Current theme:', theme);

      setIsSaving(true);
      clearError();

      console.log('📡 Calling setTheme with:', selectedTheme);
      await setTheme(selectedTheme);

      console.log('✅ Theme saved successfully');
      toast.success(`${THEMES[selectedTheme].label} saved successfully!`);
    } catch (err) {
      console.error('❌ Theme save error:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : 'No stack',
      });
      toast.error(`Failed to save theme: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Copy email to clipboard
  const handleCopyEmail = async () => {
    if (initialUser?.email) {
      try {
        await navigator.clipboard.writeText(initialUser.email);
        setCopiedEmail(true);
        toast.success('Email copied!');
        setTimeout(() => setCopiedEmail(false), 2000);
      } catch {
        toast.error('Failed to copy email');
      }
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/login' });
    } catch (err) {
      toast.error('Failed to logout');
    }
  };

  // Don't render theme-dependent content until after mount
  if (!isMounted) {
    return (
      <>
        <style>{RESPONSIVE_CSS}</style>
        <div className="settings-layout">
          <div className={`${styles.settingsSections} settings-main-content`}>
            <section className={styles.settingsSection}>
              <div className={styles.settingsSectionHeader}>
                <h2 className={styles.settingsSectionTitle}>🎨 Appearance</h2>
                <p className={styles.settingsSectionDesc}>Customize how the app looks</p>
              </div>
              <div className={styles.settingsCard}>
                <div className={styles.settingsField}>
                  <label className={styles.settingsLabel}>Theme</label>
                  <p className={styles.settingsHelp}>Choose your preferred visual style</p>
                  <div className={styles.themeOptions}>
                    {/* Show placeholder buttons */}
                    {Object.entries(THEMES).map(([key, themeConfig]) => (
                      <button
                        key={key}
                        className={styles.themeOption}
                        disabled={true}
                      >
                        <span className={styles.themeOptionIcon}>{themeConfig.icon}</span>
                        <span className={styles.themeOptionLabel}>{themeConfig.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{RESPONSIVE_CSS}</style>

      <div className="settings-layout">
        {/* ── Main Content ── */}
        <div className={`${styles.settingsSections} settings-main-content`} style={{ flex: 1, minWidth: 0 }}>

          {/* ================= APPEARANCE SECTION ================= */}
          <section id="appearance" className={`${styles.settingsSection} ${styles.anim2}`}>
            <div className={styles.settingsSectionHeader}>
              <h2 className={styles.settingsSectionTitle}>🎨 Appearance</h2>
              <p className={styles.settingsSectionDesc}>Customize how the app looks</p>
            </div>

            <div className={styles.settingsCard}>
              <div className={styles.settingsField}>
                <label className={styles.settingsLabel}>Theme</label>
                <p className={styles.settingsHelp}>Choose your preferred visual style</p>

                <div className={styles.themeOptions}>
                  {Object.entries(THEMES).map(([key, themeConfig]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTheme(key as ThemeName)}
                      className={`${styles.themeOption} ${
                        selectedTheme === key ? styles.themeOptionActive : ''
                      }`}
                      disabled={isSaving}
                      title={themeConfig.description}
                    >
                      <span className={styles.themeOptionIcon}>{themeConfig.icon}</span>
                      <span className={styles.themeOptionLabel}>{themeConfig.label}</span>
                    </button>
                  ))}
                </div>

                {/* Live Preview */}
                <div className={styles.themePreview}>
                  <label className={styles.themePreviewLabel}>Preview</label>
                  <div
                    className={`${styles.themePreviewCard} ${
                      selectedTheme === 'light'
                        ? styles.themePreviewLight
                        : selectedTheme === 'dark'
                        ? styles.themePreviewDark
                        : styles.themePreviewTerminal
                    }`}
                    data-theme-preview={selectedTheme}
                  >
                    <div className={styles.previewContent}>
                      <div className={styles.previewHeader}>
                        <div className={styles.previewTitle}>Preview Card</div>
                        <div className={styles.previewSubtitle}>
                          {selectedTheme === 'terminal'
                            ? '>_ TERMINAL MODE ACTIVE'
                            : `This is how it will look in ${selectedTheme} mode`}
                        </div>
                      </div>
                      <div className={styles.previewBody}>
                        {selectedTheme === 'terminal' ? (
                          <>
                            <p style={{ fontFamily: "'DM Mono', monospace", color: '#00FF66' }}>
                              $ system.theme = "terminal"
                            </p>
                            <p style={{ color: '#A0AABF' }}>
                              Matrix green accents · Tangerine highlights
                            </p>
                          </>
                        ) : (
                          <p>Your content will appear like this in {selectedTheme} mode.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className={styles.settingsActions}>
                  <button
                    onClick={handleThemeSave}
                    disabled={isSaving || selectedTheme === theme}
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    style={{ width: '100%' }}
                  >
                    {isSaving ? (
                      <>
                        <span className={styles.btnSpinner} />
                        Saving...
                      </>
                    ) : (
                      `Save ${THEMES[selectedTheme].label || 'Theme'}`
                    )}
                  </button>
                  {themeError && (
                    <p className={styles.settingsError}>{themeError}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ================= DANGER ZONE ================= */}
          <section id="danger" className={`${styles.settingsSection} ${styles.anim5}`}>
            <div className={styles.settingsSectionHeader}>
              <h2 className={styles.settingsSectionTitle}>⚠️ Danger Zone</h2>
              <p className={styles.settingsSectionDesc}>Irreversible actions</p>
            </div>

            <div className={`${styles.settingsCard} ${styles.settingsCardDanger}`}>
              <div className={`${styles.settingsField} danger-row`}>
                <div>
                  <label className={styles.settingsLabel}>Logout</label>
                  <p className={styles.settingsHelp}>Sign out from this device</p>
                </div>
                <div className={styles.settingsActions} style={{ margin: 0 }}>
                  <button
                    onClick={handleLogout}
                    className={`${styles.btn} ${styles.btnDanger}`}
                    style={{ width: '100%' }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Add the Dock component */}
      <Dock />
    </>
  );
}

export default function SettingsClient(props: SettingsClientProps) {
  return (
    <Suspense fallback={<div>Loading settings...</div>}>
      <SettingsContent {...props} />
    </Suspense>
  );
}