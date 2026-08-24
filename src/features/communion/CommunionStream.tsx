import React, { useState } from 'react';
import { Link } from 'react-router';
import styles from './CommunionStream.module.css';
import { COMMUNION_SERMONS } from '../../content/fixtures/communionContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const CommunionStream: React.FC = () => {
  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>CONVERGENCE & COMPLETION // LITURGICAL STREAM</span>
        <h1 className="type-h1">Communion Liturgical Stream</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          A community devoted to the cessation of difference. Here, friction is framed as injury
          and universal synchronization as restorative peace.
        </p>
      </header>

      {/* Primary Investigation Banners */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Link
          to="/communion/testimonies"
          className={styles.bannerLitany}
          aria-label="Annotate Communion Testimonies"
        >
          <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-warning)', fontWeight: 700 }}>
            ★ P12 INVESTIGATION // TESTIMONY ARCHIVE
          </span>
          <h2 className="type-h2">Testimony Without Diagnosis (Authentic vs Generated)</h2>
          <p className="type-body">
            Separate sincere, cost-bearing believers from synthetic Common Body replication artifacts
            without declaring all faith counterfeit.
          </p>
        </Link>

        <Link
          to="/communion/litany"
          className={styles.bannerLitany}
          aria-label="Concordance Analysis of Litany"
        >
          <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-permission)', fontWeight: 700 }}>
            ★ P13 INVESTIGATION // REPLICATION CONCORDANCE
          </span>
          <h2 className="type-h2">The Litany of One Shape (Replication Prompt)</h2>
          <p className="type-body">
            Isolate the byte-identical sentence that functions as an interface replication instruction
            and quarantine it through living contradiction.
          </p>
        </Link>
      </section>

      {/* Sermons and Teachings */}
      <section aria-labelledby="sermons-heading">
        <h2 id="sermons-heading" className="type-h3" style={{ color: 'var(--text-muted)' }}>
          Sermons of the Shared Form
        </h2>

        {COMMUNION_SERMONS.map((sermon) => {
          const isO06 = sermon.id === 'COM-009';
          return (
            <div key={sermon.id} className={styles.sermonCard}>
              <div className={styles.sermonHeader}>
                <h3 className={styles.sermonTitle}>{sermon.title}</h3>
                <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Speaker: @{sermon.authorHandle} ({sermon.timestamp})
                </span>
              </div>

              <p className={styles.sermonBody}>"{sermon.body}"</p>

              {/* O06 Interactive Workbench */}
              {isO06 && <CommunionModerationWorkbench />}
            </div>
          );
        })}
      </section>
    </article>
  );
};

const CommunionModerationWorkbench: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);
  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const setFlag = useGameStore((s) => s.setFlag);
  const changeReputation = useGameStore((s) => s.changeReputation);

  const isSolved = Boolean(puzzleState['o06_communion_moderation']?.status === 'solved' || gameState.flags['o06_solved']);

  const ensurePuzzleActive = (puzzleId: string) => {
    const status = useGameStore.getState().puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const handleModerate = (catChoice: string) => {
    setSelectedCategory(catChoice);
    if (catChoice === 'predatory_replication') {
      ensurePuzzleActive('o06_communion_moderation');
      setPuzzleStatus('o06_communion_moderation', 'solved', { category: catChoice }, 'Moderated synthetic replication comment.');
      setFlag('o06_solved', true);
      changeReputation('communion_body', 10);
      setFeedback('✓ Moderation decision ratified! Flagged synthetic replication instruction; +10 Communion civility.');
    } else {
      setFeedback('Moderation miss: Identical cross-species phrase without cost is machine-generated copy.');
    }
  };

  return (
    <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <p className="type-small" style={{ fontWeight: 700 }}>
        Categorize Flagged Comment: "To be understood is to become understandable. Join immediately."
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <BaseButton
          variant={selectedCategory === 'predatory_replication' ? 'primary' : 'default'}
          onClick={() => handleModerate('predatory_replication')}
          disabled={isSolved}
        >
          Flag as Predatory Replication Instruction (Generated Copy)
        </BaseButton>

        <BaseButton
          variant={selectedCategory === 'sincere_testimony' ? 'primary' : 'default'}
          onClick={() => handleModerate('sincere_testimony')}
          disabled={isSolved}
        >
          Approve as Sincere Personal Testimony
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
