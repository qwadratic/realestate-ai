# UX Design — Property Intelligence Agent

## Core Principle

The agent doesn't browse. They triage. The main screen answers:
**"Was ist neu, und was muss ich jetzt tun?"**

## Screen Hierarchy

| # | Screen | Purpose |
|---|--------|---------|
| 1 | **Feed** | Morning briefing. All clients, prioritized by urgency. Actions needed. |
| 2 | **Comparison Gallery** | Client-facing shareable page. The product output. |
| 3 | **Curation** | Review/annotate matches per client. Batch processing. |
| 4 | **Property Detail** | Deep dive on one listing with signals + map. |
| 5 | **Monitoring Setup** | Configure new client search profile. Occasional. |
| 6 | **Email Detail** | AI-suggested response with CRM context. Demo feature. |

## Feed (Main Screen)

Unified activity feed — everything since last visit, sorted by urgency.

### Item Types (by priority)

1. **New Inquiry** (red) — email arrived, AI drafted response, matching properties found
   - Actions: [Respond] [Create Profile]
2. **Signal Alert** (amber) — insolvency, price drop, sqm mismatch detected
   - Actions: [Call Client] [View Property]
3. **New Matches** (amber) — monitoring scan found results for a client
   - Actions: [Curate] [Auto-Shortlist]
4. **Client Activity** (neutral) — comparison page opened, viewing confirmed
   - Info only, no action needed
5. **Low Priority** (gray) — batch of minor matches
   - Actions: [Review Later]

### Feed Structure

```
TODAY — N actions needed
  [urgent items with action buttons]

YESTERDAY
  [completed items with status]
  [low priority batch]

EARLIER THIS WEEK
  [collapsed]
```

## Comparison Gallery (Client-Facing)

- Generative feature ordering (family → schools first, investor → yield first)
- Signal badges on every card
- AI chat + quick question pills
- Agent annotations in italic
- "Prepared for [Client]" header
- Footer: "Powered by Property Intelligence"

## Design Direction

- **Font:** Space Grotesk only. Different sizes/weights for hierarchy.
- **Palette:** Black + white + Tiffany (#0ABAB5) accent
- **Brand:** "Property Intelligence" everywhere
- **Nav:** Horizontal top tabs (Feed, Curation, Clients, Email)
- **No borders.** Tonal depth only.
- **No decorative elements.** Content-first.

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Feed replaces Dashboard | Agents triage, they don't browse. "What's new + what to do" > cards with data. |
| Single font (Space Grotesk) | Three fonts looked sloppy. One geometric sans = precision = trust. |
| Tiffany accent, not copper | Clean B&W wireframe approach. Tiffany is distinctive, not another proptech blue. |
| Email is Screen 6, not 4 | Most agents already have email. This is a demo feature, not core workflow. |
| Comparison is #2 | This is the product output — the thing clients actually see. |
