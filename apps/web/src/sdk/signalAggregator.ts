/**
 * TODO:
 * Combine multiple low-level signals into meaningful events.
 *
 * Inputs:
 * - emotion scores (from Presage)
 * - scroll speed
 * - mouse jitter
 * - dwell time
 * - UI context (route, component name)
 *
 * Outputs:
 * - "emotion_spike"
 * - "frustration_cluster"
 * - "dopamine_loop_detected"
 *
 * Logic:
 * - Smooth noisy signals (moving average)
 * - Detect spikes vs baseline
 * - Attach contextual metadata
 *
 * Important:
 * - Keep this deterministic
 * - No ML here — agents handle reasoning
 */
