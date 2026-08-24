/**
 * Player Observation Case Workbench (P02 & P03) — The Other Users
 * 
 * Implements P02 (The Photographs Behind You) and P03 (Routine With One Missing Step),
 * complete with evidence acquisition, accusation confirmation, false accusation repair,
 * progressive hints (0–4), bypass, and puzzle resets.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import styles from './PlayerObservationCase.module.css';
import {
  WITNESS_WIRE_IMAGES,
  ROUTINE_STEPS_P03,
  CONSEQUENCE_NOTICES,
} from '../../content/fixtures/witnessWireContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const PlayerObservationCase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'photos' | 'routine' | 'accounts' | 'decision'>('photos');

  // P03 Working State
  const routineSteps = ROUTINE_STEPS_P03;
  const [removedStepIds, setRemovedStepIds] = useState<string[]>([]);

  // P02/P03 Hint Level Tracking
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [showConfirmAccusation, setShowConfirmAccusation] = useState<'AUNTIE_STATIC' | 'neverlookstraight' | null>(null);
  const [showApologyModal, setShowApologyModal] = useState<boolean>(false);
  const [apologyDraft, setApologyDraft] = useState<string>(
    'I retract my earlier accusation against neverlookstraight. The edge-occluded photographs were cautionary evidence, not hostile surveillance.'
  );

  // Store actions
  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const unlockGate = useGameStore((s) => s.unlockGate);
  const advanceChapter = useGameStore((s) => s.advanceChapter);
  const changeRelationship = useGameStore((s) => s.changeRelationship);
  const setFlag = useGameStore((s) => s.setFlag);
  const updateProfile = useGameStore((s) => s.updateProfile);
  const resetPuzzle = useGameStore((s) => s.resetPuzzle);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);

  const isCaseResolved = Boolean(gameState.unlockedGates['G1'] || gameState.flags['case_01_resolved']);
  const isWrongAccusation = gameState.flags['accused_wrong_user'] === true;
  const isRepaired = gameState.flags['repaired_apology'] === true;

  // On mount, discover evidence items for workbench
  useEffect(() => {
    discoverEvidence('EV-002', 'neverlookstraight archive');
    discoverEvidence('EV-003', 'AUNTIE_STATIC case file');
    discoverEvidence('EV-004', 'MRS_COLD compressor logs');
  }, [discoverEvidence]);

  // Helper to ensure a puzzle is active before applying terminal state
  const ensurePuzzleActive = (puzzleId: string) => {
    const status = puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const toggleRemoveStep = (stepId: string) => {
    setRemovedStepIds((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const handleEscalateHint = () => {
    if (hintLevel < 4) {
      setHintLevel((prev) => prev + 1);
    }
  };

  const handleBypass = () => {
    ensurePuzzleActive('p02_photographs');
    ensurePuzzleActive('p03_routine');
    setPuzzleStatus('p02_photographs', 'bypassed', { assisted: true }, 'Player used assisted bypass.');
    setPuzzleStatus('p03_routine', 'bypassed', { assisted: true }, 'Player used assisted bypass.');
    unlockGate('G1');
    setFlag('case_01_resolved', true);
    setFlag('p02_assisted', true);
    setFlag('p03_assisted', true);
    advanceChapter(1);
  };

  const handleResetPuzzleState = () => {
    resetPuzzle('p02_photographs');
    resetPuzzle('p03_routine');
    setRemovedStepIds([]);
    setHintLevel(0);
    setShowConfirmAccusation(null);
  };

  // Accusation Execution
  const handleCommitAccusation = (targetUser: 'AUNTIE_STATIC' | 'neverlookstraight') => {
    setShowConfirmAccusation(null);

    if (targetUser === 'AUNTIE_STATIC') {
      // CORRECT ACCUSATION PATH
      ensurePuzzleActive('p02_photographs');
      ensurePuzzleActive('p03_routine');
      setPuzzleStatus(
        'p02_photographs',
        'solved',
        { accused: 'AUNTIE_STATIC', verifiedPhotographer: 'neverlookstraight' },
        'Centered 6th image identified as AUNTIE_STATIC replacement artifact.'
      );
      setPuzzleStatus(
        'p03_routine',
        'solved',
        { removedStep: 'step_invasive_select' },
        'Removed fabricated immediate selection step.'
      );

      unlockGate('G1');
      advanceChapter(1);
      setFlag('case_01_resolved', true);
      setFlag('auntie_case_open', true);
      changeRelationship('usr_nvr', 10);
      changeRelationship('usr_ilyr', 5);

      updateProfile({
        exposureScore: 15,
        ilyrTrustScore: 35,
        revisions: [
          {
            chapter: 1,
            timestamp: Date.now(),
            summary: 'Resolved Case 01: Identified replacement of AUNTIE_STATIC via stolen routine data.',
            traits: {
              case01: 'AUNTIE_STATIC_REPLACED',
              firstWitness: 'neverlookstraight',
            },
          },
        ],
      });
    } else {
      // FALSE ACCUSATION PATH (neverlookstraight)
      ensurePuzzleActive('p02_photographs');
      setPuzzleStatus(
        'p02_photographs',
        'active',
        { falseAccusation: 'neverlookstraight' },
        'False accusation against neverlookstraight.'
      );

      setFlag('accused_wrong_user', true);
      changeRelationship('usr_nvr', -15);
      changeRelationship('usr_ilyr', -10);

      updateProfile({
        exposureScore: 25,
        ilyrTrustScore: 15,
        revisions: [
          {
            chapter: 1,
            timestamp: Date.now(),
            summary: 'Erroneous accusation against neverlookstraight; corrective thread required.',
            traits: {
              case01: 'FALSE_ACCUSATION_NEVERLOOKSTRAIGHT',
            },
          },
        ],
      });
    }
  };

  // Public Apology / Repair Route (O01)
  const handlePublishApology = () => {
    setFlag('repaired_apology', true);
    setFlag('accused_wrong_user', false);
    setFlag('case_01_resolved', true);
    unlockGate('G1');
    advanceChapter(1);
    changeRelationship('usr_nvr', 10); // Restores trust to reformed baseline

    ensurePuzzleActive('p02_photographs');
    ensurePuzzleActive('p03_routine');
    setPuzzleStatus(
      'p02_photographs',
      'solved',
      { repaired: true, apologyText: apologyDraft },
      'Resolved via public apology O01.'
    );

    setShowApologyModal(false);
  };

  const getHintText = (level: number) => {
    switch (level) {
      case 1:
        return 'Nudge: Separate who captured the images from who uploaded each one. Notice how ethical observers mark inference, whereas the replacement asserts certainty.';
      case 2:
        return 'Method: The 5 edge-occluded photographs have obstruction from doorframes. The centered 6th image has 0% occlusion and standard human eye-level lens.';
      case 3:
        return 'Guided: neverlookstraight took the first 5 images to warn you. AUNTIE_STATIC uploaded the centered 6th image after being replaced. In the routine, remove the immediate selection step.';
      case 4:
        return 'Resolve: Accuse AUNTIE_STATIC. In the routine tab, remove "4. Selects Intended Item Immediately".';
      default:
        return 'Orientation: Identify which observer uploaded the invasive 6th image and reconstruct the authentic domestic routine.';
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className={styles.kicker}>CASE DOSSIER // CHAPTER 1 VERTICAL SLICE</span>
          <Link to="/wire" style={{ fontSize: '0.8rem', color: 'var(--accent-network)' }}>
            ← Back to Stream
          </Link>
        </div>
        <h1 className="type-h1">Player Observation Workbench</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Compare photographic geometry (P02), verify routine dependency (P03), and determine
          which observer compromised your domestic threshold.
        </p>
      </header>

      {/* Consequence Banners */}
      {isWrongAccusation && !isRepaired && (
        <section className={styles.consequenceNotice} aria-label="Accusation Consequence">
          <h2 className="type-h3" style={{ color: 'var(--accent-warning)' }}>
            {CONSEQUENCE_NOTICES.wrong_accusation.title}
          </h2>
          <p className="type-body">{CONSEQUENCE_NOTICES.wrong_accusation.body}</p>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <BaseButton variant="primary" onClick={() => setShowApologyModal(true)}>
              Publish Public Correction / Apology (O01)
            </BaseButton>
          </div>
        </section>
      )}

      {isRepaired && (
        <section className={styles.consequenceNotice} style={{ borderColor: 'var(--accent-permission)' }} aria-label="Apology Consequence">
          <h2 className="type-h3" style={{ color: 'var(--accent-permission)' }}>
            {CONSEQUENCE_NOTICES.apology_repair.title}
          </h2>
          <p className="type-body">{CONSEQUENCE_NOTICES.apology_repair.body}</p>
        </section>
      )}

      {isCaseResolved && !isWrongAccusation && (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--accent-network)', borderRadius: 'var(--radius-4)' }}>
          <h2 className="type-h3" style={{ color: 'var(--accent-network)' }}>✓ Case 01 Resolved: Witness Fragment Secured</h2>
          <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
            Gate <strong>G1</strong> unsealed. Moltinghouse and the Evidence Board are now open.
          </p>
        </div>
      )}

      {/* Tabs */}
      <nav className={styles.tabBar} aria-label="Case Sections">
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === 'photos' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('photos')}
        >
          1. Photographs (P02)
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === 'routine' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('routine')}
        >
          2. Routine Ledger (P03)
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === 'accounts' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          3. Account Histories
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === 'decision' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('decision')}
        >
          4. Accusation & Commit
        </button>
      </nav>

      {/* TAB 1: Photographs (P02) */}
      {activeTab === 'photos' && (
        <section className={styles.section} aria-labelledby="photos-title">
          <h2 id="photos-title" className={styles.sectionTitle}>
            P02: The Photographs Behind You
          </h2>
          <p className={styles.instruction}>
            Six domestic photographs were uploaded to Witness Wire. Five have peripheral occlusion;
            the sixth is centered and clean. Compare camera geometry and uploader identities.
          </p>

          <div className={styles.imageGrid}>
            {WITNESS_WIRE_IMAGES.map((img) => (
              <div
                key={img.id}
                className={`${styles.imageCard} ${
                  !img.edgeOcclusion ? styles.imageCardSuspicious : ''
                }`}
              >
                <div className={styles.imageHeader}>
                  <h3 className={styles.imageTitle}>{img.title}</h3>
                  <span className={styles.uploaderTag}>Uploader: @{img.uploaderHandle}</span>
                </div>

                <div className={styles.imageMockup}>
                  <p><strong>[CAPTURED FRAME: {img.filename}]</strong></p>
                  <p className="type-small">{img.altText}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <span className={styles.geometryNote}>Geometry: {img.cameraGeometry}</span>
                  <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {img.inferenceNote}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: Routine Ledger (P03) */}
      {activeTab === 'routine' && (
        <section className={styles.section} aria-labelledby="routine-title">
          <h2 id="routine-title" className={styles.sectionTitle}>
            P03: Routine With One Missing Step
          </h2>
          <p className={styles.instruction}>
            Routine Keepers document household habits by recurrence. One step was fabricated
            by the replacement to simulate mechanical efficiency. Remove the anomaly.
          </p>

          <ul className={styles.routineList}>
            {routineSteps.map((step) => {
              const isRemoved = removedStepIds.includes(step.id);
              return (
                <li
                  key={step.id}
                  className={`${styles.routineItem} ${
                    isRemoved ? styles.routineItemRemoved : ''
                  }`}
                >
                  <div className={styles.routineContent}>
                    <span className={styles.routineLabel}>{step.label}</span>
                    <span className={styles.routineDesc}>{step.description}</span>
                    {step.contradictionHint && (
                      <span className="type-small" style={{ color: 'var(--accent-warning)' }}>
                        ★ Note: {step.contradictionHint}
                      </span>
                    )}
                  </div>

                  <BaseButton
                    variant={isRemoved ? 'default' : 'danger'}
                    onClick={() => toggleRemoveStep(step.id)}
                  >
                    {isRemoved ? 'Restore Step' : 'Remove as Anomaly'}
                  </BaseButton>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* TAB 3: Account Histories */}
      {activeTab === 'accounts' && (
        <section className={styles.section} aria-labelledby="accounts-title">
          <h2 id="accounts-title" className={styles.sectionTitle}>
            Observer Account Histories & Contradictions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', borderLeft: '3px solid var(--accent-network)' }}>
              <h3 className="type-h3">@neverlookstraight (Peripheral Friend)</h3>
              <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
                "You have seen five of these places before. You did not see me. That was the point.
                Someone else has added a sixth image, centered and clean. I did not take it."
              </p>
              <span className="type-small" style={{ color: 'var(--text-muted)' }}>
                Observed behavior: Always marks inference. Uses peripheral occlusion to avoid direct gaze collision.
              </span>
            </div>

            <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', borderLeft: '3px solid var(--accent-warning)' }}>
              <h3 className="type-h3">@AUNTIE_STATIC (Routine Keeper)</h3>
              <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
                "The sixth image shows a routine correction. Humans are less mysterious after the eighth repetition."
              </p>
              <span className="type-small" style={{ color: 'var(--accent-warning)' }}>
                Anomaly detected: Replaced voice removes human variance margin. Asserts absolute certainty.
              </span>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: Decision & Accusation */}
      {activeTab === 'decision' && (
        <section className={styles.section} aria-labelledby="decision-title">
          <h2 id="decision-title" className={styles.sectionTitle}>
            Commit Case Resolution & Accusation
          </h2>
          <p className={styles.instruction}>
            Accusing an observer is a consequential public action. Review your evidence
            before committing. A false accusation will damage community trust.
          </p>

          <div className={styles.decisionSection}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--line-subtle)', borderRadius: 'var(--radius-4)' }}>
                <h3 className="type-h3">Option A: Accuse AUNTIE_STATIC</h3>
                <p className="type-body" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  State that AUNTIE_STATIC has been replaced and uploaded the invasive 6th photograph using stolen routine data.
                </p>
                <div style={{ marginTop: 'var(--space-2)' }}>
                  <BaseButton
                    variant="primary"
                    onClick={() => setShowConfirmAccusation('AUNTIE_STATIC')}
                    disabled={isCaseResolved}
                  >
                    Accuse AUNTIE_STATIC of Replacement
                  </BaseButton>
                </div>
              </div>

              <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--line-subtle)', borderRadius: 'var(--radius-4)' }}>
                <h3 className="type-h3">Option B: Accuse neverlookstraight</h3>
                <p className="type-body" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  State that neverlookstraight is a predatory stalker who took all 6 photographs without permission.
                </p>
                <div style={{ marginTop: 'var(--space-2)' }}>
                  <BaseButton
                    variant="danger"
                    onClick={() => setShowConfirmAccusation('neverlookstraight')}
                    disabled={isCaseResolved}
                  >
                    Accuse neverlookstraight of Surveillance
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Confirmation Modal */}
      {showConfirmAccusation && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
            zIndex: 50,
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm Accusation"
        >
          <div
            style={{
              backgroundColor: 'var(--bg-paper)',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-8)',
              maxWidth: '480px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <h2 className="type-h2" style={{ color: 'var(--accent-warning)' }}>
              Confirm Irreversible Accusation
            </h2>
            <p className="type-body">
              Are you sure you want to publicly accuse <strong>@{showConfirmAccusation}</strong>?
              This will broadcast a formal report across Witness Wire and irreversibly alter member relationships.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <BaseButton
                variant="danger"
                onClick={() => handleCommitAccusation(showConfirmAccusation)}
              >
                Confirm and Publish Report
              </BaseButton>
              <BaseButton onClick={() => setShowConfirmAccusation(null)}>
                Cancel
              </BaseButton>
            </div>
          </div>
        </div>
      )}

      {/* Apology / Repair Modal (O01) */}
      {showApologyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
            zIndex: 50,
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Publish Public Apology"
        >
          <div
            style={{
              backgroundColor: 'var(--bg-paper)',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-8)',
              maxWidth: '480px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <h2 className="type-h2">Publish Public Retraction (O01)</h2>
            <p className="type-body" style={{ color: 'var(--text-muted)' }}>
              Publishing this correction will repair your standing with neverlookstraight and restore community trust.
            </p>
            <textarea
              style={{
                width: '100%',
                minHeight: '100px',
                padding: 'var(--space-2)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--line-subtle)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                borderRadius: 'var(--radius-4)',
              }}
              value={apologyDraft}
              onChange={(e) => setApologyDraft(e.target.value)}
              aria-label="Apology statement"
            />
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <BaseButton variant="primary" onClick={handlePublishApology}>
                Publish Retraction & Apology
              </BaseButton>
              <BaseButton onClick={() => setShowApologyModal(false)}>
                Cancel
              </BaseButton>
            </div>
          </div>
        </div>
      )}

      {/* Progressive Hint Drawer & Reset Controls */}
      <footer className={styles.section} style={{ borderTop: '1px solid var(--line-subtle)', paddingTop: 'var(--space-4)' }}>
        <div className={styles.hintPanel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.hintLevel}>
              Progressive Hint System (Level {hintLevel} / 4)
            </span>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {hintLevel < 4 ? (
                <BaseButton onClick={handleEscalateHint}>
                  Request Hint (Level {hintLevel + 1})
                </BaseButton>
              ) : (
                <BaseButton variant="primary" onClick={handleBypass}>
                  Assisted Bypass (Level 4)
                </BaseButton>
              )}
            </div>
          </div>
          <p className="type-body" style={{ fontSize: '0.9rem' }}>
            {getHintText(hintLevel)}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
          <BaseButton onClick={handleResetPuzzleState}>
            Reset Puzzle Workbench
          </BaseButton>

          {isCaseResolved && (
            <Link to="/home" style={{ textDecoration: 'none' }}>
              <BaseButton variant="primary">Return to Palinode Hub</BaseButton>
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
};
