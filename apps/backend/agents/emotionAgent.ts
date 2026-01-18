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
import { subscribe, publish } from './solaceClients.js';
import { parseSolaceMessage} from './solaceHelpers.js';
import type { RawSignal } from './solaceHelpers.js';

export function startEmotionAgent() {
  subscribe('ife/raw/signal', (msg) => {
    const signal: RawSignal = parseSolaceMessage<RawSignal>(msg);
    console.log('[EmotionAgent] received raw signal:', signal);

    publish('ife/agent/emotion', {
      sessionId: signal.sessionId ?? 'demo-session',
      route: signal.route,
      emotion: signal.emotion,
      severity: signal.emotion.frustration > 0.7 ? 'high' : 'normal',
      timestamp: Date.now(),
    });
  });

  console.log('[EmotionAgent] started');
}
