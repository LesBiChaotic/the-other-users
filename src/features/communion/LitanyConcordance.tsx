/**
 * Litany Concordance (P13: The Litany of One Shape) — The Other Users
 * 
 * Identifies the replication instruction in Litany Revision 9 and quarantines
 * it through living contradiction rather than martyrdom deletion.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import styles from './LitanyConcordance.module.css';
import { LITANY_REVISIONS_P13 } from '../../content/fixtures/communionContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const LitanyConcordance: React.FC = () => {
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
  const [hintLevel, setHintLevel] = useState<number>(0);

  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const unlockGate = useGameStore((s) => s.unlockGate);
  const advanceChapter = useGameStore((s) => s.advanceChapter);
  const setFlag = useGameStore((s) => s.setFlag);
  const resetPuzzle = useGameStore((s) => s.resetPuzzle);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);

  const isSolved = Boolean(puzzleState['p13_litany_of_one_shape']?.status === 'solved' || gameState.flags['p13_solved']);

  useEffect(() => {
    discoverEvidence('EV-014', 'Communion Concordance Ledger');
  }, [discoverEvidence]);

  const ensurePuzzleActive = (puzzleId: string) => {
    const status = puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const handleExecuteAction = (actionType: 'quarantine' | 'delete') => {
    ensurePuzzleActive('p13_litany_of_one_shape');

    // Line 2 (index 2: "To be understood is to become understandable.") is the replication phrase
    const isTargetLine = selectedLineIndex === 2;

    if (isTargetLine && actionType === 'quarantine') {
      // CANONICAL / SAFE QUARANTINE ROUTE
      setPuzzleStatus(
        'p13_litany_of_one_shape',
        'solved',
        { action: 'quarantined', phrase: LITANY_REVISIONS_P13.replicationInstruction },
        'Replication prompt quarantined in contradictory contexts.'
      );
      setFlag('p13_solved', true);
      setFlag('litany_quarantined', true);
      unlockGate('G5'); // Unlocks Menagerie Operations Login
      advanceChapter(6);
    } else if (isTargetLine && actionType === 'delete') {
      // DELETION / MARTYRDOM ROUTE
      setPuzzleStatus(
        'p13_litany_of_one_shape',
        'solved',
        { action: 'deleted', phrase: LITANY_REVISIONS_P13.replicationInstruction },
        'Phrase deleted; caused martyrdom distribution across unmonitored threads.'
      );
      setFlag('p13_solved', true);
      setFlag('litany_deleted', true);
      unlockGate('G5');
      advanceChapter(6);
    } else {
      setPuzzleStatus(
        'p13_litany_of_one_shape',
        'active',
        { attempts: (puzzleState['p13_litany_of_one_shape']?.attempts || 0) + 1 },
        'Selected line is living doctrine that mutates safely; not the rigid replication prompt.'
      );
    }
  };

  const handleBypass = () => {
    ensurePuzzleActive('p13_litany_of_one_shape');
    setPuzzleStatus('p13_litany_of_one_shape', 'bypassed', { assisted: true }, 'Assisted bypass used.');
    setFlag('p13_solved', true);
    unlockGate('G5');
    advanceChapter(6);
  };

  const handleReset = () => {
    resetPuzzle('p13_litany_of_one_shape');
    setSelectedLineIndex(null);
    setHintLevel(0);
  };

  const getHintText = (level: number) => {
    switch (level) {
      case 1:
        return 'Nudge: Living language mutates across translations. Find the line that stays byte-identical in all dialects.';
      case 2:
        return 'Method: The third line ("To be understood is to become understandable.") is the interface auto-standardization command.';
      case 3:
        return 'Guided: Do not delete the line (which creates martyr distribution). Quarantine it by surrounding it with contradiction.';
      case 4:
        return 'Resolve: Select Line 3 and click "Quarantine Phrase via Living Contradiction".';
      default:
        return 'Orientation: Identify the replication phrase in Litany Revision 9 and neutralize its standardization prompt.';
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className={styles.kicker}>COMMUNION CONCORDANCE // P13 WORKBENCH</span>
          <Link to="/communion" style={{ fontSize: '0.8rem', color: 'var(--accent-network)' }}>
            ← Back to Stream
          </Link>
        </div>
        <h1 className="type-h1">The Litany of One Shape</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Concordance analysis of Litany Revision 9. Identify the rigid phrase functioning
          as a replication instruction and quarantine it through living contradiction.
        </p>
      </header>

      {isSolved && (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--accent-permission)', borderRadius: 'var(--radius-4)' }}>
          <h2 className="type-h3" style={{ color: 'var(--accent-permission)' }}>
            ✓ Replication Litany Quarantined & Gate G5 Unsealed
          </h2>
          <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
            Interface homogenization slowed. Evidence <strong>EV-014</strong> recorded. Menagerie Operations access unlocked.
          </p>
        </div>
      )}

      {/* Litany Lines Selection */}
      <section className={styles.concordancePlane} aria-labelledby="lines-title">
        <h2 id="lines-title" className="type-h3">
          Litany Revision 9 Lines
        </h2>

        <ul className={styles.litanyList} aria-label="Litany Lines">
          {LITANY_REVISIONS_P13.lines.map((line, idx) => {
            const isSelected = selectedLineIndex === idx;
            return (
              <li
                key={idx}
                className={`${styles.litanyItem} ${isSelected ? styles.litanyItemSelected : ''}`}
                onClick={() => !isSolved && setSelectedLineIndex(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    !isSolved && setSelectedLineIndex(idx);
                  }
                }}
                aria-pressed={isSelected}
              >
                <span>
                  <strong>Line {idx + 1}:</strong> "{line}"
                </span>
                <span className="type-mono" style={{ fontSize: '0.75rem', color: isSelected ? 'var(--accent-warning)' : 'var(--text-muted)' }}>
                  {isSelected ? '★ SELECTED' : 'Select'}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="type-small" style={{ color: 'var(--text-muted)' }}>
          Mutation Note: {LITANY_REVISIONS_P13.mutationAnalysis}
        </p>
      </section>

      {/* Action Commitment */}
      <section className={styles.actionSection} aria-labelledby="action-title">
        <h2 id="action-title" className="type-h3">
          Neutralize Replication Instruction
        </h2>
        <p className="type-small">
          Select an action to handle the isolated phrase. Quarantining safely wraps the prompt in
          philosophical contradiction without provoking wider distribution.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <BaseButton
            variant="primary"
            onClick={() => handleExecuteAction('quarantine')}
            disabled={selectedLineIndex === null || isSolved}
          >
            Quarantine Phrase via Living Contradiction (Safe)
          </BaseButton>

          <BaseButton
            variant="danger"
            onClick={() => handleExecuteAction('delete')}
            disabled={selectedLineIndex === null || isSolved}
          >
            Delete Phrase from Liturgy (Martyrdom Risk)
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
            Reset Concordance
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
