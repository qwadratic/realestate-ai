# Stitch Prompts — Property Intelligence Agent

Project: `projects/14200655937375545784` ("Property Intelligence Agent v2")
Design System: **Vienna Heritage** (`assets/fc76b196765c4adeb4c00b7b2e62c873`)

---

## Design System Prompt (already generated, Vienna Heritage)

```
Vienna Heritage design system for a property intelligence platform for Austrian real estate agents.

Light mode. Warm organic background (#FAF9F6). White card surfaces (#FFFFFF). Copper primary (#B87333 / #894D0D). Newsreader serif for headlines. Manrope for body text. Space Grotesk for data labels, numbers, monospace values. 4px border radius max. Generous spacing (spacingScale 3).

No-Line Rule: no 1px borders for sectioning. Use background color shifts only. Tonal depth defines structure.

Editorial luxury feel. Think high-end architectural digest meets data intelligence. Intentional asymmetry. Not a property listing site. Not a SaaS dashboard. A curated intelligence archive.

No blue anywhere. Copper accent signals premium Austrian warmth. Signal colors: green (#4CAF7D), amber (#D4A843), red (#D94F4F) for property intelligence badges.
```

---

## Screen 0: Agent Dashboard (already generated and approved)

```
Property intelligence dashboard for Austrian real estate agents.

Vienna Heritage design system: Light warm background (#FAF9F6), white card surfaces, copper accent (#B87333), Newsreader serif headlines, Manrope body, Space Grotesk data/labels. 4px radius. No borders, use tonal depth.

This is a property intelligence tool for Austrian real estate agents. NOT a listing site. Think luxury architectural digest meets data intelligence.

Layout:
- Top navigation: "Property Intelligence" in Newsreader serif, left. Client context "Müller Family · €400k · 3+ Zimmer · Bezirke 2-9" in Manrope, right. Small copper microphone button.

- Section title in Newsreader: "Market Intelligence" with subtitle "3 properties matched · 2 with signal activity" in Space Grotesk muted.

- 3 property cards on white surfaces (#FFFFFF) against warm background (#FAF9F6):

  Card 1: Photo placeholder. Newsreader title "Altbau-Charme in Landstraße". Manrope address "Rennweg 42, 1030 Wien · willhaben". Space Grotesk data "EUR 345,000 · 78 m² · 3 Zi · 2. OG". Feature tags: standard gray ones + copper-highlighted AI ones ("Südseitig", "Altbau", "Ruhige Lage"). Nearby: school 400m, U-Bahn 200m, Billa 80m. Green signal: "No distress signals". Score "Signal: 0/5".

  Card 2 (HIGHLIGHTED with subtle copper left border): Photo. Newsreader "Penthouse am Praterstern". "Taborstraße 18, 1020 Wien · ImmobilienScout". "EUR 789,000 · 85 m² · 3 Zi · 5. OG". Tags: "Terrasse", "Garage", copper: "Neubau 2021", "Hofseite". Red badge "Owner insolvency filed" + amber "3 listings by same owner" + amber "Building permit incomplete". Score "Signal: 3/5 · Highly motivated seller". This card should feel elevated and important.

  Card 3: Photo. Newsreader "Generalsaniert in Josefstadt". "Josefstädter Str. 71, 1080 Wien · ImmoWelt". Price with validation warning: "EUR 375,000" and sqm shows strikethrough "85 m²" with red "⚠ 72 m² verified". Tags: copper "Generalsaniert", "Westseitig". Red compliance badge "sqm mismatch · § 1299 ABGB".

- Quick question badges row: pill buttons "Compare commute times", "Which is quietest?", "School quality nearby", "Why is #2 flagged?", "Best for family with kids?"

- Floating copper circle button bottom-right with microphone icon for voice.
```

---

## Screen 1: Monitoring Setup

```
Monitoring Setup page for a property intelligence platform. Vienna Heritage design system: Light warm background (#FAF9F6), white card surfaces, copper accent (#B87333), Newsreader serif headlines, Manrope body, Space Grotesk data/labels. 4px radius. No borders, use tonal depth.

This is where a real estate agent creates a monitoring profile for a client. The system will continuously search all Austrian property portals and alert when matches are found.

PAGE LAYOUT:
- Top bar: "Property Intelligence" Newsreader serif left. Agent name right.
- Page title Newsreader: "New Monitoring Profile"
- Subtitle Manrope muted: "Continuous monitoring across all Austrian portals"

LEFT COLUMN (60%) — Client Profile Form on white card:
- "Client Profile" section header in Newsreader
- Name: "Müller Family"
- Budget: range slider EUR 300,000 – EUR 450,000 (values in Space Grotesk monospace)
- Location: multi-select Bezirk pills (2, 3, 5, 7, 8, 9 selected as copper pills)
- Property type: Apartment / House / Penthouse radio
- Rooms: 3+ stepper
- Family details textarea: "Couple with 2 children (ages 4, 7). Both work in Bezirk 1. Need elevator for stroller."
- Priority criteria: numbered draggable pills showing rank order: 1. Near school, 2. U-Bahn < 300m, 3. Elevator, 4. South-facing, 5. Quiet street, 6. Balcony. These determine how the AI ranks and presents properties.

RIGHT COLUMN (40%) — Monitoring Settings on white card:
- "Portal Coverage" section: checkboxes for willhaben ✓, ImmobilienScout24 ✓, ImmoWelt ✓, dieBOE insolvency ✓
- "Intelligence Features" section: toggles for Signal Intelligence (on), Photo Analysis (on), Map Enrichment (on), Output Validation (on)
- "Notifications" section: "Notify when 3+ matches found" dropdown
- "Frequency" section: "Every 6 hours" dropdown

BOTTOM: copper primary button "Start Monitoring" + ghost secondary "Save as Draft"
```

---

## Screen 2: Agent Curation View

```
Agent Curation View for a property intelligence platform. Vienna Heritage design system: Light warm background (#FAF9F6), white card surfaces, copper accent (#B87333), Newsreader serif headlines, Manrope body, Space Grotesk data/labels. 4px radius. No borders, use tonal depth.

This is where the agent reviews AI-monitored properties, annotates them, and rejects with reasoning. The AI learns from these decisions to improve future results.

PAGE LAYOUT:
- Top bar with "Property Intelligence" and navigation tabs: Dashboard, Monitoring, Curation (active, underlined copper), Clients, Email
- Page title Newsreader: "Curation Queue"
- Subtitle: "12 new matches for Müller Family · Last scan: 2 hours ago" in Space Grotesk muted
- Filter bar: tabs "All (12)", "Recommended (5)", "Needs Review (4)", "Rejected (3)"

MAIN CONTENT — Vertical list of property cards (not grid, list view for curation):
Each card is a horizontal layout on white surface:
- LEFT: property photo thumbnail (square, 120px)
- CENTER: Newsreader title, Manrope address + source, Space Grotesk price/sqm/rooms. Below: AI-extracted feature pills (copper for AI-discovered). Below that: signal badges if any.
- RIGHT: Action panel with:
  - Copper button "Shortlist" (adds to client presentation)
  - Ghost button "Maybe Later"
  - Red ghost button "Reject"
  - When "Reject" is clicked, a text field appears: "Why are you rejecting this?" with placeholder "Too far from U-Bahn, client needs < 300m" — the AI uses this to improve

Show 3-4 cards:
- Card 1: Recommended (green dot). Good match. No issues.
- Card 2: Recommended with signal intelligence (copper border). "Owner insolvency" badge.
- Card 3: Needs Review (amber dot). Price slightly above budget.
- Card 4: Already rejected (grayed out, strikethrough). Shows rejection reason: "No elevator, family has stroller" in muted italic.

SIDEBAR RIGHT (narrow): "Recent Comparison Pages" showing 2 thumbnail previews of previously generated client galleries. Small copper "View" link under each. This is the bridge to Screen 3.

BOTTOM: copper button "Generate Comparison Page" (creates the client-facing gallery from shortlisted properties) + "Export to PDF"
```

---

## Screen 3: Client Comparison Gallery (Generative)

```
Client Comparison Gallery — the shareable page a real estate agent sends to their client. Vienna Heritage design system: Light warm background (#FAF9F6), white card surfaces, copper accent (#B87333), Newsreader serif headlines, Manrope body, Space Grotesk data/labels. 4px radius. No borders, use tonal depth.

This page is GENERATIVE. The feature ordering adapts to the client profile. A family sees "Near school" first. An investor sees "Yield potential" first. This is the key differentiator.

PAGE LAYOUT:
- Clean header: Agent company logo area left. "Prepared for Müller Family" in Newsreader serif right. Date in Space Grotesk muted.

- Client profile summary bar (subtle warm background #F4F3F1): "Budget: €300k-€450k · 3+ rooms · Bezirke 2-9 · Family with 2 children · Priority: Schools, Transit, Elevator" in Manrope small. This determines the feature ordering below.

- THREE PROPERTY CARDS side by side, large editorial style:
  Each card on white surface:
  - Large property photo (280px height)
  - Newsreader serif title
  - Manrope address + source portal
  - Space Grotesk monospace: price, sqm, rooms, floor

  - **GENERATIVE FEATURE BOX** (this is the key component):
    Section header: "Why this matches your profile" in Newsreader italic
    Features listed IN ORDER OF RELEVANCE TO THIS CLIENT:
    1. 🏫 "Volksschule Landstraße — 400m" (ranked #1 because family with kids)
    2. 🚇 "U3 Kardinal-Nagl-Platz — 200m" (ranked #2, commute priority)
    3. ♿ "Elevator available" (ranked #3, stroller access)
    4. ☀ "South-facing balcony" (ranked #4)
    5. 🔇 "Quiet residential street" (ranked #5)
    Each item shows a small copper relevance indicator (filled dots: ●●●○○)

  - Signal intelligence summary (if any): compact badge row
  - Agent's annotation in italic Manrope: "Best overall match for your family. The school is excellent — I know parents there."

- Card 2 is highlighted as "AI Recommendation" with subtle copper top border and copper label.

- Card 3 shows the validation warning: sqm mismatch in red.

- Below cards: "Quick Questions" section
  Pill-shaped badges: "Compare commute to Stephansplatz", "Which has the best school?", "Show me the neighborhood", "Why is #2 recommended?", "Price per m² comparison"

- AI Chat area: text input field with placeholder "Ask anything about these properties..." and a copper microphone button to the right. Above the input: a subtle note "Answers verified against source data · § 1299 ABGB"

- Footer: "Powered by Property Intelligence · Prepared by [Agent Name] · [Agency]"
```

---

## Screen 4: Email Inbox

```
Email Inbox for a property intelligence platform. Vienna Heritage design system: Light warm background (#FAF9F6), white card surfaces, copper accent (#B87333), Newsreader serif headlines, Manrope body, Space Grotesk data/labels. 4px radius. No borders, use tonal depth.

This is an AI-powered email inbox that sorts emails by priority and shows AI-assigned labels. The agent sees what matters first.

PAGE LAYOUT:
- Top bar with navigation: Dashboard, Monitoring, Curation, Clients, Email (active, copper underline)
- Page title Newsreader: "Inbox"
- Subtitle Space Grotesk muted: "14 unread · 3 high priority · Last synced: 2 min ago"
- Filter tabs: "All (47)", "High Priority (3)", "Follow-up (8)", "Info Request (12)", "Low Priority (24)"

EMAIL LIST on white card surface — vertical list, each row is a horizontal email item:
Show 8-10 email rows. Each row has:
- LEFT: Priority indicator dot (red = hot lead, amber = follow-up, green = info, gray = low)
- AI label pill: "Hot Lead" (red bg), "Follow-up" (amber bg), "Info Request" (copper bg), "Auto-replied" (green bg), "Low Priority" (gray bg)
- Sender name in Manrope medium weight
- Subject line in Manrope regular, truncated
- Preview snippet in Manrope muted, one line
- Timestamp in Space Grotesk muted, right-aligned ("10:42", "Yesterday", "Mar 25")
- Unread rows have slightly bolder text and a subtle warm left border

Sample emails:
1. 🔴 Hot Lead | "Herr Weber" | "Anfrage: 3-Zimmer Wohnung Bezirk 3" | "Sehr geehrte Damen und Herren, ich suche eine..." | 10:42
2. 🔴 Hot Lead | "Frau Schneider" | "Dringend: Besichtigungstermin morgen?" | "Können wir den Termin für die Wohnung in der..." | 09:15
3. 🟡 Follow-up | "Grundwert Immobilien" | "Re: Kooperationsanfrage MLS" | "Vielen Dank für Ihr Interesse an unserem..." | Yesterday
4. 🟤 Info Request | "Notar Dr. Berger" | "Grundbuchauszug Taborstraße 18" | "Anbei der angeforderte Grundbuchauszug..." | Yesterday
5. ✅ Auto-replied | "willhaben Notification" | "Neue Immobilien in Ihren Suchkriterien" | "3 neue Objekte in Bezirk 3, 5, 8..." | Mar 26
6. ⚪ Low | "Newsletter ImmobilienScout" | "Marktbericht Wien Q1 2026" | "Der Wiener Immobilienmarkt zeigt..." | Mar 25
7. 🟡 Follow-up | "Herr Müller" | "Re: Besichtigung Rennweg 42" | "Die Besichtigung war sehr gut, wir würden..." | Mar 25
8. ⚪ Low | "System" | "Monitoring Report: 12 neue Treffer" | "Für Profil 'Müller Family' wurden 12..." | Mar 25

Clicking an email row would open the Email Detail view (Screen 5).
```

---

## Screen 5: Email Detail + Suggested Response

```
Email Detail view with AI-suggested response for a property intelligence platform. Vienna Heritage design system: Light warm background (#FAF9F6), white card surfaces, copper accent (#B87333), Newsreader serif headlines, Manrope body, Space Grotesk data/labels. 4px radius. No borders, use tonal depth.

This shows an opened email with the AI's suggested response, pre-filled using CRM data about the sender and relevant properties.

PAGE LAYOUT — Two-column:

LEFT COLUMN (55%) — Email Thread on white card:
- Back arrow + "Inbox" breadcrumb
- AI Label: "Hot Lead" red pill
- Subject in Newsreader: "Anfrage: 3-Zimmer Wohnung Bezirk 3"
- From: "Herr Weber <m.weber@gmail.com>" in Manrope
- Date: "28. März 2026, 10:42" in Space Grotesk muted
- Email body in Manrope:
  "Sehr geehrte Damen und Herren,

  ich suche eine 3-Zimmer Wohnung im 3. Bezirk, idealerweise mit Balkon und in der Nähe einer U-Bahn Station. Unser Budget liegt bei ca. EUR 350.000. Wir sind eine junge Familie mit einem Kind (2 Jahre).

  Könnten Sie uns passende Objekte vorschlagen und einen Besichtigungstermin vereinbaren?

  Mit freundlichen Grüßen,
  Martin Weber"

- Divider (tonal shift, not line)

- "AI Suggested Response" header with copper sparkle icon ✦
- Response in Manrope on a very subtle copper-tinted background (#FFF8F2):
  "Sehr geehrter Herr Weber,

  vielen Dank für Ihre Anfrage. Basierend auf Ihren Kriterien habe ich bereits 3 passende Objekte in unserem Portfolio identifiziert:

  1. Altbau-Charme in Landstraße — EUR 345.000, 78 m², 3 Zi., Balkon, 200m zur U3
  2. Penthouse am Praterstern — EUR 389.000, 85 m², 3 Zi., Terrasse, 150m zur U2
  3. Generalsaniert in Josefstadt — EUR 375.000, 72 m², 3 Zi., Einbauküche

  Ich würde Ihnen gerne eine detaillierte Vergleichsseite mit allen Informationen zusenden. Wann hätten Sie Zeit für eine erste Besichtigung? Ich hätte Donnerstag oder Freitag nachmittags verfügbar.

  Mit freundlichen Grüßen,
  [Agent Name]"

- Two buttons: copper "Send Response" + ghost "Edit Before Sending"

RIGHT COLUMN (45%) — CRM Context Panel on warm surface (#F4F3F1):
- Section Newsreader: "About This Contact"
- "New Contact" badge (first interaction)
- Extracted profile (AI-parsed from email):
  - Name: Martin Weber
  - Budget: ~EUR 350,000
  - Requirements: 3 rooms, Bezirk 3, balcony, near U-Bahn
  - Family: young family, 1 child (2 years)
  - Status: New inquiry
- Copper button: "Create Monitoring Profile" (links to Screen 1, pre-filled)

- Section: "Matching Properties"
- 3 compact property cards (miniature versions):
  - Each shows: photo thumbnail, title, price in Space Grotesk, match score "92%", "87%", "81%"
  - These are the properties the AI used to draft the response

- Section: "Suggested Actions" in Space Grotesk
  - "✦ Create comparison page for Herr Weber"
  - "✦ Schedule viewing for top match"
  - "✦ Set up monitoring profile"
  Each as a subtle copper text link.
```

---

## Usage Notes

- All screens use **project 14200655937375545784**
- Apply **Vienna Heritage** design system (`assets/fc76b196765c4adeb4c00b7b2e62c873`) before generating
- Use `GEMINI_3_1_PRO` model for best results
- Generate screens one at a time, review, iterate with `edit_screens` for adjustments
- Download HTML from each screen for implementation reference
