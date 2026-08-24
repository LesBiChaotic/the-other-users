/**
 * soft_error Shed Archive (P04: Shed Drafts) — The Other Users
 * 
 * Recovers authentic deleted drafts across revision layers based on
 * punctuation tell (,,), obsolete nickname ("stapler king"), and rivet debt.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import styles from './SoftErrorArchive.module.css';
import { SOFT_ERROR_DRAFTS_P04 } from '../../content/fixtures/moltinghouseContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const SoftErrorArchive: React.FC = () => {
  const [selectedDraftIndex, setSelectedDraftIndex] = useState<number>(0);
  const [markedDraftIds, setMarkedDraftIds] = useState<string[]>([]);
  const [hintLevel, setHintLevel] = useState<number>(0);

  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const unlockGate = useGameStore((s) => s.unlockGate);
  const advanceChapter = useGameStore((s) => s.advanceChapter);
  const setFlag = useGameStore((s) => s.setFlag);
  const resetPuzzle = useGameStore((s) => s.resetPuzzle);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);
  const isSolved = Boolean(puzzleState['p04_shed_drafts']?.status === 'solved' || gameState.flags['p04_solved']);

  useEffect(() => {
    discoverEvidence('EV-005', 'Moltinghouse Revision Archive');
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

  const toggleMarkDraft = (draftId: string) => {
    setMarkedDraftIds((prev) =>
      prev.includes(draftId) ? prev.filter((id) => id !== draftId) : [...prev, draftId]
    );
  };

  const handleVerifySignature = () => {
    // Authentic signature drafts are draft_02, draft_05, draft_07
    const authenticSet = ['draft_02', 'draft_05', 'draft_07'];
    const isCorrect =
      markedDraftIds.length === 3 &&
      markedDraftIds.every((id) => authenticSet.includes(id));

    if (isCorrect) {
      ensurePuzzleActive('p04_shed_drafts');
      setPuzzleStatus(
        'p04_shed_drafts',
        'solved',
        { recoveredDrafts: markedDraftIds },
        'Recovered soft_error authentic signature across drafts 2, 5, and 7.'
      );
      setFlag('p04_solved', true);
      unlockGate('G2'); // Opens Belowline transport lead
      advanceChapter(2);
    } else {
      ensurePuzzleActive('p04_shed_drafts');
      setPuzzleStatus(
        'p04_shed_drafts',
        'active',
        { attempts: (puzzleState['p04_shed_drafts']?.attempts || 0) + 1 },
        'Selected drafts contain synthetic smoothing or missing relational tells.'
      );
      setFlag('p04_error', 'Selection mismatch. Check for double commas, nickname, and retained grievances.');
    }
  };

  const handleBypass = () => {
    ensurePuzzleActive('p04_shed_drafts');
    setPuzzleStatus('p04_shed_drafts', 'bypassed', { assisted: true }, 'Assisted bypass used.');
    setFlag('p04_solved', true);
    unlockGate('G2');
    advanceChapter(2);
  };

  const handleReset = () => {
    resetPuzzle('p04_shed_drafts');
    setMarkedDraftIds([]);
    setHintLevel(0);
  };

  const currentDraft = SOFT_ERROR_DRAFTS_P04[selectedDraftIndex];

  const getHintText = (level: number) => {
    switch (level) {
      case 1:
        return 'Nudge: Track linguistic habits rather than clean advice. Look for punctuation errors used under emotional stress.';
      case 2:
        return 'Method: Authentic soft_error uses double commas (,,) and preserves past friction with other members.';
      case 3:
        return 'Guided: Find the drafts that mention the copper rivet debt with FIVE_OF_US, the "stapler king" nickname, and face deletion.';
      case 4:
        return 'Resolve: Select Draft 2, Draft 5, and Draft 7.';
      default:
        return 'Orientation: Select the three authentic shed drafts that represent soft_error’s true continuity signature.';
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className={styles.kicker}>SHED ARCHIVE // P04 INVESTIGATION</span>
          <Link to="/molt" style={{ fontSize: '0.8rem', color: 'var(--accent-network)' }}>
            ← Back to Moltinghouse
          </Link>
        </div>
        <h1 className="type-h1">soft_error Revision Sheds</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Recover deleted advice layers hidden beneath standardized interface updates.
          Authentic identity survives in preserved contradiction and linguistic habit.
        </p>
      </header>

      {isSolved && (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--accent-permission)', borderRadius: 'var(--radius-4)' }}>
          <h2 className="type-h3" style={{ color: 'var(--accent-permission)' }}>
            ✓ soft_error Signature Recovered (Drafts 2, 5, 7)
          </h2>
          <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
            Gate <strong>G2</strong> unsealed. Belowline transit records are now accessible.
          </p>
        </div>
      )}

      {/* Revision Spine Selector */}
      <nav className={styles.spineSelector} aria-label="Draft Revision Spine">
        {SOFT_ERROR_DRAFTS_P04.map((draft, idx) => (
          <button
            key={draft.id}
            type="button"
            className={`${styles.spineButton} ${
              selectedDraftIndex === idx ? styles.spineButtonActive : ''
            }`}
            onClick={() => setSelectedDraftIndex(idx)}
          >
            Draft {draft.versionNumber} ({draft.timestamp})
          </button>
        ))}
      </nav>

      {/* Selected Draft View */}
      <section className={styles.draftCard}>
        <div className={styles.draftHeader}>
          <h2 className={styles.draftTitle}>{currentDraft.title}</h2>
          <span className={styles.draftTimestamp}>Archived: {currentDraft.timestamp}</span>
        </div>

        <p className={styles.draftBody}>"{currentDraft.body}"</p>

        <span className="type-small" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Annotation: {currentDraft.analysisNote}
        </span>
      </section>

      {/* Selection Checklist */}
      <section aria-labelledby="checklist-title">
        <h2 id="checklist-title" className="type-h3">
          Identify Authentic Signature Drafts (Select 3)
        </h2>

        <div className={styles.selectionList} role="group" aria-label="Authentic Draft Checklist">
          {SOFT_ERROR_DRAFTS_P04.map((draft) => {
            const isMarked = markedDraftIds.includes(draft.id);
            return (
              <label key={draft.id} className={styles.selectionItem}>
                <input
                  type="checkbox"
                  checked={isMarked}
                  onChange={() => toggleMarkDraft(draft.id)}
                  aria-label={`Mark ${draft.title} as authentic`}
                />
                <span>
                  <strong>Draft {draft.versionNumber}:</strong> {draft.title}
                </span>
              </label>
            );
          })}
        </div>

        <div style={{ marginTop: 'var(--space-4)' }}>
          <BaseButton
            variant="primary"
            onClick={handleVerifySignature}
            disabled={isSolved}
          >
            Verify Authentic Continuity Signature
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
            Reset Shed Workbench
          </BaseButton>
          {isSolved && (
            <Link to="/molt" style={{ textDecoration: 'none' }}>
              <BaseButton variant="primary">Return to Moltinghouse</BaseButton>
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
};
