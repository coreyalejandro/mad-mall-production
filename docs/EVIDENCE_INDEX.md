# MADMall Evidence Index

## Source Evidence Triangle

MADMall's product, governance, and research are grounded in three source repositories. This index maps each evidence source to its role, key files, and how it feeds MADMall development.

---

## 1. the-living-constitution

**Role:** Governance authority. Every rule in MADMall traces to an Article here.

**Repository:** `github.com/coreyalejandro/the-living-constitution`

| File | What It Provides |
|------|-----------------|
| `00-constitution/PREAMBLE.md` | Foundational purpose: safety systems for the most vulnerable user |
| `00-constitution/ARTICLES.md` | Articles I-V: Bill of Rights, Execution Law, Purpose Law, Separation of Powers, Amendment Process |
| `00-constitution/standards-alignment.md` | Mapping to NIST SSDF, NIST AI RMF, OpenSSF Scorecard |
| `08-evaluation/failure_taxonomy.md` | F1-F5 failure taxonomy (Confident False Claims through Cross-Episode Recurrence) |
| `08-evaluation/datasets/failure_cases.json` | 18 failure case test fixtures |
| `08-evaluation/evidence_summary.md` | 8 evidence source categories |
| `08-evaluation/pattern_analysis.md` | 5 cross-cutting failure patterns |
| `tests/failure_modes/F1-F5/` | Test fixtures organized by failure class |

**How MADMall Uses It:**
- CLAUDE.md imports Articles I-V as governing constraints
- Feature governance pattern (spec -> threat notes -> implementation -> tests -> evidence -> amendment) derives from Article III
- Non-clinical boundary enforcement derives from Article I (Right to Safety)
- Agent separation of powers (Article IV) governs all CI/CD and agent actions

---

## 2. black-women-and-graves-disease

**Role:** Product requirements source. Research grounding. Feature specifications.

**Repository:** `github.com/coreyalejandro/black-women-and-graves-disease`

| File | What It Provides |
|------|-----------------|
| `01_UPDATED_RESEARCH_REPORT_MAD_MALL.md` | Full research report: Graves' disparities, cultural safety thesis, non-clinical scope, product framing (241 lines) |
| `02_black_women_and_graves_disease_instructional_edition_v2_*.ipynb` | Extended instructional notebook: clinical literature, superwoman schema, gendered racism in healthcare |
| `03_black-women-and-graves-disease(short_version).ipynb` | Short version research notebook |
| `04_MADMall_SUMMARY.md` | Phase 3 implementation package overview |
| `PHASE3_SUMMARY.md` | 5 features, timeline, tech stack, complexity ratings, implementation order |
| `PHASE3_ARCHITECTURE.md` | System architecture, database schemas, dependency map, security checklist |
| `PHASE3_QUICKSTART.md` | Step-by-step implementation checklist |
| `IMPLEMENTATION_GUIDE.md` | 1,200+ lines: database schemas, API endpoints, React components, testing strategies |
| `.agent/workflows/phase3-implementation.md` | Feature-by-feature workflow with commands |

**How MADMall Uses It:**
- Product Definition doc (docs/PRODUCT_DEFINITION.md) draws from the research report for disparities data, isolation framework, and non-clinical boundary
- Phase 3 feature list (5 features, 15 tables, 25+ endpoints) comes directly from PHASE3_SUMMARY.md
- Implementation code patterns come from IMPLEMENTATION_GUIDE.md
- Non-clinical boundary definition is grounded in the research report's explicit scope framing

---

## 3. kiro-hackathon-mad-mall

**Role:** Reference implementation. Feature modules, UI patterns, information architecture.

**Repository:** `github.com/coreyalejandro/kiro-hackathon-mad-mall`

| File | What It Provides |
|------|-----------------|
| `HACKATHON_SUBMISSION.md` | Complete feature list, architecture, AI integration details |
| `README.md` | Quick start, development commands, structure |
| `CLAUDE.md` | Project governance instructions |
| `.kiro/` | Agent-oriented artifacts |

**Feature Modules (proven in hackathon):**

| Module | Status | Reuse Strategy |
|--------|--------|---------------|
| Concourse (social feed) | Implemented | Rebuild inside governed scaffold. Reuse IA and naming. |
| Peer Circles (group support) | Implemented | Rebuild with consent-first data patterns |
| Comedy Lounge (humor/wellness) | Implemented | Rebuild with cultural safety moderation |
| Story Booth (personal narratives) | Implemented | Rebuild with anonymity options and consent |
| Marketplace (Black-owned businesses) | Implemented | Rebuild with payment safety from ConsentChain patterns |
| Resource Hub (curated resources) | Implemented | Rebuild with non-clinical boundary enforcement |

**AI Integration (TitanEngine):**
- AWS Bedrock with SDXL for image generation
- Claude-3 for cultural validation
- Cultural appropriateness scoring (>0.8 auto-approval threshold)
- Admin interface at `/admin/images`

**How MADMall Uses It:**
- Information architecture, route structure, and naming conventions are reference material
- Feature decomposition is proven — we rebuild inside TLC governance, not retrofit
- UI modules serve as design reference (not direct code import)
- AI integration patterns inform Phase 3 moderation design (with TLC governance applied)

---

## 4. mad-mall-production (This Repository)

**Role:** The governed product. Where all evidence converges into a shipping system.

| File | What It Provides |
|------|-----------------|
| `CLAUDE.md` | TLC governance overlay with 5 constitutional constraints |
| `docs/PRODUCT_DEFINITION.md` | Product vision, community engagement model, Data Store concept |
| `docs/EVIDENCE_INDEX.md` | This file — maps all evidence sources |
| `tasks/todo.md` | Sprint tracker with phases 0-4 |
| `tasks/lessons.md` | Amendment log (feeds Article V) |
| `tasks/pause-state.md` | SOP-013 recovery state |
| `mad-mall-deep-research-report-20260325.md` | 8-step enterprise migration plan |
| `README.md` | Product narrative with non-clinical boundary, safety thesis, roadmap |

---

## Evidence-to-Feature Mapping

Each Phase 3 feature traces back to specific evidence:

| Feature | Research Evidence | Implementation Evidence | Governance Evidence |
|---------|------------------|------------------------|-------------------|
| Sisterhood Lounge | Research report: isolation as core harm | PHASE3_SUMMARY: Pusher/WebSocket spec | Article I: cultural safety in moderation |
| Live Experiences | Research report: community as intervention | PHASE3_ARCHITECTURE: event schema | Article III: every feature has purpose |
| Service Directory | Research report: healthcare access barriers | IMPLEMENTATION_GUIDE: Stripe + booking | Article II: payment security, input validation |
| User Profiles | Research report: identity and belonging | PHASE3_QUICKSTART: S3/R2 storage | Article I: PII handling, consent |
| Content Moderation | Research report: culturally unsafe generic platforms | Hackathon: TitanEngine cultural scoring | Article I: no AAVE suppression; Article IV: bounded AI authority |
| Data Store | Product Definition: data as personal empowerment | New (to be specified) | ConsentChain patterns: consented, logged, revocable |
| Story Booth | Research report: lived experience visibility | Hackathon: Story Booth module | Article I: dignity, consent, anonymity |
| Comedy Lounge | Research report: humor as coping and wellness | Hackathon: Comedy Lounge module | Article I: cultural safety |

---

## External Standards Evidence

| Standard | Source | Application |
|----------|--------|------------|
| NIST SSDF (SP 800-218) | `the-living-constitution/00-constitution/standards-alignment.md` | Secure SDLC practices as CI/CD artifacts |
| NIST AI RMF (AI 100-1) | `the-living-constitution/00-constitution/standards-alignment.md` | AI governance for moderation and recommendations |
| OpenSSF Scorecard | `the-living-constitution/00-constitution/standards-alignment.md` | Supply-chain risk: branch protection, dependency hygiene |
| WCAG 2.1 AA | TLC Default User profile | Neurodivergent-accessible interfaces |

---

## How to Use This Index

1. **Before building a feature:** Find its row in the Evidence-to-Feature Mapping table. Read the linked evidence files.
2. **Before writing a spec:** Confirm the feature maps to research evidence (not just "nice to have").
3. **During code review:** Verify the implementation respects the governance constraints listed for that feature.
4. **During amendment:** When a failure occurs, trace it back through this index to identify which evidence gap allowed it.

---

## Verification

This index is current as of the completion of Phase 0 (Governance Baseline). It must be updated when:
- New evidence repositories are added
- New features are specified that require new evidence sources
- Existing evidence is superseded by updated research
