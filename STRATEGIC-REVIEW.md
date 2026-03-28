# Strategic Review — Outside Voice

Post-hackathon adversarial review. Not a pat on the back. The problems and where to go.

---

## Market Reality

Austria: ~8,000-10,000 licensed Makler. ~4,000-5,000 independents who pick their own tools. At €99-199/mo = TAM of €6-12M/yr. Not venture-scale unless you articulate Austria → Germany (80,000+ Makler) within 18 months.

"Lost calls during viewings" is solved by a €10/month virtual receptionist. "5 hours of research" is closer to a painkiller, but 26 calls with 1 closed deal proves people will talk to you, not that they'll pay.

## Competitive Moat: None Yet

- 10-tool agent is a weekend project for any competent team. Thin wrappers around public APIs.
- Compliance validation is an LLM prompt, not a trained model on case law.
- Insolvency signal is an Exa search query, not connected to Firmenbuch or Ediktsdatei.

What COULD become defensible:
- Data moat from real agent usage (search patterns, deal outcomes). Zero usage data today.
- Portal operator relationships (API access vs scraping, which will get you blocked).
- Email classifier trained on real agent patterns. Personalized, hard to replicate.

## Demo vs Reality

A technical judge will see:
1. All properties are fixtures in district 10, but search criteria specify districts 2,3,7,8
2. "Multi-portal search" loads a JSON file
3. Compliance validation is Claude prompting with no accuracy measurement
4. Pipeline animation is explicitly simulated (SCRIPT.md says so)
5. Only 1 of 3 clients has real data (Schmidt and Weber are stubs)

## Weakest Link

Building horizontal (voice + search + email) when each alone is a 6-month build. Mile wide, inch deep. The strategic mistake is pitching "3-in-1" when none of the three works end-to-end in production.

**Pick one. Ship it. Get 10 agents using it daily. Then expand.**

## The Narrowest Wedge

Automated Grundbuch + insolvency intelligence reports. Makler already pay for property reports. Connect to Firmenbuch/Ediktsdatei/Grundbuch. Deliver automated intel report: owner status, liens, insolvency, encumbrances. Transaction pricing (€15-30/report), clear ROI.

Wrong product shape for this wedge. Should be a single API endpoint: `POST /report { address }` → intelligence PDF. Let agents embed in existing workflow.

## Hidden 10x Idea

Real-time market intelligence from aggregated agent behavior data. 100+ agents searching = demand signals for the Austrian property market. Which districts heat up, what price points move, where supply-demand mismatches exist.

Sell upstream: to developers deciding where to build, banks pricing mortgages, investors timing entries. Agents become the data network, not the customers. Tool is free; data is the product.

Requires scale you don't have. Not what you're building today. But it's the venture-scale idea inside the lifestyle-business execution.

## Voice Agent: Demo Toy

Maya answers calls but doesn't book viewings, send links, or log leads. It's fancy voicemail with AI summarization. Dialpad does this for less. Must-have version: answer call → identify client → pull active search → recommend matches → text comparison link. Currently step 1 of 5.

## Email Agent: The Real Product

95.4% accuracy on 200 real emails. Personalized to agent behavior. Cost-weighted scoring. Prompt injection defense. Engineering rigor.

Compare to main product: compliance accuracy "unverified," pipeline "simulated," persistence "not implemented."

The email agent has the rigor. The main app has the polish. They're building the wrong thing well and the right thing in the wrong repo.

## What To Cut / Double Down

**Cut (post-hackathon):**
- Voice agent Maya as standalone product (demo toy without CRM)
- Multi-portal search claims (can't scrape without getting blocked)
- 6-screen dashboard (premature UI without persistence)

**Double down:**
- Email triage as standalone product. Ship to 10 agents next week.
- Insolvency/intel signals with real Austrian data sources (Ediktsdatei, Firmenbuch)
- The 26-call discovery data. Pick ONE pain point and go deep.

## Bottom Line

Good taste, strong discovery, impressive 3-minute demo. Building a horizontal platform when you should be driving a single sharp wedge. The demo will win a hackathon. It won't win a market.

---

*Generated 2026-03-28 by adversarial review subagent*
