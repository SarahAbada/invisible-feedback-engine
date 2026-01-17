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
