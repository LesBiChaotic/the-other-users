/**
 * FIVE_OF_US Plural Timeline (P05: One Moderator, Several Bodies) — The Other Users
 * 
 * Analyzes five-voice transcript and repair telemetry to identify internal
 * ideological division vs external account replacement.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import styles from './FiveOfUsThread.module.css';
import { FIVE_OF_US_VOICES_P05 } from '../../content/fixtures/moltinghouseContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const FiveOfUsThread: React.FC = () => {
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');
  const [hintLevel, setHintLevel] = useState<number>(0);

  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const updateProfile = useGameStore((s) => s.updateProfile);
  const setFlag = useGameStore((s) => s.setFlag);
  const changeRelationship = useGameStore((s) => s.changeRelationship);
  const resetPuzzle = useGameStore((s) => s.resetPuzzle);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);
  const playerProfile = useGameStore((s) => s.playerProfile);

  const isSolved = Boolean(puzzleState['p05_plural_bodies']?.status === 'solved' || gameState.flags['p05_solved']);
  const isFalseReport = gameState.flags['p05_false_report'] === true;

  useEffect(() => {
    discoverEvidence('EV-006', 'Belowline Annex N Repair Log');
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

  const handleActionDecision = (choice: 'consent_protocol' | 'report_replacement') => {
    if (choice === 'consent_protocol') {
      // CANONICAL / CORRECT CHOICE
      ensurePuzzleActive('p05_plural_bodies');
      setPuzzleStatus(
        'p05_plural_bodies',
        'solved',
        { action: 'request_consent_protocol' },
        'Recognized plural personhood and internal division.'
      );
      setFlag('p05_solved', true);
      setFlag('p05_false_report', false);
      changeRelationship('usr_fiv', 15);

      updateProfile({
        pluralityScore: (playerProfile.pluralityScore || 15) + 15,
        revisions: [
          {
            chapter: 2,
            timestamp: Date.now(),
            summary: 'P05 Resolved: Affirmed FIVE_OF_US plural personhood and requested internal consent protocol.',
            traits: {
              pluralityUnderstood: 'AFFIRMED',
            },
          },
        ],
      });
    } else {
      // FALSE REPORT CHOICE
      ensurePuzzleActive('p05_plural_bodies');
      setPuzzleStatus(
        'p05_plural_bodies',
        'active',
        { falseReport: 'replacement_filed' },
        'Mistook internal dissent for account compromise.'
      );
      setFlag('p05_false_report', true);
      changeRelationship('usr_fiv', -15);
    }
  };

  const handleBypass = () => {
    ensurePuzzleActive('p05_plural_bodies');
    setPuzzleStatus('p05_plural_bodies', 'bypassed', { assisted: true }, 'Assisted bypass used.');
    setFlag('p05_solved', true);
  };

  const handleReset = () => {
    resetPuzzle('p05_plural_bodies');
    setHintLevel(0);
  };

  const filteredVoices =
    selectedUnitFilter === 'all'
      ? FIVE_OF_US_VOICES_P05
      : FIVE_OF_US_VOICES_P05.filter((v) => v.unitId === selectedUnitFilter);

  const getHintText = (level: number) => {
    switch (level) {
      case 1:
        return 'Nudge: Do not assume disagreement between units means account replacement.';
      case 2:
        return 'Method: Review the telemetry. Were all five units physically co-present on site carrying solder?';
      case 3:
        return 'Guided: Unit Five has dissenting political views, but the person is still five co-present workers. Choose the consent protocol.';
      case 4:
        return 'Resolve: Select "Request Internal Consent Protocol". Do not report account replacement.';
      default:
        return 'Orientation: Align the five unit voices with repair telemetry to determine if FIVE_OF_US is replaced or internally divided.';
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className={styles.kicker}>CHORAL TELEMETRY // P05 INVESTIGATION</span>
          <Link to="/molt" style={{ fontSize: '0.8rem', color: 'var(--accent-network)' }}>
            ← Back to Moltinghouse
          </Link>
        </div>
        <h1 className="type-h1">FIVE_OF_US: One Moderator, Several Bodies</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Five hand-sized bodies, one repair cooperative. Review repair logs and message telemetry
          to determine whether dissent constitutes account compromise or authentic plural personhood.
        </p>
      </header>

      {isSolved && (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--accent-network)', borderRadius: 'var(--radius-4)' }}>
          <h2 className="type-h3" style={{ color: 'var(--accent-network)' }}>
            ✓ Plural Personhood Affirmed: Internal Consent Protocol Initiated
          </h2>
          <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
            Plurality score increased (+15%). FIVE_OF_US remains an ally in later repair procedures.
          </p>
        </div>
      )}

      {isFalseReport && !isSolved && (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface)', borderLeft: '4px solid var(--accent-warning)', borderRadius: 'var(--radius-4)' }}>
          <h2 className="type-h3" style={{ color: 'var(--accent-warning)' }}>
            Harmful Misclassification: Plural Trust Damaged
          </h2>
          <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
            Reporting replacement penalized legitimate internal dissent. FIVE_OF_US has restricted repair access.
          </p>
        </div>
      )}

      {/* Filter by Unit */}
      <section className={styles.voiceFilterBar} aria-label="Filter by Unit Voice">
        <button
          type="button"
          className={`${styles.filterButton} ${selectedUnitFilter === 'all' ? styles.filterButtonActive : ''}`}
          onClick={() => setSelectedUnitFilter('all')}
        >
          Combined Transcript (All 5)
        </button>
        {['unit_1', 'unit_2', 'unit_3', 'unit_4', 'unit_5'].map((uId, idx) => (
          <button
            key={uId}
            type="button"
            className={`${styles.filterButton} ${selectedUnitFilter === uId ? styles.filterButtonActive : ''}`}
            onClick={() => setSelectedUnitFilter(uId)}
          >
            Unit {idx + 1}
          </button>
        ))}
      </section>

      {/* Transcript List */}
      <ul className={styles.transcriptList} aria-label="Chronological Transcript">
        {filteredVoices.map((voice) => (
          <li
            key={voice.id}
            className={`${styles.transcriptItem} ${
              voice.isSingularLanguage ? styles.transcriptItemSingular : ''
            }`}
          >
            <div className={styles.voiceMeta}>
              <span className={styles.unitName}>{voice.unitName}</span>
              <span>{voice.timestamp}</span>
            </div>

            <p className={styles.voiceBody}>"{voice.body}"</p>

            <span className={styles.telemetryTag}>
              Telemetry: {voice.telemetryAction}
            </span>
          </li>
        ))}
      </ul>

      {/* Decision Section */}
      <section className={styles.decisionBox} aria-labelledby="decision-title">
        <h2 id="decision-title" className="type-h3">
          Investigation Decision: Plural Personhood vs Account Compromise
        </h2>
        <p className="type-body">
          Telemetry confirms all 5 units are physically co-present, but Unit Five expresses
          desire for individual standardization. What is the appropriate protocol?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <BaseButton
            variant="primary"
            onClick={() => handleActionDecision('consent_protocol')}
            disabled={isSolved}
          >
            Request Internal Consent Protocol (Recognize Plural Personhood)
          </BaseButton>

          <BaseButton
            variant="danger"
            onClick={() => handleActionDecision('report_replacement')}
            disabled={isSolved}
          >
            Report Account Replacement (Treat Dissent as Compromise)
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
            Reset Investigation
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
