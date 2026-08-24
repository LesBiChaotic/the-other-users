/**
 * Evidence & Contradiction Board — The Other Users
 * 
 * Organizes evidence items, contradiction links, and comparison selections.
 */

import React from 'react';
import styles from './EvidenceBoard.module.css';
import { INITIAL_EVIDENCE } from '../../content/fixtures/checkpoint1Content';
import { useGameStore } from '../../domain/state/useGameStore';
import { BaseButton } from '../../components/primitives/BaseButton';

export const EvidenceBoard: React.FC = () => {
  const activeComparisons = useGameStore((s) => s.uiState.activeComparisonEvidenceIds);
  const toggleComparison = useGameStore((s) => s.toggleEvidenceComparison);
  const markEvidence = useGameStore((s) => s.markEvidence);
  const evidenceState = useGameStore((s) => s.evidenceState);

  const evidenceItem = INITIAL_EVIDENCE[0];
  const isMarked = evidenceState[evidenceItem.id]?.marked ?? false;
  const isCompared = activeComparisons.includes(evidenceItem.id);

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>PALINODE // EVIDENCE LEDGER</span>
        <h1 className="type-h1">Evidence & Contradiction Board</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Documented sensory artifacts, protocol anomalies, and contradictory statements
          collected across communities.
        </p>
      </header>

      <div className={styles.clusterList}>
        <section className={styles.cluster} aria-labelledby="cluster-origin-heading">
          <h2 id="cluster-origin-heading" className={styles.clusterTitle}>
            Chapter 0 // Origin Dossier
          </h2>

          <div className={styles.evidenceItem}>
            <div className={styles.itemHeader}>
              <h3 className={styles.itemTitle}>{evidenceItem.title}</h3>
              <span className={styles.provenance}>PROVENANCE: {evidenceItem.provenance}</span>
            </div>

            <p className={styles.itemBody}>{evidenceItem.representations.primaryText}</p>

            {evidenceItem.representations.sensoryDescription && (
              <p className={styles.sensoryNote}>
                Sensory translation: {evidenceItem.representations.sensoryDescription}
              </p>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <BaseButton
                onClick={() => markEvidence(evidenceItem.id, !isMarked)}
              >
                {isMarked ? '★ Marked as Core Contradiction' : '☆ Mark Contradiction'}
              </BaseButton>

              <BaseButton
                variant={isCompared ? 'primary' : 'default'}
                onClick={() => toggleComparison(evidenceItem.id)}
              >
                {isCompared ? 'Comparing' : 'Compare'}
              </BaseButton>
            </div>
          </div>
        </section>
      </div>

      {activeComparisons.length > 0 && (
        <aside className={styles.comparisonTray} aria-label="Active Evidence Comparison">
          <span className="type-small">
            <strong>Comparing:</strong> {activeComparisons.length} item(s) in active analysis tray
          </span>
          <BaseButton onClick={() => toggleComparison(activeComparisons[0])}>
            Clear Tray
          </BaseButton>
        </aside>
      )}
    </article>
  );
};
