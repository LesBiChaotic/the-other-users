/**
 * The Final Permission (P17: Ending Commitment Contract) — The Other Users
 * 
 * Generates the solemn threshold contract determining what crosses from
 * network model into physical reality and commits one of the six canonical endings.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import styles from './FinalPermission.module.css';
import { CANONICAL_ENDINGS } from '../../content/fixtures/convergenceContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const FinalPermission: React.FC = () => {
  const navigate = useNavigate();
  const gameState = useGameStore((s) => s.gameState);
  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const setFlag = useGameStore((s) => s.setFlag);

  // Available ending routes evaluation
  const hasCountermodel = (gameState.flags['countermodel_strength'] as number || 0) >= 3 || gameState.flags['countermodel_ready'];
  const hasIlyr = Boolean(gameState.flags['ilyr_freed']);

  const [selectedEndingId, setSelectedEndingId] = useState<string>(
    hasCountermodel ? 'END-CHORUS' : hasIlyr ? 'END-MOD' : 'END-ORDINARY'
  );
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const currentEnding = CANONICAL_ENDINGS[selectedEndingId] || CANONICAL_ENDINGS['END-CHORUS'];

  const ensurePuzzleActive = (puzzleId: string) => {
    const status = useGameStore.getState().puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const handleCommitEnding = () => {
    ensurePuzzleActive('p17_final_permission');
    setPuzzleStatus(
      'p17_final_permission',
      'solved',
      { chosenEnding: selectedEndingId },
      `Committed final permission for ending: ${selectedEndingId}`
    );
    setFlag('ending_id', selectedEndingId);
    setFlag('ending_seen', true);
    setShowConfirmModal(false);
    navigate(`/epilogue/${selectedEndingId}`);
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className={styles.kicker}>THE FINAL PERMISSION // P17 FINALE</span>
          <Link to="/convergence" style={{ fontSize: '0.8rem', color: 'var(--accent-network)' }}>
            ← Back to Assembly
          </Link>
        </div>
        <h1 className="type-h1">The Final Permission Contract</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Determine what may cross from network model into physical reality and under whose
          continuing consent. Review the ideological and material consequence before committing.
        </p>
      </header>

      {/* Contract Sheet */}
      <section className={styles.contractSheet} aria-labelledby="sheet-title">
        <h2 id="sheet-title" className="type-h3">
          Select Embodiment & Resolution Route
        </h2>

        {/* Ending Selection Radio Group */}
        <div className={styles.endingSelectGroup} role="radiogroup" aria-label="Ending Options">
          {/* 1. END-CHORUS */}
          <div
            className={`${styles.endingOption} ${selectedEndingId === 'END-CHORUS' ? styles.endingOptionSelected : ''}`}
            onClick={() => hasCountermodel && setSelectedEndingId('END-CHORUS')}
            role="radio"
            aria-checked={selectedEndingId === 'END-CHORUS'}
            tabIndex={0}
            style={{ opacity: hasCountermodel ? 1 : 0.5 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 className="type-h3">1. The Chorus of Difference (Living Witnesses)</h3>
              <span className="type-mono" style={{ fontSize: '0.75rem', color: hasCountermodel ? 'var(--accent-permission)' : 'var(--text-muted)' }}>
                {hasCountermodel ? 'AVAILABLE (P16 SOLVED)' : 'LOCKED (REQUIRES ≥3 WITNESSES)'}
              </span>
            </div>
            <p className="type-small">
              Maintain contradictory witness definitions. Universal model collapses; Palinode survives politically unstable and alive.
            </p>
          </div>

          {/* 2. END-ORDINARY */}
          <div
            className={`${styles.endingOption} ${selectedEndingId === 'END-ORDINARY' ? styles.endingOptionSelected : ''}`}
            onClick={() => setSelectedEndingId('END-ORDINARY')}
            role="radio"
            aria-checked={selectedEndingId === 'END-ORDINARY'}
            tabIndex={0}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 className="type-h3">2. A Perfectly Ordinary Person (Universal Harmonization)</h3>
              <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-permission)' }}>
                AVAILABLE
              </span>
            </div>
            <p className="type-small">
              Surrender private difference to become the universal human template. Friction and misunderstanding cease permanently.
            </p>
          </div>

          {/* 3. END-MOD */}
          <div
            className={`${styles.endingOption} ${selectedEndingId === 'END-MOD' ? styles.endingOptionSelected : ''}`}
            onClick={() => hasIlyr && setSelectedEndingId('END-MOD')}
            role="radio"
            aria-checked={selectedEndingId === 'END-MOD'}
            tabIndex={0}
            style={{ opacity: hasIlyr ? 1 : 0.5 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 className="type-h3">3. The Moderator’s Exception (Accountable Compromise)</h3>
              <span className="type-mono" style={{ fontSize: '0.75rem', color: hasIlyr ? 'var(--accent-permission)' : 'var(--text-muted)' }}>
                {hasIlyr ? 'AVAILABLE (ILYR FREED)' : 'LOCKED (REQUIRES ILYR RELEASE)'}
              </span>
            </div>
            <p className="type-small">
              Bind Ilyr and the Common Body into an accountable threshold entity requiring multi-species consent every evening.
            </p>
          </div>

          {/* 4. END-CLOSED */}
          <div
            className={`${styles.endingOption} ${selectedEndingId === 'END-CLOSED' ? styles.endingOptionSelected : ''}`}
            onClick={() => setSelectedEndingId('END-CLOSED')}
            role="radio"
            aria-checked={selectedEndingId === 'END-CLOSED'}
            tabIndex={0}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 className="type-h3">4. The Closed Tab (Network Severance)</h3>
              <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-permission)' }}>
                AVAILABLE
              </span>
            </div>
            <p className="type-small">
              Sever all human-accessible routes and seal infrastructure. You return to an ordinary internet.
            </p>
          </div>

          {/* 5. END-MANY */}
          <div
            className={`${styles.endingOption} ${selectedEndingId === 'END-MANY' ? styles.endingOptionSelected : ''}`}
            onClick={() => setSelectedEndingId('END-MANY')}
            role="radio"
            aria-checked={selectedEndingId === 'END-MANY'}
            tabIndex={0}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 className="type-h3">5. Many Bodies, No Network (Protocol Collapse)</h3>
              <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-permission)' }}>
                AVAILABLE
              </span>
            </div>
            <p className="type-small">
              Destroy physical assembly by collapsing Palinode’s shared network protocols. Communities become isolated islands.
            </p>
          </div>

          {/* 6. END-NOTFOUND */}
          <div
            className={`${styles.endingOption} ${selectedEndingId === 'END-NOTFOUND' ? styles.endingOptionSelected : ''}`}
            onClick={() => setSelectedEndingId('END-NOTFOUND')}
            role="radio"
            aria-checked={selectedEndingId === 'END-NOTFOUND'}
            tabIndex={0}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 className="type-h3">6. User Not Found (Headless Reference Model)</h3>
              <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-permission)' }}>
                AVAILABLE
              </span>
            </div>
            <p className="type-small">
              Subordinate individual agency to automated network replication. Your account posts endless automated replies.
            </p>
          </div>
        </div>

        {/* Dynamic Contract Clauses Preview */}
        <div className={styles.clauseList}>
          <h3 className="type-h3">Active Permission Provisions for: {currentEnding.title}</h3>

          <div className={styles.clauseItem}>
            <strong>Scope & Embodiment Target:</strong> {currentEnding.conditionDescription}
          </div>

          <div className={styles.clauseItem}>
            <strong>Witness Requirement:</strong>{' '}
            {selectedEndingId === 'END-CHORUS'
              ? 'Multi-species contradictory consensus verified.'
              : selectedEndingId === 'END-MOD'
              ? 'Reciprocal nightly threshold validation under MOURNINGSTAR.'
              : 'Unilateral or automated administrative mandate.'}
          </div>

          <div className={styles.previewBox}>
            <strong>Epilogue Narrative Preview:</strong>
            <p style={{ marginTop: '4px' }}>"{currentEnding.baseCopy}"</p>
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-2)' }}>
          <BaseButton
            variant="primary"
            onClick={() => setShowConfirmModal(true)}
          >
            Finalize & Commit Permission Agreement: {currentEnding.title}
          </BaseButton>
        </div>
      </section>

      {/* Irreversible Confirmation Modal */}
      {showConfirmModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
            zIndex: 1000,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          <div
            style={{
              backgroundColor: 'var(--bg-paper)',
              border: '2px solid var(--accent-warning)',
              borderRadius: 'var(--radius-4)',
              maxWidth: '480px',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <h2 id="confirm-modal-title" className="type-h2" style={{ color: 'var(--accent-warning)' }}>
              ⚠ Irreversible Narrative Resolution
            </h2>
            <p className="type-body">
              You are committing to <strong>{currentEnding.title}</strong>. This will conclude your
              investigation and resolve the permanent fate of Palinode and its communities.
            </p>
            <p className="type-small" style={{ color: 'var(--text-muted)' }}>
              {currentEnding.profileEpilogue}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <BaseButton onClick={() => setShowConfirmModal(false)}>
                Return to Review
              </BaseButton>
              <BaseButton variant="primary" onClick={handleCommitEnding}>
                Confirm & Seal Permission
              </BaseButton>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
