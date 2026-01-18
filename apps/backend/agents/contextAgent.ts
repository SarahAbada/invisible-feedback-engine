/**
 * TODO:
 * Context correlation agent.
 *
 * Purpose:
 * - Correlate errors, latency, and emotion
 *
 * Inputs:
 * - Sentry errors
 * - emotion events
 *
 * Output:
 * - impact_summary
 *
 * Example:
 * "500 error correlates with 42% frustration spike"
 */

import { subscribe, publish } from './solaceClients.js';
import type { AggregatedInsight, AgentEvent } from './types.js';

export function startContextAgent() {
  subscribe('ife/insight/aggregated', (insight: AggregatedInsight) => {
    // TODO: correlate with Sentry / latency events

    const event: AgentEvent = {
      timestamp: Date.now(),
      sourceAgent: 'contextAgent',
      payload: {
        summary: 'Potential correlation between emotion spike and system behavior',
        insight,
      },
    };

    publish('ife/agent/context', event);
  });

  console.log('[ContextAgent] started');
}
