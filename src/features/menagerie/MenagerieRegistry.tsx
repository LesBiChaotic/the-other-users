import React, { useState } from 'react';
import { Link } from 'react-router';
import styles from './MenagerieRegistry.module.css';
import { MENAGERIE_REGISTRY_ENTRIES } from '../../content/fixtures/menagerieContent';
import { BaseButton } from '../../components/primitives/BaseButton';
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
          {MENAGERIE_REGISTRY_ENTRIES.map((entry) => {
            const isO07 = entry.id === 'MEN-008';
            const isO08 = entry.id === 'MEN-009';

            return (
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

                {/* O07 Habitat Triage Workbench */}
                {isO07 && <MenagerieHabitatTriageWorkbench />}

                {/* O08 Rookery Lost-Word Recovery Workbench */}
                {isO08 && <RookeryLostWordWorkbench />}
              </li>
            );
          })}
        </ul>
      </section>
    </article>
  );
};

const MenagerieHabitatTriageWorkbench: React.FC = () => {
  const [selectedTriage, setSelectedTriage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);
  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const setFlag = useGameStore((s) => s.setFlag);
  const changeReputation = useGameStore((s) => s.changeReputation);

  const isSolved = Boolean(puzzleState['o07_menagerie_habitat_triage']?.status === 'solved' || gameState.flags['o07_solved']);

  const ensurePuzzleActive = (puzzleId: string) => {
    const status = useGameStore.getState().puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const handleTriage = (choice: string) => {
    setSelectedTriage(choice);
    if (choice === 'dampen_and_humidify') {
      ensurePuzzleActive('o07_menagerie_habitat_triage');
      setPuzzleStatus('o07_menagerie_habitat_triage', 'solved', { triage: choice }, 'Stabilized Chalk Choir habitat.');
      setFlag('o07_solved', true);
      changeReputation('menagerie_directorate', 10);
      setFeedback('✓ Enclosure H-03 stabilized! Dampened 60Hz resonance; +10 Directorate audit trust.');
    } else {
      setFeedback('Triage failure: Dry forced heat causes limestone spalling and chokes choral resonance.');
    }
  };

  return (
    <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <p className="type-small" style={{ fontWeight: 700 }}>
        O07 // Habitat Calibration for Chalk Choir:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <BaseButton
          variant={selectedTriage === 'dampen_and_humidify' ? 'primary' : 'default'}
          onClick={() => handleTriage('dampen_and_humidify')}
          disabled={isSolved}
        >
          Calibrate: Dampen 60Hz hum & stabilize mineral humidity
        </BaseButton>

        <BaseButton
          variant={selectedTriage === 'dry_forced_heat' ? 'primary' : 'default'}
          onClick={() => handleTriage('dry_forced_heat')}
          disabled={isSolved}
        >
          Standard Human HVAC: Increase dry forced air circulation
        </BaseButton>
      </div>

      {feedback && (
        <p className="type-small" style={{ color: isSolved ? 'var(--accent-permission)' : 'var(--accent-warning)', fontWeight: 700 }}>
          {feedback}
        </p>
      )}
    </div>
  );
};

const RookeryLostWordWorkbench: React.FC = () => {
  const [selectedDeEmphasis, setSelectedDeEmphasis] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);
  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const setFlag = useGameStore((s) => s.setFlag);
  const changeReputation = useGameStore((s) => s.changeReputation);

  const isSolved = Boolean(puzzleState['o08_rookery_lost_word']?.status === 'solved' || gameState.flags['o08_solved']);

  const ensurePuzzleActive = (puzzleId: string) => {
    const status = useGameStore.getState().puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const handleDeEmphasis = (choice: string) => {
    setSelectedDeEmphasis(choice);
    if (choice === 'peripheral_de_emphasis') {
      ensurePuzzleActive('o08_rookery_lost_word');
      setPuzzleStatus('o08_rookery_lost_word', 'solved', { deEmphasis: choice }, 'Recovered peripheral audio word: REFUSAL.');
      setFlag('o08_solved', true);
      changeReputation('human_observation_guild', 10);
      setFeedback('✓ Lost word recovered: "REFUSAL"! +10 Observation Guild trust awarded.');
    } else {
      setFeedback('Signal loss: Direct center amplification drowns out peripheral phonetic whispers.');
    }
  };

  return (
    <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <p className="type-small" style={{ fontWeight: 700 }}>
        O08 // Audio Salvage De-emphasis Filter:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <BaseButton
          variant={selectedDeEmphasis === 'peripheral_de_emphasis' ? 'primary' : 'default'}
          onClick={() => handleDeEmphasis('peripheral_de_emphasis')}
          disabled={isSolved}
        >
          Side-Channel Filter: Apply peripheral acoustic de-emphasis
        </BaseButton>

        <BaseButton
          variant={selectedDeEmphasis === 'center_boost' ? 'primary' : 'default'}
          onClick={() => handleDeEmphasis('center_boost')}
          disabled={isSolved}
        >
          Center Boost: Maximize primary microphone gain
        </BaseButton>
      </div>

      {feedback && (
        <p className="type-small" style={{ color: isSolved ? 'var(--accent-permission)' : 'var(--accent-warning)', fontWeight: 700 }}>
          {feedback}
        </p>
      )}
    </div>
  );
};
