/**
 * Epilogue Narrative & Resolution View — The Other Users
 * 
 * Renders the canonical longform ending, conditional named-user fates,
 * final player profile conclusion, and New Game Plus invitation hook.
 */

import React from 'react';
import { useParams, Link } from 'react-router';
import styles from './EpilogueView.module.css';
import { CANONICAL_ENDINGS } from '../../content/fixtures/convergenceContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const EpilogueView: React.FC = () => {
  const { ending } = useParams<{ ending: string }>();
  const gameState = useGameStore((s) => s.gameState);
  const playerProfile = useGameStore((s) => s.playerProfile);

  const endingId = ending || (gameState.flags['ending_id'] as string) || 'END-CHORUS';
  const endingData = CANONICAL_ENDINGS[endingId] || CANONICAL_ENDINGS['END-CHORUS'];

  // Conditional Named-User Fates
  const hasSoftError = Boolean(gameState.flags['p04_solved']);
  const hasNeverlookstraight = !gameState.flags['accused_wrong_user'] && !gameState.flags['bond_sacrificed'];
  const hasIlyrClean = Boolean(gameState.flags['ilyr_freed']) && !gameState.flags['ilyr_ownership_compromised'];
  const hasIlyrCompromised = Boolean(gameState.flags['ilyr_ownership_compromised']);
  const hasFiveOfUs = Boolean(gameState.flags['p05_solved']) && !gameState.flags['p05_false_report'];

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>THE OTHER USERS // EPILOGUE RESOLUTION</span>
        <h1 className="type-h1">{endingData.title}</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          {endingData.subtitle}
        </p>
      </header>

      {/* Main Canonical Ending Prose */}
      <section className={styles.epilogueBody} aria-label="Ending Narrative">
        <p>{endingData.baseCopy}</p>
      </section>

      {/* Conditional Named-User Fates */}
      <section className={styles.userOutcomesSection} aria-labelledby="fates-heading">
        <h2 id="fates-heading" className="type-h3">
          Named Network User Outcomes
        </h2>

        {/* 1. soft_error */}
        <div className={styles.outcomeCard}>
          <h3 className="type-h3">@soft_error (Borrowface Advice Moderator)</h3>
          <p className="type-small">
            {hasSoftError
              ? 'Authentic continuity signature preserved in archived drafts. She continues moderating Moltinghouse with her trademark double commas and sharp contour repairs.'
              : 'Absorbed into Standard Form pilot; advice remains polite, uniform, and devoid of past grievances.'}
          </p>
        </div>

        {/* 2. neverlookstraight */}
        <div className={styles.outcomeCard}>
          <h3 className="type-h3">@neverlookstraight (Peripheral Friend)</h3>
          <p className="type-small">
            {hasNeverlookstraight
              ? 'Remains an active witness at the edge of your attention. Occasional uncentered photographs arrive in your inbox when you least expect them.'
              : 'Withdrew from human observation entirely; the edge of your vision is quiet and unpeopled.'}
          </p>
        </div>

        {/* 3. MOURNINGSTAR */}
        <div className={styles.outcomeCard}>
          <h3 className="type-h3">@MOURNINGSTAR / Ilyr-of-the-Lintel (Senior Moderator)</h3>
          <p className="type-small">
            {hasIlyrClean
              ? 'Standing as an independent threshold mediator. They continue enforcing narrow durations and reciprocal accountability.'
              : hasIlyrCompromised
              ? 'Freed physically from Annex N, but subject to TermsMayApply platform arbitration clauses.'
              : 'Still sealed within Enclosure N-04; periodic scheduled messages continue transmitting into the void.'}
          </p>
        </div>

        {/* 4. FIVE_OF_US */}
        <div className={styles.outcomeCard}>
          <h3 className="type-h3">@FIVE_OF_US (Repair Cooperative)</h3>
          <p className="type-small">
            {hasFiveOfUs
              ? 'Five workers, one invoice, five temperatures. Internal dispute protocol resolved without defection; the cooperative remains whole.'
              : 'Unit Five accepted Communion synchronization; remaining four units operate with a permanent mechanical delay.'}
          </p>
        </div>
      </section>

      {/* Final Player Profile Conclusion */}
      <section className={styles.profileConclusion} aria-labelledby="profile-conclusion-title">
        <h2 id="profile-conclusion-title" className="type-h3" style={{ color: 'var(--accent-permission)' }}>
          Palinode Network Final Ledger
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginTop: 'var(--space-2)' }}>
          <p><strong>SUBJECT:</strong> @{playerProfile.handle || 'Domestic_Witness_01'}</p>
          <p><strong>STATUS:</strong> {endingData.profileEpilogue}</p>
          <p><strong>REPUTATION RECORD:</strong> Plurality: {playerProfile.pluralityScore || 30} • Exposure: {playerProfile.exposureScore || 15} • Ilyr Trust: {playerProfile.ilyrTrustScore || 35}</p>
          <p><strong>COMMUNITY CITIZENSHIP:</strong> PERMANENT HISTORICAL ANCHOR VERIFIED</p>
        </div>
      </section>

      {/* New Game Plus Hook */}
      <section className={styles.ngPlusCard} aria-labelledby="ngplus-title">
        <h2 id="ngplus-title" className="type-h3" style={{ color: 'var(--accent-network)' }}>
          ★ New Game Plus: Post-Ending Invitation (M04)
        </h2>
        <p className="type-body">{endingData.ngPlusHook}</p>
        <p className="type-small" style={{ color: 'var(--text-muted)' }}>
          You may restart the investigation with altered provisional traits or review your persistent
          evidence board at any time.
        </p>
        <div style={{ marginTop: 'var(--space-2)' }}>
          <Link to="/home" style={{ textDecoration: 'none' }}>
            <BaseButton variant="primary">Return to Palinode Hub</BaseButton>
          </Link>
        </div>
      </section>
    </article>
  );
};
