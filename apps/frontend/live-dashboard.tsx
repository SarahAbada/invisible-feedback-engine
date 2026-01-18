import { useEffect, useState } from 'react';

// Simulated test signals
const testSignals = [
  { route: '/home', emotion: { frustration: 0.8, engagement: 0.2, confusion: 0.3 }, interactionType: 'scroll' },
  { route: '/checkout', emotion: { frustration: 0.3, engagement: 0.5, confusion: 0.7 }, interactionType: 'click' },
  { route: '/profile', emotion: { frustration: 0.6, engagement: 0.4, confusion: 0.2 }, interactionType: 'hover' },
];

export default function LiveDashboard() {
  const [signals, setSignals] = useState<typeof testSignals>([]);

  useEffect(() => {
    // Simulate incoming signals every 2 seconds
    let index = 0;
    const interval = setInterval(() => {
      setSignals(prev => [testSignals[index % testSignals.length], ...prev]);
      index++;
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getSeverity = (frustration: number) => {
    if (frustration > 0.7) return 'High';
    if (frustration > 0.4) return 'Medium';
    return 'Low';
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Live UX Feedback Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {signals.map((signal, i) => (
          <div key={i} className="bg-white shadow-md rounded">
            <div className="p-4">
              <h2 className="font-semibold">Route: {signal.route}</h2>
              <p>Interaction: {signal.interactionType}</p>
              <p>Frustration: {signal.emotion.frustration.toFixed(2)} ({getSeverity(signal.emotion.frustration)})</p>
              <p>Engagement: {signal.emotion.engagement.toFixed(2)}</p>
              <p>Confusion: {signal.emotion.confusion.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}