/**
 * Vesper Social Discovery Home — The Other Users
 * 
 * Constellation of compatibility paths, boundary negotiations, and occupancy models.
 * Replaces generic swipe-based dating patterns with explicit negotiated coexistence.
 */

import React from 'react';
import { Link } from 'react-router';
import styles from './VesperHome.module.css';
import { VESPER_PROFILES } from '../../content/fixtures/vesperContent';

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
    </article>
  );
};
