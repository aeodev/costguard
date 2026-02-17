import type { z } from 'zod';
import type {
  auditLogSchema,
  integrationSchema,
  orgSchema,
  policySchema,
  riskFindingSchema,
  spendEventSchema,
  subscriptionSchema,
  teamSchema,
  toolSchema,
  userSchema
} from '../schemas/models';
import type {
  integrationSyncDiffSchema,
  loginResponseSchema,
  meResponseSchema,
  orgOverviewSchema,
  spendSummarySchema
} from '../schemas/api';

export type Tool = z.infer<typeof toolSchema>;
export type User = z.infer<typeof userSchema>;
export type Team = z.infer<typeof teamSchema>;
export type Subscription = z.infer<typeof subscriptionSchema>;
export type SpendEvent = z.infer<typeof spendEventSchema>;
export type RiskFinding = z.infer<typeof riskFindingSchema>;
export type Policy = z.infer<typeof policySchema>;
export type AuditLog = z.infer<typeof auditLogSchema>;
export type Integration = z.infer<typeof integrationSchema>;
export type Org = z.infer<typeof orgSchema>;

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
export type OrgOverview = z.infer<typeof orgOverviewSchema>;
export type SpendSummary = z.infer<typeof spendSummarySchema>;
export type IntegrationSyncDiff = z.infer<typeof integrationSyncDiffSchema>;

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  requestId: string;
};

export type ApiError = {
  ok: false;
  error: {
    code: string;
    message: string;
  };
  requestId: string;
};

export type ApiEnvelope<T> = ApiSuccess<T> | ApiError;
