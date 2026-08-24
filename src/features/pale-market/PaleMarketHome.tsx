import React, { useState } from 'react';
import { Link } from 'react-router';
import styles from './PaleMarketHome.module.css';
import { PALE_MARKET_LISTINGS } from '../../content/fixtures/paleMarketContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const PaleMarketHome: React.FC = () => {
  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>MNEMOVORE & CONCEPTUAL COMMERCE // PROVENANCE STREET</span>
        <h1 className="type-h1">Pale Market Street Ledger</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Trade in names, privacy, discarded permissions, and remembered sensations.
          Every item lists its provenance, cost, and ontological permanence.
        </p>
      </header>

      {/* Primary Investigation Banners */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Link
          to="/market/listing/access-identity"
          className={styles.bannerListing}
          aria-label="Assemble Access Identity Workbench"
        >
          <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-warning)', fontWeight: 700 }}>
            ★ P10 INVESTIGATION // IDENTITY ASSEMBLY
          </span>
          <h2 className="type-h2">MKT-007: Assemble an Access Pass Without a Body</h2>
          <p className="type-body">
            Build a one-use entry credential for Menagerie operations. Authenticate the action
            without inadvertently creating a living Recordborn claimant.
          </p>
        </Link>

        <Link
          to="/market/listing/unremember-me"
          className={styles.bannerListing}
          aria-label="Memory Removal Exchange"
        >
          <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-permission)', fontWeight: 700 }}>
            ★ P11 INVESTIGATION // MEMORY PRUNING
          </span>
          <h2 className="type-h2">MKT-008: The Neighboring Memory (@unremember_me)</h2>
          <p className="type-body">
            Evaluate whether to remove the Common Body's predictive model of your behavior
            at the inevitable cost of an adjacent emotional bond.
          </p>
        </Link>
      </section>

      {/* Canonical Launch & Expanded Listings */}
      <section aria-labelledby="listings-heading">
        <h2 id="listings-heading" className="type-h3" style={{ color: 'var(--text-muted)' }}>
          Active Conceptual Trade Listings
        </h2>

        <ul className={styles.marketLedger} aria-label="Pale Market Listings">
          {PALE_MARKET_LISTINGS.map((listing) => {
            const isO05 = listing.id === 'MKT-017';
            return (
              <li key={listing.id} className={styles.listingRow}>
                <div className={styles.listingHeader}>
                  <h3 className={styles.listingTitle}>{listing.title}</h3>
                  <span className={styles.permanenceBadge}>{listing.permanence}</span>
                </div>

                <p className="type-body">{listing.description}</p>

                <div className={styles.priceTag}>
                  <strong>Price:</strong> {listing.priceText} ({listing.priceCost})
                </div>

                <span className={styles.provenanceNote}>
                  Provenance: {listing.provenance} • Vendor: @{listing.vendorHandle}
                </span>

                {/* O05 Interactive Workbench */}
                {isO05 && <PaleMarketProvenanceAuditWorkbench />}
              </li>
            );
          })}
        </ul>
      </section>
    </article>
  );
};

const PaleMarketProvenanceAuditWorkbench: React.FC = () => {
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);
  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const setFlag = useGameStore((s) => s.setFlag);
  const changeRelationship = useGameStore((s) => s.changeRelationship);

  const isSolved = Boolean(puzzleState['o05_pale_market_provenance']?.status === 'solved' || gameState.flags['o05_solved']);

  const ensurePuzzleActive = (puzzleId: string) => {
    const status = useGameStore.getState().puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const handleAudit = (auditChoice: string) => {
    setSelectedAudit(auditChoice);
    if (auditChoice === 'record_provenance_only') {
      ensurePuzzleActive('o05_pale_market_provenance');
      setPuzzleStatus('o05_pale_market_provenance', 'solved', { audit: auditChoice }, 'Provenance verified without entrapment.');
      setFlag('o05_solved', true);
      changeRelationship('usr_ilyr', 10);
      setFeedback('✓ Provenance audit validated! Traced Ilyr’s fragment without trapping their legal self; +10 Ilyr trust.');
    } else {
      setFeedback('Audit danger: Using Ilyr’s name-fragment traps their personhood inside your profile records.');
    }
  };

  return (
    <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <p className="type-small" style={{ fontWeight: 700 }}>
        Select Legal Provenance Action:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <BaseButton
          variant={selectedAudit === 'record_provenance_only' ? 'primary' : 'default'}
          onClick={() => handleAudit('record_provenance_only')}
          disabled={isSolved}
        >
          Audit Only: Record provenance trail without adopting the name-fragment
        </BaseButton>

        <BaseButton
          variant={selectedAudit === 'adopt_fragment' ? 'primary' : 'default'}
          onClick={() => handleAudit('adopt_fragment')}
          disabled={isSolved}
        >
          Adopt Fragment: Bind Ilyr’s discarded name directly to player profile
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
