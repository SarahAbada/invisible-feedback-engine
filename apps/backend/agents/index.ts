import { startEmotionAgent } from './emotionAgent.js';
import { startContextAgent } from './contextAgent.js';
import { startUXFrictionAgent } from './uxFrictionAgent.js';
import { startInsightAgent } from './insightAgent.js';

export function startAgents() {
  startEmotionAgent();
  startContextAgent();
  startUXFrictionAgent();
  startInsightAgent();

  console.log('[IFE] All agents started');
}
