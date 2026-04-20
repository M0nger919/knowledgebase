# Knowbase — PM Board

Last updated: 2026-04-19

## Sprint 1: Foundation & Auth ✅ COMPLETE
**Goal:** Get users signing in and ingesting content
**Start:** 2026-04-18 | **Completed:** 2026-04-19 (1 day ahead of schedule)

### Done
- [x] Auth UI (signup/login with email + magic link) — #1
- [x] Auth callback + session management — #2
- [x] Protected routes (redirect to login if not authed) — #2
- [x] Ingestion engine — text, URL, file upload — #3
- [x] Background processing queue — #13
- [x] QA pass — 5 bugs found and fixed — #5-9
- [x] Custom 404 page, footer, form validation fixes

---

## Sprint 2: AI Pipeline & Context Engine 🔄 IN PROGRESS
**Goal:** Content gets auto-processed into smart context chunks
**Start:** 2026-04-19 | **Target end:** 2026-05-02

### Done
- [x] Semantic chunking algorithm — #10
- [x] Hierarchical summary generation (4 layers) — #10
- [x] Entity extraction (person, org, project, concept, date) — #11
- [x] Auto-tagging and categorization — #11
- [x] Auto-space suggestion — #11
- [x] Background job queue (6 job types, retry, priority) — #13
- [x] Pipeline orchestrator (chunk→summarize→embed→tag) — #13
- [x] Code review — 2 blocking + 6 non-blocking fixes

### In Progress
- [ ] Smart context engine — token budget retrieval — #12

### Todo
- [ ] Relevance scoring (semantic + recency + relationships) — #12
- [ ] Context deduplication — #12

### Blocked
(None)

---

## Sprint 3: Knowledge Graph & Chat
**Goal:** Users can chat with their knowledge and see relationships
**Target start:** 2026-05-03 | **Target end:** 2026-05-16

### Todo
- [ ] Relationship detection between documents
- [ ] Knowledge graph storage and querying
- [ ] Visual graph view (interactive node/edge display)
- [ ] AI chat interface
- [ ] Conversation-aware context (track what agent already saw)
- [ ] Proactive suggestions

---

## Sprint 4: Dashboard & API
**Goal:** Polish UI, ship agent integration API
**Target start:** 2026-05-17 | **Target end:** 2026-05-30

### Todo
- [ ] Dashboard with auto-spaces view
- [ ] AI insights panel
- [ ] Context profile system
- [ ] REST API for agent integration
- [ ] Python + TypeScript SDK
- [ ] Webhook support

---

## Sprint 5: Launch Prep
**Goal:** Monitoring, payments, polish, go live
**Target start:** 2026-05-31 | **Target end:** 2026-06-13

### Todo
- [ ] Sentry error monitoring
- [ ] Stripe payment integration
- [ ] Landing page final polish
- [ ] Terms of service + privacy policy
- [ ] Beta testing
- [ ] Public launch

---

## Decisions Log
| Date | Decision | Rationale | Made by |
|------|----------|-----------|---------|
| 2026-04-16 | Next.js 15 + Supabase | Vercel-native, fastest MVP path | Henry + AI |
| 2026-04-16 | OpenAI embeddings | Best quality semantic search | AI |
| 2026-04-18 | Core feature: Auto-organize + AI agent native | Differentiation from Notion/Confluence | Henry |
| 2026-04-18 | Pivot to "Context layer for AI agents" | Bigger market, real pain point | Henry + AI |
| 2026-04-18 | quantafelis.org domain | Registered | Henry |
| 2026-04-19 | Parallel dev workflow (3 Senior Devs) | Speed + quality via subagent delegation | AI |
| 2026-04-19 | SSRF protection on URL ingestion | Security review finding | Code Reviewer |

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenAI API costs for processing | Medium | Cache embeddings, batch processing, lazy summarization |
| Context retrieval quality | High | User feedback loop, A/B test retrieval strategies |
| Background job reliability | Medium | Supabase pg_net job queue with retry |
| Scope creep | High | Strict sprint boundaries, PM enforces scope |

## Key Metrics to Track
- Documents ingested
- Chunks generated
- Context retrieval accuracy (user thumbs up/down)
- Token efficiency (relevant info per 1k tokens)
- Active users
- API calls from agents

## Velocity
| Sprint | Tasks Planned | Tasks Done | Duration |
|--------|--------------|------------|----------|
| Sprint 1 | 4 | 4 (+ 5 QA fixes) | 1 day |
| Sprint 2 | 4 | 3 (1 remaining) | in progress |
