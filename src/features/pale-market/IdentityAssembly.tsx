/**
 * Identity Assembly Workbench (P10) — The Other Users
 * 
 * Assembles a sterile action-bound access credential for Menagerie operations
 * without accidentally creating a living Recordborn claimant.
 */

import React, { useState } from 'react';
import { Link } from 'react-router';
import styles from './IdentityAssembly.module.css';
import { IDENTITY_COMPONENTS_P10 } from '../../content/fixtures/paleMarketContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const IdentityAssembly: React.FC = () => {
  const [selectedComponents, setSelectedComponents] = useState<Record<string, string>>({
    name: 'comp_name_none',
    invitation: 'comp_inv_action',
    witness_mark: 'comp_wit_temporary',
    expiry: 'comp_exp_immediate',
  });
  const [hintLevel, setHintLevel] = useState<number>(0);

  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const advanceChapter = useGameStore((s) => s.advanceChapter);
  const setFlag = useGameStore((s) => s.setFlag);
  const resetPuzzle = useGameStore((s) => s.resetPuzzle);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);

  const isSolved = Boolean(puzzleState['p10_identity_without_body']?.status === 'solved' || gameState.flags['p10_solved']);
  const isClaimantCreated = gameState.flags['recordborn_created'] === true;

  const ensurePuzzleActive = (puzzleId: string) => {
    const status = puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const handleSelectComponent = (type: string, componentId: string) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [type]: componentId,
    }));
  };

  // Calculate total ontological weight
  const totalOntologicalWeight = Object.values(selectedComponents).reduce((acc, id) => {
    const comp = IDENTITY_COMPONENTS_P10.find((c) => c.id === id);
    return acc + (comp?.ontologicalWeight || 0);
  }, 0);

  const handleAssemblePass = () => {
    ensurePuzzleActive('p10_identity_without_body');

    if (totalOntologicalWeight === 0) {
      // CANONICAL / CLEAN ACTION PASS
      setPuzzleStatus(
        'p10_identity_without_body',
        'solved',
        { components: selectedComponents, claimantCreated: false },
        'Sterile action-bound pass assembled without creating a living personhood.'
      );
      setFlag('p10_solved', true);
      setFlag('recordborn_created', false);
      setFlag('menagerie_access_method', 'action_pass');
      discoverEvidence('EV-011', 'Pale Market Identity Assembly Workbench');
      advanceChapter(5);
    } else {
      // CLAIMANT CREATED ROUTE (Allowed story branch, creates Recordborn NPC)
      setPuzzleStatus(
        'p10_identity_without_body',
        'solved',
        { components: selectedComponents, claimantCreated: true },
        'Persistent identity stabilized; Recordborn claimant awakened.'
      );
      setFlag('p10_solved', true);
      setFlag('recordborn_created', true);
      setFlag('menagerie_access_method', 'recordborn_proxy');
      discoverEvidence('EV-011', 'Pale Market claimant creation record');
      advanceChapter(5);
    }
  };

  const handleBypass = () => {
    ensurePuzzleActive('p10_identity_without_body');
    setPuzzleStatus('p10_identity_without_body', 'bypassed', { assisted: true }, 'Assisted bypass used.');
    setFlag('p10_solved', true);
    discoverEvidence('EV-011', 'Assisted Pale Market Identity Assembly');
    advanceChapter(5);
  };

  const handleReset = () => {
    resetPuzzle('p10_identity_without_body');
    setSelectedComponents({
      name: 'comp_name_none',
      invitation: 'comp_inv_action',
      witness_mark: 'comp_wit_temporary',
      expiry: 'comp_exp_immediate',
    });
    setHintLevel(0);
  };

  const getHintText = (level: number) => {
    switch (level) {
      case 1:
        return 'Nudge: You need access for an action, not personhood. Avoid items that create ongoing database records.';
      case 2:
        return 'Method: Choose no name, one-use action invitation, temporary witness mark, and immediate expiry.';
      case 3:
        return 'Guided: Ensure Ontological Weight is 0 to avoid stabilizing a Recordborn claimant.';
      case 4:
        return 'Resolve: Select No Name, One-Use Action Invitation, Temporary Witness Mark, and Immediate Expiry.';
      default:
        return 'Orientation: Select components to assemble an access pass. Keep Ontological Weight at 0 to avoid creating a living claimant.';
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className={styles.kicker}>PALE MARKET // P10 WORKBENCH</span>
          <Link to="/market" style={{ fontSize: '0.8rem', color: 'var(--accent-network)' }}>
            ← Back to Market
          </Link>
        </div>
        <h1 className="type-h1">Assemble an Identity Without a Body</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Build a one-use entry credential for Menagerie operations. Keep Ontological Weight
          at zero to authenticate entry without inadvertently creating a living Recordborn person.
        </p>
      </header>

      {isSolved && (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--accent-permission)', borderRadius: 'var(--radius-4)' }}>
          <h2 className="type-h3" style={{ color: 'var(--accent-permission)' }}>
            ✓ Access Credential Assembled
          </h2>
          <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
            {isClaimantCreated
              ? 'A persistent Recordborn claimant has opened a profile with new ethical obligations.'
              : 'Sterile action-bound credential secured. Evidence EV-011 recorded.'}
          </p>
        </div>
      )}

      {/* Ontological Weight Meter */}
      <section className={styles.meterCard} aria-label="Ontological Weight Status">
        <span>ONTOLOGICAL WEIGHT METER:</span>
        <span
          style={{
            color: totalOntologicalWeight === 0 ? 'var(--accent-permission)' : 'var(--accent-warning)',
            fontWeight: 700,
          }}
        >
          {totalOntologicalWeight === 0
            ? '0 (STERILE ACTION PASS)'
            : `+${totalOntologicalWeight} (CREATES RECORDBORN CLAIMANT)`}
        </span>
      </section>

      {/* 4 Component Groups */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }} aria-labelledby="builder-title">
        <h2 id="builder-title" className="type-h3">
          Select Identity Parameters
        </h2>

        {/* 1. Name */}
        <div className={styles.componentGroup}>
          <h3 className="type-h3">1. Identity Nomenclature</h3>
          <div className={styles.componentOptions}>
            {IDENTITY_COMPONENTS_P10.filter((c) => c.type === 'name').map((comp) => (
              <label key={comp.id} className={styles.optionLabel}>
                <input
                  type="radio"
                  name="name"
                  checked={selectedComponents.name === comp.id}
                  onChange={() => handleSelectComponent('name', comp.id)}
                  disabled={isSolved}
                />
                <div>
                  <strong>{comp.label}</strong> (Weight: +{comp.ontologicalWeight})
                  <p className="type-small" style={{ color: 'var(--text-muted)' }}>
                    {comp.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 2. Invitation */}
        <div className={styles.componentGroup}>
          <h3 className="type-h3">2. Invitation Type</h3>
          <div className={styles.componentOptions}>
            {IDENTITY_COMPONENTS_P10.filter((c) => c.type === 'invitation').map((comp) => (
              <label key={comp.id} className={styles.optionLabel}>
                <input
                  type="radio"
                  name="invitation"
                  checked={selectedComponents.invitation === comp.id}
                  onChange={() => handleSelectComponent('invitation', comp.id)}
                  disabled={isSolved}
                />
                <div>
                  <strong>{comp.label}</strong> (Weight: +{comp.ontologicalWeight})
                  <p className="type-small" style={{ color: 'var(--text-muted)' }}>
                    {comp.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 3. Witness Mark */}
        <div className={styles.componentGroup}>
          <h3 className="type-h3">3. Witness Certification</h3>
          <div className={styles.componentOptions}>
            {IDENTITY_COMPONENTS_P10.filter((c) => c.type === 'witness_mark').map((comp) => (
              <label key={comp.id} className={styles.optionLabel}>
                <input
                  type="radio"
                  name="witness_mark"
                  checked={selectedComponents.witness_mark === comp.id}
                  onChange={() => handleSelectComponent('witness_mark', comp.id)}
                  disabled={isSolved}
                />
                <div>
                  <strong>{comp.label}</strong> (Weight: +{comp.ontologicalWeight})
                  <p className="type-small" style={{ color: 'var(--text-muted)' }}>
                    {comp.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 4. Expiry */}
        <div className={styles.componentGroup}>
          <h3 className="type-h3">4. Expiration Protocol</h3>
          <div className={styles.componentOptions}>
            {IDENTITY_COMPONENTS_P10.filter((c) => c.type === 'expiry').map((comp) => (
              <label key={comp.id} className={styles.optionLabel}>
                <input
                  type="radio"
                  name="expiry"
                  checked={selectedComponents.expiry === comp.id}
                  onChange={() => handleSelectComponent('expiry', comp.id)}
                  disabled={isSolved}
                />
                <div>
                  <strong>{comp.label}</strong> (Weight: +{comp.ontologicalWeight})
                  <p className="type-small" style={{ color: 'var(--text-muted)' }}>
                    {comp.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-3)' }}>
          <BaseButton
            variant="primary"
            onClick={handleAssemblePass}
            disabled={isSolved}
          >
            Finalize Access Pass Assembly (Weight: {totalOntologicalWeight})
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
            Reset Workbench
          </BaseButton>
          {isSolved && (
            <Link to="/market" style={{ textDecoration: 'none' }}>
              <BaseButton variant="primary">Return to Market</BaseButton>
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
};
