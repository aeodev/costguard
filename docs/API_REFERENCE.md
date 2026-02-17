# API Reference

Base URL: `http://localhost:4000`

## Envelope Contract
- Success: `{ "ok": true, "data": ..., "requestId": "..." }`
- Error: `{ "ok": false, "error": { "code": "...", "message": "..." }, "requestId": "..." }`

## Public Endpoints
- `GET /health`
- `POST /auth/login`

## Protected Endpoints
- `GET /me`
- `GET /org/overview`
- `GET /subscriptions?toolId=&teamId=&status=&personal=&q=`
- `POST /subscriptions/:id/cancel`
- `POST /subscriptions/:id/mark-personal`
- `POST /subscriptions/:id/request-sso`
- `GET /spend/summary?range=30d|90d`
- `GET /risk/findings?severity=&status=&q=`
- `POST /risk/:id/resolve`
- `GET /policies`
- `POST /policies`
- `GET /integrations`
- `POST /integrations/mock-sync`
- `GET /audit?action=&actor=&range=`
- `GET /team`

## Example: Login
Request:
```http
POST /auth/login
Content-Type: application/json

{ "email": "admin@aicostguard.dev", "password": "password123" }
```

Response:
```json
{
  "ok": true,
  "data": {
    "token": "mock.user_001.abcd...",
    "user": { "id": "user_001", "email": "admin@aicostguard.dev" }
  },
  "requestId": "c4f2..."
}
```

## Example: Policy Upsert
Request:
```http
POST /policies
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Acme AI Governance Baseline",
  "rules": {
    "allowlistedToolIds": ["tool_chatgpt", "tool_claude"],
    "requireSSO": true,
    "banPersonalAccounts": true,
    "monthlySpendCap": 45000
  }
}
```

Response:
```json
{
  "ok": true,
  "data": {
    "id": "policy_001",
    "name": "Acme AI Governance Baseline",
    "updatedAt": "2026-02-17T..."
  },
  "requestId": "0d83..."
}
```

## Example: Mock Sync
Request:
```http
POST /integrations/mock-sync
Authorization: Bearer <token>
```

Response:
```json
{
  "ok": true,
  "data": {
    "addedSubscriptions": 3,
    "addedSpendEvents": 10,
    "addedRiskFindings": 2,
    "auditEntriesCreated": 16,
    "subscriptionIds": ["sub_036", "sub_037", "sub_038"],
    "findingIds": ["risk_016", "risk_017"]
  },
  "requestId": "7fd5..."
}
```
