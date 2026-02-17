import type { AuditLog, Integration, Org, Policy, RiskFinding, SpendEvent, Subscription, Team, Tool, User } from '@aicostguard/shared';

const now = new Date();
const isoDaysAgo = (days: number): string => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const orgSeed: Org = {
  id: 'org_001',
  name: 'Acme Labs',
  plan: 'Growth',
  renewalDate: isoDaysAgo(-45)
};

export const teamsSeed: Team[] = [
  { id: 'team_platform', name: 'Platform' },
  { id: 'team_product', name: 'Product' },
  { id: 'team_growth', name: 'Growth' },
  { id: 'team_data', name: 'Data' }
];

export const usersSeed: User[] = [
  {
    id: 'user_001',
    name: 'Ava Patel',
    email: 'admin@aicostguard.dev',
    teamId: 'team_platform',
    role: 'admin',
    createdAt: isoDaysAgo(365)
  },
  {
    id: 'user_002',
    name: 'Noah Kim',
    email: 'admin2@aicostguard.dev',
    teamId: 'team_data',
    role: 'admin',
    createdAt: isoDaysAgo(330)
  },
  {
    id: 'user_003',
    name: 'Mia Foster',
    email: 'member1@aicostguard.dev',
    teamId: 'team_product',
    role: 'member',
    createdAt: isoDaysAgo(310)
  },
  {
    id: 'user_004',
    name: 'Liam Reyes',
    email: 'liam.reyes@aicostguard.dev',
    teamId: 'team_platform',
    role: 'member',
    createdAt: isoDaysAgo(280)
  },
  {
    id: 'user_005',
    name: 'Sofia Clark',
    email: 'sofia.clark@aicostguard.dev',
    teamId: 'team_growth',
    role: 'member',
    createdAt: isoDaysAgo(275)
  },
  {
    id: 'user_006',
    name: 'Ethan Brooks',
    email: 'ethan.brooks@aicostguard.dev',
    teamId: 'team_data',
    role: 'member',
    createdAt: isoDaysAgo(250)
  },
  {
    id: 'user_007',
    name: 'Olivia Price',
    email: 'olivia.price@aicostguard.dev',
    teamId: 'team_product',
    role: 'member',
    createdAt: isoDaysAgo(240)
  },
  {
    id: 'user_008',
    name: 'Lucas Ward',
    email: 'lucas.ward@aicostguard.dev',
    teamId: 'team_growth',
    role: 'member',
    createdAt: isoDaysAgo(220)
  },
  {
    id: 'user_009',
    name: 'Amelia Ross',
    email: 'amelia.ross@aicostguard.dev',
    teamId: 'team_data',
    role: 'member',
    createdAt: isoDaysAgo(205)
  },
  {
    id: 'user_010',
    name: 'James Cole',
    email: 'james.cole@aicostguard.dev',
    teamId: 'team_platform',
    role: 'member',
    createdAt: isoDaysAgo(190)
  },
  {
    id: 'user_011',
    name: 'Harper West',
    email: 'harper.west@aicostguard.dev',
    teamId: 'team_product',
    role: 'member',
    createdAt: isoDaysAgo(176)
  },
  {
    id: 'user_012',
    name: 'Benjamin Yu',
    email: 'benjamin.yu@aicostguard.dev',
    teamId: 'team_growth',
    role: 'member',
    createdAt: isoDaysAgo(160)
  }
];

export const toolsSeed: Tool[] = [
  {
    id: 'tool_chatgpt',
    name: 'ChatGPT',
    category: 'assistant',
    vendorRiskTier: 'medium',
    supportsSSO: true,
    dataRetentionDays: 30,
    website: 'https://chat.openai.com'
  },
  {
    id: 'tool_claude',
    name: 'Claude',
    category: 'assistant',
    vendorRiskTier: 'medium',
    supportsSSO: true,
    dataRetentionDays: 30,
    website: 'https://claude.ai'
  },
  {
    id: 'tool_cursor',
    name: 'Cursor',
    category: 'coding',
    vendorRiskTier: 'medium',
    supportsSSO: true,
    dataRetentionDays: 45,
    website: 'https://cursor.com'
  },
  {
    id: 'tool_copilot',
    name: 'GitHub Copilot',
    category: 'coding',
    vendorRiskTier: 'low',
    supportsSSO: true,
    dataRetentionDays: 30,
    website: 'https://github.com/features/copilot'
  },
  {
    id: 'tool_perplexity',
    name: 'Perplexity',
    category: 'search',
    vendorRiskTier: 'medium',
    supportsSSO: false,
    dataRetentionDays: 90,
    website: 'https://www.perplexity.ai'
  },
  {
    id: 'tool_notion_ai',
    name: 'Notion AI',
    category: 'productivity',
    vendorRiskTier: 'low',
    supportsSSO: true,
    dataRetentionDays: 365,
    website: 'https://www.notion.so/product/ai'
  },
  {
    id: 'tool_midjourney',
    name: 'Midjourney',
    category: 'image',
    vendorRiskTier: 'high',
    supportsSSO: false,
    dataRetentionDays: 120,
    website: 'https://www.midjourney.com'
  },
  {
    id: 'tool_gemini',
    name: 'Gemini',
    category: 'assistant',
    vendorRiskTier: 'medium',
    supportsSSO: true,
    dataRetentionDays: 60,
    website: 'https://gemini.google.com'
  },
  {
    id: 'tool_codeium',
    name: 'Codeium',
    category: 'coding',
    vendorRiskTier: 'medium',
    supportsSSO: false,
    dataRetentionDays: 60,
    website: 'https://codeium.com'
  },
  {
    id: 'tool_jasper',
    name: 'Jasper',
    category: 'copywriting',
    vendorRiskTier: 'medium',
    supportsSSO: false,
    dataRetentionDays: 180,
    website: 'https://www.jasper.ai'
  }
];

const planCost: Record<string, number> = {
  Free: 0,
  Pro: 25,
  Team: 39,
  Business: 65,
  Enterprise: 95
};

const plans = ['Pro', 'Team', 'Business', 'Enterprise', 'Team'];

export const subscriptionsSeed: Subscription[] = Array.from({ length: 35 }, (_, index) => {
  const user = usersSeed[(index * 5) % usersSeed.length];
  const tool = toolsSeed[(index * 3) % toolsSeed.length];
  const plan = plans[index % plans.length];

  return {
    id: `sub_${String(index + 1).padStart(3, '0')}`,
    toolId: tool.id,
    userId: user.id,
    plan,
    seatCostMonthly: planCost[plan],
    status: index % 6 === 0 ? 'canceled' : 'active',
    startedAt: isoDaysAgo(15 + ((index * 4) % 210)),
    isPersonal: index % 8 === 0 || index % 11 === 0
  };
});

const spendTypes: SpendEvent['type'][] = ['seat', 'api', 'overage'];

export const spendEventsSeed: SpendEvent[] = Array.from({ length: 120 }, (_, index) => {
  const dayOffset = 89 - (index % 90);
  const tool = toolsSeed[index % toolsSeed.length];
  const team = teamsSeed[index % teamsSeed.length];
  const type = spendTypes[index % spendTypes.length];
  const base = type === 'seat' ? 80 : type === 'api' ? 140 : 60;

  return {
    id: `spend_${String(index + 1).padStart(3, '0')}`,
    toolId: tool.id,
    amount: base + ((index * 17) % 90),
    currency: 'USD',
    occurredAt: isoDaysAgo(dayOffset),
    type,
    teamId: team.id
  };
});

const riskTypes = [
  'shadow_ai',
  'personal_account',
  'sso_gap',
  'retention_risk',
  'spend_anomaly',
  'unsanctioned_tool',
  'sso_gap',
  'retention_risk',
  'shadow_ai',
  'personal_account',
  'usage_spike',
  'allowlist_violation',
  'retention_risk',
  'policy_drift',
  'sso_gap'
];

const riskSeverities: RiskFinding['severity'][] = [
  'high',
  'high',
  'high',
  'high',
  'high',
  'high',
  'med',
  'med',
  'med',
  'med',
  'med',
  'low',
  'low',
  'low',
  'low'
];

export const riskFindingsSeed: RiskFinding[] = Array.from({ length: 15 }, (_, index) => {
  const tool = toolsSeed[(index * 2) % toolsSeed.length];
  const user = usersSeed[(index * 3) % usersSeed.length];

  return {
    id: `risk_${String(index + 1).padStart(3, '0')}`,
    severity: riskSeverities[index],
    type: riskTypes[index],
    title: `${tool.name} governance finding ${index + 1}`,
    description: `${tool.name} has policy posture drift tied to ${riskTypes[index].replace('_', ' ')} for ${user.email}.`,
    toolId: tool.id,
    userId: user.id,
    detectedAt: isoDaysAgo(1 + index * 2),
    status: index % 4 === 0 ? 'resolved' : 'open'
  };
});

export const policiesSeed: Policy[] = [
  {
    id: 'policy_001',
    name: 'Acme AI Governance Baseline',
    rules: {
      allowlistedToolIds: [
        'tool_chatgpt',
        'tool_claude',
        'tool_cursor',
        'tool_copilot',
        'tool_perplexity',
        'tool_notion_ai'
      ],
      requireSSO: true,
      banPersonalAccounts: true,
      monthlySpendCap: 45000
    },
    updatedAt: isoDaysAgo(3)
  }
];

export const integrationsSeed: Integration[] = [
  {
    id: 'int_google_workspace',
    name: 'Google Workspace',
    status: 'connected',
    description: 'Discovers OAuth-backed AI apps and account ownership.',
    lastSyncAt: isoDaysAgo(0)
  },
  {
    id: 'int_okta',
    name: 'Okta',
    status: 'connected',
    description: 'Validates SSO enforcement and deprovisioning posture.',
    lastSyncAt: isoDaysAgo(1)
  },
  {
    id: 'int_ramp_brex',
    name: 'Ramp / Brex',
    status: 'not_connected',
    description: 'Maps expense-card AI purchases to business units.',
    lastSyncAt: null
  },
  {
    id: 'int_github',
    name: 'GitHub',
    status: 'connected',
    description: 'Tracks coding-assistant adoption by engineering team.',
    lastSyncAt: isoDaysAgo(2)
  }
];

const auditActions = [
  'auth.login',
  'subscription.created',
  'subscription.canceled',
  'subscription.mark_personal',
  'risk.created',
  'risk.resolved',
  'policy.updated',
  'integration.sync'
];

export const auditLogsSeed: AuditLog[] = Array.from({ length: 28 }, (_, index) => {
  const actor = usersSeed[index % usersSeed.length];
  const action = auditActions[index % auditActions.length];
  const targetType = action.startsWith('risk')
    ? 'risk'
    : action.startsWith('policy')
      ? 'policy'
      : action.startsWith('integration')
        ? 'integration'
        : 'subscription';

  return {
    id: `audit_${String(index + 1).padStart(3, '0')}`,
    actorUserId: actor.id,
    action,
    targetType,
    targetId:
      targetType === 'risk'
        ? riskFindingsSeed[index % riskFindingsSeed.length]?.id ?? 'risk_001'
        : targetType === 'policy'
          ? 'policy_001'
          : targetType === 'integration'
            ? integrationsSeed[index % integrationsSeed.length]?.id ?? 'int_google_workspace'
            : subscriptionsSeed[index % subscriptionsSeed.length]?.id ?? 'sub_001',
    createdAt: isoDaysAgo(1 + (index % 45)),
    meta: {
      source: 'seed',
      note: 'Historical governance event'
    }
  };
});
