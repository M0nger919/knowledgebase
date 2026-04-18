# Knowbase — PM Board

Last updated: 2026-04-18

## Sprint 1: Foundation & Auth (Current)
**Goal:** Get users signing in and ingesting content
**Start:** 2026-04-18 | **Target end:** 2026-04-25

### In Progress
- [ ] Auth UI (signup/login with email + magic link)
- [ ] Auth callback + session management
- [ ] Protected routes (redirect to login if not authed)

### Todo
- [ ] Ingestion engine — text input
- [ ] Ingestion engine — URL fetch and parse
- [ ] Ingestion engine — file upload (PDF, Markdown)
- [ ] Background processing queue setup

### Blocked
(None)

### Done This Sprint
- [x] Phase 1 infrastructure complete (all cloud platforms)
- [x] Product spec + user personas written
- [x] Database schema with vector search

---

## Sprint 2: AI Pipeline & Context Engine
**Goal:** Content gets auto-processed into smart context chunks
**Target start:** 2026-04-26 | **Target end:** 2026-05-09

### Todo
- [ ] Semantic chunking algorithm (split at thought boundaries)
- [ ] Hierarchical summary generation (1-liner, summary, key points)
- [ ] Entity extraction (people, projects, concepts)
- [ ] Auto-tagging and categorization
- [ ] Smart context engine — token budget retrieval
- [ ] Relevance scoring (semantic + recency + relationships)
- [ ] Context deduplication

---

## Sprint 3: Knowledge Graph & Chat
**Goal:** Users can chat with their knowledge and see relationships
**Target start:** 2026-05-10 | **Target end:** 2026-05-23

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
**Target start:** 2026-05-24 | **Target end:** 2026-06-06

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
**Target start:** 2026-06-07 | **Target end:** 2026-06-20

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

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenAI API costs for processing | Medium | Cache embeddings, batch processing, lazy summarization |
| Context retrieval quality | High | User feedback loop, A/B test retrieval strategies |
| Background job reliability | Medium | Use Supabase pg_net or external queue (BullMQ) |
| Scope creep | High | Strict sprint boundaries, PM enforces scope |

## Key Metrics to Track
- Documents ingested
- Chunks generated
- Context retrieval accuracy (user thumbs up/down)
- Token efficiency (relevant info per 1k tokens)
- Active users
- API calls from agents
