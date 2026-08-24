/**
 * Settings Store & Pre-Hydration Synchronization — The Other Users
 * 
 * Manages player sensory, accessibility, and visual preferences.
 * Synchronizes with localStorage and DOM attributes before and during React lifecycle.
 */

import { create } from 'zustand';
import { SettingsState } from '../types/state';

export const DEFAULT_SETTINGS: SettingsState = {
  theme: 'dark',
  textScale: 100,
  reducedMotion: false,
  highContrast: false,
  soundEnabled: true,
  transcriptsEnabled: true,
  untimedPuzzles: false,
  contentWarningsEnabled: true,
};

export function loadInitialSettings(): SettingsState {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem('palinode_settings');
    const storedTheme = localStorage.getItem('palinode_theme') as 'light' | 'dark' | null;
    const storedMotion = localStorage.getItem('palinode_motion');

    let base: SettingsState = DEFAULT_SETTINGS;
    if (stored) {
      base = { ...base, ...JSON.parse(stored) };
    }

    if (storedTheme) {
      base.theme = storedTheme;
    }
    if (storedMotion) {
      base.reducedMotion = storedMotion === 'reduced';
    }

    return base;
  } catch (e) {
    console.warn('Failed to load settings from storage, using defaults', e);
    return DEFAULT_SETTINGS;
  }
}

export interface SettingsStoreState extends SettingsState {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setTextScale: (scale: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  setHighContrast: (highContrast: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setTranscriptsEnabled: (enabled: boolean) => void;
  setUntimedPuzzles: (untimed: boolean) => void;
  setContentWarningsEnabled: (enabled: boolean) => void;
  applyToDOM: () => void;
}

function syncPreferencesToDOM(settings: SettingsState) {
  if (typeof document === 'undefined') return;

  // Theme
  let activeTheme = settings.theme;
  if (activeTheme === 'system') {
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    activeTheme = prefersDark ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', activeTheme);
  try {
    localStorage.setItem('palinode_theme', activeTheme);
  } catch {}

  // Reduced Motion
  if (settings.reducedMotion) {
    document.documentElement.classList.add('reduced-motion');
    try {
      localStorage.setItem('palinode_motion', 'reduced');
    } catch {}
  } else {
    document.documentElement.classList.remove('reduced-motion');
    try {
      localStorage.setItem('palinode_motion', 'normal');
    } catch {}
  }

  // Text Scale
  document.documentElement.style.setProperty('--user-text-scale', `${settings.textScale}%`);

  // Persist all settings
  try {
    localStorage.setItem('palinode_settings', JSON.stringify(settings));
  } catch {}
}

export const useSettingsStore = create<SettingsStoreState>((set, get) => ({
  ...loadInitialSettings(),

  setTheme: (theme) => {
    set({ theme });
    syncPreferencesToDOM(get());
  },

  setTextScale: (textScale) => {
    const clamped = Math.max(100, Math.min(200, textScale));
    set({ textScale: clamped });
    syncPreferencesToDOM(get());
  },

  setReducedMotion: (reducedMotion) => {
    set({ reducedMotion });
    syncPreferencesToDOM(get());
  },

  setHighContrast: (highContrast) => {
    set({ highContrast });
    syncPreferencesToDOM(get());
  },

  setSoundEnabled: (soundEnabled) => {
    set({ soundEnabled });
    syncPreferencesToDOM(get());
  },

  setTranscriptsEnabled: (transcriptsEnabled) => {
    set({ transcriptsEnabled });
    syncPreferencesToDOM(get());
  },

  setUntimedPuzzles: (untimedPuzzles) => {
    set({ untimedPuzzles });
    syncPreferencesToDOM(get());
  },

  setContentWarningsEnabled: (contentWarningsEnabled) => {
    set({ contentWarningsEnabled });
    syncPreferencesToDOM(get());
  },

  applyToDOM: () => {
    syncPreferencesToDOM(get());
  },
}));
