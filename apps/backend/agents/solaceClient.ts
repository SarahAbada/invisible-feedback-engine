/**
 * Thin Solace wrapper.
 * Replace internals with real Solace SDK when ready.
 */

type MessageHandler = (payload: any) => void;

export function subscribe(topic: string, handler: MessageHandler) {
  console.log(`[Solace] Subscribed to ${topic}`);

  // TODO: Replace with real Solace subscription
}

export function publish(topic: string, payload: any) {
  console.log(`[Solace] Publish → ${topic}`, payload);

  // TODO: Replace with real Solace publish
}
