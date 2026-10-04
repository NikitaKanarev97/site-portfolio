/** Preview only. Facts: cases/agent-ops-console.ts. Screens: real prototype, fixture data. */
import { defineStory, type LegacyKitStory } from '../cases/story';
const pilot = '/media/pilot-agent-ops';
const PROTOTYPE = 'https://agent-ops-console.vercel.app';
const material = {
  theme: 'agent', plate: 'dark',
  cover: {
    title: 'Agent Ops',
    outcome: 'Between a promise and a payout: a person.',
    media: {
      variant: 'proof', layout: 'interlock', gate: 'Human review', eyebrow: 'AI support · Billing · Human oversight',
      caption: 'Payout + message · prototype data',
      shot: { src: `${pilot}/consequences-1440.webp`, srcNarrow: `${pilot}/consequences-390.webp`, alt: 'Two real prototype panels: the $340 payout and the exact message sent on approval', device: 'panel' },
      panels: [
        { src: `${pilot}/message-1440.webp`, srcNarrow: `${pilot}/message-390.webp`, alt: 'The complete customer message that approval will send', device: 'panel' },
        { src: `${pilot}/payout-1440.webp`, srcNarrow: `${pilot}/payout-390.webp`, alt: 'The complete $340 payout preview, before approval', device: 'panel' },
      ],
    },
  },
  facts: [
    { term: 'Client', value: 'NDA · B2B SaaS, billing' },
    { term: 'Year', value: '2026' },
    { term: 'Role', value: 'Sole product designer' },
    { term: 'Platform', value: 'Web, desktop-first' },
    { term: 'Evidence', value: 'User-tested, accepted' },
    { term: 'Prototype', value: 'Live, invented data', href: PROTOTYPE },
  ],
  challenge: {
    label: 'Challenge', thesis: 'Read the promises, not the chats',
    body: 'The agent closed 61% of contacts alone. Then it promised fourteen refunds under an expired promotion: $23,000. The team of 24 would not grow. Reviewing every conversation was impossible.',
    numbers: [
      { value: '1,770', caption: 'agent-closed chats per day' },
      { value: '71', caption: 'commitments per day · estimate' },
      { value: '2.4 h', caption: 'daily review time · estimate' },
    ],
  },
  estimateNote: 'Design estimates: 177 hours of daily chat review, requiring 25 reviewers, versus 2.4 hours to review commitments. These are not measured savings.',
  steps: {
    label: 'Cause → promise → decision', variant: 'focus', composition: 'checkpoint', gate: 'Human review',
    items: [
      {
        label: 'Find the cause', thesis: 'Seventeen chats. One cause.',
        body: 'I put repeating causes above individual chats and ranked them by financial exposure. One expired article becomes one correction at the source, rather than seventeen separate verdicts.',
        layout: 'wide', scene: 'overview', caption: 'Cause clusters · prototype data',
        shot: { src: `${pilot}/clusters-framed-1440.webp`, srcNarrow: `${pilot}/clusters-framed-390.webp`, alt: 'Four complete cause clusters: expired promotion, extended trial, unsupported SLA and legacy price', device: 'panel' },
      },
      {
        label: 'Check the promise', thesis: 'The promise and the proof',
        body: 'A hard case once crossed five tools. I brought the conversation, trace and verdict together; the transcript flags the unsupported claim.',
        layout: 'wide', scene: 'workspace', caption: 'Workspace / transcript · $420 fixture',
        shot: { src: `${pilot}/run-context.webp`, srcNarrow: `${pilot}/transcript-framed-390.webp`, alt: 'Run workspace with conversation, evidence and verdict; narrow view shows its complete transcript panel', device: 'panel' },
      },
      {
        label: 'Read the promise', thesis: 'The promise lacks proof',
        body: 'The conversation stays intact. An unsupported refund claim is flagged at the exact message, so the reviewer sees what the customer was told.',
        layout: 'wide', scene: 'promise', caption: 'Same $420 fixture · complete transcript', desktopOnly: true,
        shot: { src: `${pilot}/transcript-framed-1440.webp`, srcNarrow: `${pilot}/transcript-framed-390.webp`, alt: 'Six real prototype turns, with an unsupported refund promise explicitly flagged', device: 'panel' },
      },
      {
        label: 'Approve the consequence', thesis: 'Money waits for a person',
        body: 'A refund waits for a person. The amount, policy and customer message are visible before approval. Rejecting remains available even when evidence is incomplete.',
        layout: 'split', scene: 'decision', caption: '$340 approval · separate prototype fixture',
        shot: { src: `${pilot}/approval-card-1440.webp`, srcNarrow: `${pilot}/approval-card-390.webp`, alt: 'Complete $340 refund approval card: customer, reason, policy, billing, history and both actions', device: 'panel' },
      },
    ],
  },
  details: {
    label: 'A closer look', thesis: 'A missing record is part of the evidence',
    body: 'An empty trace can mean an invented answer or missing vendor data. I made the gap explicit, so the reviewer can distinguish a policy match from the article the agent never consulted.',
    callout: {
      src: `${pilot}/evidence-1440.webp`, srcNarrow: `${pilot}/evidence-390.webp`,
      alt: 'Complete evidence panel: intent, policy match, missing article warning, billing call and written commitment',
      marks: [
        { x: 98, y: 28, text: 'A policy match is recorded' },
        { x: 98, y: 46, text: 'The skipped article is named' },
        { x: 98, y: 76, text: 'The billing call carries the amount' },
        { x: 98, y: 89, text: 'The promise is now in writing' },
      ],
      caption: 'Evidence panel · prototype data',
    },
  },
  result: {
    label: 'Outcome', thesis: 'Tested, reworked and accepted',
    body: 'User testing informed the revisions. The client accepted the prototype: nineteen screens across three roles. Implementation remained with the client.',
    cards: [],
  },
  closing: [
    { term: 'The trade-off', value: 'Every payout now waits for a person. Oversight gives control back, but sacrifices automation at the point where money moves.' },
    { term: 'Scope', value: 'Research, IA, UX/UI, the design system and a tested prototype. Brief to acceptance: up to one month.' },
  ],
  prototype: { label: 'Open the live prototype, on invented data', href: PROTOTYPE },
} satisfies LegacyKitStory;

/** The accepted composition, expressed as ordered modules without a new art pass. */
export const agentOpsPilot = defineStory({
  theme: material.theme, plate: material.plate, cover: material.cover, facts: material.facts,
  blocks: [
    { id: 'review-load', type: 'numbers', motion: 'count', evidenceId: 'agent-estimates',
      payload: { thesis: material.challenge, items: material.challenge.numbers, note: material.estimateNote } },
    { id: 'human-checkpoint', type: 'steps', motion: 'focus', evidenceId: 'agent-panels', mediaId: 'agent-workspace', payload: material.steps },
    { id: 'missing-evidence', type: 'detail', evidenceId: 'agent-panels', mediaId: 'agent-evidence',
      payload: { thesis: material.details, callout: material.details.callout } },
    { id: 'accepted-prototype', type: 'outcome', motion: 'static', evidenceId: 'agent-acceptance',
      payload: { result: material.result,
        tradeoff: { label: material.closing[0].term, text: material.closing[0].value },
        evidence: { label: material.closing[1].term, text: material.closing[1].value } } },
  ],
  prototype: material.prototype,
});
