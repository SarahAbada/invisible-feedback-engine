/**
 * TODO:
 * UX friction agent.
 *
 * Purpose:
 * - Identify UI components causing negative emotion
 *
 * Inputs:
 * - emotion spikes
 * - UI context
 *
 * Output:
 * - friction_report
 *
 * Example:
 * "Search bar causes frustration after 3 failed attempts"
 */

import { subscribe, publish } from './solaceClients.js';
import type { AggregatedInsight, AgentEvent } from './types.js';

export function startUXFrictionAgent() {
  subscribe('ife/insight/aggregated', (insight: AggregatedInsight) => {
    const event: AgentEvent = {
      timestamp: Date.now(),
      sourceAgent: 'uxFrictionAgent',
      payload: {
        route: insight.route,
        issue: insight.type,
        message: 'Repeated negative signals detected on this UI path',
      },
    };

    publish('ife/agent/ux-friction', event);
  });

  console.log('[UXFrictionAgent] started');
}
