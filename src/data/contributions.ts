/**
 * Structured, public-safe version of docs/bayer-contributions-report.md.
 * Internal platform, project, team and event names are intentionally generic.
 */

export interface Mission {
  id: string;
  name: string;
  period: string;
  start: string;
  /** ISO year-month, or null while ongoing. */
  end: string | null;
  roles: string[];
  delivered: string;
}

export const operatingModel = {
  name: 'Dynamic Shared Ownership',
  text: 'Bayer runs on Dynamic Shared Ownership: people join the missions where they add the most value instead of staying in one fixed team. My title stayed Data Analyst, but I held several roles across four missions.',
};

export const missions: Mission[] = [
  {
    id: 'core-asset',
    name: 'Consumer core data asset',
    period: 'Mar 2026 – present',
    start: '2026-03',
    end: null,
    roles: ['Data analyst', 'Scrum master', 'Project coordinator'],
    delivered: 'Rebuilt the asset wiki and data catalog, built the team’s Azure DevOps board and ran its scrum ceremonies, and owned the asset’s metadata artifacts.',
  },
  {
    id: 'talk-to-data',
    name: 'Talk-to-Data pilot',
    period: 'Apr – Jun 2026',
    start: '2026-04',
    end: '2026-06',
    roles: ['Data analyst', 'AI solution tester'],
    delivered: 'Turned marketing business questions into SQL, compared AI assistants, and built and validated Databricks Genie spaces with subject-matter experts.',
  },
  {
    id: 'adoption',
    name: 'UCL adoption squad',
    period: 'Jul 2026 – present',
    start: '2026-07',
    end: null,
    roles: ['Contributor', 'Technical writer', 'Front-end contributor'],
    delivered: 'Promoted enterprise-wide adoption of UCL (Unified Consumption Layer): wrote the UCL federated registry capability card and quick-start guide, and rebuilt the capability roadmap as a filterable release timeline.',
  },
  {
    id: 'semantic-layer',
    name: 'Semantic-layer enablement squad',
    period: 'Sep 2026 – present',
    start: '2026-09',
    end: null,
    roles: ['Repo admin', 'Enablement lead', 'Reviewer'],
    delivered: 'Set up repository governance, CI and the docs site, onboarded six teams, delivered the first pillar data products and wrote design proposals.',
  },
];

export const bayerStats = [
  { value: '37', label: 'pull requests merged', detail: '50 authored' },
  { value: '48', label: 'issues authored', detail: 'user stories + acceptance criteria' },
  { value: '19', label: 'code reviews', detail: 'on 11 pull requests' },
  { value: '108', label: 'commits', detail: 'across 5 repositories' },
  { value: '6', label: 'teams onboarded', detail: 'to the semantic layer' },
  { value: '79', label: 'wiki pages cleaned', detail: '886 duplicated lines removed in one PR' },
];

export const goldenTest = {
  product: 'pillar-data-product',
  passed: 4,
  total: 4,
  averageScore: 4.57,
  maxScore: 5,
  verdict: 'Go',
  findings: [
    'The agent stated a business rule that is not documented in the glossary or precedence rules. Asked the steward to document it, or for the agent to stop stating it.',
    'Rounding in prose, and technical column names shown to business users.',
    'The golden set was too small and too easy. Proposed multi-wave, edge-case and out-of-scope tests.',
  ],
};

export const metadataArtifacts = [
  { name: 'Governance contract', purpose: 'Ownership, purpose and terms of use' },
  { name: 'Terminology registry', purpose: 'Business glossary for the product' },
  { name: 'Table data dictionary', purpose: 'Column-level definitions' },
  { name: 'Semantic precedence rules', purpose: 'Which definition wins when sources disagree' },
  { name: 'Technical access', purpose: 'How consumers get access' },
  { name: 'Golden queries', purpose: 'Reference questions and expected SQL' },
];

export const aiWorkflow = {
  rule: 'AI drafts, I decide.',
  steps: [
    { who: 'human', step: 'frame()', text: 'I define the problem, the constraints and what “done” means.' },
    { who: 'ai', step: 'draft()', text: 'Cursor, GitHub Copilot, Claude or Databricks Genie drafts code, docs, analyses or options.' },
    { who: 'human', step: 'review()', text: 'I review, test and validate: strict builds, unit tests, type checks, visual checks.' },
    { who: 'human', step: 'decide()', text: 'I make the call, own it, and disclose when an analysis came from a model.' },
  ],
  examples: [
    'Posted a model-generated option analysis labelled as such, then argued my own position separately. It changed the recommendation.',
    'Tested an AI data product with AI: sent each golden question to the agent platform via MCP and compared answers and SQL with the golden set.',
    'Built a docs-site workflow diagram, CI workflows and infrastructure-as-code changes with Cursor agents, each PR carrying its own validation evidence.',
  ],
};

export type DecisionStatus = 'accepted' | 'proposed';

export interface Decision {
  id: string;
  title: string;
  status: DecisionStatus;
  context: string;
  decision: string;
  why?: string;
  role: string;
}

export const decisions: Decision[] = [
  {
    id: 'ADR-001',
    title: 'Native GitHub controls instead of custom CI for access control',
    status: 'accepted',
    context: 'Analysts and stewards needed to edit semantics freely without being able to change the engine.',
    decision: 'CODEOWNERS as an allowlist, a push ruleset and an admin team, instead of my own custom path-guard CI. I closed my own PR three days after opening it.',
    why: 'Platform-native controls over custom code someone has to maintain. It also removed a second admin list and a check that read its rules from the PR it was checking.',
    role: 'Designed, implemented and documented it, and wrote the admin rollout runbook.',
  },
  {
    id: 'ADR-002',
    title: 'Pillar data products, not one monolith',
    status: 'accepted',
    context: 'One large marketing analytics data product could not be reviewed as a whole. Pillars had different owners and licensing, and reviewer time was scarce.',
    decision: 'Independent pillar data products, composed later into one product, with table semantics reusable across products. Drafts merged with deployment flags off.',
    role: 'Co-designed the structure, wrote the decision record, and enforced it as reviewer.',
  },
  {
    id: 'ADR-003',
    title: 'Minimum viable metadata',
    status: 'accepted',
    context: 'Teams were stalling on schemas with hundreds of fields.',
    decision: 'Publish with about 10 core fields, check the product in the registry, then iterate.',
    why: 'Lowers the entry barrier and gets real feedback early.',
    role: 'My own principle, applied in every onboarding.',
  },
  {
    id: 'ADR-004',
    title: 'Schema evolution: never add mandatory fields',
    status: 'proposed',
    context: 'Artifact schemas, registry schemas and mappings change over time, and version fields were inconsistent.',
    decision: 'New fields always arrive as optional (minor). Renames and removals are major versions, migrated by script in one bot PR. One unified schema-version block replaces three inconsistent fields.',
    why: 'If the rule holds, “regenerate and redeploy everything” always works and the engine stays simple.',
    role: 'Disclosed the AI option analysis, then wrote and defended my own position.',
  },
  {
    id: 'ADR-005',
    title: 'Unstructured reports as their own data product',
    status: 'accepted',
    context: 'Third-party market research reports needed to be usable by agents.',
    decision: 'Report files become a separate data product. Vectorized content is agent context, not a data product, and semantics live as metadata on document chunks.',
    role: 'Agreed with the proposal and documented the architecture and ingestion flow.',
  },
  {
    id: 'ADR-006',
    title: 'Mermaid → draw.io on the wiki',
    status: 'accepted',
    context: 'The wiki’s rendering backend could not draw Mermaid diagrams.',
    decision: 'Convert every diagram to draw.io.',
    role: 'Converted, validated the XML, and confirmed no Mermaid blocks remained.',
  },
  {
    id: 'ADR-007',
    title: 'An informative roadmap without percentages',
    status: 'accepted',
    context: 'An adoption dashboard was ranking business units against each other.',
    decision: 'Replace percentages with short “published” cards linking to documentation, on a filterable quarter × architecture timeline.',
    role: 'Implemented it and iterated through review.',
  },
  {
    id: 'ADR-008',
    title: 'Live docs previews replace downloadable artifacts',
    status: 'accepted',
    context: 'Reviewers had to download and unzip a build to see a docs change.',
    decision: 'Every docs PR gets a rendered preview link, removed on merge. Strict builds still run, with read-only workflow permissions.',
    why: 'Reviewers should click a link, not unzip a build.',
    role: 'Built the preview workflow and removed the old one.',
  },
];

export interface Proposal {
  id: string;
  title: string;
  status: string;
  summary: string;
  points: string[];
}

export const proposals: Proposal[] = [
  {
    id: 'RFC-001',
    title: 'Agent Skills hub for the semantic layer',
    status: 'pilot planned',
    summary: 'A governed catalog of agent skills that helps stewards write metadata artifacts, published to an internal AI marketplace for Cursor, Claude Code and Copilot.',
    points: [
      'Each skill: a spec-compliant SKILL.md, a skill.yaml validated by JSON Schema, and a changelog.',
      'Blocking CI from day one: spec, policy, template sync, generated catalog, secret and size scans.',
      'Every authoring skill ends by running the engine’s own validators.',
      'Grounded in a survey of 8 public skill repositories.',
    ],
  },
  {
    id: 'RFC-002',
    title: 'Semantic Quality Framework',
    status: 'proposed',
    summary: 'Turns a quality-configuration artifact into a semantic quality checker for every metadata PR.',
    points: [
      'Five dimensions: completeness, informativeness, controlled vocabulary, clarity, consistency.',
      'Deterministic rules, statistical similarity and LLM checks. LLM checks never block.',
      'Blocking by severity, and only on objects changed in the PR, so it can be switched on without fixing all existing issues first.',
      'Rolled out in phases, from warnings only to blocking.',
    ],
  },
];

export const openIdeas = [
  'Ontology-grade quality checks (ROBOT, OWL reasoners): validate → explain → repair.',
  'Reusable glossaries across data products, like table dictionaries already are.',
  'Removing tool-specific flows now that a single agent platform is the target.',
];

export const bayerTimeline = [
  { when: '2026-03', text: 'Joined Bayer Consumer Health as Data Analyst' },
  { when: '2026-04', text: 'Talk-to-Data pilot: business questions → SQL, multi-model comparison, first Genie space with validated metadata' },
  { when: '2026-06', text: 'Core data asset wiki restructure begins' },
  { when: '2026-08', text: '13-section data catalog, design docs, Mermaid → draw.io, 79-page cleanup' },
  { when: '2026-09', text: 'First metadata artifacts in the semantic layer engine; issue forms, PR template, feature → main' },
  { when: '2026-10', text: 'Joined the enablement squad; repo governance; interactive workflow diagram; pillar data product decision; IaC volumes in 3 environments; first talk' },
  { when: '2026-11', text: 'First 2 pillar data products deployed; golden queries 4/4; live docs previews; Week of Stars talk; RFC-001 and RFC-002' },
];

export const talks = [
  {
    title: 'Driving enterprise adoption of UCL (Unified Consumption Layer)',
    event: 'Internal technology conference',
    date: 'October 2026',
    note: 'Made the case for enterprise-wide adoption of UCL as the shared layer for consuming governed data.',
  },
  {
    title: 'UCL adoption and the semantic layer engine',
    event: 'Week of Stars',
    date: 'November 2026',
    note: 'Showed how version-controlled documentation becomes AI-ready data products, published to UCL and queried by Talk-to-Data agents.',
  },
];
