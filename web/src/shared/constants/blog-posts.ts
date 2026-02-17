export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  sections: BlogSection[];
  cta: {
    title: string;
    description: string;
    label: string;
    to: string;
  };
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'the-new-saas-sprawl-shadow-ai-in-engineering',
    title: 'The New SaaS Sprawl: Shadow AI in Engineering',
    excerpt:
      'Engineering teams are adopting AI at startup speed, but procurement and security controls still move at enterprise speed. That mismatch drives hidden spend and hidden risk.',
    date: '2026-01-23',
    readingTime: '8 min read',
    sections: [
      {
        heading: 'Why shadow AI accelerates in engineering',
        paragraphs: [
          'Developers optimize for flow. If a tool boosts throughput, teams swipe a card and keep moving. Traditional software intake processes often arrive after the buying decision.',
          'The result is fragmented AI usage across coding assistants, chat tools, documentation copilots, and experimental APIs with no unified owner.'
        ],
        bullets: [
          'Expense visibility lags by weeks',
          'Identity controls are inconsistent by team',
          'Duplicate licenses spread across similar tool categories'
        ]
      },
      {
        heading: 'The operational cost of invisible adoption',
        paragraphs: [
          'The immediate issue is not malicious behavior. It is that finance, security, and engineering lose a shared system of record. Without that, every policy discussion starts from incomplete data.',
          'This drives reactive governance: manual spreadsheet audits, broad tool bans, and delayed remediation because no one knows the right owner.'
        ]
      },
      {
        heading: 'How to reduce shadow AI without slowing teams down',
        paragraphs: [
          'Treat discovery as a product capability, not a quarterly exercise. Pair subscription visibility with risk findings and lightweight policy guardrails.',
          'When governance actions are assigned, tracked, and auditable, teams can fix high-impact issues quickly without broad productivity disruption.'
        ]
      }
    ],
    cta: {
      title: 'Build a live inventory before enforcing policy',
      description: 'Start with visibility by team, then prioritize remediation by cost and risk exposure.',
      label: 'See subscriptions',
      to: '/app/subscriptions'
    }
  },
  {
    slug: 'measuring-roi-of-ai-tools-without-spying-on-developers',
    title: 'Measuring ROI of AI Tools Without Spying on Developers',
    excerpt:
      'You can prove value from AI subscriptions using spend and outcome proxies. You do not need invasive employee surveillance to make budget decisions.',
    date: '2026-02-02',
    readingTime: '7 min read',
    sections: [
      {
        heading: 'The ROI trap',
        paragraphs: [
          'Many teams try to connect every dollar of AI spend to individual keystrokes. That creates privacy concerns and still fails to capture real impact on delivery.',
          'A governance platform should prioritize accountable proxy metrics that are transparent, repeatable, and explainable to finance leaders.'
        ]
      },
      {
        heading: 'Use accountable proxy metrics',
        paragraphs: [
          'A strong baseline combines spend trend, per-seat average, usage mix, and estimated time savings. These indicators are directional, but they provide enough signal for portfolio decisions.',
          'Pair these with team-level adoption and policy exceptions so decisions can account for both productivity and control posture.'
        ],
        bullets: [
          'Cost per active seat by team',
          'API vs seat spend composition over time',
          'Estimated hours saved based on calibrated assumptions'
        ]
      },
      {
        heading: 'Keep it auditable',
        paragraphs: [
          'Every recommendation should include assumptions and a request ID trail in case finance or security needs to review the decision path.',
          'Auditability increases trust and prevents ROI metrics from becoming opaque black-box numbers.'
        ]
      }
    ],
    cta: {
      title: 'Track spend and ROI proxies in one dashboard',
      description: 'Use analytics to compare tool efficiency before committing to expansion.',
      label: 'Open analytics',
      to: '/app/analytics'
    }
  },
  {
    slug: 'policy-as-code-for-ai-practical-guardrails',
    title: 'Policy-as-Code for AI: Practical Guardrails',
    excerpt:
      'Policy documents are not controls. Converting governance rules into editable configuration gives teams clear boundaries without blocking delivery.',
    date: '2026-02-11',
    readingTime: '9 min read',
    sections: [
      {
        heading: 'Translate policy language into executable rules',
        paragraphs: [
          'Most AI governance policies already describe intent: allow approved tools, require SSO, ban personal billing, cap spend. The missing step is operationalizing these rules.',
          'Policy-as-code makes those controls visible, versioned, and enforceable in day-to-day workflows.'
        ]
      },
      {
        heading: 'Design for exceptions, not just enforcement',
        paragraphs: [
          'Rigid controls drive more shadow adoption. Practical guardrails include exception paths with ownership, due dates, and audit evidence.',
          'When teams can request temporary exceptions with accountability, policy adherence improves over time.'
        ],
        bullets: [
          'Allowlist management tied to real tools',
          'Personal-account bans with remediation actions',
          'Spend caps that trigger investigation before hard failure'
        ]
      },
      {
        heading: 'Measure policy effectiveness',
        paragraphs: [
          'Policy quality is measured by outcomes: fewer high-risk findings, improved SSO coverage, and reduced duplicate spend.',
          'Review policy metrics weekly and update controls as tool landscape and team behavior evolve.'
        ]
      }
    ],
    cta: {
      title: 'Turn policy text into live controls',
      description: 'Edit allowlists and spend caps, then track the resulting audit trail.',
      label: 'Manage policies',
      to: '/app/policies'
    }
  }
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined =>
  blogPosts.find((post) => post.slug === slug);
