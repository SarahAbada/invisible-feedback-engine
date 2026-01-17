/**
 * TODO:
 * This is the core client-side SDK wrapper.
 *
 * Responsibilities:
 * - Ask for explicit user consent (GDPR-style)
 * - Initialize Presage emotion inference only AFTER consent
 * - Collect non-invasive signals:
 *   - cursor movement velocity
 *   - scroll speed
 *   - idle time
 *   - tab focus / blur
 *   - error events (from Sentry)
 * - NEVER record raw video/audio
 *
 * Flow:
 * 1. Show ConsentModal on first load
 * 2. On accept:
 *    - Start Presage (emotion inference)
 *    - Start signal aggregation loop
 * 3. Batch signals every N seconds
 * 4. Send anonymized payload to backend
 *
 * Privacy:
 * - No PII
 * - Session-based random UUID
 * - Kill switch if user revokes consent
 */

'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type EmotionState = {
  frustration: number;
  engagement: number;
  confusion: number;
};

type FeedbackContextType = {
  consentGiven: boolean;
  grantConsent: () => void;
  revokeConsent: () => void;
  sessionId: string | null;
};

const FeedbackContext = createContext<FeedbackContextType | null>(null);

const CONSENT_KEY = 'ife_consent';

export const InvisibleFeedbackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const emotionRef = useRef<EmotionState>({
    frustration: 0,
    engagement: 0,
    confusion: 0,
  });

  /* ----------------------------------------
   * Consent handling
   * -------------------------------------- */
  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'true') {
      setConsentGiven(true);
    }
  }, []);

  const grantConsent = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    setConsentGiven(true);
  };

  const revokeConsent = () => {
    localStorage.removeItem(CONSENT_KEY);
    setConsentGiven(false);
    setSessionId(null);
  };

  /* ----------------------------------------
   * Session initialization
   * -------------------------------------- */
  useEffect(() => {
    if (!consentGiven) return;

    const id = crypto.randomUUID();
    setSessionId(id);
    console.log('[IFE] Session started:', id);
  }, [consentGiven]);

  /* ----------------------------------------
   * Fake Presage emotion inference
   * -------------------------------------- */
  useEffect(() => {
    if (!consentGiven) return;

    const interval = setInterval(() => {
      emotionRef.current = {
        frustration: Math.random(),
        engagement: Math.random(),
        confusion: Math.random(),
      };
    }, 1000);

    return () => clearInterval(interval);
  }, [consentGiven]);

  /* ----------------------------------------
   * Batch + emit events
   * -------------------------------------- */
  useEffect(() => {
    if (!consentGiven || !sessionId) return;

    const interval = setInterval(() => {
      const payload = {
        sessionId,
        timestamp: Date.now(),
        emotion: emotionRef.current,
        route: window.location.pathname,
      };

      // TODO: replace with backend POST
      console.log('[IFE EVENT]', payload);
    }, 5000);

    return () => clearInterval(interval);
  }, [consentGiven, sessionId]);

  return (
    <FeedbackContext.Provider
      value={{ consentGiven, grantConsent, revokeConsent, sessionId }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

/* ----------------------------------------
 * Hook for consuming context
 * -------------------------------------- */
export const useInvisibleFeedback = () => {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error(
      'useInvisibleFeedback must be used inside InvisibleFeedbackProvider'
    );
  }
  return ctx;
};
