# Knowbase — Development Progress

Last updated: 2026-04-24 10:32 (HKT)
Latest commit: 6e13e93 — chore: sync PROGRESS.md with actual latest commit
Unpushed changes: yes
Deployed to Vercel: yes (auto-deploy from main, env vars updated 2026-04-19)

## Deployment Log
| Date | Commit | What | Result |
|------|--------|------|--------|
| 2026-04-19 23:15 | — | Migration 002_jobs.sql applied (processing_jobs table + 5 doc columns + indexes + RLS) | ✅ Verified: table, columns, indexes all present |

---

## Sprint 1: Foundation & Auth
**Status:** ✅ Complete | **Start:** 2026-04-18 | **End:** 2026-04-19

| # | Task | Role | Status | Note |
|---|------|------|--------|------|
| 1.1 | Auth UI (signup/login) | Senior Dev A | ✅ Done | Email + magic link, client components with validation |
| 1.2 | Auth session management | Senior Dev A | ✅ Done | Supabase onAuthStateChange, server-side auth-guard |
| 1.3 | Ingestion engine (text/URL/file) | Senior Dev B | ✅ Done | 3 API routes + ingest-panel with drag-and-drop |
| 1.4 | Background processing queue | DevOps | ✅ Done | processing_jobs table, pipeline.ts, worker.ts with 6-stage pipeline |
| 1.5 | QA pass on deployed app | QA Engineer | ✅ Done | 5 bugs found and fixed (commit f1c92ff) |

---

## Sprint 2: AI Pipeline & Context Engine
**Status:** 🔄 In Progress | **Start:** 2026-04-19

| # | Task | Role | Status | Note |
|---|------|------|--------|------|
| 2.1 | Wire chunk job to real chunker | Senior Dev A | ✅ Done | chunkDocument() → inserts into document_chunks table |
| 2.2 | Wire summarize job to real summarizer | Senior Dev B | ✅ Done | generateHierarchicalSummary() → updates one_liner, short_summary, key_points |
| 2.3 | Wire embed job to real OpenAI embeddings | Senior Dev C | ✅ Done | generateEmbedding() per chunk with 100ms rate-limit guard |
| 2.4 | Wire entity extraction job | Senior Dev A | ✅ Done | extractEntities() → updates documents.entities JSONB |
| 2.5 | Wire tagging job | Senior Dev B | ✅ Done | generateTags() → updates documents.tags TEXT[] |
| 2.6 | Wire space suggestion job | Senior Dev C | ✅ Done | suggestSpace() → auto-moves doc if confidence > 0.7 |
| 2.7 | Switch to OpenRouter API | DevOps | ✅ Done | Switched to OpenRouter API (free Gemma for chat, cheap OpenAI embeddings) |
| 2.8 | Document processing status UI | UX | ⏳ Todo | Show processing pipeline status on document page |
| 2.9 | QA pass on AI pipeline | QA Engineer | ⏳ Todo | Test full pipeline end-to-end after wiring |

---

## Sprint 3: Knowledge Graph & Chat
**Status:** ⏳ Upcoming | **Target start:** 2026-05-10

| # | Task | Role | Status | Note |
|---|------|------|--------|------|
| 3.1 | Relationship detection | Senior Dev A | ⏳ Todo | |
| 3.2 | Knowledge graph storage | Senior Dev B | ⏳ Todo | |
| 3.3 | Visual graph view | UX Designer | ⏳ Todo | |
| 3.4 | AI chat interface | Senior Dev A | ⏳ Todo | |
| 3.5 | Proactive suggestions | Senior Dev B | ⏳ Todo | |

---

## Sprint 4: Dashboard & API
**Status:** ⏳ Planned | **Target start:** 2026-05-24

| # | Task | Role | Status | Note |
|---|------|------|--------|------|
| 4.1 | Dashboard with auto-spaces view | UX | ⏳ Todo | |
| 4.2 | AI insights panel | UX | ⏳ Todo | |
| 4.3 | Context profile system | Senior Dev A | ⏳ Todo | |
| 4.4 | REST API for agent integration | Senior Dev B | ⏳ Todo | |
| 4.5 | Python + TypeScript SDK | Senior Dev C | ⏳ Todo | |
| 4.6 | Webhook support | DevOps | ⏳ Todo | |

---

## Sprint 5: Launch Prep
**Status:** ⏳ Planned | **Target start:** 2026-06-07

| # | Task | Role | Status | Note |
|---|------|------|--------|------|
| 5.1 | Sentry error monitoring | DevOps | ⏳ Todo | |
| 5.2 | Stripe payment integration | DevOps | ⏳ Todo | |
| 5.3 | Landing page final polish | UX | ⏳ Todo | |
| 5.4 | Terms of service + privacy policy | — | ⏳ Todo | |
| 5.5 | Beta testing | QA Engineer | ⏳ Todo | |
| 5.6 | Public launch | — | ⏳ Todo | |

---

## Blockers
- None — all migrations applied, AI pipeline unblocked.

---

## Open Questions
- Should we use Supabase Edge Functions or Vercel Cron for the worker loop? Current implementation processes jobs inline during API requests (fire-and-forget), which may time out on Vercel's serverless limits for large documents.

---

## Key Decisions (latest first)
| Date | Decision | By |
|------|----------|----|
| 2026-04-19 | Senior Dev A switched from Claude Code to Hermes subagent (glm-5.1) | Henry |
| 2026-04-19 | Use OpenRouter instead of direct OpenAI API (free models for chat, cheap embeddings) | Henry + AI |
| 2026-04-18 | Core feature: Auto-organize + AI agent native | Henry |
| 2026-04-18 | Pivot to "Context layer for AI agents" | Henry + AI |
| 2026-04-16 | Next.js 15 + Supabase | Henry + AI |
| 2026-04-16 | OpenAI embeddings (text-embedding-3-small) | AI |

---

## File Map (key files)
| File | Purpose |
|------|---------|
| src/lib/queue/worker.ts | Job queue: create, process, retry logic — all 6 AI stages wired |
| src/lib/queue/pipeline.ts | Pipeline orchestrator: 6 stages per document |
| src/lib/ai/chunker.ts | Semantic chunking (~500 token target chunks) |
| src/lib/ai/summarizer.ts | Hierarchical summaries (1-liner, short, key points) |
| src/lib/ai/entities.ts | Named entity extraction (person, org, project, concept, date) |
| src/lib/ai/tagger.ts | Auto-tagging (up to 10 tags, merge with existing) |
| src/lib/ai/space-suggester.ts | Space suggestion (auto-move if confidence > 0.7) |
| src/lib/openai.ts | OpenRouter client: Gemma 3 free for chat, OpenAI embeddings via OpenRouter |
| src/lib/ingestion/ingest.ts | Document ingestion into Supabase |
| src/lib/ingestion/url-parser.ts | URL fetch + HTML→Markdown |
| src/lib/ingestion/file-parser.ts | PDF/DOCX/MD/TXT parsing |
| src/app/api/ingest/*/route.ts | 3 ingestion API routes |
| src/app/api/jobs/status/route.ts | Job status polling endpoint |
| supabase/migrations/002_jobs.sql | processing_jobs table + document columns |

---

## Environment
- **Repo:** github.com/M0nger919/knowledgebase
- **Branch:** main
- **Domain:** quantafelis.org
- **Supabase project:** ytvvmxxglbulcyzmagsv
- **Vercel:** Connected (auto-deploy on push to main)
- **Stack:** Next.js 16.2.4, TypeScript, Tailwind 4, Supabase, OpenAI


