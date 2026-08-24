/**
 * Ilyr Threshold Procedure (P15: A Door Defined as Never Entered) — The Other Users
 * 
 * Executes the threshold exit protocol for Senior Moderator @MOURNINGSTAR.
 * Resolves the legal contradiction of unlawful occupancy without inventing false consent.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import styles from './IlyrThresholdProcedure.module.css';
import { ILYR_PROCEDURE_STEPS_P15 } from '../../content/fixtures/menagerieContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const IlyrThresholdProcedure: React.FC = () => {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState<number>(0);

  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const unlockGate = useGameStore((s) => s.unlockGate);
  const advanceChapter = useGameStore((s) => s.advanceChapter);
  const setFlag = useGameStore((s) => s.setFlag);
  const changeRelationship = useGameStore((s) => s.changeRelationship);
  const resetPuzzle = useGameStore((s) => s.resetPuzzle);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);

  const isSolved = Boolean(puzzleState['p15_door_never_entered']?.status === 'solved' || gameState.flags['p15_solved']);
  const isCompromised = gameState.flags['ilyr_ownership_compromised'] === true;

  useEffect(() => {
    discoverEvidence('EV-016', 'Threshold Moderation Procedural Log');
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

  const handleExecuteProcedure = (stepId: string) => {
    setSelectedStepId(stepId);
    ensurePuzzleActive('p15_door_never_entered');

    if (stepId === 'step_proc_correct') {
      // CANONICAL / CORRECT PROCEDURE
      setPuzzleStatus(
        'p15_door_never_entered',
        'solved',
        { procedure: 'corrective_admission_witnessed_exit', termsCompromised: false },
        'Admitted for correction and granted immediate witnessed exit under porchlight_ON.'
      );
      setFlag('p15_solved', true);
      setFlag('ilyr_freed', true);
      setFlag('ilyr_ownership_compromised', false);
      changeRelationship('usr_ilyr', 15);
      unlockGate('G6'); // Unlocks Convergence Finale
      advanceChapter(7);
    } else if (stepId === 'step_proc_compromised') {
      // COMPROMISED TERMS ROUTE
      setPuzzleStatus(
        'p15_door_never_entered',
        'solved',
        { procedure: 'terms_retroactive_rider', termsCompromised: true },
        'Ilyr freed physically, but ownership of exit procedure transferred to TermsMayApply.'
      );
      setFlag('p15_solved', true);
      setFlag('ilyr_freed', true);
      setFlag('ilyr_ownership_compromised', true);
      changeRelationship('usr_ilyr', -10);
      unlockGate('G6');
      advanceChapter(7);
    } else {
      // ERASURE / REWRITE ATTEMPT
      setPuzzleStatus(
        'p15_door_never_entered',
        'active',
        { attempts: (puzzleState['p15_door_never_entered']?.attempts || 0) + 1 },
        'Record erasure fatal contradiction: cannot purge active pressure witness.'
      );
    }
  };

  const handleBypass = () => {
    ensurePuzzleActive('p15_door_never_entered');
    setPuzzleStatus('p15_door_never_entered', 'bypassed', { assisted: true }, 'Assisted bypass used.');
    setFlag('p15_solved', true);
    setFlag('ilyr_freed', true);
    unlockGate('G6');
    advanceChapter(7);
  };

  const handleReset = () => {
    resetPuzzle('p15_door_never_entered');
    setSelectedStepId(null);
    setHintLevel(0);
  };

  const getHintText = (level: number) => {
    switch (level) {
      case 1:
        return 'Nudge: The legal contradiction must be acknowledged, not smoothed away.';
      case 2:
        return 'Method: A door cannot grant exit to a person it never admitted. Ilyr needs a legal present, not an invented past.';
      case 3:
        return 'Guided: Formally enter a time-bounded corrective admission voucher, then grant immediate witnessed exit under porchlight_ON.';
      case 4:
        return 'Resolve: Select "Acknowledge Unlawful Occupancy & Corrective Admission" and execute protocol.';
      default:
        return 'Orientation: Select the procedural protocol to release MOURNINGSTAR without compromising their personhood.';
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className={styles.kicker}>THRESHOLD MODERATION // P15 WORKBENCH</span>
          <Link to="/menagerie/ops" style={{ fontSize: '0.8rem', color: 'var(--accent-network)' }}>
            ← Back to Operations Console
          </Link>
        </div>
        <h1 className="type-h1">A Door Defined as Never Entered</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Procedural exit protocol for Senior Moderator @MOURNINGSTAR (Enclosure N-04).
          Release the occupant without inventing false consent or surrendering ownership to platform arbitration.
        </p>
      </header>

      {isSolved && (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--accent-permission)', borderRadius: 'var(--radius-4)' }}>
          <h2 className="type-h3" style={{ color: 'var(--accent-permission)' }}>
            ✓ MOURNINGSTAR Released from Enclosure N-04
          </h2>
          <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
            {isCompromised
              ? 'WARNING: Exit procedure ownership was transferred to TermsMayApply. Finale conditions altered.'
              : 'Corrective admission executed. Authentic Ilyr restored as an independent moderator. Gate G6 unsealed.'}
          </p>
        </div>
      )}

      {/* Door Timeline */}
      <section className={styles.doorTimeline} aria-labelledby="timeline-title">
        <h2 id="timeline-title" className="type-h3">
          Door-Shaped Procedural Timeline
        </h2>
        <div className={styles.timelineStep}>
          <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-network)' }}>
            1. ENTRY RECORD:
          </span>
          <p className="type-small">ABSENT (Directorate records deny admission occurred).</p>
        </div>
        <div className={styles.timelineStep}>
          <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-network)' }}>
            2. OCCUPANCY STATUS:
          </span>
          <p className="type-small">PROVEN (78.4 kg physical pressure pulses against doorframe).</p>
        </div>
        <div className={styles.timelineStep}>
          <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-network)' }}>
            3. PROCEDURAL CONTRADICTION:
          </span>
          <p className="type-small">Exit is prohibited because no admitted occupant exists.</p>
        </div>
      </section>

      {/* Procedure Options */}
      <section aria-labelledby="options-title">
        <h2 id="options-title" className="type-h3">
          Select Exit Protocol
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {ILYR_PROCEDURE_STEPS_P15.map((step) => {
            const isSelected = selectedStepId === step.id;
            return (
              <div
                key={step.id}
                className={`${styles.procedureCard} ${
                  isSelected && step.isCorrectProcedure ? styles.procedureCardSelected : ''
                } ${isSelected && step.isCompromisedTermsProcedure ? styles.procedureCardCompromised : ''}`}
              >
                <h3 className="type-h3">{step.title}</h3>
                <p className="type-body">{step.plainDescription}</p>

                <p className="type-small" style={{ color: 'var(--text-muted)' }}>
                  Legal Implication: {step.legalImplication}
                </p>

                <div style={{ marginTop: 'var(--space-2)' }}>
                  <BaseButton
                    variant={step.isCorrectProcedure ? 'primary' : 'default'}
                    onClick={() => handleExecuteProcedure(step.id)}
                    disabled={isSolved}
                  >
                    Execute This Exit Protocol
                  </BaseButton>
                </div>
              </div>
            );
          })}
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
            Reset Procedure
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
