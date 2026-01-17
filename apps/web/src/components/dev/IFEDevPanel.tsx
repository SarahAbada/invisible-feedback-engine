'use client';

import React from 'react';

type IFEDevPanelProps = {
  sessionId: string | null;
  signalCount: number;
  aggregationCount: number;
  lastInsight: any | null;
  consentGiven: boolean;  
};

export function IFEDevPanel({
  sessionId,
  signalCount,
  aggregationCount,
  lastInsight,
  consentGiven,
}: IFEDevPanelProps) {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 320,
        background: '#0f172a',
        color: '#e5e7eb',
        padding: 12,
        borderRadius: 8,
        fontSize: 12,
        fontFamily: 'monospace',
        zIndex: 9999,
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
        Invisible Feedback Engine (DEV)
      </div>

      <div>
        <strong>Session:</strong>{' '}
        <span style={{ wordBreak: 'break-all' }}>
          {sessionId ?? '—'}
        </span>
      </div>

      <div>
        <strong>Signals:</strong> {signalCount}
      </div>

      <div>
        <strong>Aggregations:</strong> {aggregationCount}
      </div>

      <div style={{ marginTop: 8 }}>
        <strong>Last Insight:</strong>
        <pre
          style={{
            marginTop: 4,
            maxHeight: 120,
            overflow: 'auto',
            background: '#020617',
            padding: 6,
            borderRadius: 4,
          }}
        >
          {lastInsight
            ? JSON.stringify(lastInsight, null, 2)
            : '—'}
        </pre>
      </div>
    </div>
  );
}
