/**
 * Pre-Game Sensory & Accessibility Preferences View — The Other Users
 */

import React from 'react';
import { useNavigate } from 'react-router';
import styles from './AccessibilitySettings.module.css';
import { useSettingsStore } from '../../domain/state/settingsStore';
import { BaseButton } from '../../components/primitives/BaseButton';

export const AccessibilitySettings: React.FC = () => {
  const navigate = useNavigate();
  const settings = useSettingsStore();

  return (
    <article className={styles.container}>
      <header className={styles.headingGroup}>
        <span className={styles.kicker}>SYSTEM CONFIGURATION</span>
        <h1 className="type-h1">Sensory & Accessibility Preferences</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Configure perception thresholds, contrast layers, and puzzle timings. Preferences persist locally.
        </p>
      </header>

      {/* Visual & Theme */}
      <section className={styles.section} aria-labelledby="heading-visual">
        <h2 id="heading-visual" className={styles.sectionTitle}>
          Visual & Color Rendering
        </h2>

        <div className={styles.controlRow}>
          <div className={styles.controlLabel}>
            <span>Theme Layer</span>
            <span className={styles.controlSubtext}>Semantic contrast mapping</span>
          </div>
          <div className={styles.radioGroup} role="radiogroup" aria-label="Theme Layer">
            {(['dark', 'light', 'system'] as const).map((t) => (
              <label key={t} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="theme"
                  value={t}
                  checked={settings.theme === t}
                  onChange={() => settings.setTheme(t)}
                  aria-label={`Set theme to ${t}`}
                />
                <span style={{ textTransform: 'capitalize' }}>{t}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.controlRow}>
          <label htmlFor="text-scale-slider" className={styles.controlLabel}>
            <span>Text Scaling ({settings.textScale}%)</span>
            <span className={styles.controlSubtext}>Prose measure preserved up to 200%</span>
          </label>
          <input
            id="text-scale-slider"
            type="range"
            min={100}
            max={200}
            step={10}
            value={settings.textScale}
            onChange={(e) => settings.setTextScale(Number(e.target.value))}
            className={styles.sliderInput}
            aria-valuemin={100}
            aria-valuemax={200}
            aria-valuenow={settings.textScale}
          />
        </div>

        <div className={styles.controlRow}>
          <label htmlFor="high-contrast-toggle" className={styles.controlLabel}>
            <span>Enhanced Contrast Borders</span>
            <span className={styles.controlSubtext}>Increase contrast on separation rules</span>
          </label>
          <input
            id="high-contrast-toggle"
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => settings.setHighContrast(e.target.checked)}
            className={styles.toggleInput}
          />
        </div>
      </section>

      {/* Motion & Interaction */}
      <section className={styles.section} aria-labelledby="heading-motion">
        <h2 id="heading-motion" className={styles.sectionTitle}>
          Motion & Kinetic Dynamics
        </h2>

        <div className={styles.controlRow}>
          <label htmlFor="reduced-motion-toggle" className={styles.controlLabel}>
            <span>Reduced Motion</span>
            <span className={styles.controlSubtext}>Removes peel, parallax, oscillation, and auto-scroll</span>
          </label>
          <input
            id="reduced-motion-toggle"
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => settings.setReducedMotion(e.target.checked)}
            className={styles.toggleInput}
          />
        </div>
      </section>

      {/* Auditory & Transcripts */}
      <section className={styles.section} aria-labelledby="heading-audio">
        <h2 id="heading-audio" className={styles.sectionTitle}>
          Acoustics & Transcripts
        </h2>

        <div className={styles.controlRow}>
          <label htmlFor="sound-toggle" className={styles.controlLabel}>
            <span>Acoustic Audio Signals</span>
            <span className={styles.controlSubtext}>Belowline vibration and ambient sensory cues</span>
          </label>
          <input
            id="sound-toggle"
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => settings.setSoundEnabled(e.target.checked)}
            className={styles.toggleInput}
          />
        </div>

        <div className={styles.controlRow}>
          <label htmlFor="transcripts-toggle" className={styles.controlLabel}>
            <span>Text Transcripts Always Visible</span>
            <span className={styles.controlSubtext}>Couples text equivalent to all acoustic artifacts</span>
          </label>
          <input
            id="transcripts-toggle"
            type="checkbox"
            checked={settings.transcriptsEnabled}
            onChange={(e) => settings.setTranscriptsEnabled(e.target.checked)}
            className={styles.toggleInput}
          />
        </div>
      </section>

      {/* Cognition & Gameplay */}
      <section className={styles.section} aria-labelledby="heading-cognition">
        <h2 id="heading-cognition" className={styles.sectionTitle}>
          Investigation & Cognition
        </h2>

        <div className={styles.controlRow}>
          <label htmlFor="untimed-toggle" className={styles.controlLabel}>
            <span>Untimed Mode</span>
            <span className={styles.controlSubtext}>Disables all time-sensitive investigation pressure</span>
          </label>
          <input
            id="untimed-toggle"
            type="checkbox"
            checked={settings.untimedPuzzles}
            onChange={(e) => settings.setUntimedPuzzles(e.target.checked)}
            className={styles.toggleInput}
          />
        </div>

        <div className={styles.controlRow}>
          <label htmlFor="content-warnings-toggle" className={styles.controlLabel}>
            <span>Content Warnings</span>
            <span className={styles.controlSubtext}>Pre-announces anatomical instability and body themes</span>
          </label>
          <input
            id="content-warnings-toggle"
            type="checkbox"
            checked={settings.contentWarningsEnabled}
            onChange={(e) => settings.setContentWarningsEnabled(e.target.checked)}
            className={styles.toggleInput}
          />
        </div>
      </section>

      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <BaseButton variant="primary" onClick={() => navigate(-1)}>
          Save & Return
        </BaseButton>
      </div>
    </article>
  );
};
