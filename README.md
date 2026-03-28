<div align="center">

# Klar

### Property Intelligence for Austrian Real Estate

**"When I'm at a viewing and someone calls ... customer lost."**

3-in-1 AI assistant: Voice Agent + Property Search + Email Triage.
So the agent can focus on relationships, viewings, and negotiations.

[Live Demo](https://property-intel-omega.vercel.app) . [About Page](https://property-intel-omega.vercel.app/about) . [GitHub](https://github.com/qwadratic/realestate-ai)

</div>

---

## The Problem

26 discovery calls. 148 prospects. Three patterns kept repeating:

1. **Lost leads** - Agents can't pick up the phone during viewings. Caller gone.
2. **Manual research** - 5-6 hours per assignment copying listings into spreadsheets.
3. **Email overload** - Sorting inquiries, responding to the same questions, chasing follow-ups.

One persona. One root cause: **the agent is the bottleneck.**

## What It Does

### AI Voice Agent
Answers calls when the agent is at a viewing. Pre-qualifies the caller (budget, urgency, timeline), captures contact details, forwards a structured summary. No more lost leads.

### Multi-Portal Property Search
Searches willhaben, ImmobilienScout24, ImmoWelt simultaneously. AI extraction from German descriptions. Owner intelligence and insolvency signals via Exa. Compliance validation under Austrian law. **5-6 hours of manual research becomes a 2-minute review.**

### AI Email Agent
Classifies incoming emails, drafts context-aware responses in the agency's voice, queues for human review. Built as a coding agent extension because this tool is deeply personal.

> *Propelos is AI for browsing. Klar is AI for advising.*

## Traction

Already closing deals from discovery: **1 closed deal, 43% pipeline rate.**

## Architecture

```
Client Call          Search Pipeline          Intelligence           Output
----------          ---------------          ------------           ------

Transcript    -->   willhaben.at      -->   Exa Semantic     -->   Comparison Page
Profile              ImmobilienScout         Owner Intel            Shareable Link
Criteria             ImmoWelt                Insolvency Check       AI Chat
                                             Google Maps            Voice Agent
              -->   Claude Extract    -->   Compliance Check  -->
                    (German NLP)            (MaklerG, ABGB)
```

## 10-Tool Agent

Claude Sonnet 4 with agentic tool loop. Each tool is a real API call.

| Tool | What it does |
|------|-------------|
| `list_properties` | Browse all properties in the system |
| `extract_features` | AI extraction from German descriptions |
| `lookup_intel` | Owner & insolvency signals via Exa |
| `search_nearby` | Schools, transit, supermarkets via Google Maps |
| `enrich_with_maps` | Full Maps enrichment + commute calculation |
| `compute_commute` | Public transit time to any destination |
| `validate_compliance` | Austrian law compliance (MaklerG, ABGB) |
| `analyze_property` | Full pipeline: extract + enrich + validate |
| `analyze_all` | Batch analysis across all properties |
| `web_search` | Exa semantic search for context |

## Intelligence Signals

What competitors miss. What Klar catches.

- **Insolvency** - Detects active proceedings against property owners. Signals negotiation leverage.
- **Compliance** - Catches sqm mismatches between listing and description. References Austrian law (MaklerG, ABGB).
- **Location** - Schools, transit, supermarkets within 1km. Commute by public transit. Personalized by family.

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Feed | `/` | Morning triage. Clients sorted by urgency. |
| Client Detail | `/clients/[id]` | Transcript, AI-extracted profile, criteria, search pipeline. |
| Curation | `/curation` | Select properties, generate shareable links. |
| Comparison | `/comparison/[id]` | Client-facing cards with signals + AI chat + voice. |
| Email | `/email` | AI-prioritized inbox with suggested responses. |
| About | `/about` | Architecture, features, tech stack. |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Space Grotesk |
| AI Agent | Claude Sonnet 4 via OpenRouter, 10-tool agentic loop |
| Intelligence | Exa semantic search, Google Maps Platform |
| Compliance | Austrian law validation (MaklerG, ABGB) |
| Voice | ElevenLabs Conversational AI |
| Email | Claude Sonnet classifier, 95.4% accuracy (MCC=0.912) |
| Testing | Robot Framework + Playwright (33 tests, all pass) |
| Deploy | Vercel |

## How We Built It

Discovery-first. 26 call transcripts, structured signal table, 10 pain clusters, 5 scored ICP hypotheses, 11 mapped objection patterns.

Then we built only what the data demanded: German-language voice recognition, multi-portal scraping with deduplication, email classification with embedding database support.

## Quick Start

```bash
cd property-intel
cp .env.example .env.local  # Add your API keys
npm install
npm run dev
```

Required environment variables:
```
OPENROUTER_API_KEY=     # Claude Sonnet via OpenRouter
EXA_API_KEY=            # Exa semantic search
GOOGLE_MAPS_API_KEY=    # Google Maps Platform
```

## Testing

```bash
cd property-intel
robot --outputdir tests/results tests/klar_demo.robot
```

33 human-readable BDD tests with Playwright backend and video recording.

## Design System

| Element | Value |
|---------|-------|
| Font | Space Grotesk (single font, precision feel) |
| Primary | Copper #B87333 (every competitor uses blue) |
| Background | Warm off-white #FAF9F6 |
| Borders | None. Tonal depth only. |
| Radius | 4px everywhere |
| Elevation | Background color shifts, not shadows |

---

<div align="center">

Built at **OpenClaw Hackathon Vienna**, March 2026

**KaiserTech** . Vienna, Austria

</div>
