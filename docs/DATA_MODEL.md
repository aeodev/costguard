# AICostGuard Data Model

## Core Entities
- `Tool`: catalog of AI tools, risk tier, SSO support, retention window.
- `User`: organization user with role and team assignment.
- `Team`: business unit grouping for users and spend attribution.
- `Subscription`: per-user tool subscription with plan, status, personal-account flag.
- `SpendEvent`: atomic spend signal by tool/type/date and optional team attribution.
- `RiskFinding`: governance issue with severity, status, and tool/user references.
- `Policy`: active governance ruleset (allowlist + controls + spend cap).
- `AuditLog`: immutable governance event feed with metadata.

## Relationships
- `User.teamId -> Team.id`
- `Subscription.userId -> User.id`
- `Subscription.toolId -> Tool.id`
- `SpendEvent.toolId -> Tool.id`
- `SpendEvent.teamId -> Team.id` (optional)
- `RiskFinding.toolId -> Tool.id` (optional)
- `RiskFinding.userId -> User.id` (optional)
- `AuditLog.actorUserId -> User.id`

## Example Objects
```json
{
  "tool": {
    "id": "tool_chatgpt",
    "name": "ChatGPT",
    "category": "assistant",
    "vendorRiskTier": "medium",
    "supportsSSO": true,
    "dataRetentionDays": 30,
    "website": "https://chat.openai.com"
  },
  "subscription": {
    "id": "sub_001",
    "toolId": "tool_chatgpt",
    "userId": "user_001",
    "plan": "Team",
    "seatCostMonthly": 39,
    "status": "active",
    "startedAt": "2026-01-02T12:00:00.000Z",
    "isPersonal": false
  },
  "policy": {
    "id": "policy_001",
    "name": "Acme AI Governance Baseline",
    "rules": {
      "allowlistedToolIds": ["tool_chatgpt", "tool_claude"],
      "requireSSO": true,
      "banPersonalAccounts": true,
      "monthlySpendCap": 45000
    },
    "updatedAt": "2026-02-14T09:00:00.000Z"
  }
}
```
