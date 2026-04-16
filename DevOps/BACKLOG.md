# Knowbase — Deployment Backlog
> **Last updated:** 2026-04-16 | **Author:** Hermes Agent

---

## Issues Encountered & Resolved

### BUG-001: Vector extension not enabled in Supabase
- **Date:** 2026-04-16
- **When:** Initial schema.sql execution
- **Error:** `ERROR: 42704: type "vector" does not exist`
- **Cause:** `vector` extension must be enabled via Supabase Dashboard (Database → Extensions) before `VECTOR(1536)` column type is recognized
- **Fix:** Enable `vector` extension in Supabase Dashboard, then re-run schema.sql
- **Prevention:** Add `CREATE EXTENSION IF NOT EXISTS vector;` at the top of schema.sql

### BUG-002: Resend client crashes build when API key is missing
- **Date:** 2026-04-16
- **When:** First Vercel deployment
- **Error:** `Missing API key. Pass it to the constructor new Resend("re_123")`
- **Cause:** `new Resend(process.env.RESEND_API_KEY)` runs at module import time — Vercel builds without `RESEND_API_KEY` env var set → crash
- **Fix:** Lazy initialization — only instantiate client when `sendEmail()` is actually called
- **File:** `src/lib/email.ts`
- **Prevention:** All third-party client instantiations should use lazy init pattern

### BUG-003: OpenAI client has same crash-at-import risk
- **Date:** 2026-04-16
- **When:** Discovered during BUG-002 fix review
- **Error:** Would crash same way as BUG-002 if `OPENAI_API_KEY` is missing at build time
- **Cause:** `new OpenAI()` called at module level in `src/lib/openai.ts`
- **Fix:** Lazy initialization — instantiate on first use
- **File:** `src/lib/openai.ts`

### BUG-004: Git identity not configured
- **Date:** 2026-04-16
- **When:** First commit attempt
- **Error:** `fatal: unable to auto-detect email address`
- **Cause:** Fresh server, no `user.name` / `user.email` in git config
- **Fix:** Set repo-level git config (`git config user.name "Hermes Agent"`)
- **Prevention:** Check git identity before first commit

### BUG-005: Vercel CLI not in PATH
- **Date:** 2026-04-16
- **When:** Trying to debug deploy from CLI
- **Error:** `vercel: command not found`
- **Cause:** `npm i -g vercel` installed to Hermes node_modules, not system PATH
- **Fix:** Added `/home/admin/.hermes/node/bin` to PATH
- **Prevention:** Use `npx vercel` or add Hermes node bin to PATH in shell profile

---

## Open Items (Not Yet Done)

| ID | Task | Priority | Created | Notes |
|----|------|----------|---------|-------|
| TODO-001 | Add `RESEND_API_KEY` to Vercel env vars | Medium | 2026-04-16 | Email won't work without it |
| TODO-002 | Add `OPENAI_API_KEY` to Vercel env vars | Medium | 2026-04-16 | Embeddings won't work without it |
| TODO-003 | Add `CREATE EXTENSION IF NOT EXISTS vector` to schema.sql | Low | 2026-04-16 | Safety net for fresh DBs |
| TODO-004 | Create Stripe account | Low | 2026-04-16 | Phase 2 (payments) |
| TODO-005 | Create Sentry account | Low | 2026-04-16 | Error monitoring |
| TODO-006 | Build working UI | High | 2026-04-16 | Phase 2 main work |
