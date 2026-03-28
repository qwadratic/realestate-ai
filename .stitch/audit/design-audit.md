# Design Audit — Property Intelligence Agent (Stitch Screens)

**Date:** 2026-03-28
**Screens:** 6 (Dashboard, Monitoring, Curation, Comparison, Email Inbox, Email Detail)
**Design System:** Vienna Heritage (light mode)
**Reviewer:** /design-review

---

## First Impression

The site communicates **premium intelligence tool, not a listing site.** That's the right signal.

I notice **Screen 0 (Dashboard) is the strongest design** — editorial hierarchy, property cards with signal badges, warm copper accents, generous spacing. It feels like the product it claims to be.

The first 3 things my eye goes to: **the property photos** (good), **the signal badges on Card 2** (great — this IS the product), **the "Market Intelligence" headline** (Newsreader serif does heavy lifting here).

If I had to describe Screen 0 in one word: **"Curated."**

But across all 6 screens, the word becomes: **"Inconsistent."** Each screen feels like it was designed by a different person with a different understanding of the brand.

---

## Design Score: C+
## AI Slop Score: B

---

## Inferred Design System (Extracted)

| Token | Screen 0 | Screen 1 | Screen 2 | Screen 3 | Screen 4 | Screen 5 |
|-------|----------|----------|----------|----------|----------|----------|
| **Brand** | Property Intelligence | Property Intelligence | Editorial Intelligence | VIENNA HERITAGE | Vienna Heritage | Editorial Intelligence |
| **Fonts** | Newsreader, Manrope, Space Grotesk | Same | Same | Same | Same | Same |
| **Background** | #FAF9F6 | #FAF9F6 | #FAF9F6 | #FAF9F6 | #FAF9F6 | #FAF9F6 |
| **Card surface** | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF |
| **Primary** | #894D0D (copper) | #894D0D | #894D0D | #894D0D | #894D0D | #894D0D |
| **Nav style** | Sidebar + top bar | Top nav | Top tabs | Top tabs | Sidebar + top | Sidebar |

---

## Findings

### FINDING-001: Brand name inconsistent across screens [HIGH]

| Screen | Brand Text |
|--------|-----------|
| 0 - Dashboard | "Property Intelligence" ✓ |
| 1 - Monitoring | "Property Intelligence" ✓ |
| 2 - Curation | "Editorial Intelligence" ✗ |
| 3 - Comparison | "VIENNA HERITAGE" ✗ |
| 4 - Email Inbox | "Vienna Heritage" ✗ |
| 5 - Email Detail | "Editorial Intelligence" ✗ |

**Impact:** Users seeing 3 different brands across 6 screens would lose all trust. This must be "Property Intelligence" everywhere.

**Fix:** When building frontend, hardcode brand as "Property Intelligence" in shared layout component.

---

### FINDING-002: Three fonts where one was requested [HIGH]

All screens use the 3-font system from Vienna Heritage:
- **Newsreader** (serif) — headlines
- **Manrope** (sans) — body
- **Space Grotesk** (mono) — data/labels

User explicitly requested: **Space Grotesk only**, different sizes/weights.

**Fix:** When building frontend, use Space Grotesk throughout. Light weight for body, medium for headings, tabular-nums for data. Lose Newsreader and Manrope.

**Design note:** Space Grotesk works well as a universal font here because the product is intelligence/data-forward, not editorial-luxury. A geometric sans with mono undertones signals "precision" which is exactly what Austrian real estate agents want from a compliance tool.

---

### FINDING-003: Screen 1 has 192px "VIENNA HERITAGE" watermark [HIGH]

The monitoring setup page has a hidden/oversized `H2` element at 192px font size reading "VIENNA HERITAGE". This is the "strip" the user noticed — likely a Stitch design system label that leaked into the generated screen.

**Fix:** Remove entirely in frontend build. Not a design element.

---

### FINDING-004: Screen 2 uses non-Austrian properties [MEDIUM]

The Curation Queue shows:
- "Belle Alliance Penthouse" — Belle-Alliance-Platz is in **Berlin**
- "Charlottenburg Garden Residence" — Charlottenburg is a **Berlin** district
- "Industrial Loft Space" — generic, no Vienna location

These should be Vienna properties with Austrian addresses (Bezirk numbers, Straße names).

**Fix:** When building frontend, use fixture data from `property-intel/fixtures/properties.json` which has 6 real Vienna properties.

---

### FINDING-005: Navigation pattern inconsistent across screens [MEDIUM]

| Screen | Nav Pattern |
|--------|-------------|
| 0 | Left sidebar with icon links + top bar |
| 1 | Horizontal top bar only |
| 2 | Horizontal tabs (Dashboard, Monitoring, Curation, Clients, Email) |
| 3 | Horizontal tabs (Portfolio, Collections, Coverage) — different labels |
| 4 | Left sidebar + horizontal top tabs — both |
| 5 | Left sidebar (Inbox, Drafts, Sent, Archived, Trash) |

Three different navigation paradigms across 6 screens.

**Fix:** Pick one pattern and stick to it. Recommendation: **horizontal top tabs** (Screen 2 pattern) for agent-facing screens (0, 1, 2, 4). Screen 3 (client comparison) should have its own clean header — it's the client-facing shareable page. Screen 5 inherits Screen 4's nav since it's the email detail view.

---

### FINDING-006: Screen 4 has dark hero banner [MEDIUM]

The Email Inbox has a dark brown/copper banner section at the top right ("Priority Detected in Bezirk 3") that conflicts with the light mode Vienna Heritage design system.

Vienna Heritage is explicitly light mode. Dark sections break the tonal layering principle.

**Fix:** Use warm surface (#F4F3F1) background instead of dark banner. Highlight priority content with copper accent text on light surface.

---

### FINDING-007: Screen 2 heading hierarchy broken [POLISH]

- H3 "Recent Comparison Pages" renders at **10px** — far too small for an H3 tag
- H1 "Curation Queue" at 48px is good
- H2 property titles at 24px are good

**Fix:** Section headers like "Recent Comparison Pages" should be 14-16px in Space Grotesk, bold. Don't use H3 for something at 10px.

---

### FINDING-008: Screen 3 comparison cards lack signal badges [MEDIUM]

The prompt specified signal badges (owner insolvency, sqm mismatch) on comparison cards. The generated screen shows:
- Card 2: Has "AI RECOMMENDATION" label ✓
- Card 3: Has "Rooftop terrace" but no sqm mismatch warning ✗

The signal intelligence display — the whole product differentiator — is underrepresented on the most important screen.

**Fix:** When building frontend, ensure PropertyValidated data flows through to comparison cards. Signal badges (green/amber/red) must be prominent on every card.

---

### FINDING-009: No-Line Rule mostly followed [POSITIVE]

Across all screens, tonal depth defines structure. Cards sit on warm background without borders. The only violations are subtle input field bottom borders (acceptable per DESIGN.md) and some filter tab underlines (expected for active state).

Good execution of the core design principle.

---

### FINDING-010: Screen 5 email detail is the best new screen [POSITIVE]

The two-column layout (email thread left, CRM context right) is well-structured. The AI suggested response area with copper-tinted background is clear and distinct. "About This Contact" sidebar with matching properties and match scores (92%, 87%, 81%) is exactly what an agent needs.

This screen has the clearest information hierarchy of all new screens.

---

## Category Grades

| Category | Grade | Notes |
|----------|-------|-------|
| Visual Hierarchy | B | Screen 0 strong, others vary |
| Typography | D | 3 fonts, user wants 1. Heading scale inconsistent (10px H3). |
| Color & Contrast | A | Copper palette consistent, warm neutrals, signal colors correct |
| Spacing & Layout | B | Generous spacing, editorial feel. Some dense areas in Screen 2 |
| Interaction States | N/A | Static Stitch screens, not evaluable |
| Responsive | N/A | Desktop only, not evaluable |
| Content Quality | C | Wrong brand names, Berlin properties, watermark leak |
| AI Slop | B | No purple gradients, no blob decorations, no 3-column icon grids. Some centered headings. |
| Motion | N/A | Static |
| Performance | N/A | Static HTML |

---

## Quick Wins (for frontend build)

1. **Single font: Space Grotesk everywhere** — biggest impact, simplest change
2. **Hardcode "Property Intelligence" brand** — one shared component
3. **Unified horizontal nav** — Dashboard, Monitoring, Curation, Clients, Email
4. **Signal badges on all property cards** — this IS the product
5. **Kill the dark banner on email inbox** — light surfaces only

---

## Screen Rankings (best to worst for frontend reference)

1. **Screen 0: Dashboard** — Use as primary reference. Best hierarchy, signals, layout.
2. **Screen 5: Email Detail** — Clean two-column, good CRM sidebar.
3. **Screen 3: Comparison Gallery** — Right structure, needs more signal data.
4. **Screen 1: Monitoring Setup** — Good form layout, remove watermark.
5. **Screen 4: Email Inbox** — Good list view, fix dark banner.
6. **Screen 2: Curation** — Weakest. Wrong properties, small headings, needs work.

---

## Recommendation

Screen 0 and Screen 5 are the two strongest references. Build the frontend using Screen 0 as the component library source (property cards, signal badges, quick question pills, copper accents) and apply Space Grotesk universally.

The Stitch screens are **good enough as directional reference** but should not be pixel-replicated. The frontend build should normalize: one font, one brand, one nav pattern, consistent signal display.
