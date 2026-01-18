import { publish } from '../agents/solaceClient.js';

// Simulate sending emotion + interaction signals
function sendTestSignals() {
  const now = Date.now();

  const testSignals = [
    {
      timestamp: now,
      route: '/home',
      emotion: { frustration: 0.8, engagement: 0.2, confusion: 0.3 },
      interactionType: 'scroll',
    },
    {
      timestamp: now + 1000,
      route: '/checkout',
      emotion: { frustration: 0.3, engagement: 0.5, confusion: 0.7 },
      interactionType: 'click',
    },
  ];

  testSignals.forEach(signal => {
    publish('ife/insight/aggregated', JSON.stringify(signal));
    console.log('[TestSignal] Sent:', signal);
  });
}

sendTestSignals();
