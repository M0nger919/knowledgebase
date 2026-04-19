# Knowbase — AI Dev Team Sprint Workflow

## Team Roster

| Role | Agent | Skills | Responsibilities |
|------|-------|--------|-----------------|
| Product Manager | Hermes (orchestrator) | ai-project-management, github-issues, writing-plans | Sprint planning, tracking, reporting |
| Tech Lead | Hermes (orchestrator) | subagent-driven-development, systematic-debugging | Task dispatch, parallel coordination, debugging |
| Senior Dev A | Hermes subagent (glm-5.1) | — | Complex features, architecture decisions, refactoring |
| Senior Dev B | Codex | codex | Quick implementations, batch fixes, API routes |
| Senior Dev C | OpenCode | opencode | Open-source tasks, long sessions, feature implementation |
| Code Reviewer | Independent subagent | requesting-code-review, github-code-review | Security scan, quality gate, spec compliance |
| QA Engineer | Independent subagent | dogfood, test-driven-development | Product feature testing, user flows, UI/UX validation, edge cases |
| DevOps Engineer | Hermes + subagents | infra-verification, webhook-subscriptions, saas-bootstrap | Migration verification, env var tracking, deployment health, infra logging |
| UX Designer | Hermes + subagents | popular-web-designs, excalidraw | Design system, wireframes, diagrams |

**IMPORTANT — DevOps vs QA separation:**
- **DevOps** owns infrastructure: migrations, env vars, deployment health. Runs BEFORE a task is marked Done.
- **QA** owns product quality: user flows, UI testing, feature completeness. Runs AFTER infra is verified.
- **Rule: DevOps gate must pass before QA gate runs.**

---

## Sprint Workflow

### Phase 1: Sprint Planning (PM + You)

1. **PM reviews current sprint status** in PM_BOARD.md
2. **PM discusses priorities with you** (Henry) — what to focus on next
3. **PM writes implementation plan** using writing-plans skill:
   - Bite-sized tasks (2-5 min each)
   - Exact file paths and complete code
   - TDD steps for every code task
4. **PM creates GitHub Issues** for each task with sprint labels
5. **PM updates PM_BOARD.md** with sprint tasks

### Phase 2: Task Dispatch (Tech Lead)

1. **Tech Lead reads the plan** and groups independent tasks
2. **Parallel dispatch** via delegate_task(tasks=[...]):
   - Tasks touching DIFFERENT files run in parallel
   - Tasks touching SAME files run sequentially
3. **Each task follows this cycle:**

```
┌─────────────────────────────────────────────┐
│           PER-TASK EXECUTION CYCLE           │
├─────────────────────────────────────────────┤
│                                             │
│  1. IMPLEMENTER (Senior Dev)                │
│     - Fresh subagent per task               │
│     - Receives full task context            │
│     - Follows TDD: test → fail → code → pass│
│     - Commits when green                    │
│                                             │
│  2. SPEC REVIEWER (Code Reviewer)           │
│     - Fresh independent subagent            │
│     - Checks against original spec          │
│     - PASS or list spec gaps                │
│     - If gaps → implementer fixes → recheck │
│                                             │
│  3. QUALITY REVIEWER (Code Reviewer)        │
│     - Fresh independent subagent            │
│     - Security scan, code quality           │
│     - APPROVED or REQUEST_CHANGES           │
│     - If issues → fixer agent → recheck     │
│                                             │
│  4. DEVOPS VERIFICATION (if infra impact)   │
│     - Runs infra-verification skill         │
│     - Verify migrations applied to prod DB  │
│     - Verify env vars set on Vercel         │
│     - Verify deployment health              │
│     - Log results to ~/projects/DevOps/     │
│     - PASS/FAIL/PARTIAL verdict             │
│                                             │
│  5. MARK COMPLETE                           │
│     - Close GitHub issue                    │
│     - Update todo list + PROGRESS.md        │
│     - ONLY if all above gates pass          │
│                                             │
└─────────────────────────────────────────────┘
```

### Phase 3: Integration (Tech Lead)

1. After all tasks complete, run full build + tests
2. Dispatch **integration reviewer** to check cross-task consistency
3. Commit and push to main

### Phase 4: QA (QA Engineer)

1. Wait for Vercel deployment to go live
2. Run **dogfood** skill against the deployed app:
   - Navigate all pages
   - Test all user flows
   - Check console for errors
   - Capture evidence of any issues
3. Generate QA report in dogfood-output/

### Phase 5: Sprint Review (PM + You)

1. PM generates sprint report:
   - Tasks completed vs planned
   - Bugs found by QA
   - Metrics (files changed, tests added, issues closed)
   - Decisions made this sprint
2. PM discusses with you: what went well, what to improve
3. PM updates PM_BOARD.md and PROJECT_PLAN.md
4. PM updates Hermes memory for cross-session continuity

---

## Decision Authority

| Decision Type | Who Decides |
|--------------|-------------|
| Product direction, features, priorities | Henry (you) |
| Sprint scope and task breakdown | PM (Hermes) proposes, Henry approves |
| Technical approach, architecture | Tech Lead proposes, Henry approves |
| Code quality gates | Code Reviewer (automated, non-negotiable) |
| Test requirements | QA Engineer (TDD enforced) |
| Bug severity and fix priority | QA + Tech Lead |

---

## Communication Flow

```
Henry (You)
  ↕ Telegram/Discord (daily check-ins, decisions)
PM (Hermes)
  ↕ PM_BOARD.md + GitHub Issues (sprint tracking)
Tech Lead (Hermes)
  ↕ delegate_task (dispatches work)
Senior Devs (Claude/Codex/OpenCode)
  ↕ Git commits (produce code)
Code Reviewer (subagent)
  ↕ Review reports (approve/reject)
QA Engineer (subagent)
  ↕ dogfood-output/report.md (bug reports)
```

---

## Quality Gates

No code reaches main without passing ALL gates:

1. **TDD Gate** — Every feature has failing test written FIRST
2. **Spec Gate** — Implementation matches the plan exactly
3. **Security Gate** — No hardcoded secrets, no injection vulnerabilities
4. **Quality Gate** — Clean code, proper error handling, no debug prints
5. **Regression Gate** — All existing tests still pass
6. **DevOps Gate** — Migrations applied, env vars set, deployment healthy (infra tasks ONLY)
7. **QA Gate** — Dogfood testing on deployed app passes (product features ONLY)

**Gate ordering:**
- Gates 1–5 apply to ALL tasks
- Gate 6 (DevOps) runs after code review, BEFORE task is marked Done, for any task with infra impact
- Gate 7 (QA) runs at sprint end, AFTER all infra is verified

---

## Current Sprint Assignment

### Sprint 1: Foundation & Auth (IN PROGRESS)

| Task | Role | Status |
|------|------|--------|
| Auth UI (signup/login) | Senior Dev A | ✅ Done |
| Auth session management | Senior Dev A | ✅ Done |
| Ingestion engine | Senior Dev B | ✅ Done |
| Background queue setup | DevOps | 🔄 In Progress |
| QA pass on deployed app | QA Engineer | ⏳ Next |

### Sprint 2: AI Pipeline & Context Engine (UPCOMING)

| Task | Role |
|------|------|
| Semantic chunking algorithm | Senior Dev A (Claude) |
| Hierarchical summary generation | Senior Dev B (Codex) |
| Entity extraction | Senior Dev C (OpenCode) |
| Smart context engine (THE CORE) | Senior Dev A (Claude) |
| Relevance scoring | Senior Dev B (Codex) |
| Context deduplication | Senior Dev C (OpenCode) |

### Sprint 3: Knowledge Graph & Chat (PLANNED)

| Task | Role |
|------|------|
| Relationship detection | Senior Dev A (Claude) |
| Knowledge graph storage | Senior Dev B (Codex) |
| Visual graph view | UX Designer |
| AI chat interface | Senior Dev A (Claude) |
| Proactive suggestions | Senior Dev B (Codex) |

---

## Efficiency Rules

1. **Parallel when possible** — 3 Senior Devs can work simultaneously on different files
2. **Fresh context per task** — no subagent carries baggage from previous tasks
3. **Never self-review** — implementer and reviewer are always different subagents
4. **Fail closed** — if review can't parse result, it's a fail
5. **Max 2 fix cycles** — if code can't pass review after 2 attempts, escalate to Henry
6. **Commit after every task** — small commits, easy to revert
7. **Track everything** — PM_BOARD.md + GitHub Issues + Hermes memory
