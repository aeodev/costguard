# UI Style Guide

## Visual Direction
- Dark mode default with persistent light-mode toggle.
- Slate/neutral base palette with emerald and sky accents.
- High-contrast text hierarchy for dense governance data.

## Typography
- Page titles: `text-3xl` or `text-2xl`, semibold.
- Section headings: `text-xl` or `text-lg`.
- Metadata labels: `text-xs uppercase tracking-wide`.
- Body copy: `text-sm` with clear line-height.

## Spacing
- Page vertical rhythm: `space-y-6` or `space-y-8`.
- Card padding: `p-5` default.
- Filter/action rows: `gap-2` or `gap-3`.

## Core Components
- `Card` for visual grouping of related data.
- `PageHeader` for title, subheading, and action cluster.
- `Table` for subscriptions/risk/audit/user datasets.
- `Badge` for status/severity/role emphasis.
- `Modal` for sync summaries and request flows.
- `ErrorState`, `EmptyState`, `Skeleton` for non-happy path UX.

## Interaction Principles
- Primary action is always visible near the page heading.
- Mutations show toast feedback and trigger query invalidation.
- Error states show retry and request ID when available.

## Do / Don't
- Do keep controls explicit and auditable.
- Do keep policy and risk terms consistent across pages.
- Do not present empty pages or unlabeled metrics.
- Do not hide side effects of sync or policy changes.
