/**
 * ROOM_TONE Case (P08: Compatibility Is Not Sameness) — The Other Users
 * 
 * Investigates the fragmentation of Apartment Choir @ROOM_TONE from 12 residents to 9.
 * Identifies Date C as a Communion collection event masquerading as a perfect match.
 */

import React, { useState } from 'react';
import { Link } from 'react-router';
import styles from './RoomToneCase.module.css';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

interface DateRecord {
  id: string;
  label: string;
  venue: string;
  claimedCompatibility: string;
  separationClause: string;
  checkoutStatus: string;
  isDateC: boolean;
  notes: string;
}

const DATE_RECORDS: DateRecord[] = [
  {
    id: 'date_a',
    label: 'Date A // Amber Streetlamp Walk',
    venue: 'Threshold Terrace',
    claimedCompatibility: 'Negotiated (Light tolerance conflict addressed)',
    separationClause: 'Active (Separation executed at 23:15)',
    checkoutStatus: 'All 12 residents confirmed checked out',
    isDateC: false,
    notes: 'Normal awkward date; light preferences differed but safety preserved.',
  },
  {
    id: 'date_b',
    label: 'Date B // Closet Acoustic Session',
    venue: 'Lichen & Loom Pantry',
    claimedCompatibility: 'Negotiated (High humidity boundary set)',
    separationClause: 'Active (Separation executed at 01:00)',
    checkoutStatus: 'All 12 residents confirmed checked out',
    isDateC: false,
    notes: 'Slight acoustic friction, no loss of personhood.',
  },
  {
    id: 'date_c',
    label: 'Date C // "Universal Harmonic Resonance"',
    venue: 'calmly_complete_venue (Communion Concourse)',
    claimedCompatibility: '100% Universal (No conflicts, boundaries optimized away)',
    separationClause: 'OMITTED ("Emergency separation unnecessary in complete harmony")',
    checkoutStatus: 'DISPUTED: Only 1 resident checked out; 3 residents missing from chorus',
    isDateC: true,
    notes: 'Critical Anomaly: Zero conflict claim preceded profile revision from 12 to 9 voices.',
  },
  {
    id: 'date_d',
    label: 'Date D // Post-Fragmentation Rehearsal',
    venue: 'Basement Echo Chamber',
    claimedCompatibility: 'Strained (Low harmonic volume)',
    separationClause: 'Active (Separation executed at 22:30)',
    checkoutStatus: '9 remaining residents checked out',
    isDateC: false,
    notes: 'Choir singing with missing registers after Date C collection.',
  },
];

export const RoomToneCase: React.FC = () => {
  const [selectedDateId, setSelectedDateId] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState<number>(0);

  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const advanceChapter = useGameStore((s) => s.advanceChapter);
  const setFlag = useGameStore((s) => s.setFlag);
  const resetPuzzle = useGameStore((s) => s.resetPuzzle);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);

  const isSolved = Boolean(puzzleState['p08_compatibility_not_sameness']?.status === 'solved' || gameState.flags['p08_solved']);

  const ensurePuzzleActive = (puzzleId: string) => {
    const status = puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const handleSelectDate = (dateId: string) => {
    setSelectedDateId(dateId);

    if (dateId === 'date_c') {
      // CANONICAL / CORRECT CHOICE
      ensurePuzzleActive('p08_compatibility_not_sameness');
      setPuzzleStatus(
        'p08_compatibility_not_sameness',
        'solved',
        { identifiedCollectionDate: 'date_c' },
        'Identified Date C as predatory collection disguised as universal compatibility.'
      );
      setFlag('p08_solved', true);
      discoverEvidence('EV-009', 'Vesper Compatibility Registry');
      if (useGameStore.getState().gameState.flags['p09_solved']) advanceChapter(4);
    } else {
      ensurePuzzleActive('p08_compatibility_not_sameness');
      setPuzzleStatus(
        'p08_compatibility_not_sameness',
        'active',
        { falseDate: dateId },
        'Date contains normal boundary negotiation and all residents safely checked out.'
      );
    }
  };

  const handleBypass = () => {
    ensurePuzzleActive('p08_compatibility_not_sameness');
    setPuzzleStatus('p08_compatibility_not_sameness', 'bypassed', { assisted: true }, 'Assisted bypass used.');
    setFlag('p08_solved', true);
    discoverEvidence('EV-009', 'Assisted Vesper Compatibility Registry');
    if (useGameStore.getState().gameState.flags['p09_solved']) advanceChapter(4);
  };

  const handleReset = () => {
    resetPuzzle('p08_compatibility_not_sameness');
    setSelectedDateId(null);
    setHintLevel(0);
  };

  const getHintText = (level: number) => {
    switch (level) {
      case 1:
        return 'Nudge: Compatibility permits negotiated difference. A profile that promises zero conflict is suspicious.';
      case 2:
        return 'Method: Look at the venue checkout logs and emergency separation clauses.';
      case 3:
        return 'Guided: Date C claims separation is "unnecessary" and only 1 resident checked out afterwards.';
      case 4:
        return 'Resolve: Select Date C as the predatory collection event.';
      default:
        return 'Orientation: Identify which date event captured and fragmented ROOM_TONE under a false harmony claim.';
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className={styles.kicker}>VESPER INVESTIGATION // P08 WORKBENCH</span>
          <Link to="/vesper" style={{ fontSize: '0.8rem', color: 'var(--accent-network)' }}>
            ← Back to Vesper
          </Link>
        </div>
        <h1 className="type-h1">ROOM_TONE: Compatibility Is Not Sameness</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Trace the date history and venue checkout records of Apartment Choir @ROOM_TONE.
          Determine which match promised universal harmony to collect missing residents.
        </p>
      </header>

      {isSolved && (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--accent-network)', borderRadius: 'var(--radius-4)' }}>
          <h2 className="type-h3" style={{ color: 'var(--accent-network)' }}>
            ✓ Date C Collection Event Identified & Fragment Recovered
          </h2>
          <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
            Evidence <strong>EV-009</strong> secured. Choir residents preserved for counter-model assembly.
          </p>
        </div>
      )}

      {/* Occupancy Meter */}
      <section className={styles.occupancyMeter} aria-label="Choir Occupancy Status">
        <span>CHOIR OCCUPANCY LOG:</span>
        <span style={{ color: isSolved ? 'var(--accent-permission)' : 'var(--accent-warning)', fontWeight: 700 }}>
          {isSolved ? '9 / 12 RESIDENTS (3 RECOVERABLE FROM COMMUNION)' : '9 / 12 RESIDENTS ACTIVE'}
        </span>
      </section>

      {/* Date History Stream */}
      <section aria-labelledby="dates-heading">
        <h2 id="dates-heading" className="type-h3">
          Archived Compatibility Dates & Venue Checkouts
        </h2>

        <ul className={styles.dateList} aria-label="Date Records">
          {DATE_RECORDS.map((date) => (
            <li
              key={date.id}
              className={`${styles.dateCard} ${
                date.isDateC && isSolved ? styles.dateCardSuspect : ''
              }`}
            >
              <div className={styles.dateHeader}>
                <h3 className={styles.dateTitle}>{date.label}</h3>
                <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Venue: {date.venue}
                </span>
              </div>

              <div className={styles.dateMeta}>
                <div>
                  <strong>Claimed Compatibility:</strong> {date.claimedCompatibility}
                </div>
                <div>
                  <strong>Separation Protocol:</strong> {date.separationClause}
                </div>
                <div>
                  <strong>Venue Checkout:</strong> {date.checkoutStatus}
                </div>
              </div>

              <p className="type-small" style={{ color: 'var(--text-muted)' }}>
                Analysis Note: {date.notes}
              </p>

              <div style={{ marginTop: 'var(--space-2)' }}>
                <BaseButton
                  variant={selectedDateId === date.id ? 'primary' : 'default'}
                  onClick={() => handleSelectDate(date.id)}
                  disabled={isSolved}
                >
                  {date.isDateC && isSolved
                    ? '✓ Identified Predatory Match'
                    : 'Flag as Collection Event'}
                </BaseButton>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Hints & Reset */}
      <footer style={{ borderTop: '1px solid var(--line-subtle)', paddingTop: 'var(--space-4)' }}>
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-network)' }}>
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
            <Link to="/vesper" style={{ textDecoration: 'none' }}>
              <BaseButton variant="primary">Return to Vesper</BaseButton>
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
};
