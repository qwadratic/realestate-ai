# Stitch Prompts v5 — Klar Property Intelligence

**Project:** `projects/15851953800831516062` ("Klar")
**Design System:** `assets/11635772912728155990` ("Klar Design System")

## Design System Reference

All screens use the same design system. Never deviate.

```
Klar design system. Property intelligence for Austrian real estate agents.

Single font: Space Grotesk. All sizes, all weights. No serif fonts. No second font.
Tabular-nums for all numbers. Letter-spacing: -0.01em for headlines.

Background: warm off-white #FAF9F6. Cards: #FFFFFF. Surface: #F4F3F1.
Primary: copper #B87333, dark copper #894D0D.
Text: #1A1C1A. Muted: #555B64. Faint: #7D838C.
Signal: green #4CAF7D, amber #D4A843, red #D94F4F.

4px border radius everywhere. No borders for structure — use background color shifts.
Ghost borders at 15% opacity only for accessibility. Elevation via tonal layering, no shadows.
Generous spacing (16-24px between sections). Content-first. No decorative elements.

Brand: "Klar" (not "Property Intelligence", not "Vienna Heritage").
Nav: horizontal top tabs — Feed, Curation, Clients, Email. "Klar" logo left, avatar right.
```

---

## Page Flow (matches SCRIPT.md demo narrative)

The 6 screens flow as one story. Each screen links to the next logically:

```
1. Feed (/)           → click client card →
2. Client Detail      → click "Suche starten" → pipeline runs → click "Objekte kuratieren" →
3. Curation           → select properties → click "Vergleich erstellen" →
4. Comparison (share) → chat + voice FAB → (end of client flow)
5. Email (/email)     → click email row →
6. Email Detail       → AI response + actions
```

---

## Screen 1: Feed (Dashboard) — `/`

```
Morning triage feed for a real estate agent. Klar design system.

Top nav: "Klar" in Space Grotesk 24px bold left. Tabs: Feed (active, copper underline), Curation, Clients, Email. Avatar circle "MA" right.

Section: "Ihre Klienten" in 15px uppercase tracking-wider muted.

3 client cards stacked vertically on white surfaces:
- Card 1 (copper left border = active): Avatar "MF". "Familie Müller". Green dot + "Suche aktiv" green chip. "3+ Zimmer, Bezirke 2-9, Budget €300k-€450k". "Heute, 09:15". Arrow right.
- Card 2: Avatar "HS". "Herr Schmidt". Amber dot + "Besichtigung geplant" chip. "Besichtigung Fr 14:00, Josefstädter Str. 71". "Gestern, 16:30".
- Card 3: Avatar "FW". "Frau Weber". Red dot + "Neue Anfrage" chip. "3-Zi, Bezirk 3, ca. €350.000". "Heute, 10:42".

Cards are clickable — clicking opens Client Detail.

Section: "Letzte Aktivitäten" in 15px uppercase.

4 feed items stacked:
- Red "Neue Anfrage" chip. "Frau Weber · 3-Zi Bezirk 3 · €350.000". "KI-Antwort erstellt · 3 passende Objekte gefunden". Buttons: [Antworten] [Profil erstellen].
- Amber "Signal" chip with copper left border. "Insolvenzverfahren — Taborstraße 18, 1020 Wien". "Donau Immobilien GmbH · Aktenzeichen 3S 42/26". Red "Insolvenz" + amber "Verhandlungsspielraum" signal chips.
- Green "Bestätigt" chip, muted. "Herr Schmidt · Besichtigung Fr 14:00 · Josefstädter Str. 71".
- Gray "Info" chip, muted. "Marktbericht Q1 2026 — Wien Wohnungsmarkt".

No decorative elements. No icons. Content density is high — this is a work tool.
```

---

## Screen 2: Client Detail — `/clients/muller`

```
Client detail page showing AI-extracted profile from a phone call. Klar design system.

Top nav: same as Feed. Breadcrumb: "Klienten › Familie Müller" with green "Suche aktiv" chip.

SECTION 1: "Gesprächsanalyse" with "KI-extrahiert" copper badge.
Subtitle: "Telefonat vom 27. März 2026, 09:15 · 7 Erkenntnisse".

7 insight rows, each with a small copper dot left:
- "Mindestens 3 Zimmer, bevorzugt 4" — faint quote preview: "Mindestens drei Zimmer, besser vier..."
- "Lift ist entscheidend" — "Ganz wichtig: ein Lift! Mit zwei kleinen..."
- "Bezirke 2, 3, 7, 8" — "Wir schauen uns den 2., 3., 7. und 8..."
- "Max 15 Min Pendel zum Stephansplatz" — "maximal 15 Minuten mit den Öffis..."
- "Volksschule in der Nähe" — "Eine Volksschule in der Nähe ist uns..."
- "Budget €300k–€450k" — "Unser Maximum liegt bei 450.000 Euro..."
- "Finanzierung gesichert" — "Wir haben auch etwas Eigenkapital..."

Each row has a hover tooltip showing the full transcript quote. This is the grounding mechanism.

Button: "Volles Transkript anzeigen ↓" in copper text.

SECTION 2: "Klientenprofil" card.
Subtitle: "Aus Gespräch extrahiert · Vom Makler bearbeitet".
Grid 2-col: Budget €300k–€450k, Zimmer 3+ (bevorzugt 4), Bezirke Leopoldstadt/Landstraße/Neubau/Josefstadt, Familie "2 Erwachsene, 2 Kinder (3 und 6 Jahre)", Stil "Altbau", Einzug "Sofort / 3 Monate", Finanzierung "Eigenkapital vorhanden". Some fields have copper "Bearbeitet ✎" label. Priority pills numbered: 1. Volksschule 2. U-Bahn 3. Lift 4. Balkon.

SECTION 3: "Suchkriterien" card — editable.
Subtitle: "Klicken zum Bearbeiten" right-aligned faint text.
Chips in a flex row: "3+" "450.000 €" "15 Min" (these are clickable/editable, ring-2 ring-copper when active). "Bezirke 1020, 1030, 1070, 1080". Green chips: "Lift ✓" "Balkon ✓". Muted chips: "altbau" "school_nearby".

SECTION 4: Big copper button "Suche starten" full width.

When clicked, pipeline animation appears: 6 steps with green checkmarks completing sequentially:
1. "Durchsuche willhaben.at..." 2. "Durchsuche ImmobilienScout24.at..." 3. "Durchsuche ImmoWelt.at..." 4. "Exa Intelligence — Eigentümer & Insolvenz..." 5. "KI-Signale erkennen..." 6. "Compliance-Prüfung (§ 3 MaklerG)..."

Progress bar with copper segments filling left to right.

After completion: "6 Objekte gefunden" header. 2x3 grid of property cards. Then copper button: "Objekte kuratieren →" linking to Curation page.
```

---

## Screen 3: Curation — `/curation`

```
Property curation page where agent selects which properties to include in client comparison. Klar design system.

Top nav: same. "Kuration" tab active.

Header: "Kuration" 28px bold. "6 Objekte fur Familie Muller · 4 ausgewahlt" with copper "4 ausgewahlt" text.

Filter tabs: Alle (6) | Empfohlen | Mit Signalen. Active tab has copper border-bottom.

Vertical list of property cards, each with:
- LEFT: Copper checkbox (checked = filled copper, unchecked = ghost border).
- Photo thumbnail 120x120px.
- CENTER: Title 18px medium. Address + source 14px muted. Price/sqm/rooms 15px medium. Feature pills (building_style, orientation, condition, Balkon, Lift). Signal chips if any (red "Insolvenz", amber "sqm mismatch").
- RIGHT: "Ausschliessen" button (ghost border). When excluded: card at 40% opacity, button turns red "Zurucknehmen".

Show 4-6 property cards. Card 2 has insolvency signal (red chip). Card 3 has sqm mismatch (amber chip). Card 5 is excluded (faded, strikethrough title).

Selected cards have subtle ring-2 ring-copper/30.

STICKY BOTTOM BAR: warm background with blur. "Vergleich erstellen (4) →" copper button. "Öffnet Vergleichsseite in neuem Tab · Link wird kopiert" faint text. This button generates a shareable URL and opens comparison in new tab.
```

---

## Screen 4: Comparison (shareable) — `/comparison/share`

```
Client-facing comparison page. Shareable via link. No nav bar — this is the client's page. Klar design system.

HEADER: "Klar" 18px muted left. "Erstellt für Familie Müller" 34px bold right. "28. März 2026" muted right.

CRITERIA BAR: surface background. "Budget: €300k–€450k · 3+ Zimmer · Bezirke 2, 3, 7, 8 · Familie, 2 Kinder · Prioritäten: Volksschule, U-Bahn, Lift" in 15px muted.

3 PROPERTY CARDS in a row (responsive grid, supports 2-6 cards):
Card 1: "Altbau-Charme in Landstraße". Rennweg 42 · willhaben. €345.000 · 78 m² · 3 Zi · 2. OG. Features: "Volksschule Landstraße — 400m" (score 4), "U3 Kardinal-Nagl-Platz — 200m" (score 3), "Lift vorhanden", "Balkon", "Südseitig". Green signal: "Keine Signale · 0/5". Agent note italic: "Beste Übereinstimmung für Ihre Familie. Volksschule in 400m."

Card 2 (copper "Empfohlen" label): "Penthouse am Praterstern". Taborstraße 18 · ImmobilienScout. €789.000 · 85 m² · 3 Zi · 5. OG. Features: "U2 Taborstraße — 150m", "Dachterrasse", "Garage", "Neubau 2021". RED signal: "Insolvenz". Amber: "3 listings by same owner". Agent note: "Premium-Lage. Insolvenz-Signal deutet auf Verhandlungsspielraum."

Card 3: "Generalsaniert in Josefstadt". Josefstädter Str. 71 · ImmoWelt. €375.000 · 85 m² (STRIKETHROUGH "85" + red "72 m² verifiziert"). Amber signal: "sqm mismatch". Compliance flag: "m²-Abweichung · § 1299 ABGB". Agent note: "Gute Lage. m²-Abweichung klären vor Besichtigung."

CHAT SECTION below cards:
Suggested question pills: "Pendelzeit zum Stephansplatz vergleichen", "Welche hat die beste Schule?", "Warum ist #2 empfohlen?", "Preis pro m² im Vergleich".
Text input: "Fragen Sie etwas über diese Objekte..." with send button.

FOOTER: "Powered by Klar · Erstellt von Marcus Adler · KaiserTech Immobilien" centered faint.

VOICE FAB: fixed bottom-right. Copper circle 56px with microphone icon. When active: green (speaking) or red pulse (listening).
```

---

## Screen 5: Email Inbox — `/email`

```
AI-prioritized email inbox. Klar design system.

Top nav: same. "Email" tab active.

Header: "Posteingang" 28px bold. "8 E-Mails · 5 ungelesen · 2 Signal" in 15px muted.

Filter tabs: Alle (8) | Dringend | Signale | Neue Anfragen. Active = copper underline.

Email list on white card, divided by ghost borders:
Each row is horizontal: priority dot → AI label chip → sender name → subject (truncated) → preview (truncated, muted) → timestamp right.

Unread rows have copper left border and bolder text.

8 email rows:
1. Red dot. "Neue Anfrage" red chip. "Frau Weber". "Anfrage: 3-Zi Bezirk 3". "Sehr geehrte Damen und..." "10:42"
2. Amber dot. "Signal" amber chip. "Grundbuch Wien". "Insolvenzverfahren Taborstraße 18". "Donau Immobilien GmbH..." "09:30"
3. Green dot. "Terminbestätigung" green chip. "Herr Schmidt". "Re: Besichtigung Josefstädter Str". "Vielen Dank, Freitag..." "Gestern"
4. No dot. "Rechnung" gray chip. "willhaben.at". "Rechnung März 2026". "Ihre Monatsrechnung..." "Gestern"
5. Red dot. "Dringend" red chip. "Notar Dr. Berger". "Grundbuchauszug fehlt". "Für den Kaufvertrag..." "Di"
6. No dot. "Newsletter" gray chip. "ImmobilienScout". "Marktbericht Q1 2026". "Der Wiener Markt..." "Mo"
7. Amber dot. "Follow-up" amber chip. "Familie Müller". "Re: Vergleichsseite". "Die Vergleichsseite war..." "Mo"
8. No dot. "Auto" gray chip. "System". "Monitoring: 3 neue Treffer". "Für Profil Müller..." "So"

Clicking a row opens Email Detail.
```

---

## Screen 6: Email Detail — `/email/[id]`

```
Email detail with AI-suggested response. Klar design system. Two-column layout.

Top nav: same. Breadcrumb: "← Posteingang".

LEFT COLUMN (60%):
"Neue Anfrage" red chip.
Subject: "Anfrage: 3-Zimmer Wohnung Bezirk 3" in 24px bold.
"Von: m.weber@gmail.com" muted. "Datum: Heute, 10:42" faint. "Klient: Frau Weber" copper text.

Tonal divider (not a line — background shift).

Email body in 15px: German email text asking about 3-Zimmer in Bezirk 3, budget €350k, young family.

"KI-Antwortvorschlag" section header with copper sparkle ✦ on surface background:
AI-drafted response referencing 3 matching properties with prices. Professional German.
Two buttons: copper "Antwort senden" + ghost "Bearbeiten".

RIGHT COLUMN (40%): sticky sidebar on surface background.
"KI-Analyse" 18px medium.
- Priorität: red chip "Urgent"
- KI-Einschätzung: description text
- Zugeordneter Klient: "Frau Weber" copper underline
- Empfohlene Aktionen: copper text links — "Sofort antworten", "Termin im Kalender eintragen", "Klient benachrichtigen"
```

---

## Prompt Coherence Checklist

| Check | Status |
|-------|--------|
| Same nav on all agent-facing screens (1,2,3,5,6) | ✓ "Klar" + Feed/Curation/Clients/Email tabs |
| Screen 4 (comparison) has no nav — client-facing | ✓ Clean header, no tabs |
| Brand is "Klar" everywhere | ✓ Never "Property Intelligence" or "Vienna Heritage" |
| Single font: Space Grotesk | ✓ All sizes and weights |
| Client flow: Feed → Client → Curation → Comparison | ✓ Buttons link each step |
| Colors match globals.css exactly | ✓ #FAF9F6, #B87333, #1A1C1A, signals |
| New features included: grounded summary, editable criteria, shareable link, voice FAB | ✓ |
| German UI text throughout | ✓ |
| No decorative elements, no icons (except signal dots and checkmarks) | ✓ |
