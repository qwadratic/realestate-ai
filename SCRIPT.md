# Demo Script — Klar Property Intelligence (3 Minutes)

**Team:** KaiserTech (2 people) | **Event:** OpenClaw Hackathon Vienna, March 2026

---

## Opening (0:00 - 0:20) — The Problem

> "Every real estate agent in Austria spends 3 hours per client on the same workflow: listen to what they want, search 4 portals, cross-reference ownership data, check compliance, and prepare a comparison. Klar does this in 60 seconds."

**Show:** README landing page at `/about` — architecture diagram, feature highlights.

---

## Scene 1 (0:20 - 0:50) — Client Understanding

**Show:** Dashboard (`/`) — 3 clients, activity feed with urgency signals.

> "This is the agent's morning view. Not a dashboard — a triage feed. Red means act now."

**Click:** Familie Muller → Client detail (`/clients/muller`)

> "One phone call. The AI listened, extracted a full client profile, and derived search criteria. Every field is grounded in what the client actually said."

**Hover:** Quote tooltip on a profile field → shows the exact transcript quote.

> "Hover any field — it shows you the exact quote. Nothing hallucinated."

**Demo:** Edit a search criterion inline (change budget to 500k).

> "The agent edited the budget after talking to the husband. Everything is editable."

---

## Scene 2 (0:50 - 1:30) — Intelligent Search Pipeline

**Click:** "Suche starten" button

> "Now watch. It searches 3 Austrian portals simultaneously, runs Exa intelligence for owner and insolvency signals, then validates compliance under Austrian law."

**Show:** Pipeline animation — 6 steps completing with green checkmarks.

> "6 properties found. 1 with an insolvency signal. 1 with a compliance flag — the listed square meters don't match the description. That's a § 1299 ABGB issue."

**Show:** Results grid with signal chips and compliance warnings.

---

## Scene 3 (1:30 - 2:10) — Curation & Client-Facing Output

**Click:** "Vergleichsgalerie erstellen"

> "The agent curates. Some properties get excluded — too far from schools, wrong district. What's left gets a shareable link."

**Show:** Curation page (`/curation`) — select 3 properties, click "Generate comparison link"

**Show:** New tab opens with comparison page — the client-facing output.

> "This is what the client receives. Not a PDF — a live, interactive page. Personalized for the Muller family. Look: schools are listed first because they have children. An investor would see yield first."

**Point out:**
- Property cards with signals (insolvency = red, sqm mismatch = amber)
- Agent notes on each card
- "Prepared for Muller Family" header

---

## Scene 4 (2:10 - 2:40) — AI Chat & Voice Agent

**Show:** Chat panel on comparison page. Type: "Warum ist die Taborstraße empfohlen?"

> "The client can ask questions. The AI doesn't just answer — it retrieves the client's persona, checks what they care about, and explains in context."

**Show:** Chat response with reasoning: retrieves client criteria, matches against property features, explains insolvency = negotiation leverage.

**Click:** Voice FAB (microphone button)

> "Or they can just ask out loud."

**Show:** Voice agent responds about the Penthouse Praterstern.

---

## Scene 5 (2:40 - 3:00) — Technical Depth & Close

> "Under the hood: a 10-tool Claude agent connected to Google Maps, Exa Intelligence, and Austrian compliance checks. 33 Robot Framework tests. Deployed on Vercel."

**Show:** Quick scroll of README `/about` page — architecture diagram, tool list, tech stack.

> "Propelos is AI for browsing. Klar is AI for advising. That's the difference."

---

## Key Demo Beats

| Beat | What judges see | Why it matters |
|------|----------------|----------------|
| Quote tooltips | AI claims grounded in real transcript | Trust, not hallucination |
| Insolvency signal | Red chip on property card | Real-world intelligence |
| Compliance flag | sqm mismatch + law reference | Legal accuracy |
| Shareable link | URL encodes property selection | Product thinking |
| Voice agent | Speak to get property insights | Wow factor |
| Pipeline animation | 6 steps with real API names | Technical depth |

## Fallback Plan

If voice agent doesn't work live: skip Scene 4 voice part, extend chat demo.
If APIs are slow: pipeline animation is simulated, results load from fixtures.
If Vercel is down: run locally, it's the same code.
