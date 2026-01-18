/**
 * TODO:
 * Insight synthesis agent.
 *
 * Purpose:
 * - Convert raw findings into human-readable insights
 *
 * Output:
 * - short summaries
 * - dashboard-ready insights
 *
 * Example:
 * "Users disengage 20% faster when infinite scroll is enabled"
 *
 * Optional:
 * - LLM-powered summarization
 */

import { subscribe, publish } from './solaceClient.js';
import type { AgentEvent } from './types.js';

export function startInsightAgent() {
  const handler = (event: AgentEvent) => {
    const summary = {
      timestamp: Date.now(),
      insight: `[${event.sourceAgent}] ${event.payload.message ?? 'New insight generated'}`,
      details: event.payload,
    };

    publish('ife/agent/summary', summary);
  };

  subscribe('ife/agent/emotion', handler);
  subscribe('ife/agent/context', handler);
  subscribe('ife/agent/ux-friction', handler);

  console.log('[InsightAgent] started');
}
