/**
 * TODO:
 * Emotion agent.
 *
 * Purpose:
 * - Detect emotional degradation patterns
 *
 * Logic:
 * - Look for sustained frustration
 * - Compare against session baseline
 *
 * Output:
 * - emotional_warning event
 *
 * Example:
 * "User showing prolonged confusion on checkout page"
 */

import { subscribe, publish } from './solaceClient.js';
import type { AggregatedInsight, AgentEvent } from './types.js';

export function startEmotionAgent() {
  subscribe('ife/insight/aggregated', (insight: AggregatedInsight) => {
    if (
      insight.type === 'FRUSTRATION_SPIKE' ||
      insight.type === 'CONFUSION_CLUSTER'
    ) {
      const event: AgentEvent = {
        timestamp: Date.now(),
        sourceAgent: 'emotionAgent',
        payload: {
          warning: 'Sustained negative emotional pattern detected',
          insight,
        },
      };

      publish('ife/agent/emotion', event);
    }
  });

  console.log('[EmotionAgent] started');
}
