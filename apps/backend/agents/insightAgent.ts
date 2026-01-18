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
import { subscribe, publish } from './solaceClients.js';
import type { EmotionEvent } from './solaceHelpers.js';
import { parseSolaceMessage } from './solaceHelpers.js';

export function startInsightAgent() {
  subscribe('ife/agent/emotion', (msg) => {
    const emotion: EmotionEvent = parseSolaceMessage<EmotionEvent>(msg);
    console.log('[InsightAgent] received emotion:', emotion);

    const insight = {
      sessionId: emotion.sessionId,
      insight: emotion.severity === 'high' ? 'User likely frustrated' : 'User engagement normal',
      confidence: emotion.severity === 'high' ? 0.9 : 0.6,
      timestamp: Date.now(),
    };

    publish('ife/insight/final', insight);
  });

  console.log('[InsightAgent] started');
}
