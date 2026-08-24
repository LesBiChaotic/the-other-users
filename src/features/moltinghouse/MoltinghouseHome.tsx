import React, { useState } from 'react';
import { Link } from 'react-router';
import styles from './MoltinghouseHome.module.css';
import { MOLTINGHOUSE_THREADS } from '../../content/fixtures/moltinghouseContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const MoltinghouseHome: React.FC = () => {
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ q1?: string; q2?: string; q3?: string }>({});
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);
  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const setFlag = useGameStore((s) => s.setFlag);
  const updateProfile = useGameStore((s) => s.updateProfile);
  const changeReputation = useGameStore((s) => s.changeReputation);

  const isO02Solved = Boolean(puzzleState['o02_moltinghouse_quiz']?.status === 'solved' || gameState.flags['o02_solved']);
  const ordinaryThreadsRead = Number(gameState.flags['molt_threads_viewed_count'] || 0);
  const investigationsUnlocked = ordinaryThreadsRead >= 3;

  const toggleExpand = (threadId: string) => {
    setExpandedThreadId((prev) => (prev === threadId ? null : threadId));
    if (expandedThreadId !== threadId && threadId !== 'MOLT-009' && !gameState.flags[`molt_seen_${threadId}`]) {
      const nextCount = ordinaryThreadsRead + 1;
      setFlag(`molt_seen_${threadId}`, true);
      setFlag('molt_threads_viewed_count', nextCount);
      if (nextCount >= 3) setFlag('molt_investigations_unlocked', true);
    }
  };

  const handleAnswerQuiz = (qKey: 'q1' | 'q2' | 'q3', ans: string) => {
    setQuizAnswers((prev) => ({ ...prev, [qKey]: ans }));
  };

  const ensurePuzzleActive = (puzzleId: string) => {
    const status = useGameStore.getState().puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const submitQuiz = () => {
    const isCorrect =
      quizAnswers.q1 === 'q1_reset' &&
      quizAnswers.q2 === 'q2_history' &&
      quizAnswers.q3 === 'q3_commas';

    if (isCorrect) {
      ensurePuzzleActive('o02_moltinghouse_quiz');
      setPuzzleStatus('o02_moltinghouse_quiz', 'solved', { answers: quizAnswers }, 'Passed Moltinghouse Etiquette Quiz.');
      setFlag('o02_solved', true);
      updateProfile({ provisionalSpecies: 'DOMESTIC WITNESS (CONTOUR-AWARE)' });
      changeReputation('plurality_accord', 10);
      setQuizFeedback('✓ Quiz passed! Awarded "Contour-Aware" cosmetic profile molt and +10 Plurality trust.');
    } else {
      setQuizFeedback('Incorrect answer(s). Remember: ethics respects history, not cosmetic uniformity.');
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>MIMETIC MUTUAL AID // REVISION SHEDS</span>
        <h1 className="type-h1">Moltinghouse</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          A community for Borrowfaces, Housemolts, and Handfuls. Threads exist as stacked
          identity layers; newest revisions reveal earlier contours.
        </p>
      </header>

      <section className={styles.threadLayer} aria-label="Chapter continuity notice">
        <span className={styles.bannerKicker}>CHAPTER 1 CONSEQUENCE // THE ARGUMENT AUNTIE TRIED TO CLEAN</span>
        <h2 className="type-h3">Moltinghouse remembers how you handled a stranger.</h2>
        <p className="type-body">
          {gameState.flags['accused_wrong_user']
            ? 'Your accusation reached the revision sheds before you did. Members have hidden private contours and will not accept certainty without relational proof.'
            : gameState.flags['repaired_apology']
              ? 'Your public correction was mirrored here with its edits intact. Members are cautious, but they recognize a witness willing to preserve being wrong.'
              : gameState.flags['case_01_deferred']
                ? 'Witness Wire records that you refused to accuse without enough evidence. Moltinghouse has granted read-only access while it decides whether caution is care.'
                : 'The recovered moderation link points here: an argument was edited into a clean ending that neither participant remembers choosing.'}
        </p>
      </section>

      {/* Primary Investigation Banners */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {!investigationsUnlocked && (
          <div className={styles.threadLayer} role="status">
            <span className={styles.bannerKicker}>COMMUNITY CONTEXT REQUIRED // {ordinaryThreadsRead}/3 THREADS READ</span>
            <p className="type-body">
              Read three ordinary discussions and their annotations first. A continuity signature is a relationship, not a spelling test.
            </p>
          </div>
        )}
        <Link
          to="/molt/sheds/soft_error"
          className={styles.bannerInvestigation}
          aria-label="Investigate soft_error Shed Drafts"
          aria-disabled={!investigationsUnlocked}
          onClick={(event) => { if (!investigationsUnlocked) event.preventDefault(); }}
        >
          <span className={styles.bannerKicker}>★ P04 INVESTIGATION // SHED ARCHIVE</span>
          <h2 className="type-h2">soft_error Shed Drafts & Revision Layers</h2>
          <p className="type-body">
            Examine the deleted drafts of Moltinghouse advice moderator @soft_error.
            Identify her authentic continuity signature beneath the standardized replacement layers.
          </p>
        </Link>

        <Link
          to="/molt/thread/five-of-us"
          className={styles.bannerInvestigation}
          aria-label="Investigate FIVE_OF_US Plural Timeline"
          aria-disabled={!investigationsUnlocked}
          onClick={(event) => { if (!investigationsUnlocked) event.preventDefault(); }}
        >
          <span className={styles.bannerKicker}>★ P05 INVESTIGATION // PLURAL TIMELINE</span>
          <h2 className="type-h2">FIVE_OF_US: One Moderator, Several Bodies</h2>
          <p className="type-body">
            Review the five-voice transcript and repair telemetry of the repair cooperative.
            Determine whether disagreement constitutes account replacement or authentic plural personhood.
          </p>
        </Link>
      </section>

      {/* Ordinary Support Threads Stream */}
      <section className={styles.layeredDeck} aria-label="Support and Ethics Threads">
        <h2 className="type-h3" style={{ color: 'var(--text-muted)' }}>
          Community Advice & Contour Etiquette
        </h2>

        {MOLTINGHOUSE_THREADS.map((thread) => {
          const isExpanded = expandedThreadId === thread.id;
          const isQuizThread = thread.id === 'MOLT-009';

          return (
            <div key={thread.id} className={styles.threadLayer}>
              <div className={styles.layerHeader}>
                <span className={styles.authorMeta}>
                  @{thread.authorHandle} ({thread.authorSpecies || thread.category})
                </span>
                <span className={styles.revisionPill}>{thread.revisionCount} revisions</span>
              </div>

              <h3 className={styles.threadTitle}>{thread.title}</h3>
              <p className={styles.threadBody}>{thread.body}</p>

              {/* O02 Quiz Interactive Workbench */}
              {isQuizThread && (
                <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <h4 className="type-h3" style={{ color: 'var(--accent-permission)' }}>
                    O02 Ethics Quiz Questionnaire
                  </h4>

                  {/* Q1 */}
                  <div>
                    <p className="type-small" style={{ fontWeight: 700 }}>
                      1. How should facial fatigue during learned customer service mimicry be managed?
                    </p>
                    <label style={{ display: 'block', marginTop: '4px' }}>
                      <input
                        type="radio"
                        name="q1"
                        checked={quizAnswers.q1 === 'q1_staple'}
                        onChange={() => handleAnswerQuiz('q1', 'q1_staple')}
                        disabled={isO02Solved}
                      />{' '}
                      Staple the hinge and increase smile wattage.
                    </label>
                    <label style={{ display: 'block', marginTop: '4px' }}>
                      <input
                        type="radio"
                        name="q1"
                        checked={quizAnswers.q1 === 'q1_reset'}
                        onChange={() => handleAnswerQuiz('q1', 'q1_reset')}
                        disabled={isO02Solved}
                      />{' '}
                      Request speech-only duties or schedule a private muscle reset.
                    </label>
                  </div>

                  {/* Q2 */}
                  <div>
                    <p className="type-small" style={{ fontWeight: 700 }}>
                      2. Why are "spontaneity tests" considered discriminatory against suspected replacements?
                    </p>
                    <label style={{ display: 'block', marginTop: '4px' }}>
                      <input
                        type="radio"
                        name="q2"
                        checked={quizAnswers.q2 === 'q2_history'}
                        onChange={() => handleAnswerQuiz('q2', 'q2_history')}
                        disabled={isO02Solved}
                      />{' '}
                      Because "natural" is subjective; authentic identity requires comparison to private history.
                    </label>
                    <label style={{ display: 'block', marginTop: '4px' }}>
                      <input
                        type="radio"
                        name="q2"
                        checked={quizAnswers.q2 === 'q2_speed'}
                        onChange={() => handleAnswerQuiz('q2', 'q2_speed')}
                        disabled={isO02Solved}
                      />{' '}
                      Because mimics should always respond within 50 milliseconds.
                    </label>
                  </div>

                  {/* Q3 */}
                  <div>
                    <p className="type-small" style={{ fontWeight: 700 }}>
                      3. What linguistic habit indicates authentic soft_error presence?
                    </p>
                    <label style={{ display: 'block', marginTop: '4px' }}>
                      <input
                        type="radio"
                        name="q3"
                        checked={quizAnswers.q3 === 'q3_commas'}
                        onChange={() => handleAnswerQuiz('q3', 'q3_commas')}
                        disabled={isO02Solved}
                      />{' '}
                      Double commas when worried and unresolved private grievances.
                    </label>
                    <label style={{ display: 'block', marginTop: '4px' }}>
                      <input
                        type="radio"
                        name="q3"
                        checked={quizAnswers.q3 === 'q3_perfect'}
                        onChange={() => handleAnswerQuiz('q3', 'q3_perfect')}
                        disabled={isO02Solved}
                      />{' '}
                      Flawlessly polite, generic grammar with no complaints.
                    </label>
                  </div>

                  {quizFeedback && (
                    <p className="type-small" style={{ color: isO02Solved ? 'var(--accent-permission)' : 'var(--accent-warning)', fontWeight: 700 }}>
                      {quizFeedback}
                    </p>
                  )}

                  {!isO02Solved && (
                    <div>
                      <BaseButton variant="primary" onClick={submitQuiz}>
                        Submit Quiz Answers
                      </BaseButton>
                    </div>
                  )}
                </div>
              )}

              {/* Thread Comments Toggle */}
              <div style={{ marginTop: 'var(--space-2)' }}>
                <BaseButton onClick={() => toggleExpand(thread.id)}>
                  {isExpanded ? 'Hide Annotations' : `View Annotations (${thread.comments.length})`}
                </BaseButton>
              </div>

              {isExpanded && (
                <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', borderTop: '1px solid var(--line-subtle)', paddingTop: 'var(--space-2)' }}>
                  {thread.comments.map((comm) => (
                    <div key={comm.id} style={{ padding: 'var(--space-2)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-4)' }}>
                      <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-network)' }}>
                        @{comm.authorHandle}:
                      </span>
                      <p className="type-small" style={{ marginTop: '2px' }}>
                        {comm.body}
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
