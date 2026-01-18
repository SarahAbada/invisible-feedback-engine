export type AggregatedInsight = {
  type:
    | 'FRUSTRATION_SPIKE'
    | 'ENGAGEMENT_DROP'
    | 'SCROLL_LOOP'
    | 'CONFUSION_CLUSTER';
  severity: 'low' | 'medium' | 'high';
  route: string;
  description: string;
  evidence: any[];
};

export type AgentEvent<T = any> = {
  timestamp: number;
  sourceAgent: string;
  sessionId?: string;
  payload: T;
};
