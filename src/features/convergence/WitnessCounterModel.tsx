/**
 * Living Witness Counter-Model Assembly (P16: Definitions of a Human) — The Other Users
 * 
 * Assembles irreconcilable living witness definitions from distinct sensory families
 * to break Common Body compression and unlock The Chorus of Difference ending.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import styles from './WitnessCounterModel.module.css';
import { LIVING_WITNESSES_P16 } from '../../content/fixtures/convergenceContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const WitnessCounterModel: React.FC = () => {
  const [selectedWitnessIds, setSelectedWitnessIds] = useState<string[]>([]);
  const [hintLevel, setHintLevel] = useState<number>(0);

  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const unlockGate = useGameStore((s) => s.unlockGate);
  const advanceChapter = useGameStore((s) => s.advanceChapter);
  const setFlag = useGameStore((s) => s.setFlag);
  const resetPuzzle = useGameStore((s) => s.resetPuzzle);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);

  const isSolved = Boolean(puzzleState['p16_definitions_of_human']?.status === 'solved' || gameState.flags['countermodel_ready']);

  useEffect(() => {
    discoverEvidence('EV-017', 'Convergence Assembly Floor');
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

  // Evaluate individual witness eligibility based on past game choices
  const isWitnessEligible = (witId: string): { eligible: boolean; reason?: string } => {
    if (witId === 'wit_neverlookstraight') {
      if (gameState.flags['accused_wrong_user']) {
        return { eligible: false, reason: 'Alienated by un-repaired false accusation.' };
      }
      if (gameState.flags['bond_sacrificed']) {
        return { eligible: false, reason: 'Interpersonal memory bond was severed in Pale Market.' };
      }
      return { eligible: true };
    }
    if (witId === 'wit_soft_error') {
      return {
        eligible: Boolean(gameState.flags['p04_solved'] || puzzleState['p04_shed_drafts']?.status === 'solved'),
        reason: 'Requires soft_error authentic signature recovery (P04).',
      };
    }
    if (witId === 'wit_underplatform_9') {
      return {
        eligible: Boolean(gameState.flags['p07_solved'] || puzzleState['p07_forged_silence']?.status === 'solved'),
        reason: 'Requires Manifest 44 acoustic audit verification (P07).',
      };
    }
    if (witId === 'wit_room_tone') {
      return {
        eligible: Boolean(gameState.flags['p08_solved'] || puzzleState['p08_compatibility_not_sameness']?.status === 'solved'),
        reason: 'Requires ROOM_TONE resident recovery from Date C (P08).',
      };
    }
    if (witId === 'wit_porchlight_on') {
      return {
        eligible: Boolean(gameState.flags['ilyr_freed'] || puzzleState['p15_door_never_entered']?.status === 'solved'),
        reason: 'Requires MOURNINGSTAR threshold exit release (P15).',
      };
    }
    return { eligible: true };
  };

  const toggleSelectWitness = (witId: string) => {
    const status = isWitnessEligible(witId);
    if (!status.eligible) return;

    setSelectedWitnessIds((prev) =>
      prev.includes(witId) ? prev.filter((id) => id !== witId) : [...prev, witId]
    );
  };

  // Calculate unique sensory families in selection
  const uniqueFamiliesSelected = new Set(
    selectedWitnessIds.map((id) => {
      const w = LIVING_WITNESSES_P16.find((item) => item.id === id);
      return w?.familyId;
    })
  );

  const countermodelStrength = uniqueFamiliesSelected.size;

  const handleCommitCountermodel = () => {
    ensurePuzzleActive('p16_definitions_of_human');

    if (countermodelStrength >= 3) {
      // SUCCESSFUL COUNTER-MODEL (Chorus of Difference Unlocked)
      setPuzzleStatus(
        'p16_definitions_of_human',
        'solved',
        { selectedWitnesses: selectedWitnessIds, strength: countermodelStrength },
        `Assembled living counter-model from ${countermodelStrength} distinct sensory families.`
      );
      setFlag('p16_solved', true);
      setFlag('countermodel_ready', true);
      setFlag('countermodel_strength', countermodelStrength);
      unlockGate('G7');
      advanceChapter(8);
    } else {
      setPuzzleStatus(
        'p16_definitions_of_human',
        'active',
        { attempts: (puzzleState['p16_definitions_of_human']?.attempts || 0) + 1 },
        'Insufficient witness diversity. At least 3 distinct sensory families required.'
      );
    }
  };

  const handleBypass = () => {
    ensurePuzzleActive('p16_definitions_of_human');
    setPuzzleStatus('p16_definitions_of_human', 'bypassed', { assisted: true }, 'Assisted bypass used.');
    setFlag('p16_solved', true);
    setFlag('countermodel_ready', true);
    setFlag('countermodel_strength', 5);
    unlockGate('G7');
    advanceChapter(8);
  };

  const handleReset = () => {
    resetPuzzle('p16_definitions_of_human');
    setSelectedWitnessIds([]);
    setHintLevel(0);
  };

  const getHintText = (level: number) => {
    switch (level) {
      case 1:
        return 'Nudge: You are not seeking the single best definition of humanity. Contradiction requires living social weight.';
      case 2:
        return 'Method: Choose living witnesses from different sensory families whose perceptions cannot be reconciled.';
      case 3:
        return 'Guided: Select at least 3 eligible witnesses (e.g. neverlookstraight, soft_error, underplatform_9, ROOM_TONE).';
      case 4:
        return 'Resolve: Check all eligible witnesses and click "Commit Living Counter-Model".';
      default:
        return 'Orientation: Select living witnesses from distinct families. At least 3 are required to shatter the Common Body model.';
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className={styles.kicker}>CONVERGENCE FINALE // P16 COUNTER-MODEL</span>
          <Link to="/convergence" style={{ fontSize: '0.8rem', color: 'var(--accent-network)' }}>
            ← Back to Assembly
          </Link>
        </div>
        <h1 className="type-h1">Definitions of a Human</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Construct mutually valid, irreconcilable definitions of humanity from living witnesses.
          Living contradictions break the Common Body's compression algorithm.
        </p>
      </header>

      {isSolved && (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--accent-permission)', borderRadius: 'var(--radius-4)' }}>
          <h2 className="type-h3" style={{ color: 'var(--accent-permission)' }}>
            ✓ Counter-Model Ready ({countermodelStrength} / 5 Sensory Families)
          </h2>
          <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
            Evidence <strong>EV-017</strong> secured. <strong>The Chorus of Difference</strong> ending route is unlocked.
          </p>
        </div>
      )}

      {/* Counter-Model Strength Meter */}
      <section className={styles.strengthMeter} aria-label="Counter-Model Strength">
        <span>COUNTER-MODEL STRENGTH:</span>
        <span
          style={{
            color: countermodelStrength >= 3 ? 'var(--accent-permission)' : 'var(--accent-warning)',
            fontWeight: 700,
          }}
        >
          {countermodelStrength} / 5 DISTINCT SENSORY FAMILIES (MINIMUM 3 REQUIRED)
        </span>
      </section>

      {/* Living Witnesses List */}
      <section aria-labelledby="witnesses-title">
        <h2 id="witnesses-title" className="type-h3">
          Available Living Witness Statements
        </h2>

        <ul className={styles.witnessList} aria-label="Witness Statements">
          {LIVING_WITNESSES_P16.map((witness) => {
            const eligibility = isWitnessEligible(witness.id);
            const isSelected = selectedWitnessIds.includes(witness.id);

            return (
              <li
                key={witness.id}
                className={`${styles.witnessCard} ${isSelected ? styles.witnessCardSelected : ''} ${
                  !eligibility.eligible ? styles.witnessCardIneligible : ''
                }`}
              >
                <div className={styles.witnessHeader}>
                  <h3 className="type-h3">@{witness.userHandle}</h3>
                  <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-network)' }}>
                    Family: {witness.sensoryMode}
                  </span>
                </div>

                <blockquote className={styles.statementQuote}>
                  "{witness.definitionStatement}"
                </blockquote>

                {eligibility.eligible ? (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectWitness(witness.id)}
                      disabled={isSolved}
                      aria-label={`Include @${witness.userHandle} in Counter-Model`}
                    />
                    <span className="type-small" style={{ fontWeight: 700 }}>
                      {isSelected ? '✓ Included in Counter-Model' : 'Include This Witness'}
                    </span>
                  </label>
                ) : (
                  <span className="type-small" style={{ color: 'var(--accent-warning)', fontStyle: 'italic' }}>
                    Unavailable: {eligibility.reason}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <div style={{ marginTop: 'var(--space-4)' }}>
          <BaseButton
            variant="primary"
            onClick={handleCommitCountermodel}
            disabled={countermodelStrength < 3 || isSolved}
          >
            Commit Living Counter-Model ({countermodelStrength} / 5 Families)
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
            Reset Counter-Model
          </BaseButton>
          {isSolved && (
            <Link to="/convergence/permission" style={{ textDecoration: 'none' }}>
              <BaseButton variant="primary">Proceed to The Final Permission →</BaseButton>
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
};
