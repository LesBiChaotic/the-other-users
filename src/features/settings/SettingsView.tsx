/**
 * Settings & Multi-Tier Reset Surface — The Other Users
 * 
 * Preferences and confirmed resets (Surface, Puzzle, Chapter, Full).
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './SettingsView.module.css';
import { useSettingsStore } from '../../domain/state/settingsStore';
import { useGameStore } from '../../domain/state/useGameStore';
import { BaseButton } from '../../components/primitives/BaseButton';

export const SettingsView: React.FC = () => {
  const navigate = useNavigate();
  const settings = useSettingsStore();
  const resetFull = useGameStore((s) => s.resetFull);
  const resetChapter = useGameStore((s) => s.resetChapter);
  const resetSurface = useGameStore((s) => s.resetSurface);
  const currentChapter = useGameStore((s) => s.gameState.chapter);

  const [confirmFullReset, setConfirmFullReset] = useState(false);
  const [confirmChapterReset, setConfirmChapterReset] = useState(false);

  const handleExecuteFullReset = async () => {
    await resetFull();
    navigate('/');
  };

  const handleExecuteChapterReset = () => {
    resetChapter(currentChapter);
    setConfirmChapterReset(false);
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>SYSTEM PREFERENCES</span>
        <h1 className="type-h1">Settings & Resets</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Manage local perceptual filters, sensory layers, and independent reset checkpoints.
        </p>
      </header>

      {/* Visual & Theme */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Visual & Color Theme</h2>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {(['dark', 'light', 'system'] as const).map((t) => (
            <BaseButton
              key={t}
              variant={settings.theme === t ? 'primary' : 'default'}
              onClick={() => settings.setTheme(t)}
            >
              {t.toUpperCase()} MODE
            </BaseButton>
          ))}
        </div>
      </section>

      {/* Multi-Tier Resets */}
      <section className={styles.dangerSection} aria-labelledby="resets-heading">
        <h2 id="resets-heading" className={styles.dangerTitle}>
          Independent Reset Checkpoints
        </h2>

        {/* Surface Reset */}
        <div className={styles.resetRow}>
          <div className={styles.resetInfo}>
            <span className={styles.resetName}>Surface Reset</span>
            <span className={styles.resetDesc}>
              Clears active comparison trays, filters, and drafts without touching story progress.
            </span>
          </div>
          <BaseButton onClick={() => resetSurface()}>
            Reset Surface
          </BaseButton>
        </div>

        {/* Chapter Reset */}
        <div className={styles.resetRow}>
          <div className={styles.resetInfo}>
            <span className={styles.resetName}>Chapter Reset (Chapter {currentChapter})</span>
            <span className={styles.resetDesc}>
              Reverts state to the snapshot taken at entry to Chapter {currentChapter}. Preserves settings.
            </span>
          </div>
          {confirmChapterReset ? (
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <BaseButton variant="danger" onClick={handleExecuteChapterReset}>
                Confirm Chapter Reset
              </BaseButton>
              <BaseButton onClick={() => setConfirmChapterReset(false)}>
                Cancel
              </BaseButton>
            </div>
          ) : (
            <BaseButton onClick={() => setConfirmChapterReset(true)}>
              Restart Chapter
            </BaseButton>
          )}
        </div>

        {/* Full Reset */}
        <div className={styles.resetRow}>
          <div className={styles.resetInfo}>
            <span className={styles.resetName}>Full Factory Reset</span>
            <span className={styles.resetDesc}>
              Erases onboarding, earned traits, messages, evidence, inventory, endings, and caches.
              Returns to public invitation landing.
            </span>
          </div>
          {confirmFullReset ? (
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <BaseButton variant="danger" onClick={handleExecuteFullReset}>
                Permanently Wipe All Data
              </BaseButton>
              <BaseButton onClick={() => setConfirmFullReset(false)}>
                Cancel
              </BaseButton>
            </div>
          ) : (
            <BaseButton variant="danger" onClick={() => setConfirmFullReset(true)}>
              Full Reset
            </BaseButton>
          )}
        </div>
      </section>
    </article>
  );
};
