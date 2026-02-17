# AICostGuard Master Plan

## Product Thesis
AI adoption is now fragmented across teams, payment methods, and vendors. Most organizations cannot answer three basic questions quickly: what AI tools are in use, how much they cost, and which ones create governance risk. AICostGuard is the operating layer that unifies those answers and turns them into actionable controls.

## ICP and Buyer Roles
- ICP: Mid-market and enterprise companies with 100-5000 employees and cross-functional AI tool adoption.
- Primary buyer: CFO (spend control, consolidation, renewal readiness).
- Co-buyer: CISO (risk posture, policy coverage, auditability).
- Key champion: VP Engineering (team productivity with practical guardrails).

## MVP Scope (Included)
- Subscription discovery dataset (mock integrations).
- Spend tracking for seat, API, and overage events.
- Risk findings with severity and resolution workflows.
- Policy editor for allowlist, SSO requirement, personal-account ban, and monthly spend cap.
- Integration sync simulation with deterministic diff output.
- Audit feed with actor/action/target/meta filters.
- Team and settings views.
- Marketing site, docs overview, contact funnel, and blog.

## Roadmap
### MVP
- In-memory deterministic environment for fast product iteration.
- Shared schema contract between API and web.
- Core governance workflows from discovery to remediation.

### v1
- Persistent datastore and background sync jobs.
- Production connectors (Google Workspace, Okta, Ramp/Brex, GitHub).
- Notification rules for SLA and policy violations.

### v2
- Multi-org tenancy and delegated administration.
- Forecasting and anomaly detection tuned by organization baseline.
- Governance templates by industry and control profile.

## Pricing Strategy
- Starter: foundational visibility and reporting for smaller teams.
- Growth: policy controls, richer analytics, and broader integrations.
- Enterprise: advanced control workflows, long-horizon audit retention, custom onboarding.
- Sales motion: demo-led conversion with role-specific value framing (finance, security, engineering).

## Risks and Mitigations
- Risk: Governance seen as friction by engineering.
  Mitigation: exception-capable controls and transparent remediation workflows.
- Risk: ROI skepticism from finance.
  Mitigation: explicit proxy assumptions and drill-down spend analytics.
- Risk: Integration quality determines trust.
  Mitigation: sync diffs, audit logs, and operational runbook for troubleshooting.
- Risk: Policy drift over time.
  Mitigation: regular policy reviews and measurable policy coverage indicators.
