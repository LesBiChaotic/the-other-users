/**
 * Memory Removal Exchange (P11: The Neighboring Memory) — The Other Users
 * 
 * Interactive consultation with @unremember_me. Previews exact costs before
 * removing the Common Body's predictive model of the player.
 */

import React, { useState } from 'react';
import { Link } from 'react-router';
import styles from './MemoryRemoval.module.css';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const MemoryRemoval: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<'escrow' | 'sacrifice' | 'refuse' | null>(null);
  const [hintLevel, setHintLevel] = useState<number>(0);

  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const advanceChapter = useGameStore((s) => s.advanceChapter);
  const setFlag = useGameStore((s) => s.setFlag);
  const changeRelationship = useGameStore((s) => s.changeRelationship);
  const resetPuzzle = useGameStore((s) => s.resetPuzzle);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);

  const isSolved = Boolean(puzzleState['p11_neighboring_memory']?.status === 'solved' || gameState.flags['p11_solved']);

  const ensurePuzzleActive = (puzzleId: string) => {
    const status = puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const handleExecuteRoute = (route: 'escrow' | 'sacrifice' | 'refuse') => {
    setSelectedRoute(route);
    ensurePuzzleActive('p11_neighboring_memory');

    if (route === 'escrow') {
      // ARCHIVORE ESCROW ROUTE (Canonical balanced choice)
      setPuzzleStatus(
        'p11_neighboring_memory',
        'solved',
        { route: 'archivore_escrow' },
        'Memory deposited in cold storage with ARCHIVE_OF_TUESDAY.'
      );
      setFlag('p11_solved', true);
      setFlag('archive_escrow', true);
      setFlag('player_model_weakened', true);
      discoverEvidence('EV-012', 'unremember_me Archivore escrow receipt');
      changeRelationship('usr_unr', 10);
      advanceChapter(5);
    } else if (route === 'sacrifice') {
      // DIRECT SACRIFICE ROUTE
      setPuzzleStatus(
        'p11_neighboring_memory',
        'solved',
        { route: 'bond_sacrificed' },
        'Memory bond severed; warmth erased from neighboring witness.'
      );
      setFlag('p11_solved', true);
      setFlag('bond_sacrificed', true);
      setFlag('player_model_weakened', true);
      discoverEvidence('EV-012', 'unremember_me severance receipt');
      changeRelationship('usr_nvr', -15);
      advanceChapter(5);
    } else {
      // REFUSAL ROUTE
      setPuzzleStatus(
        'p11_neighboring_memory',
        'solved',
        { route: 'transaction_refused' },
        'Refused memory pruning; preserved all interpersonal bonds.'
      );
      setFlag('p11_solved', true);
      setFlag('memory_prune_refused', true);
      discoverEvidence('EV-012', 'unremember_me refusal ledger');
      advanceChapter(5);
    }
  };

  const handleBypass = () => {
    ensurePuzzleActive('p11_neighboring_memory');
    setPuzzleStatus('p11_neighboring_memory', 'bypassed', { assisted: true }, 'Assisted bypass used.');
    setFlag('p11_solved', true);
    discoverEvidence('EV-012', 'Assisted unremember_me exchange');
    advanceChapter(5);
  };

  const handleReset = () => {
    resetPuzzle('p11_neighboring_memory');
    setSelectedRoute(null);
    setHintLevel(0);
  };

  const getHintText = (level: number) => {
    switch (level) {
      case 1:
        return 'Nudge: This is an ethical cost decision rather than a combination lock.';
      case 2:
        return 'Method: Review the consequence of each option. Escrow preserves facts while isolating the model.';
      case 3:
        return 'Guided: Archivore escrow creates a safe third path that avoids emotional bond destruction.';
      case 4:
        return 'Resolve: Choose Archivore Escrow, Sacrifice Bond, or Refuse Transaction to commit.';
      default:
        return 'Orientation: Choose how to handle your behavioural profile without unconsented collateral loss.';
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className={styles.kicker}>PALE MARKET // P11 WORKBENCH</span>
          <Link to="/market" style={{ fontSize: '0.8rem', color: 'var(--accent-network)' }}>
            ← Back to Market
          </Link>
        </div>
        <h1 className="type-h1">The Neighboring Memory</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Consultation with Kindly Thief @unremember_me. Every memory removal inevitably takes
          one neighboring association.
        </p>
      </header>

      {isSolved && (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--accent-permission)', borderRadius: 'var(--radius-4)' }}>
          <h2 className="type-h3" style={{ color: 'var(--accent-permission)' }}>
            ✓ Memory Transaction Resolved ({selectedRoute ? selectedRoute.toUpperCase() : 'RESOLVED'})
          </h2>
          <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
            Evidence <strong>EV-012</strong> logged. Relationship consequences applied.
          </p>
        </div>
      )}

      {/* Vendor Quote */}
      <blockquote className={styles.vendorSpeech}>
        "I can shear away the Common Body’s behavioural model of your habits. But memory is woven,
        not stacked. If I cut the model, the shears will also take the warmth connecting you to
        one witness. There are no clean cuts in memory."
        <footer style={{ marginTop: 'var(--space-2)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          — @unremember_me, Kindly Thief
        </footer>
      </blockquote>

      {/* Memory Dependency Graph */}
      <section className={styles.graphDependencyCard} aria-labelledby="dep-title">
        <h2 id="dep-title" className="type-h3">
          Memory Dependency Map (Collateral Preview)
        </h2>
        <div className="type-small" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <p><strong>Primary Target:</strong> Common Body Predictive Model (Human Habit Matrix)</p>
          <p><strong>Adjacent Edge 1:</strong> neverlookstraight Photography Bond (Trust & Recognition)</p>
          <p><strong>Adjacent Edge 2:</strong> Provisional Species Verification Record</p>
        </div>
      </section>

      {/* Decision Options */}
      <section aria-labelledby="choice-title">
        <h2 id="choice-title" className="type-h3">
          Select Transaction Protocol
        </h2>

        <div className={styles.decisionList}>
          {/* Option 1: Escrow */}
          <div className={styles.decisionOption}>
            <h3 className="type-h3" style={{ color: 'var(--accent-permission)' }}>
              1. Deposit in Archivore Escrow (@ARCHIVE_OF_TUESDAY)
            </h3>
            <p className="type-small">
              Deposits the memory in sealed cold storage. Shields you from predictive targeting
              while preserving historical evidence without emotional erasure.
            </p>
            <BaseButton
              variant="primary"
              onClick={() => handleExecuteRoute('escrow')}
              disabled={isSolved}
            >
              Authorize Archivore Escrow (Safe Compromise)
            </BaseButton>
          </div>

          {/* Option 2: Sacrifice */}
          <div className={styles.decisionOption}>
            <h3 className="type-h3" style={{ color: 'var(--accent-warning)' }}>
              2. Sever Model and Sacrifice Adjacent Bond
            </h3>
            <p className="type-small">
              Permanently expunges the model. @neverlookstraight will remember meeting you, but
              the protective warmth that made them care will be lost.
            </p>
            <BaseButton
              variant="danger"
              onClick={() => handleExecuteRoute('sacrifice')}
              disabled={isSolved}
            >
              Sever Model & Accept Bond Loss
            </BaseButton>
          </div>

          {/* Option 3: Refuse */}
          <div className={styles.decisionOption}>
            <h3 className="type-h3">
              3. Refuse the Shears (Preserve All Bonds)
            </h3>
            <p className="type-small">
              Walk away from the transaction. The Common Body model remains active, but no
              friendships or memories are harmed.
            </p>
            <BaseButton
              onClick={() => handleExecuteRoute('refuse')}
              disabled={isSolved}
            >
              Refuse Transaction & Retain Memory
            </BaseButton>
          </div>
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
            Reset Consultation
          </BaseButton>
          {isSolved && (
            <Link to="/market" style={{ textDecoration: 'none' }}>
              <BaseButton variant="primary">Return to Market</BaseButton>
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
};
