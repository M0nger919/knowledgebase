# Deployment Automation Review — Knowbase

## Current Workflow (Manual Steps Required)

```
[Code Change] → git commit → git push → Vercel auto-deploys → ❓ check if it worked
```

**Problems with this:**
1. No local build check before pushing — broken code reaches production
2. Env vars managed manually in Vercel Dashboard — easy to forget, no source of truth
3. No CI/CD pipeline — no tests, no linting, no safety net
4. Schema changes require manual Supabase SQL Editor execution
5. Debugging deploy failures requires Vercel token + CLI — reactive, not proactive

---

## Recommended Automation Improvements

### 1. GitHub Actions CI Pipeline (HIGH IMPACT)
```yaml
# .github/workflows/ci.yml
on: push / PR
jobs:
  build:
    - checkout
    - setup node
    - npm ci
    - npm run build        # catches type errors before deploy
    - npm run lint         # code quality gate
  test:
    - npm test             # future-proof for when we add tests
```
**Benefit:** Broken code never reaches Vercel. You see failures in GitHub PRs.

### 2. Environment Variables as Code (HIGH IMPACT)
- Store all env vars in a `.env.example` file (committed to git)
- Use Vercel CLI to sync: `vercel env pull .env.local`
- Single source of truth → no more "forgot to add env var" deploy failures

### 3. Pre-push Hook (MEDIUM IMPACT)
```bash
# .husky/pre-push
npm run build || exit 1
```
**Benefit:** Instant feedback — if build breaks, push is blocked locally.

### 4. Supabase Migrations (MEDIUM IMPACT)
- Replace raw `schema.sql` with Supabase CLI migrations
- `supabase migration new <name>` → versioned, trackable
- Migrations run automatically in CI or via `supabase db push`
- No more manual SQL Editor execution

### 5. Vercel Preview Deployments (LOW EFFORT, HIGH VALUE)
- Already enabled by default with GitHub integration
- Every PR gets a preview URL
- Can test changes before merging to main

### 6. Automated Deploy Health Check (FUTURE)
- Cron job or GitHub Action that pings the deployed URL after deploy
- Catches runtime crashes (like the Resend error) automatically

---

## Proposed Implementation Order

| Step | What | Effort | Impact |
|------|------|--------|--------|
| 1 | `.env.example` + Vercel env sync | 10 min | Prevents missing env var failures |
| 2 | GitHub Actions CI (build + lint) | 30 min | Catches errors before deploy |
| 3 | Pre-push hook | 5 min | Instant local feedback |
| 4 | Supabase CLI + migrations | 1 hour | Versioned schema changes |
| 5 | Preview deployment testing | 0 min | Already works with Vercel |

---

## What's Already Automated ✅
- Vercel auto-deploys on git push to main
- Git push to GitHub (single command)
- Database schema executed once (static)

## What Still Needs Manual Intervention ❌
- Env var management
- Schema migrations
- Build verification before push
- Deploy failure detection
