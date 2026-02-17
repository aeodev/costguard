export const queryKeys = {
  me: ['me'] as const,
  overview: ['overview'] as const,
  tools: ['tools'] as const,
  team: ['team'] as const,
  subscriptions: (filters: string) => ['subscriptions', filters] as const,
  spendSummary: (range: string) => ['spend-summary', range] as const,
  riskFindings: (filters: string) => ['risk-findings', filters] as const,
  policies: ['policies'] as const,
  integrations: ['integrations'] as const,
  audit: (filters: string) => ['audit', filters] as const
};
