/**
 * TODO:
 * Combine multiple low-level signals into meaningful events.
 *
 * Inputs:
 * - emotion scores (from Presage)
 * - scroll speed
 * - mouse jitter
 * - dwell time
 * - UI context (route, component name)
 *
 * Outputs:
 * - "emotion_spike"
 * - "frustration_cluster"
 * - "dopamine_loop_detected"
 *
 * Logic:
 * - Smooth noisy signals (moving average)
 * - Detect spikes vs baseline
 * - Attach contextual metadata
 *
 * Important:
 * - Keep this deterministic
 * - No ML here — agents handle reasoning
 */

/**
 * signalAggregator.ts
 *
 * Converts low-level interaction + emotion signals into
 * meaningful feedback insights.
 *
 * This is NOT ML — it is explainable heuristics.
 */

export type RawSignal = {
  timestamp: number;
  route: string;
  emotion: {
    frustration: number;
    engagement: number;
    confusion: number;
  };
  scrollDepth?: number;
  interactionType?: 'scroll' | 'click' | 'hover' | 'keypress';
};

export type AggregatedInsight = {
  type:
    | 'FRUSTRATION_SPIKE'
    | 'ENGAGEMENT_DROP'
    | 'SCROLL_LOOP'
    | 'CONFUSION_CLUSTER';
  severity: 'low' | 'medium' | 'high';
  route: string;
  description: string;
  evidence: RawSignal[];
};

/* ----------------------------------------
 * Tunable thresholds (demo-friendly)
 * -------------------------------------- */
const THRESHOLDS = {
  frustrationHigh: 0.75,
  engagementLow: 0.3,
  scrollLoopCount: 6,
  timeWindowMs: 15_000,
};

/* ----------------------------------------
 * Internal rolling buffer
 * -------------------------------------- */
const buffer: RawSignal[] = [];

/* ----------------------------------------
 * Public API
 * -------------------------------------- */
export function ingestSignal(signal: RawSignal) {
  buffer.push(signal);

  pruneOldSignals();

  return analyzeSignals();
}

/* ----------------------------------------
 * Core analysis logic
 * -------------------------------------- */
function analyzeSignals(): AggregatedInsight[] {
  const insights: AggregatedInsight[] = [];

  insights.push(...detectFrustrationSpikes());
  insights.push(...detectEngagementDrop());
  insights.push(...detectScrollLoops());
  insights.push(...detectConfusionClusters());

  return insights;
}

/* ----------------------------------------
 * Signal pruning
 * -------------------------------------- */
function pruneOldSignals() {
  const cutoff = Date.now() - THRESHOLDS.timeWindowMs;
  while (buffer.length && buffer[0].timestamp < cutoff) {
    buffer.shift();
  }
}

/* ----------------------------------------
 * Detectors
 * -------------------------------------- */

function detectFrustrationSpikes(): AggregatedInsight[] {
  const spikes = buffer.filter(
    s => s.emotion.frustration >= THRESHOLDS.frustrationHigh
  );

  if (spikes.length < 2) return [];

  return [
    {
      type: 'FRUSTRATION_SPIKE',
      severity: 'high',
      route: spikes[0].route,
      description:
        'User experienced repeated high frustration in a short time window.',
      evidence: spikes,
    },
  ];
}

function detectEngagementDrop(): AggregatedInsight[] {
  const low = buffer.filter(
    s => s.emotion.engagement <= THRESHOLDS.engagementLow
  );

  if (low.length < 3) return [];

  return [
    {
      type: 'ENGAGEMENT_DROP',
      severity: 'medium',
      route: low[0].route,
      description:
        'User engagement steadily dropped, possibly due to uninteresting or overwhelming content.',
      evidence: low,
    },
  ];
}

function detectScrollLoops(): AggregatedInsight[] {
  const scrolls = buffer.filter(s => s.interactionType === 'scroll');

  if (scrolls.length < THRESHOLDS.scrollLoopCount) return [];

  return [
    {
      type: 'SCROLL_LOOP',
      severity: 'medium',
      route: scrolls[0].route,
      description:
        'User appears to be stuck in a repetitive scrolling loop with no meaningful interaction.',
      evidence: scrolls,
    },
  ];
}

function detectConfusionClusters(): AggregatedInsight[] {
  const confused = buffer.filter(s => s.emotion.confusion > 0.6);

  if (confused.length < 3) return [];

  return [
    {
      type: 'CONFUSION_CLUSTER',
      severity: 'low',
      route: confused[0].route,
      description:
        'User displayed sustained confusion signals, possibly due to unclear UI or instructions.',
      evidence: confused,
    },
  ];
}
