export function parseSolaceMessage<T>(msg: any): T {
  if (typeof msg === 'string') return JSON.parse(msg);
  return msg;
}

export type RawSignal = {
  sessionId?: string;
  route: string;
  emotion: { frustration: number; engagement: number; confusion: number };
  interactionType: string;
};

export type EmotionEvent = {
  sessionId: string;
  route: string;
  emotion: { frustration: number; engagement: number; confusion: number };
  severity: 'normal' | 'high';
  timestamp: number;
};
