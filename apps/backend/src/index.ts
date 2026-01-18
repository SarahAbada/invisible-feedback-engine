import 'dotenv/config';
import { connectSolace, subscribe } from '../agents/solaceClients.js';
import { startEmotionAgent } from '../agents/emotionAgent.js';
import { startInsightAgent } from '../agents/insightAgent.js';

async function boot() {
  console.log('[IFE Backend] Connecting to Solace broker...');
  await connectSolace();

  console.log('[IFE Backend] Booting agents...');
  startEmotionAgent();
  startInsightAgent();
  console.log('[IFE Backend] Agents loaded. Waiting for events...');

  subscribe('ife/insight/final', (insight) => {
    console.log('\n🧠 FINAL UX INSIGHT');
    console.log('------------------');
    console.log(insight);
    console.log('------------------\n');
  });
}

boot().catch(err => {
  console.error('[IFE Backend] Failed to boot:', err);
  process.exit(1);
});
