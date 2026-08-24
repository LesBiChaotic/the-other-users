/**
 * Menagerie Public Registry Home — The Other Users
 * 
 * Institutional specimen ledger ruptured by resident annotations and budget omissions.
 * Replaces generic admin dashboards with physical specimen records and resident counter-notes.
 */

import React from 'react';
import { Link } from 'react-router';
import styles from './MenagerieRegistry.module.css';
import { MENAGERIE_REGISTRY_ENTRIES } from '../../content/fixtures/menagerieContent';
import { useGameStore } from '../../domain/state/useGameStore';

export const MenagerieRegistry: React.FC = () => {
  const gameState = useGameStore((s) => s.gameState);
  const isOpsUnlocked = Boolean(gameState.unlockedGates['G5'] || gameState.flags['menagerie_access_method']);

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>MENAGERIE DIRECTORATE // PUBLIC SPECIMEN REGISTRY</span>
        <h1 className="type-h1">Annex N Public Specimen Ledger</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Official containment and habitat support registry for Subterranean Annex N.
          Entries include Directorate institutional assessments and unauthorized resident annotations.
        </p>
      </header>

      {/* Operations Console Access Banner */}
      {isOpsUnlocked ? (
        <Link
          to="/menagerie/ops"
          className={styles.bannerOps}
          aria-label="Access Operations Console"
        >
          <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-warning)', fontWeight: 700 }}>
            ★ G5 ACCESS GRANTED // OPERATIONS CONSOLE
          </span>
          <h2 className="type-h2">Enter Annex N Facility Operations</h2>
          <p className="type-body">
            Authenticated via Action-Bound Pass. Inspect physical enclosure drawings,
            audit synthetic camera feeds (P14), and execute Ilyr exit procedure (P15).
          </p>
        </Link>
      ) : (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface)', borderLeft: '3px solid var(--line-emphasis)', borderRadius: 'var(--radius-4)' }}>
          <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            OPERATIONS LOCK: Requires Gate G5 (Sensory Triad & Pale Market pass assembly).
          </span>
        </div>
      )}

      {/* Public Specimen Registry Entries */}
      <section aria-labelledby="registry-heading">
        <h2 id="registry-heading" className="type-h3" style={{ color: 'var(--text-muted)' }}>
          Cataloged Habitat Records
        </h2>

        <ul className={styles.registryList} aria-label="Specimen Records">
          {MENAGERIE_REGISTRY_ENTRIES.map((entry) => (
            <li key={entry.id} className={styles.registryItem}>
              <div className={styles.itemHeader}>
                <h3 className={styles.specimenLabel}>{entry.specimenLabel}</h3>
                <span className={styles.riskBadge}>{entry.institutionalRisk}</span>
              </div>

              <p className="type-small">
                <strong>Species / Subject:</strong> {entry.speciesName} •{' '}
                <strong>Status:</strong> {entry.occupancyStatus}
              </p>

              <p className="type-body">{entry.officialSummary}</p>

              {entry.residentAnnotation && (
                <div className={styles.annotationBox}>
                  <strong>Resident Annotation:</strong> "{entry.residentAnnotation}"
                </div>
              )}

              {entry.budgetFootnote && (
                <span className={styles.budgetNote}>
                  Internal Audit: {entry.budgetFootnote}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};
