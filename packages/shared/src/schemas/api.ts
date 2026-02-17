import { z } from 'zod';
import {
  auditLogSchema,
  integrationSchema,
  orgSchema,
  policySchema,
  riskFindingSchema,
  subscriptionSchema,
  teamSchema,
  toolSchema,
  userSchema
} from './models';

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const loginResponseSchema = z.object({
  token: z.string(),
  user: userSchema
});

export const meResponseSchema = z.object({
  user: userSchema,
  org: orgSchema,
  basics: z.object({
    activeSubscriptions: z.number().int().nonnegative(),
    openFindings: z.number().int().nonnegative(),
    monthlySpend: z.number().nonnegative()
  })
});

export const subscriptionsQuerySchema = z.object({
  toolId: z.string().optional(),
  teamId: z.string().optional(),
  status: z.enum(['active', 'canceled']).optional(),
  personal: z.enum(['true', 'false']).optional(),
  q: z.string().optional()
});

export const spendSummaryQuerySchema = z.object({
  range: z.enum(['30d', '90d']).default('30d')
});

export const riskQuerySchema = z.object({
  severity: z.enum(['low', 'med', 'high']).optional(),
  status: z.enum(['open', 'resolved']).optional(),
  q: z.string().optional()
});

export const auditQuerySchema = z.object({
  action: z.string().optional(),
  actor: z.string().optional(),
  range: z.enum(['7d', '30d', '90d']).optional()
});

export const policyUpsertRequestSchema = z.object({
  name: z.string().min(2),
  rules: z.object({
    allowlistedToolIds: z.array(z.string()),
    requireSSO: z.boolean(),
    banPersonalAccounts: z.boolean(),
    monthlySpendCap: z.number().nonnegative().optional()
  })
});

export const orgOverviewSchema = z.object({
  kpis: z.object({
    totalSpend30d: z.number(),
    activeSubscriptions: z.number(),
    openFindings: z.number(),
    highSeverityFindings: z.number(),
    personalSubscriptions: z.number(),
    ssoCoveragePercent: z.number()
  }),
  spendSeries: z.array(
    z.object({
      date: z.string(),
      amount: z.number()
    })
  ),
  topToolsBySpend: z.array(
    z.object({
      toolId: z.string(),
      toolName: z.string(),
      amount: z.number()
    })
  ),
  recentFindings: z.array(riskFindingSchema),
  recommendedActions: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      reason: z.string(),
      cta: z.string()
    })
  )
});

export const spendSummarySchema = z.object({
  timeSeries: z.array(
    z.object({
      date: z.string(),
      amount: z.number()
    })
  ),
  byTool: z.array(
    z.object({
      toolId: z.string(),
      toolName: z.string(),
      amount: z.number()
    })
  ),
  byTeam: z.array(
    z.object({
      teamId: z.string(),
      teamName: z.string(),
      amount: z.number()
    })
  ),
  perSeatAverage: z.number(),
  estimatedHoursSaved: z.number()
});

export const integrationsResponseSchema = z.array(integrationSchema);

export const integrationSyncDiffSchema = z.object({
  addedSubscriptions: z.number(),
  addedSpendEvents: z.number(),
  addedRiskFindings: z.number(),
  auditEntriesCreated: z.number(),
  subscriptionIds: z.array(z.string()),
  findingIds: z.array(z.string())
});

export const policiesResponseSchema = z.object({
  policies: z.array(policySchema),
  tools: z.array(toolSchema)
});

export const teamResponseSchema = z.object({
  teams: z.array(teamSchema),
  users: z.array(userSchema),
  subscriptions: z.array(subscriptionSchema)
});

export const auditResponseSchema = z.array(auditLogSchema);
export const subscriptionsResponseSchema = z.array(subscriptionSchema);
export const toolsResponseSchema = z.array(toolSchema);
export const riskFindingsResponseSchema = z.array(riskFindingSchema);
