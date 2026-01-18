import { publish, connectSolace } from '../agents/solaceClients.js';

// Utility function for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function sendTestSignals() {
  await connectSolace();
  await delay(500);
  const now = Date.now();
  const sessionId = 'test-session-' + Date.now();
  const testSignals = [
    {
      sessionId,
      timestamp: now,
      route: '/home',
      emotion: { frustration: 0.8, engagement: 0.2, confusion: 0.3 },
      interactionType: 'scroll',
    },
    {
      sessionId,
      timestamp: now + 1000,
      route: '/checkout',
      emotion: { frustration: 0.3, engagement: 0.5, confusion: 0.7 },
      interactionType: 'click',
    },
  ];

  testSignals.forEach(signal => {
    publish('ife/raw/signal', signal);
    console.log('[TestSignal] Sent:', signal);
  });
}

sendTestSignals();
