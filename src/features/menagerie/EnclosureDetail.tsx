/**
 * Enclosure Detail & Control Station (P14: The Camera That Never Blinks) — The Other Users
 * 
 * Inspects 5-sensor matrices per enclosure to prove camera feeds are synthetic loops
 * and identify the live biological footprint sensor pair (Pressure + Permission).
 */

import React, { useState } from 'react';
import { useParams, Link } from 'react-router';
import styles from './EnclosureDetail.module.css';
import { ENCLOSURE_SENSOR_MATRICES_P14 } from '../../content/fixtures/menagerieContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const EnclosureDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedLiveSensors, setSelectedLiveSensors] = useState<string[]>([]);
  const [hintLevel, setHintLevel] = useState<number>(0);

  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const advanceChapter = useGameStore((s) => s.advanceChapter);
  const setFlag = useGameStore((s) => s.setFlag);
  const resetPuzzle = useGameStore((s) => s.resetPuzzle);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);

  const matrix =
    ENCLOSURE_SENSOR_MATRICES_P14.find((m) => m.enclosureId === id) ||
    ENCLOSURE_SENSOR_MATRICES_P14[0];

  const isSolved = Boolean(puzzleState['p14_camera_that_never_blinks']?.status === 'solved' || gameState.flags['p14_solved']);

  const ensurePuzzleActive = (puzzleId: string) => {
    const status = puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const toggleSelectLiveSensor = (sensorKey: string) => {
    setSelectedLiveSensors((prev) =>
      prev.includes(sensorKey) ? prev.filter((k) => k !== sensorKey) : [...prev, sensorKey]
    );
  };

  const handleAuditSensors = () => {
    // Live pair is 'pressure' and 'permission'
    const hasPressure = selectedLiveSensors.includes('pressure');
    const hasPermission = selectedLiveSensors.includes('permission');
    const isExactPair = selectedLiveSensors.length === 2 && hasPressure && hasPermission;

    if (isExactPair) {
      ensurePuzzleActive('p14_camera_that_never_blinks');
      setPuzzleStatus(
        'p14_camera_that_never_blinks',
        'solved',
        { liveSensors: selectedLiveSensors, powerDiverted: true },
        'Proven camera feeds are synthetic loops; live pressure/permission pair identified.'
      );
      setFlag('p14_solved', true);
      setFlag('synthetic_footage_proven', true);
      discoverEvidence('EV-015', 'Menagerie live Pressure + Permission audit');
      setFlag('menagerie_witness_roster', [
        'usr_ilyr',
        ...(gameState.flags['p05_solved'] && !gameState.flags['p05_false_report'] ? ['usr_fiv'] : []),
        ...(gameState.flags['bond_sacrificed'] ? [] : ['usr_nvr']),
      ].join('|'));
      advanceChapter(7);
    } else {
      ensurePuzzleActive('p14_camera_that_never_blinks');
      setPuzzleStatus(
        'p14_camera_that_never_blinks',
        'active',
        { attempts: (puzzleState['p14_camera_that_never_blinks']?.attempts || 0) + 1 },
        'Selected sensors include synthetic optical loop or delayed infrastructure echoes.'
      );
    }
  };

  const handleBypass = () => {
    ensurePuzzleActive('p14_camera_that_never_blinks');
    setPuzzleStatus('p14_camera_that_never_blinks', 'bypassed', { assisted: true }, 'Assisted bypass used.');
    setFlag('p14_solved', true);
    setFlag('synthetic_footage_proven', true);
    discoverEvidence('EV-015', 'Assisted Menagerie sensor audit');
    advanceChapter(7);
  };

  const handleReset = () => {
    resetPuzzle('p14_camera_that_never_blinks');
    setSelectedLiveSensors([]);
    setHintLevel(0);
  };

  const getHintText = (level: number) => {
    switch (level) {
      case 1:
        return 'Nudge: Do not ask which video image looks real. Ask which physical sensor the creature’s body cannot avoid.';
      case 2:
        return 'Method: The video loops every 43 seconds. Echo is delayed by 3.2s, and heat belongs to the camera projector.';
      case 3:
        return 'Guided: Lintelkin require doorway pressure and create permission tokens. Select Pressure and Permission as the live pair.';
      case 4:
        return 'Resolve: Check "Pressure Sensor" and "Permission Log", then click "Divert Power to Live Sensors".';
      default:
        return 'Orientation: Identify the 2 live biological sensors and prove the optical camera feed is a generated loop.';
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className={styles.kicker}>ENCLOSURE CONTROL // P14 SENSOR AUDIT</span>
          <Link to="/menagerie/ops" style={{ fontSize: '0.8rem', color: 'var(--accent-network)' }}>
            ← Back to Operations Console
          </Link>
        </div>
        <h1 className="type-h1">{matrix.enclosureName}</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Dedicated multi-sensor monitoring plane for Subject @{matrix.occupantSubject}.
          Audit camera stutters against physical load and permission metrics.
        </p>
      </header>

      {isSolved && (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--accent-permission)', borderRadius: 'var(--radius-4)' }}>
          <h2 className="type-h3" style={{ color: 'var(--accent-permission)' }}>
            ✓ Synthetic Loop Exposed & Live Sensor Pair Confirmed
          </h2>
          <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
            Optical generators bypassed. Global power diverted to live habitat telemetry.
            Evidence <strong>EV-015</strong> recorded. <strong>P15 Threshold Exit Procedure</strong> is now accessible.
          </p>
        </div>
      )}

      {/* Sensor Stream Cards */}
      <section className={styles.sensorMatrix} aria-labelledby="sensors-title">
        <h2 id="sensors-title" className="type-h3">
          5-Band Environmental & Biological Sensor Matrix
        </h2>

        {/* 1. Camera Feed */}
        <div className={`${styles.sensorCard} ${styles.sensorCardLoop}`}>
          <div className={styles.sensorHeader}>
            <h3 className={styles.sensorName}>1. Optical Video Feed (CCTV Camera)</h3>
            <span className={styles.sensorTypeBadge} style={{ color: 'var(--accent-warning)' }}>
              FEED: OPTICAL (43s LOOP)
            </span>
          </div>
          <p className="type-small">{matrix.cameraFeedText}</p>
          <span className="type-small" style={{ color: 'var(--text-muted)' }}>
            Audit Note: Clock overlay updates smoothly while shadows stutter on repeat.
          </span>
        </div>

        {/* 2. Pressure Sensor */}
        <div className={`${styles.sensorCard} ${styles.sensorCardLive}`}>
          <div className={styles.sensorHeader}>
            <h3 className={styles.sensorName}>2. Physical Structural Pressure Sensor</h3>
            <span className={styles.sensorTypeBadge} style={{ color: 'var(--accent-permission)' }}>
              SENSOR: TACTILE (LIVE PULSES)
            </span>
          </div>
          <p className="type-small">{matrix.pressureSensorText}</p>
          <label style={{ marginTop: 'var(--space-1)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <input
              type="checkbox"
              checked={selectedLiveSensors.includes('pressure')}
              onChange={() => toggleSelectLiveSensor('pressure')}
              disabled={isSolved}
              aria-label="Flag Pressure Sensor as Live"
            />
            <span className="type-small" style={{ fontWeight: 700 }}>
              Flag as Live Biological Sensor
            </span>
          </label>
        </div>

        {/* 3. Permission Log */}
        <div className={`${styles.sensorCard} ${styles.sensorCardLive}`}>
          <div className={styles.sensorHeader}>
            <h3 className={styles.sensorName}>3. Threshold Permission Activity Log</h3>
            <span className={styles.sensorTypeBadge} style={{ color: 'var(--accent-permission)' }}>
              LOG: CRYPTOGRAPHIC (LIVE TOKENS)
            </span>
          </div>
          <p className="type-small">{matrix.permissionLogText}</p>
          <label style={{ marginTop: 'var(--space-1)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <input
              type="checkbox"
              checked={selectedLiveSensors.includes('permission')}
              onChange={() => toggleSelectLiveSensor('permission')}
              disabled={isSolved}
              aria-label="Flag Permission Log as Live"
            />
            <span className="type-small" style={{ fontWeight: 700 }}>
              Flag as Live Biological Sensor
            </span>
          </label>
        </div>

        {/* 4. Echo Sensor */}
        <div className={styles.sensorCard}>
          <div className={styles.sensorHeader}>
            <h3 className={styles.sensorName}>4. Subterranean Acoustic Echo Sensor</h3>
            <span className={styles.sensorTypeBadge}>ACOUSTIC (DELAYED)</span>
          </div>
          <p className="type-small">{matrix.echoSensorText}</p>
          <label style={{ marginTop: 'var(--space-1)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <input
              type="checkbox"
              checked={selectedLiveSensors.includes('echo')}
              onChange={() => toggleSelectLiveSensor('echo')}
              disabled={isSolved}
              aria-label="Flag Echo Sensor as Live"
            />
            <span className="type-small">Flag as Live Biological Sensor</span>
          </label>
        </div>

        {/* 5. Heat Sensor */}
        <div className={styles.sensorCard}>
          <div className={styles.sensorHeader}>
            <h3 className={styles.sensorName}>5. Thermal Infrastructure Sensor</h3>
            <span className={styles.sensorTypeBadge}>THERMAL (INFRASTRUCTURE)</span>
          </div>
          <p className="type-small">{matrix.heatSensorText}</p>
          <label style={{ marginTop: 'var(--space-1)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <input
              type="checkbox"
              checked={selectedLiveSensors.includes('heat')}
              onChange={() => toggleSelectLiveSensor('heat')}
              disabled={isSolved}
              aria-label="Flag Heat Sensor as Live"
            />
            <span className="type-small">Flag as Live Biological Sensor</span>
          </label>
        </div>
      </section>

      {/* Audit Action Commitment */}
      <section className={styles.auditControls} aria-labelledby="controls-heading">
        <h2 id="controls-heading" className="type-h3">
          Facility Power Allocation & Audit Verification
        </h2>
        <p className="type-small">
          Confirm the pair of live sensors to shut down optical generator loops and reroute
          facility power to active habitat support.
        </p>

        <BaseButton
          variant="primary"
          onClick={handleAuditSensors}
          disabled={isSolved}
        >
          Divert Power to Live Sensors ({selectedLiveSensors.length} / 2 Selected)
        </BaseButton>
      </section>

      {/* Hints & Reset */}
      <footer style={{ borderTop: '1px solid var(--line-subtle)', paddingTop: 'var(--space-4)' }}>
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-warning)' }}>
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
            Reset Sensor Matrix
          </BaseButton>
          {isSolved && (
            <Link to="/menagerie/threshold" style={{ textDecoration: 'none' }}>
              <BaseButton variant="primary">Proceed to Ilyr Exit Procedure →</BaseButton>
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
};
