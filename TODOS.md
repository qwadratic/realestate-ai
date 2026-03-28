# TODOS — Klar Property Intelligence

Post-hackathon roadmap. Prioritized by go-to-market impact.
Generated from CEO + Eng review, 2026-03-28.

---

## P0 — Ship Blockers

### Rotate exposed secrets
`.env` was in the repo before `.gitignore` was added. Google Cloud token and Stitch access token are in git history. Rotate all keys, run `git filter-branch` to purge history, enable secret scanning on GitHub.
**Effort:** 30 min | **Risk if skipped:** credential compromise

### Sanitize chat HTML output (XSS)
`chat-input.tsx` uses `dangerouslySetInnerHTML` with naive regex markdown conversion. No sanitization. An LLM response containing `<img onerror="...">` executes in the user's browser. Install `dompurify`, wrap all rendered HTML.
**Effort:** 1 hour | **Risk if skipped:** XSS via prompt injection through property descriptions

---

## P1 — Before First Real User

### Add auth + rate limiting to API routes
All 7 API endpoints are unauthenticated. `/api/call` triggers paid ElevenLabs calls. `/api/agent` burns OpenRouter tokens. An attacker can run up thousands in charges with a curl loop. Add Vercel Edge Middleware with API key auth, Upstash rate limiting (10 req/min per IP).
**Effort:** 4 hours | **Affects:** `/api/agent`, `/api/chat`, `/api/call`, `/api/voice/*`, `/api/properties`, `/api/tools/*`

### Wrap agent tool execution in try/catch
`agent.ts:400` — `executeTool()` is called without error handling. If Google Maps is down, entire agent loop crashes. User sees blank screen. Wrap in try/catch, return graceful error as tool result.
**Effort:** 1 hour | **File:** `src/lib/agent.ts:394-410`

### Add timeouts to all external API calls
`maps.ts`, `exa.ts` — `fetch()` calls have no timeout. If an API hangs, Vercel times out at 30-60s with no user feedback. Use `AbortController` with 10s timeout on all external calls.
**Effort:** 2 hours | **Files:** `src/lib/maps.ts`, `src/lib/exa.ts`, `src/lib/agent.ts`

### Use Promise.allSettled instead of Promise.all
`agent.ts:207` — parallel Maps + Exa calls fail together. If one API is down, both results are lost. Switch to `Promise.allSettled` with graceful fallbacks.
**Effort:** 30 min | **File:** `src/lib/agent.ts:206-210`

### Move hardcoded PII out of source code
Voice prompt in `route.ts` contains real client names, budgets, addresses, viewing times. Phone number hardcoded in `call/route.ts`. Move to env vars or database.
**Effort:** 1 hour | **Files:** `src/app/api/voice/v1/chat/completions/route.ts`, `src/app/api/call/route.ts`

---

## P2 — Go-to-Market Quality

### Add data persistence (Supabase)
All analyzed data lives in-memory (`Map` in `agent.ts`). Page refresh = everything lost. Wire Supabase for: analyzed properties, client profiles, agent audit logs. Schema designed but not implemented.
**Effort:** 8 hours | **Unlocks:** multi-session workflows, real client management

### Separate demo mode from production mode
No visual indicator that screens show fixture data. Add `NEXT_PUBLIC_DEMO_MODE` env var. Show "DEMO" banner. Separate routes: `/demo/*` for fixtures, `/app/*` for real data. Prevent accidental production use of demo code.
**Effort:** 3 hours

### Build compliance validation test set
Claude validates Austrian law compliance but accuracy is unverified. Build 20-50 test properties with known issues (sqm mismatches, missing disclosures). Measure accuracy. Target 90%+. Add disclaimer: "AI-assisted analysis, not legal advice."
**Effort:** 4 hours | **Risk if skipped:** wrong compliance advice to agents

### Integrate email agent
Email triage (95.4% accuracy, MCC=0.912) is a separate Pi extension. Not wired to main app. Create `/api/email/classify` endpoint, expose classifier, show real emails on `/email` screen with fixture fallback.
**Effort:** 2 hours | **Unlocks:** 3-in-1 value prop becomes real, not just landing page claim

### Add audit logging for agent actions
No trace of tool calls, LLM prompts, or validation outputs. If agent gives wrong advice, no way to debug. Log all tool calls with input/output, cost estimate, timestamp to Supabase.
**Effort:** 4 hours | **Unlocks:** debugging, cost tracking, compliance audit trail

### Add security headers
No CSP, X-Frame-Options, HSTS, or X-Content-Type-Options. Add via `next.config.js` headers.
**Effort:** 30 min

### Update Anthropic SDK
`@anthropic-ai/sdk` at 0.80.0, latest is 0.95.0+. Missing features and security patches.
**Effort:** 15 min

### Add input validation to all POST endpoints
`/api/chat`, `/api/agent`, `/api/call` — no validation on request body. Malformed input crashes endpoints with 500. Add zod schemas.
**Effort:** 2 hours

### Rate limit expensive agent operations
`analyze_all` tool runs full pipeline on every property (Claude + Maps + Exa per property). 100 calls = ~€120. Add per-user daily quota.
**Effort:** 2 hours

---

## P3 — Scale & Polish

### Wire real property scraping
Apify scraper exists (`scripts/scrape-properties.ts`), 8 real Vienna properties already scraped. App still uses hand-written fixtures. Swap in scraped data, add refresh schedule.
**Effort:** 2 hours

### Add E2E tests for real API paths
Current Robot Framework tests are fixture-based. Need Playwright tests for: agent chat with real Claude, Maps timeout handling, Exa failure graceful degradation, rate limiting enforcement.
**Effort:** 6 hours

### Multi-tenant architecture
Currently single-agent demo. Multiple real estate agencies need isolated data, separate clients, own branding. Design tenant model, auth system, data isolation.
**Effort:** 2-3 weeks

### German UI completion
Some labels still English ("Compare commute", "best school" on comparison page quick questions). Full German pass needed.
**Effort:** 1 hour

### Portal monitoring (continuous search)
Architecture designed in Stitch prompts. Not implemented. Continuous scanning of willhaben/ImmoScout/ImmoWelt with alerts when new matches found.
**Effort:** 1-2 weeks

### Voice agent tools: schedule_viewing, send_comparison_link, log_lead
Shown as "Planned" on landing page. Need Supabase + calendar integration for scheduling, email sending for comparison links, CRM write for lead logging.
**Effort:** 1 week

---

*Last updated: 2026-03-28 (OpenClaw Hackathon)*
