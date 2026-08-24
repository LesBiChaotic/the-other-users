/**
 * Testimony Archive (P12: Testimony Without Diagnosis) — The Other Users
 * 
 * Separates authentic, cost-bearing convergence believers from synthetic
 * Common Body replication artifacts without declaring all faith counterfeit.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import styles from './TestimonyArchive.module.css';
import { COMMUNION_TESTIMONIES_P12 } from '../../content/fixtures/communionContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const TestimonyArchive: React.FC = () => {
  const [annotations, setAnnotations] = useState<Record<string, 'authentic' | 'generated'>>({});
  const [hintLevel, setHintLevel] = useState<number>(0);

  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const advanceChapter = useGameStore((s) => s.advanceChapter);
  const setFlag = useGameStore((s) => s.setFlag);
  const changeRelationship = useGameStore((s) => s.changeRelationship);
  const resetPuzzle = useGameStore((s) => s.resetPuzzle);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);

  const isSolved = Boolean(puzzleState['p12_testimony_without_diagnosis']?.status === 'solved' || gameState.flags['p12_solved']);

  useEffect(() => {
    discoverEvidence('EV-013', 'Communion Testimony Archive');
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

  const handleAnnotate = (id: string, classification: 'authentic' | 'generated') => {
    setAnnotations((prev) => ({
      ...prev,
      [id]: classification,
    }));
  };

  const handleVerifyAnnotations = () => {
    // 1 & 2 are authentic, 3 & 4 are generated
    const is1Auth = annotations['COM-001_t'] === 'authentic';
    const is2Auth = annotations['COM-002'] === 'authentic';
    const is3Gen = annotations['COM-003'] === 'generated';
    const is4Gen = annotations['COM-004'] === 'generated';

    if (is1Auth && is2Auth && is3Gen && is4Gen) {
      ensurePuzzleActive('p12_testimony_without_diagnosis');
      setPuzzleStatus(
        'p12_testimony_without_diagnosis',
        'solved',
        { annotations },
        'Accurately differentiated sincere faith from synthetic replication.'
      );
      setFlag('p12_solved', true);
      changeRelationship('usr_cal', 10);
      advanceChapter(6);
    } else {
      ensurePuzzleActive('p12_testimony_without_diagnosis');
      setPuzzleStatus(
        'p12_testimony_without_diagnosis',
        'active',
        { attempts: (puzzleState['p12_testimony_without_diagnosis']?.attempts || 0) + 1 },
        'Misclassified testimony. Check for cost acknowledgement and biological accuracy.'
      );
    }
  };

  const handleBypass = () => {
    ensurePuzzleActive('p12_testimony_without_diagnosis');
    setPuzzleStatus('p12_testimony_without_diagnosis', 'bypassed', { assisted: true }, 'Assisted bypass used.');
    setFlag('p12_solved', true);
    advanceChapter(6);
  };

  const handleReset = () => {
    resetPuzzle('p12_testimony_without_diagnosis');
    setAnnotations({});
    setHintLevel(0);
  };

  const getHintText = (level: number) => {
    switch (level) {
      case 1:
        return 'Nudge: Sincere believers acknowledge real emotional loss, retained boundaries, or past choices.';
      case 2:
        return 'Method: Look for the repeated sentence "To be understood is to become understandable" or biological impossibilities (e.g. wings on a Pressure Saint).';
      case 3:
        return 'Guided: Testimonies 1 & 2 are Authentic Believers. Testimonies 3 & 4 are Generated Suspects.';
      case 4:
        return 'Resolve: Mark calmly_complete and Silent_Plow as Authentic; mark Unbound_Echo and Granite_Saint_4 as Generated.';
      default:
        return 'Orientation: Categorize each testimony as either an Authentic Believer or a Generated Suspect.';
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className={styles.kicker}>COMMUNION ARCHIVE // P12 WORKBENCH</span>
          <Link to="/communion" style={{ fontSize: '0.8rem', color: 'var(--accent-network)' }}>
            ← Back to Stream
          </Link>
        </div>
        <h1 className="type-h1">Testimony Without Diagnosis</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Review convergence testimonies. Differentiate sincere believers who voluntarily accepted
          the cost of synchronization from synthetic machine-generated replication artifacts.
        </p>
      </header>

      {isSolved && (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--accent-permission)', borderRadius: 'var(--radius-4)' }}>
          <h2 className="type-h3" style={{ color: 'var(--accent-permission)' }}>
            ✓ Testimony Analysis Verified (Evidence EV-013 Secured)
          </h2>
          <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
            Sincere faith respected; synthetic replication artifacts exposed.
          </p>
        </div>
      )}

      {/* Testimony List */}
      <ul className={styles.testimonyList} aria-label="Testimonies to Annotate">
        {COMMUNION_TESTIMONIES_P12.map((testimony) => {
          const currentChoice = annotations[testimony.id];
          return (
            <li key={testimony.id} className={styles.testimonyCard}>
              <div className={styles.testimonyHeader}>
                <span className={styles.authorMeta}>
                  @{testimony.authorHandle} ({testimony.species})
                </span>
                <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {testimony.timestamp}
                </span>
              </div>

              <h3 className="type-h3">{testimony.title}</h3>
              <p className="type-body">"{testimony.body}"</p>

              <div className={styles.annotationControls}>
                <BaseButton
                  variant={currentChoice === 'authentic' ? 'primary' : 'default'}
                  onClick={() => handleAnnotate(testimony.id, 'authentic')}
                  disabled={isSolved}
                >
                  Authentic Believer (Cost-Bearing)
                </BaseButton>

                <BaseButton
                  variant={currentChoice === 'generated' ? 'danger' : 'default'}
                  onClick={() => handleAnnotate(testimony.id, 'generated')}
                  disabled={isSolved}
                >
                  Generated Suspect (Replication Artifact)
                </BaseButton>
              </div>
            </li>
          );
        })}
      </ul>

      <div style={{ marginTop: 'var(--space-3)' }}>
        <BaseButton
          variant="primary"
          onClick={handleVerifyAnnotations}
          disabled={isSolved}
        >
          Verify Testimony Annotations ({Object.keys(annotations).length} / 4 Categorized)
        </BaseButton>
      </div>

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
            Reset Annotations
          </BaseButton>
          {isSolved && (
            <Link to="/communion" style={{ textDecoration: 'none' }}>
              <BaseButton variant="primary">Return to Communion</BaseButton>
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
};
