# Bayer Consumer Health — Work & Contributions Report

**Period:** March 2026 – November 2026 · **Title:** Data Analyst · **Location:** Warsaw

> Public, sanitized version. Colleague names, internal URLs, repository links, business figures and internal platform, project, product, team and event names are removed or replaced with generic descriptions. The enterprise program UCL (Unified Consumption Layer) is named. Publicly available vendor tools (Databricks, GitHub, Cursor, Copilot and similar) are named. Every statement below is traceable to a GitHub issue, pull request, review or comment I authored.

---

## 1. Summary

In nine months at Bayer Consumer Health I moved from documenting a single data asset to helping run the metadata platform that turns documentation into AI-ready data products. The work has three main threads:

- **Docs-as-Code.** Data products and tables are described in version-controlled YAML. CI validates them, and merging publishes them to Databricks, to the UCL (Unified Consumption Layer) federated registry and to Talk-to-Data agents. I wrote documentation, built the docs site and its PR previews, and set the repository's contribution and access rules.
- **AI-ready data and metadata.** I created and reviewed the metadata artifacts behind the first data products in a marketing analytics product family, co-designed their structure, and tested them end to end against an AI agent. The golden-query test passed 4 out of 4 queries.
- **AI-assisted work, with a human making the decisions.** I use Cursor, GitHub Copilot, Claude and Databricks Genie to draft code, documentation, analyses and proposals. The problem framing, the decision, the review and the validation are mine, and I disclose when an analysis came from a model.

Around these threads I onboarded six teams, presented the platform at two internal events, and coordinated delivery as scrum master and project coordinator where the team needed it.

---

## 2. How I worked: Dynamic Shared Ownership

Bayer runs on **Dynamic Shared Ownership (DSO)**: people join the missions where they add the most value instead of staying in one fixed team. My title stayed *Data Analyst*, but in practice I held several roles across four teams:

| Mission / team | Period | Roles I played | What I delivered |
|---|---|---|---|
| **Consumer core data asset team** | Mar 2026 – present | Data analyst · Scrum master · Project coordinator | Rebuilt the asset wiki and data catalog. Built the team's Azure DevOps board and ran its scrum ceremonies. Owned the asset's metadata artifacts. |
| **Talk-to-Data platform pilot** | Apr – Jun 2026 | Data analyst · AI solution tester | Turned marketing business questions into SQL. Built and validated Databricks Genie spaces with subject-matter experts. |
| **Semantic-layer enablement squad** | Sep 2026 – present | Repo admin · Enablement lead for two core data assets · Reviewer | Set up repo governance, CI and the docs site. Onboarded teams. Delivered the first data products of a marketing analytics product family. Wrote design proposals. |
| **UCL adoption squad** | Oct 2026 – present | Contributor · Technical writer · Front-end contributor | Promoted enterprise-wide UCL adoption. Wrote the UCL federated registry capability card and its adoption handover. Redesigned the UCL capability roadmap. |

---

## 3. In numbers

| Metric | Value |
|---|---|
| Pull requests authored | 50 (37 merged) |
| Issues authored | 48 |
| Comments written | 71 |
| Pull requests reviewed | 11 (19 reviews, 12 inline code comments) |
| Commits to company repositories | 108, across 5 repositories |
| Teams onboarded to the semantic layer | 6 |
| Data products I drove to UCL | 2 deployed; 3 more authored and awaiting business review |
| Deployment environments covered by IaC changes | 3 (development, quality assurance, production) |
| Wiki pages cleaned up in a single PR | 79 files, 886 duplicated lines removed |
| Golden-query test of an AI data product | 4 out of 4 passed, average weighted score 4.57 out of 5 |
| Internal events where I presented | 2 (an internal technology conference and an internal company event) |

---

## 4. Themes and evidence

### 4.1 Docs-as-Code

**Core data asset wiki (MkDocs, Jun–Sep 2026)**
- Wrote data catalog pages to one 13-section standard: identity, ownership, business definition, grain and keys, column dictionary, freshness, quality rules, security, usage, lineage, links, and a plain YAML block.
- Added architecture, ingestion and transformation design, and roadmap pages. Aligned the catalog with the asset's Databricks consumption views.
- Converted every Mermaid diagram to draw.io after finding that the wiki's rendering backend could not draw Mermaid.
- Removed the hand-written "Quick Navigation" blocks from 79 pages, because they duplicated the auto-generated table of contents and drifted out of date.
- Standardized section names across the asset. Restructured the landing pages into a navigation hub. Documented a brand-level analytics product for both business readers and engineers.
- Every PR listed its validation: `git diff --check` and a local `mkdocs build`.

**Semantic layer documentation site (Oct–Nov 2026)**
- Built an **interactive workflow diagram** of the whole pipeline (documentation → GitHub → engine → Talk-to-Data → registry). It has animated stages, hover tooltips, click-to-focus, a presentation mode and a print stylesheet. I published it on GitHub Pages with an embedded preview.
- Refreshed the site for its new audience, consumer health teams publishing to UCL. Added a brand palette with light and dark modes, artifact cards with criticality and readiness badges, last-updated dates and a home-page flow diagram, with `mkdocs build --strict` passing.
- Added **live PR previews**: every docs PR gets a rendered site link, and the preview is removed on merge. Later I removed the old download-a-zip preview, so each PR gets one comment instead of two.
- Added "Step 0: Get access" to the data product creation guide, a 36-second overview video, and code-backed architecture diagrams generated with Archify. Each diagram node links to the source lines it describes.

**Repository intake as code**
- Added **GitHub issue forms**, one per work label, with a user story, acceptance criteria and notes. Disabled blank issues and added a PR template with Summary, Business Impact, Technical Changes, Risks and Evidence sections. I later found that issues created from the project board skip the forms, and documented that gap.
- Documented the move from a feature → dev → main branching model to feature → main, and aligned the CI triggers with it.

### 4.2 AI-assisted coding and ways of working

My rule is that AI drafts and I decide. Examples:

- **Option analysis with disclosure.** On schema versioning, I posted a Claude analysis labelled as such, then gave my own position in a separate comment. That position changed the recommendation (see decision 5.4).
- **Agent-built deliverables.** I used Cursor agents for the workflow diagram, docs-site changes, CI workflows, infrastructure-as-code PRs, the platform roadmap front end and the two large design proposals. Each PR carries its own validation evidence: strict builds, unit tests, type checks, and visual checks at desktop and phone widths.
- **Testing AI with AI.** I tested a production data product by calling the company agent platform's MCP server from Cursor. Each golden question was sent word for word, and both the answer and the generated SQL were compared with the golden set (see 4.3).
- **Comparing models for business questions (Talk-to-Data pilot).** I sent marketing questions to several AI assistants, including Databricks AI, Microsoft Copilot and Perplexity, then built a Genie space enriched with validated metadata to raise answer accuracy.
- **Copilot inside the PR workflow.** I used Copilot for merge-conflict resolution, preview generation and first-pass review comments, and taught new reviewers to use Copilot on the repository to query documentation.
- **Diagrams from code.** I used Archify to generate architecture and artifact-lineage diagrams that are pinned to a commit.
- **Agent skills.** I write my own Cursor skills and rules, and proposed a governed skills hub for the whole user base (see 6.1).

### 4.3 AI-ready data processing and metadata handling

**The metadata model.** Data products and tables are described in a set of YAML artifacts, including:

| Artifact | Purpose |
|---|---|
| Governance contract | Ownership, purpose and terms of use |
| Terminology registry | Business glossary for the product |
| Table data dictionary | Column-level definitions |
| Semantic precedence rules | Which definition wins when sources disagree |
| Technical access | How consumers get access |
| Golden queries | Reference questions and expected SQL |

The engine compiles these into the registry's table and data-product JSON, and sends them to Genie or agent context. I explained this model to every team I onboarded, and authored, reviewed or tested artifacts across it:

- **First core data asset artifacts.** Registered the consumer asset in the engine and authored its first data dictionaries: one price dimension and nine fact tables, adjusted to the current registry table schema and validated with the engine's validator and unit tests.
- **Pillar data products.** Co-designed the split of a marketing analytics product family into five independently governed pillar data products with reusable table-level semantics (decision 5.2).
  - Promoted their storage volumes through development, quality assurance and production as infrastructure as code.
  - Reviewed the artifacts. My comments covered ownership guidelines, a missing acronym definition, the access-request channel, a duplicated table/view, and an engine test file changed outside the review scope.
- **End-to-end quality test.** Ran one pillar data product's golden queries through the AI agent: 4 out of 4 correct, with SQL matching the golden joins and filters, rated *Go* in the business testing workbook. Raised three metadata findings:
  - The agent stated a business rule that is not documented in the glossary or precedence rules, so I asked the steward to confirm and document the rule, or for the agent to stop stating it.
  - Rounding in prose, and technical column names shown to business users.
  - The golden set was too small and too easy. I proposed multi-wave, edge-case and out-of-scope tests.
- **Business testing coordination.** I coordinate the early business testing of the first two pillar data products, so that scored feedback flows back into the metadata.
- **Unstructured data.** Helped define the first data product built on a collection of unstructured documents (third-party market research reports):
  - Vectorized content is an *agent-supporting artifact*, not a data product.
  - Semantics are added as metadata on document chunks.
  - Proposed ingestion flow: new file → parse and vectorize → AI-generated metadata → automated PR into the semantic layer → owner review → deploy.
- **Ownership semantics.** Drafted the data product role definitions (manager, owner, steward, support) and applied them in reviews.
- **Semantic reuse across platforms.** In the finance work I documented an approach for reusing upstream platform semantics: reference registry semantic objects by ID and keep column mappings, so meaning survives renames.
- **Minimum viable metadata (my onboarding principle).** Publish a data product with about 10 core fields, check it in the registry, then add attributes and table documentation step by step. This replaces trying to fill hundreds of fields up front.

### 4.4 Governance and platform engineering

- **Repository access model.** Write-access collaborators (analysts, stewards) can change only semantics paths. Engine, config, CI, templates and process docs need a repo admin.
  - Built a custom path-guard CI first, then replaced it within three days with native GitHub controls: CODEOWNERS as an allowlist, plus a push ruleset rolled out in Evaluate mode (decision 5.1).
  - Moved code ownership from named users to a GitHub team, so membership changes no longer touch the file.
  - Wrote the admin runbook and the acceptance criteria for each scenario.
- **Project hygiene.** Scoped the project board's automation so it only collects the team's own issues.
- **Infrastructure as code.** Added the Unity Catalog volume definitions for the new pillar data products in all three environments, so the deployed platform matches its declared state.
- **Access at scale.** Requested engine and workspace roles for the onboarding program's analysts and data stewards.

### 4.5 Enablement, communication and adoption

- **Onboarded six teams:** a marketing analytics team, a finance core data asset team, the consumer core data asset team, a manufacturing data product team, an external consultancy partner, and an unstructured-data squad. For each I covered the metadata model, the PR-based workflow, the single manual quality gate (an expert reviewer) and the deployment chain.
- **Taught GitHub to business analysts.** Live walkthroughs of PR review: files changed, rendered previews, marking files as viewed, approval thresholds.
- **Decision records in the repository.** Turned meetings and chats into issue comments with decisions, rationale, owners and actions, so decisions are traceable after the meeting.
- **Status reporting.** Set up a recurring team-status cadence covering progress, risks and blockers, so the squad lead can report upward with current information.
- **Governance by design.** Made sure data exposure, agent tooling and validation were reviewed and agreed before data products were published.
- **Talks and decks.** Promoted enterprise-wide adoption of UCL at an internal technology conference (October), presented UCL and the semantic layer engine at an internal company event (November), and built a metadata-connections deck used in a leadership presentation.
- **UCL portal (adoption squad).**
  - Wrote the UCL federated registry capability card and quick-start guide, and completed its adoption handover.
  - Linked its enablement resources following the UI conventions.
  - Added divisional playbook entries.
  - Turned the adoption dashboard into an informative capability roadmap without percentages, so that business units are not ranked against each other.
  - Built a native quarter × architecture release timeline with filters, a details drawer and a phone layout, backed by tests and type checks.

### 4.6 Agile delivery and project coordination

- Built the core data asset team's **Azure DevOps board** and ran its scrum ceremonies.
- Ran enablement work as GitHub issues with user stories and acceptance criteria. Separated tracking issues (team status, collaboration per data asset) from delivery issues.
- Tracked dependencies and blockers explicitly in the backlog, so delivery risks were visible early instead of surfacing late.

---

## 5. Key decisions

### 5.1 Native GitHub controls instead of custom CI for access control
- **Context:** Analysts and stewards needed to edit semantics freely without being able to change the engine.
- **Options:** (a) custom path-guard CI with its own admin list; (b) CODEOWNERS allowlist plus a push ruleset plus an admin team.
- **Decision:** (b). I closed my own path-guard PR three days after opening it.
- **Why:** I prefer platform-native controls over custom code someone has to maintain. They also removed a second admin list and a check that read its rules from the PR it was checking.
- **My role:** Designed, implemented and documented it, and wrote the admin rollout runbook.

### 5.2 Pillar data products, not one monolith
- **Context:** One large marketing analytics data product could not be reviewed as a whole. Pillars have different owners and licensing, and reviewer time was scarce.
- **Decision:** Independent pillar data products (two first, then three more), composed later into one product. Table semantics stay reusable across products. The open PR was merged with deployment flags off and drafts marked `draft` or `in_review`, so files could land without being exposed.
- **My role:** Co-designed the structure with the artifact author and the product's analysts. Wrote the decision record. Approved and enforced it as reviewer.

### 5.3 Minimum viable metadata
- **Decision:** Publish with about 10 core fields, then iterate after seeing the product in the registry.
- **Why:** Lowers the entry barrier and gets real feedback early. Teams were stalling on schemas with hundreds of fields.
- **My role:** My own principle, applied in every onboarding.

### 5.4 Schema evolution: never add mandatory fields
- **Context:** Artifact schemas, registry schemas and mappings all change over time, and the version fields were inconsistent.
- **My position:** New fields always arrive as optional (minor version). Renames and removals are major versions, migrated by script in one bot PR. If that rule holds, "regenerate and redeploy everything" works in every case and the engine stays simple. Version-specific upcasters only help while PRs are open during a major change. Separately, one `artifact_schema {type, version}` block should replace the three inconsistent version fields.
- **My role:** Disclosed the AI option analysis, then wrote and defended my own position.

### 5.5 Unstructured reports as their own data product
- **Decision:** Third-party report files become a separate data product, not files attached to a structured data product. Vectorized content is treated as agent context, not as a data product.
- **My role:** The artifact author proposed it. I agreed and documented the architecture and ingestion flow.

### 5.6 Mermaid → draw.io on the wiki
- **Why:** The wiki backend could not render Mermaid. I validated the converted XML and confirmed that no Mermaid blocks remained.

### 5.7 An informative roadmap without percentages
- **Decision:** Remove adoption percentages and use short "published" cards that link to documentation.
- **My role:** Squad direction; I implemented it and iterated on it through review.

### 5.8 Live docs previews replace downloadable artifacts
- **Why:** Reviewers should click a link, not download and unzip a build. Strict builds still run on every docs PR, and workflow permissions were reduced to read-only.

---

## 6. Ideas and proposals

### 6.1 Agent Skills hub for the semantic layer
A governed catalog of agent skills that helps stewards write metadata artifacts, published to an internal AI marketplace for Cursor, Claude Code and Copilot.
- **Format:** each skill is a spec-compliant `SKILL.md` plus a `skill.yaml` sidecar validated by JSON Schema, plus a changelog.
- **Bundled templates:** skills carry copies of the canonical templates, and CI checks that the copies are byte-identical to the source.
- **Blocking CI from day one:** spec validation, repository policy, bundle sync, an up-to-date generated catalog, and secret and size scans.
- **Built-in acceptance test:** every authoring skill ends by running the engine's own validators.
- **Groundwork:** includes a survey of prior art (8 public skill repositories), the options weighed, a rollout plan and open questions.
- **Status:** a pilot skill is planned.

### 6.2 Semantic Quality Framework
Turns a quality-configuration artifact into configuration for a semantic quality checker.
- **Five dimensions:** completeness, informativeness, controlled vocabulary, clarity and consistency.
- **Three check types:** deterministic rules, statistical similarity and LLM checks. LLM checks come later and never block.
- **Blocking:** decided by finding severity, not by score. Only findings on objects changed in the PR can block, so the checker can be switched on without first fixing all existing issues.
- **Defaults:** a default configuration with per-product overrides and waivers recorded in the PR diff.
- **Outputs:** JSON and Markdown reports posted to the PR, rolled out in phases from warnings only to blocking.

### 6.3 Schema versioning rule
Described in decision 5.4: additive changes are optional and minor, breaking changes are migrated by bot PR, and there is one unified version field.

### Other open ideas
- Research brief on ontology-grade quality checks (ROBOT, OWL reasoners, validate → explain → repair).
- Making glossaries reusable across data products, the way table dictionaries already are.
- Removing tool-specific flows now that a single agent platform is the target.
- A Governance section on the docs site.

---

## 7. Timeline

| When | Milestone |
|---|---|
| Mar 2026 | Joined Bayer Consumer Health as Data Analyst (consumer core data asset team) |
| Apr–May 2026 | Talk-to-Data pilot: data-stream analysis; marketing questions → SQL; multi-model comparison; first Genie space with validated metadata |
| Jun 2026 | Genie Talk-to-Data space on marketing analytics data; core data asset wiki restructure begins |
| Jul–Aug 2026 | Data catalog pages; architecture, roadmap and ingestion design docs; Mermaid → draw.io; 79-page navigation cleanup |
| Sep 2026 | First metadata artifacts for the consumer core data asset in the semantic layer engine; issue forms and PR template; feature → main branching |
| Oct 2026 | Joined the semantic-layer enablement squad; onboarded marketing, finance and partner teams; repo governance; interactive workflow diagram and GitHub Pages; internal conference talk; pillar data product decision; storage volumes in all three environments; registry capability card and roadmap |
| Nov 2026 | First two pillar data products deployed; golden-query test 4/4; docs refresh, live previews, video, architecture diagrams; internal event talk; Semantic Quality Framework and Agent Skills proposals; native roadmap timeline |

---

## 8. Tools and methods used

- **Docs-as-Code:** MkDocs Material, GitHub Pages, Fumadocs/Next.js, Markdown and MDX, draw.io, Mermaid, Archify, HTML, CSS and JavaScript for interactive diagrams.
- **Metadata and semantics:** YAML artifacts, JSON Schema, data product and table schemas, Unity Catalog, data contracts, glossaries, golden queries; OWL, SHACL and ROBOT researched.
- **AI:** Cursor agents and skills, GitHub Copilot, Microsoft Copilot, Claude, Databricks Genie (AI/BI), MCP, Perplexity.
- **Platform and DevOps:** GitHub Actions, CODEOWNERS, rulesets, issue forms, Databricks Asset Bundles (volumes as IaC), Python validators and unit tests, TypeScript and Node tests.
- **Delivery:** Scrum, Azure DevOps boards, GitHub Projects, user stories with Given/When/Then acceptance criteria, decision records.
