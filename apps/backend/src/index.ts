// apps/backend/src/index.ts
import { startEmotionAgent } from '../agents/emotionAgent.js';
import { startContextAgent } from '../agents/contextAgent.js';
import { startInsightAgent } from '../agents/insightAgent.js';
import { startUXFrictionAgent } from '../agents/uxFrictionAgent.js';

// Start your agents
console.log('[IFE Backend] Booting agents...');

const emotionAgent = startEmotionAgent();
const contextAgent = startContextAgent();
const insightAgent = startInsightAgent();
const uxFrictionAgent = startUXFrictionAgent();

console.log('[IFE Backend] Agents loaded. Waiting for events...');
