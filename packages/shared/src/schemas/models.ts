import { z } from 'zod';

export const toolSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  vendorRiskTier: z.enum(['low', 'medium', 'high']),
  supportsSSO: z.boolean(),
  dataRetentionDays: z.number().int().nonnegative(),
  website: z.string().url()
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  teamId: z.string(),
  role: z.enum(['admin', 'member']),
  createdAt: z.string()
});

export const teamSchema = z.object({
  id: z.string(),
  name: z.string()
});

export const subscriptionSchema = z.object({
  id: z.string(),
  toolId: z.string(),
  userId: z.string(),
  plan: z.string(),
  seatCostMonthly: z.number().nonnegative(),
  status: z.enum(['active', 'canceled']),
  startedAt: z.string(),
  isPersonal: z.boolean().optional()
});

export const spendEventSchema = z.object({
  id: z.string(),
  toolId: z.string(),
  amount: z.number(),
  currency: z.string(),
  occurredAt: z.string(),
  type: z.enum(['seat', 'api', 'overage']),
  teamId: z.string().optional()
});

export const riskFindingSchema = z.object({
  id: z.string(),
  severity: z.enum(['low', 'med', 'high']),
  type: z.string(),
  title: z.string(),
  description: z.string(),
  toolId: z.string().optional(),
  userId: z.string().optional(),
  detectedAt: z.string(),
  status: z.enum(['open', 'resolved'])
});

export const policySchema = z.object({
  id: z.string(),
  name: z.string(),
  rules: z.object({
    allowlistedToolIds: z.array(z.string()),
    requireSSO: z.boolean(),
    banPersonalAccounts: z.boolean(),
    monthlySpendCap: z.number().nonnegative().optional()
  }),
  updatedAt: z.string()
});

export const auditLogSchema = z.object({
  id: z.string(),
  actorUserId: z.string(),
  action: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  createdAt: z.string(),
  meta: z.record(z.unknown())
});

export const integrationSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['connected', 'not_connected']),
  description: z.string(),
  lastSyncAt: z.string().nullable()
});

export const orgSchema = z.object({
  id: z.string(),
  name: z.string(),
  plan: z.string(),
  renewalDate: z.string()
});
