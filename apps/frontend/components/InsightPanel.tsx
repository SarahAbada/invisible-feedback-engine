import { useState, useEffect } from "react";
import { subscribe } from "../lib/solaceClient"; // your frontend Solace wrapper

export default function InsightPanel() {
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    const handler = (insight: any) => {
      setInsights(prev => [insight, ...prev]); // newest on top
    };

    subscribe("ife/insight/final", handler);

    return () => {
      // optionally unsubscribe if your wrapper supports it
    };
  }, []);

  return (
    <div className="p-4 space-y-2">
      {insights.map((insight, idx) => (
        <div key={idx} className="bg-white p-4 rounded shadow">
          <p><strong>Route:</strong> {insight.route ?? "—"}</p>
          <p><strong>Insight:</strong> {insight.insight}</p>
          <p><strong>Confidence:</strong> {insight.confidence ?? "—"}</p>
        </div>
      ))}
    </div>
  );
}
