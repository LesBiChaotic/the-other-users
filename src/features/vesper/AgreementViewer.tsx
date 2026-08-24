/**
 * Body-Sharing Agreement Viewer (P09) — The Other Users
 * 
 * Reconstructs the 5 safe plain-language consent clauses to expose and neutralize
 * TermsMayApply's predatory circular exception.
 */

import React, { useState } from 'react';
import { Link } from 'react-router';
import styles from './AgreementViewer.module.css';
import { BODY_SHARING_CLAUSES_P09 } from '../../content/fixtures/vesperContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const AgreementViewer: React.FC = () => {
  const [restoredClauseIds, setRestoredClauseIds] = useState<string[]>([]);
  const [hintLevel, setHintLevel] = useState<number>(0);

  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const unlockGate = useGameStore((s) => s.unlockGate);
  const advanceChapter = useGameStore((s) => s.advanceChapter);
  const setFlag = useGameStore((s) => s.setFlag);
  const resetPuzzle = useGameStore((s) => s.resetPuzzle);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);

  const isSolved = Boolean(puzzleState['p09_body_sharing_agreement']?.status === 'solved' || gameState.flags['p09_solved']);

  const ensurePuzzleActive = (puzzleId: string) => {
    const status = puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const handleToggleRestore = (clauseId: string) => {
    setRestoredClauseIds((prev) =>
      prev.includes(clauseId) ? prev.filter((id) => id !== clauseId) : [...prev, clauseId]
    );
  };

  const handleCommitContract = () => {
    // All 5 clauses must be restored
    if (restoredClauseIds.length === 5) {
      ensurePuzzleActive('p09_body_sharing_agreement');
      setPuzzleStatus(
        'p09_body_sharing_agreement',
        'solved',
        { restoredClauses: restoredClauseIds },
        'Restored all five safe consent clauses; TermsMayApply exception neutralized.'
      );
      setFlag('p09_solved', true);
      setFlag('terms_exposed', true);
      discoverEvidence('EV-010', 'Vesper Safety Template Archive');
      if (useGameStore.getState().gameState.flags['p08_solved']) {
        unlockGate('G4');
        advanceChapter(4);
      }
    } else {
      ensurePuzzleActive('p09_body_sharing_agreement');
      setPuzzleStatus(
        'p09_body_sharing_agreement',
        'active',
        { attempts: (puzzleState['p09_body_sharing_agreement']?.attempts || 0) + 1 },
        'Contract contains unrestored predatory clauses.'
      );
    }
  };

  const handleBypass = () => {
    ensurePuzzleActive('p09_body_sharing_agreement');
    setPuzzleStatus('p09_body_sharing_agreement', 'bypassed', { assisted: true }, 'Assisted bypass used.');
    setFlag('p09_solved', true);
    discoverEvidence('EV-010', 'Assisted Vesper Safety Template Archive');
    if (useGameStore.getState().gameState.flags['p08_solved']) {
      unlockGate('G4');
      advanceChapter(4);
    }
  };

  const handleReset = () => {
    resetPuzzle('p09_body_sharing_agreement');
    setRestoredClauseIds([]);
    setHintLevel(0);
  };

  const getHintText = (level: number) => {
    switch (level) {
      case 1:
        return 'Nudge: Check each clause for scope, duration, revocation, emergency separation, and data retention.';
      case 2:
        return 'Method: A right to revoke cannot depend on permission from the other party or platform arbitration.';
      case 3:
        return 'Guided: Restore all five clauses to their plain-language safety standards.';
      case 4:
        return 'Resolve: Click "Restore Safe Clause" on all 5 sections and commit the repaired contract.';
      default:
        return 'Orientation: Repair the five altered clauses to protect bodily sovereignty and expose TermsMayApply.';
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className={styles.kicker}>CONSENT ARCHIVE // P09 WORKBENCH</span>
          <Link to="/vesper" style={{ fontSize: '0.8rem', color: 'var(--accent-network)' }}>
            ← Back to Vesper
          </Link>
        </div>
        <h1 className="type-h1">Body-Sharing Consent Agreement</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Reconstruct the original plain-language consent clauses after predatory legal alterations
          by @TermsMayApply. Protect bodily sovereignty across five core provisions.
        </p>
      </header>

      {isSolved && (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--accent-permission)', borderRadius: 'var(--radius-4)' }}>
          <h2 className="type-h3" style={{ color: 'var(--accent-permission)' }}>
            ✓ Body-Sharing Agreement Repaired & Gate G4 Unsealed
          </h2>
          <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
            Sensory Triad unlocked. <strong>Pale Market</strong> and <strong>Communion</strong> are now accessible.
          </p>
        </div>
      )}

      {/* Contract Clauses */}
      <section className={styles.contractPlane} aria-labelledby="clauses-title">
        <h2 id="clauses-title" className="type-h3">
          Five Essential Consent Provisions
        </h2>

        {BODY_SHARING_CLAUSES_P09.map((clause) => {
          const isRestored = restoredClauseIds.includes(clause.id) || isSolved;
          return (
            <div
              key={clause.id}
              className={`${styles.clauseCard} ${isRestored ? styles.clauseCardRestored : ''}`}
            >
              <div className={styles.clauseHeader}>
                <span className={styles.categoryTag}>PROVISION: {clause.category.toUpperCase()}</span>
                <span className="type-mono" style={{ fontSize: '0.75rem', color: isRestored ? 'var(--accent-permission)' : 'var(--accent-warning)' }}>
                  {isRestored ? '✓ SAFE CLAUSE RESTORED' : '⚠ PREDATORY ALTERATION'}
                </span>
              </div>

              <p className="type-small">
                <strong>Plain Summary:</strong> {clause.plainSummary}
              </p>

              <div className={styles.clauseDiff}>
                <strong>Current Contract Language:</strong>
                <p style={{ marginTop: '4px' }}>
                  {isRestored ? clause.safeClauseText : clause.alteredPredatoryText}
                </p>
              </div>

              <p className="type-small" style={{ color: 'var(--text-muted)' }}>
                Rule: {clause.explanation}
              </p>

              <div style={{ marginTop: 'var(--space-2)' }}>
                <BaseButton
                  variant={isRestored ? 'default' : 'primary'}
                  onClick={() => handleToggleRestore(clause.id)}
                  disabled={isSolved}
                >
                  {isRestored ? 'Revert to Altered Version' : 'Restore Safe Plain Clause'}
                </BaseButton>
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 'var(--space-3)' }}>
          <BaseButton
            variant="primary"
            onClick={handleCommitContract}
            disabled={isSolved}
          >
            Commit Repaired Consent Agreement ({restoredClauseIds.length} / 5 Restored)
          </BaseButton>
        </div>
      </section>

      {/* Hints & Reset */}
      <footer style={{ borderTop: '1px solid var(--line-subtle)', paddingTop: 'var(--space-4)' }}>
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-permission)' }}>
              Hint Level ({hintLevel} / 4)
            </span>
            {hintLevel < 4 ? (
              <BaseButton onClick={() => setHintLevel((p) => p + 1)}>
                Request Hint (Level {hintLevel + 1})
              </BaseButton>
            ) : (
              <BaseButton variant="primary" onClick={handleBypass}>
                Assisted Bypass (Level 4)
              </BaseButton>
            )}
          </div>
          <p className="type-body" style={{ fontSize: '0.9rem' }}>
            {getHintText(hintLevel)}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-3)' }}>
          <BaseButton onClick={handleReset}>
            Reset Contract Workbench
          </BaseButton>
          {isSolved && (
            <Link to="/home" style={{ textDecoration: 'none' }}>
              <BaseButton variant="primary">Return to Hub</BaseButton>
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
};
