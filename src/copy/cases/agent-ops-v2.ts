/** Editorial master. Facts: Agent-ops-console/outputs/case-study.md.
 * Images: audit/agent-ops-v2/capture-manifest.json. No post-launch claims. */
export type AgentShotCopy = { desktop: string; mobile: string; alt: string; caption?: string; fullDesktop?: string; fullMobile?: string };
export type AgentSection = { id: string; label: string; title: string; body: string; shots?: AgentShotCopy[]; note?: string };
export type AgentCaseCopy = {
  meta: { title: string; description: string };
  eyebrow: string; title: string; promise: string; disclosure: string;
  hero: AgentShotCopy;
  facts: { term: string; value: string }[];
  navLabel: string;
  sections: AgentSection[];
  contextLabel: string;
  metrics: { value: string; label: string }[];
  flow: { name: string; text: string }[];
  outcome: { label: string; title: string; body: string; changeLabel: string; change: string; tradeLabel: string; trade: string; scopeLabel: string; scope: string; cta: string; href: string; note: string };
  home: { label: string; title: string; body: string; alt: string };
};
const shot = (key: string, alt: string, caption: string, mobile = `${key}-mobile`): AgentShotCopy => ({ desktop: `${key}-desktop`, mobile, alt, caption, fullMobile: mobile === `${key}-mobile` ? undefined : `${key}-mobile` });
export const agentCaseEn: AgentCaseCopy = {
  meta: { title: 'Agent Ops Console — human oversight for consequential AI decisions', description: 'Designing traceable human oversight for an AI support agent: risk-based review, financial approvals, verified policies and evidence-led autonomy. A user-tested, client-accepted prototype.' },
  eyebrow: 'B2B SaaS · AI operations', title: 'Agent Ops Console',
  promise: 'Human oversight for AI decisions with real consequences.',
  disclosure: 'Client under NDA. All names, accounts and figures inside the interface are synthetic.',
  hero: { desktop: 'approval-task-desktop', mobile: 'approval-task-mobile', fullDesktop: 'action-approvals-desktop', fullMobile: 'action-approvals-mobile', alt: 'Action Approvals V1.1: Ferrum Logistics requests a $120 invoice credit. Policy, billing history, customer message and approve or reject actions remain together.', caption: 'Action Approvals · the commitment, its consequences and the human decision' },
  facts: [
    { term: 'My role', value: 'Sole product designer' },
    { term: 'Year / duration', value: '2026 · up to one month' },
    { term: 'Platform', value: 'Responsive web · React / Storybook' },
    { term: 'Delivery', value: 'User-tested prototype · accepted by the client' },
  ],
  navLabel: 'Inside this case', contextLabel: 'Client-provided history · before this project',
  metrics: [ { value: '61%', label: 'of contacts resolved by the AI agent' }, { value: '4.4', label: 'CSAT reported by the vendor' }, { value: '$23,000', label: 'paid after 14 outdated-promotion promises' } ],
  sections: [
    { id: 'problem', label: '01 · The problem', title: 'The agent resolved conversations. It also made promises nobody could see.', body: 'The client handled subscription billing for around 40,000 business customers. The vendor’s dashboard showed successful resolutions and satisfied customers. Then fourteen refunds promised under an expired promotion surfaced, roughly nineteen days later. The company paid $23,000. The missing measure was the consequence of an apparently successful conversation.' },
    { id: 'operating-model', label: '02 · The operating model', title: 'Review the commitments, not every message.', body: 'A team of 24, spread across three time zones, could not read every automated conversation. I made the commitment the unit of review: a refund, a credit, a plan change or a consequential promise. Repeated causes become clusters, so a reviewer can fix one source instead of repeating the same investigation fourteen times.' },
    { id: 'investigation', label: '03 · Detect and investigate', title: 'Find the costly pattern. Verify the individual decision.', body: 'The queue ranks open financial exposure and separates common-cause clusters from individual runs. Opening a run brings the written promise, its sources, billing calls and missing checks into one workspace with the verdict. A polished answer is no longer enough: the reviewer can inspect what supports it and what fails.', shots: [
      shot('review-queue', 'Review Queue V2: $18,430 open exposure, four cause clusters and 91 single runs; expired promotion is the largest cluster.', 'Review Queue · one repeated cause above the individual conversations it affects'),
      shot('run-detail', 'Run Detail: Nordwind GmbH’s $1,120 promise, five findings, conversation, expired knowledge-base source, billing trace and verdict.', 'Run Detail · a single run, not a member of the promotion cluster; evidence stays next to the verdict', 'run-evidence-mobile'),
    ] },
    { id: 'checkpoint', label: '04 · The human checkpoint', title: 'A financial action waits for an accountable person.', body: 'The request exposes the amount, policy, billing method, history and time remaining before the decision. The credit and the customer-visible message sit together. Here, $120 becomes a credit on the next invoice; no cash leaves the account. The action opens a final check, and rejection requires a reason that can be routed to the source.', shots: [
      { desktop: 'approval-task-desktop', mobile: 'approval-task-mobile', fullDesktop: 'action-approvals-desktop', fullMobile: 'action-approvals-mobile', alt: 'Complete selected approval for Ferrum Logistics: $120 service credit, policy and history, invoice credit consequences, customer message, Approve $120 and Reject with reason.', caption: 'Action Approvals · approve the actual billing consequence, not just the agent’s wording' },
    ], note: 'Trade-off · human intervention deliberately reduces automation at the boundary of financial consequences.' },
    { id: 'policy', label: '05 · Fix the source', title: 'Correct the rule. Verify what the agent actually runs.', body: 'The policy draft preserves the originating cluster, region, capability, limit and approval authority. The version comparison then separates approval, application and confirmation by the agent. In this fixture, v5 is approved and applied, but the agent still confirms v4. That mismatch stays visible; it cannot be presented as a successful rollout.', shots: [
      shot('policy-editor', 'Policy Editor V1: a cluster-originated refund-cap draft, €250 to €120, its scope, reason and four-step approval chain.', 'Policy Editor · the source, boundary and authority travel with the change', 'policy-boundary-mobile'),
      shot('policy-version-diff', 'Policy Version Diff V1.1: approved v5 is not confirmed. The agent is live on v4, with the rollout mismatch, changed cap and rollout steps visible.', 'Version Diff · approved and applied does not mean confirmed by the agent', 'policy-rollout-mobile'),
    ] },
    { id: 'autonomy', label: '06 · Earn autonomy', title: 'More autonomy needs evidence. A serious defect takes it back.', body: 'Quality makes policy-compliant autonomy the operating measure and opens the runs behind each signal. The ladder grants permissions by capability, with evidence thresholds and a visible next boundary. Readiness is not permission. A severity-1 defect automatically lowers the affected capability; clean evidence and an explicit human decision are needed before it can rise again.', shots: [
      shot('quality-dashboard', 'Quality Dashboard V1.2: complete Yesterday dataset, policy-compliant autonomy and five fixed operating signals, each with records and thresholds.', 'Quality · synthetic operating signals with an explicit date, scope and coverage'),
      shot('autonomy', 'Autonomy V1.1: ready, holding and automatically lowered capabilities. Refund has fallen from L3 to L2 after a severity-1 defect.', 'Autonomy · promotion is earned per capability; the safety fuse can lower it automatically'),
    ] },
  ],
  flow: [ { name: 'Conversations', text: 'Find consequential promises' }, { name: 'Exposure', text: 'Group causes and rank risk' }, { name: 'Human review', text: 'Verify evidence and decide' }, { name: 'Policy', text: 'Correct and confirm the source' }, { name: 'Quality', text: 'Inspect operating evidence' }, { name: 'Autonomy', text: 'Grant or withdraw a boundary' } ],
  outcome: {
    label: '07 · The outcome', title: 'Tested with users. Reworked. Accepted by the client.',
    body: 'I delivered the interactive prototype after research with the client and current and future users, then tested and revised it. The client accepted the work and took implementation forward independently. The outcome evidenced here is the tested design and working prototype.',
    changeLabel: 'What testing changed', change: 'Reviewers needed to see a cluster’s members and exclude false matches before trusting a grouped correction. Testing also led to a short undo window for an incorrect verdict.',
    tradeLabel: 'The deliberate cost', trade: 'A person interrupts automation where money or policy is at stake. Missing evidence and unconfirmed changes remain visible until someone resolves them.',
    scopeLabel: 'My scope', scope: 'Research, requirements, information architecture, product UX/UI, design system, interactive React / Storybook prototype and testing.',
    cta: 'Public prototype — earlier version', href: 'https://agent-ops-console.vercel.app/', note: 'The public demo predates these accepted screens. Client under NDA · synthetic interface data.',
  },
  home: { label: 'AI supervision · the human checkpoint', title: 'A credit. A customer promise. One accountable decision.', body: 'See the billing consequence and the exact message before anything is approved.', alt: 'Actual Action Approvals V1.1 consequences: $120 is credited on the next invoice, with the customer’s message alongside it.' },
};

export function assertAgentPair(en: AgentCaseCopy, ru: AgentCaseCopy) {
  if (en.sections.map(s => s.id).join() !== ru.sections.map(s => s.id).join()) throw new Error('Agent Ops EN/RU sections differ');
  for (let i = 0; i < en.sections.length; i++) {
    const a = en.sections[i].shots ?? [], b = ru.sections[i].shots ?? [];
    if (a.map(s => s.desktop + s.mobile).join() !== b.map(s => s.desktop + s.mobile).join()) throw new Error(`Agent Ops EN/RU imagery differs in ${en.sections[i].id}`);
  }
  if (en.facts.length !== ru.facts.length || en.flow.length !== ru.flow.length || en.metrics.length !== ru.metrics.length) throw new Error('Agent Ops EN/RU structure differs');
}
