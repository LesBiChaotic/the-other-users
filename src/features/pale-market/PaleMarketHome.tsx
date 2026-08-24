/**
 * Pale Market Street Ledger Home — The Other Users
 * 
 * Nonmaterial trade ledger where listings hang from provenance lines.
 * Replaces e-commerce product grids with ethical provenance and permanence disclosures.
 */

import React from 'react';
import { Link } from 'react-router';
import styles from './PaleMarketHome.module.css';
import { PALE_MARKET_LISTINGS } from '../../content/fixtures/paleMarketContent';

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

      {/* Canonical Launch Listings */}
      <section aria-labelledby="listings-heading">
        <h2 id="listings-heading" className="type-h3" style={{ color: 'var(--text-muted)' }}>
          Active Conceptual Trade Listings
        </h2>

        <ul className={styles.marketLedger} aria-label="Pale Market Listings">
          {PALE_MARKET_LISTINGS.map((listing) => (
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
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};
