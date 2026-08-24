/**
 * Player Profile & Anatomy Surface — The Other Users
 * 
 * Renders the working hypothesis of the player's organism, definition fields,
 * behavioral state meters, and revision spine.
 */

import React from 'react';
import styles from './PlayerProfileView.module.css';
import { useGameStore } from '../../domain/state/useGameStore';

export const PlayerProfileView: React.FC = () => {
  const profile = useGameStore((s) => s.playerProfile);

  return (
    <article className={styles.container}>
      {/* Silhouette Hero */}
      <section className={styles.heroSilhouette} aria-label="Provisional Form Silhouette">
        <div className={styles.silhouetteGraphic} aria-hidden="true">
          ◈
        </div>
        <h1 className={styles.handleTitle}>{profile.handle}</h1>
        <span className={styles.speciesSubtitle}>{profile.provisionalSpecies}</span>
        <p className="type-small">Pronouns: {profile.pronouns}</p>
      </section>

      {/* Anatomical Hypotheses */}
      <section className={styles.section} aria-labelledby="anatomy-heading">
        <h2 id="anatomy-heading" className={styles.sectionHeading}>
          Provisional Anatomy & Habitat Boundaries
        </h2>

        <dl className={styles.definitionList}>
          <div className={styles.defItem}>
            <dt className={styles.defTerm}>Occupancy Count</dt>
            <dd className={styles.defDesc}>{profile.occupancyCount} individual(s)</dd>
          </div>

          <div className={styles.defItem}>
            <dt className={styles.defTerm}>Threshold Tolerance</dt>
            <dd className={styles.defDesc}>{profile.thresholdTolerance}</dd>
          </div>

          <div className={styles.defItem}>
            <dt className={styles.defTerm}>Memory Diet</dt>
            <dd className={styles.defDesc}>{profile.memoryDiet}</dd>
          </div>

          <div className={styles.defItem}>
            <dt className={styles.defTerm}>Mimicry Risk</dt>
            <dd className={styles.defDesc} style={{ color: 'var(--accent-warning)' }}>
              {profile.mimicryRisk}
            </dd>
          </div>

          <div className={styles.defItem}>
            <dt className={styles.defTerm}>Witnessed Shape</dt>
            <dd className={styles.defDesc}>{profile.witnessedShape}</dd>
          </div>
        </dl>
      </section>

      {/* Behavioral State Meters */}
      <section className={styles.section} aria-labelledby="meters-heading">
        <h2 id="meters-heading" className={styles.sectionHeading}>
          Palinode State Alignment Meters
        </h2>

        <div className={styles.meterGrid}>
          <div className={styles.meterRow}>
            <div className={styles.meterLabel}>
              <span>Plurality (Bodily & Cultural Autonomy)</span>
              <span className="type-mono">{profile.pluralityScore}%</span>
            </div>
            <div className={styles.meterBarTrack}>
              <div
                className={styles.meterBarFill}
                style={{ width: `${profile.pluralityScore}%` }}
              />
            </div>
          </div>

          <div className={styles.meterRow}>
            <div className={styles.meterLabel}>
              <span>Legibility (Standardization Pressure)</span>
              <span className="type-mono">{profile.legibilityScore}%</span>
            </div>
            <div className={styles.meterBarTrack}>
              <div
                className={styles.meterBarFill}
                style={{ width: `${profile.legibilityScore}%`, backgroundColor: 'var(--accent-permission)' }}
              />
            </div>
          </div>

          <div className={styles.meterRow}>
            <div className={styles.meterLabel}>
              <span>Exposure (Human Identification Risk)</span>
              <span className="type-mono">{profile.exposureScore}%</span>
            </div>
            <div className={styles.meterBarTrack}>
              <div
                className={styles.meterBarFill}
                style={{ width: `${profile.exposureScore}%`, backgroundColor: 'var(--accent-warning)' }}
              />
            </div>
          </div>

          <div className={styles.meterRow}>
            <div className={styles.meterLabel}>
              <span>Ilyr Trust (Moderator Alignment)</span>
              <span className="type-mono">{profile.ilyrTrustScore}%</span>
            </div>
            <div className={styles.meterBarTrack}>
              <div
                className={styles.meterBarFill}
                style={{ width: `${profile.ilyrTrustScore}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Revision Spine */}
      <section className={styles.section} aria-labelledby="revisions-heading">
        <h2 id="revisions-heading" className={styles.sectionHeading}>
          Profile Revision History Spine
        </h2>

        <ul className={styles.revisionList}>
          {profile.revisions.length > 0 ? (
            profile.revisions.map((rev) => (
              <li key={rev.timestamp} className={styles.revisionItem}>
                <div className={styles.revisionHeader}>
                  <span>CHAPTER {rev.chapter} REVISION</span>
                  <span>{new Date(rev.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="type-body">{rev.summary}</p>
              </li>
            ))
          ) : (
            <li className="type-small" style={{ color: 'var(--text-muted)' }}>
              Initial provisional baseline active. No downstream revisions recorded.
            </li>
          )}
        </ul>
      </section>
    </article>
  );
};
