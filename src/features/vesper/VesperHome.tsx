/**
 * Vesper Social Discovery Home — The Other Users
 * 
 * Constellation of compatibility paths, boundary negotiations, and occupancy models.
 * Replaces generic swipe-based dating patterns with explicit negotiated coexistence.
 */

import React, { useState } from 'react';
import { Link } from 'react-router';
import styles from './VesperHome.module.css';
import { VESPER_PROFILES, VESPER_DISCUSSIONS } from '../../content/fixtures/vesperContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const VesperHome: React.FC = () => {
  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>CHORAL & SYMBIOTIC INTIMACY // BOUNDARY REGISTRY</span>
        <h1 className="type-h1">Vesper Compatibility Constellation</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          A community for negotiated coexistence across incompatible anatomies.
          Compatibility is not identical traits; it is the presence of declared boundaries
          and verified emergency separation protocols.
        </p>
      </header>

      {/* Primary Investigation Banners */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Link
          to="/vesper/profile/room-tone"
          className={styles.bannerInvestigation}
          aria-label="Investigate ROOM_TONE Fragmented Occupancy"
        >
          <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-warning)', fontWeight: 700 }}>
            ★ P08 INVESTIGATION // ROOM_TONE OCCUPANCY
          </span>
          <h2 className="type-h2">ROOM_TONE: Compatibility Is Not Sameness</h2>
          <p className="type-body">
            Trace the date history and venue exits of the 12-resident Apartment Choir.
            Identify which match promised universal compatibility to separate and collect missing residents.
          </p>
        </Link>

        <Link
          to="/vesper/agreements/body-sharing"
          className={styles.bannerInvestigation}
          aria-label="Repair Body-Sharing Consent Agreement"
        >
          <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-permission)', fontWeight: 700 }}>
            ★ P09 INVESTIGATION // CONSENT CONTRACT REPAIR
          </span>
          <h2 className="type-h2">The Body-Sharing Agreement (TermsMayApply Clause)</h2>
          <p className="type-body">
            Reconstruct plain-language clauses for scope, duration, revocation, emergency separation,
            and data deletion after predatory legal alterations.
          </p>
        </Link>
      </section>

      {/* Ordinary Compatibility Profiles */}
      <section className={styles.profileConstellation} aria-labelledby="profiles-heading">
        <h2 id="profiles-heading" className="type-h3" style={{ color: 'var(--text-muted)' }}>
          Active Member Boundary Disclosures
        </h2>

        {VESPER_PROFILES.map((profile) => (
          <div key={profile.id} className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <h3 className={styles.handle}>@{profile.handle}</h3>
              <span className={styles.species}>{profile.species}</span>
            </div>

            <p className="type-body">"{profile.bio}"</p>

            <div className={styles.fieldGrid}>
              <div>
                <strong>Occupancy:</strong> {profile.occupancy}
              </div>
              <div>
                <strong>Light Tolerance:</strong> {profile.lightTolerance}
              </div>
              <div>
                <strong>Feeding:</strong> {profile.feedingArrangement}
              </div>
              <div>
                <strong>Separation:</strong> {profile.separationProtocol}
              </div>
            </div>

            <span className="type-small" style={{ color: 'var(--accent-warning)' }}>
              <strong>Deal-Breaker:</strong> {profile.dealBreaker}
            </span>
          </div>
        ))}
      </section>

      {/* Ordinary Discussions Stream & O04 Workbench */}
      <section aria-labelledby="discussions-title" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <h2 id="discussions-title" className="type-h3">
          Public Intimacy Discussions & Safety Protocols
        </h2>

        {VESPER_DISCUSSIONS.map((disc) => {
          const isO04 = disc.id === 'VESP-008';
          return (
            <div
              key={disc.id}
              style={{
                backgroundColor: 'var(--bg-paper)',
                border: '1px solid var(--line-subtle)',
                borderLeft: isO04 ? '4px solid var(--accent-permission)' : '3px solid var(--accent-network)',
                borderRadius: 'var(--radius-4)',
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 className="type-h3">{disc.title}</h3>
                <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-network)' }}>
                  @{disc.authorHandle} • {disc.timestamp}
                </span>
              </div>

              <p className="type-body">{disc.body}</p>

              {/* O04 Interactive Alignment Workbench */}
              {isO04 && <VesperProfileAlignmentWorkbench />}

              {disc.comments && disc.comments.length > 0 && (
                <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', borderTop: '1px solid var(--line-subtle)', paddingTop: 'var(--space-2)' }}>
                  {disc.comments.map((c, i) => (
                    <div key={i} style={{ padding: 'var(--space-2)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-4)' }}>
                      <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-network)' }}>
                        @{c.authorHandle}:
                      </span>
                      <p className="type-small" style={{ marginTop: '2px' }}>
                        {c.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </article>
  );
};

const VesperProfileAlignmentWorkbench: React.FC = () => {
  const [selectedSeparation, setSelectedSeparation] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);
  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const setFlag = useGameStore((s) => s.setFlag);
  const changeReputation = useGameStore((s) => s.changeReputation);

  const isSolved = Boolean(puzzleState['o04_vesper_compatibility_profile']?.status === 'solved' || gameState.flags['o04_solved']);

  const ensurePuzzleActive = (puzzleId: string) => {
    const status = useGameStore.getState().puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const handleAlign = (sepChoice: string) => {
    setSelectedSeparation(sepChoice);
    if (sepChoice === 'unilateral_threshold') {
      ensurePuzzleActive('o04_vesper_compatibility_profile');
      setPuzzleStatus('o04_vesper_compatibility_profile', 'solved', { separation: sepChoice }, 'Authored safe compatibility boundaries.');
      setFlag('o04_solved', true);
      changeReputation('plurality_accord', 15);
      setFeedback('✓ Profile parameters ratified! Declared unilateral threshold exit; +15 Plurality trust awarded.');
    } else {
      setFeedback('Alignment rejected: Permanent synchronization eliminates consent and violates Vesper boundary ethics.');
    }
  };

  return (
    <div style={{ marginTop: 'var(--space-2)', padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <p className="type-small" style={{ fontWeight: 700 }}>
        Declare Emergency Separation Protocol for Domestic Witness:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <BaseButton
          variant={selectedSeparation === 'unilateral_threshold' ? 'primary' : 'default'}
          onClick={() => handleAlign('unilateral_threshold')}
          disabled={isSolved}
        >
          Unilateral Threshold Exit: Instant separation upon stepping onto porch threshold
        </BaseButton>

        <BaseButton
          variant={selectedSeparation === 'permanent_harmony' ? 'primary' : 'default'}
          onClick={() => handleAlign('permanent_harmony')}
          disabled={isSolved}
        >
          Permanent Synchronization: No exit required (Universal Harmony)
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
