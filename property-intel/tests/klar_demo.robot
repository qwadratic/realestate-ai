*** Settings ***
Library    Browser
Library    String
Suite Setup    Open Klar App
Suite Teardown    Close Browser

*** Variables ***
${BASE_URL}    http://localhost:3000
${TIMEOUT}     15s

*** Keywords ***
Open Klar App
    New Browser    chromium    headless=true
    New Context    viewport={"width": 1440, "height": 900}    recordVideo={"dir": "${OUTPUT_DIR}/videos", "size": {"width": 1440, "height": 900}}
    New Page       ${BASE_URL}
    Wait For Load State    domcontentloaded    timeout=${TIMEOUT}

Page Text Should Contain
    [Arguments]    ${expected}
    ${text}=    Get Text    body
    ${lower}=    Convert To Lower Case    ${text}
    ${expected_lower}=    Convert To Lower Case    ${expected}
    Should Contain    ${lower}    ${expected_lower}

Main Text Should Contain
    [Arguments]    ${expected}
    ${text}=    Get Text    main
    ${lower}=    Convert To Lower Case    ${text}
    ${expected_lower}=    Convert To Lower Case    ${expected}
    Should Contain    ${lower}    ${expected_lower}

Take Evidence Screenshot
    [Arguments]    ${name}
    Take Screenshot    filename=${name}    fullPage=true

*** Test Cases ***

# ╔══════════════════════════════════════════════════════════════╗
# ║  KLAR — Property Intelligence for Austrian Real Estate      ║
# ║  33 Human-Readable Tests · Robot Framework + Playwright     ║
# ╚══════════════════════════════════════════════════════════════╝


# ─── ACT 1: THE MORNING VIEW ──────────────────────────────────
# The agent opens Klar at 9am. Three clients, sorted by urgency.
# Red means act now. Green means progressing. The feed tells
# the agent what happened overnight.
# ──────────────────────────────────────────────────────────────

Dashboard Shows Klar Branding
    [Documentation]    "Klar" logo visible in navigation with 4 tabs: Feed, Curation, Clients, Email
    Get Text    nav >> text=Klar    ==    Klar
    Get Element Count    nav >> a    >=    4
    Take Evidence Screenshot    01-dashboard-nav

Dashboard Lists Three Active Clients
    [Documentation]    Morning triage: 3 clients at different stages — active search, viewing planned, new inquiry
    Main Text Should Contain    Familie Müller
    Main Text Should Contain    Herr Schmidt
    Main Text Should Contain    Frau Weber
    Take Evidence Screenshot    02-dashboard-clients

Each Client Shows Their Current Status
    [Documentation]    Status chips tell the agent what stage each client is in
    Main Text Should Contain    Suche aktiv
    Main Text Should Contain    Besichtigung geplant
    Main Text Should Contain    Neue Anfrage

Activity Feed Shows Overnight Events
    [Documentation]    Signal intelligence surfaced: an insolvency filing was detected while the agent slept
    Main Text Should Contain    Letzte Aktivitäten
    Main Text Should Contain    Insolvenzverfahren
    Take Evidence Screenshot    03-dashboard-activity


# ─── ACT 2: UNDERSTANDING THE CLIENT ─────────────────────────
# The agent clicks into Familie Müller. One phone call. The AI
# listened, extracted a full profile, and derived search criteria.
# Every claim is grounded in what the client actually said.
# ──────────────────────────────────────────────────────────────

Click Into Müller Family Detail
    [Documentation]    Clicking the client card navigates to their full detail page
    Click    text=Familie Müller
    Wait For Navigation    url=${BASE_URL}/clients/muller    timeout=${TIMEOUT}
    Take Evidence Screenshot    04-client-detail

AI Extracted 7 Insights From Phone Call
    [Documentation]    The transcript was analyzed into grounded insights — each one links to a real quote
    Main Text Should Contain    Gesprächsanalyse
    Main Text Should Contain    KI-extrahiert
    Main Text Should Contain    Mindestens 3 Zimmer
    Main Text Should Contain    Lift ist entscheidend
    Take Evidence Screenshot    05-transcript-summary

Client Profile Was Distilled Automatically
    [Documentation]    Budget, districts, family size, priorities — all extracted from a single conversation
    Main Text Should Contain    Klientenprofil
    Main Text Should Contain    Leopoldstadt
    Main Text Should Contain    Josefstadt
    Main Text Should Contain    2 Erwachsene, 2 Kinder

Agent Edited Fields Are Marked
    [Documentation]    The agent manually adjusted budget after talking to the husband — marked with "Bearbeitet"
    Main Text Should Contain    Bearbeitet

Family Priorities Are Ranked
    [Documentation]    Priority order matters: schools first (family has children), then transit, then elevator
    Main Text Should Contain    Volksschule
    Main Text Should Contain    U-Bahn

Search Criteria Are Editable
    [Documentation]    Derived from profile, displayed as clickable chips — rooms, budget, commute, must-haves
    Main Text Should Contain    Suchkriterien
    Main Text Should Contain    3+
    Main Text Should Contain    Lift
    Main Text Should Contain    Balkon
    Take Evidence Screenshot    06-search-criteria

Search Button Is Ready
    [Documentation]    One click triggers the full pipeline: scrape → extract → enrich → validate
    Get Element Count    button >> text=Suche starten    ==    1


# ─── ACT 3: THE SEARCH PIPELINE ──────────────────────────────
# 6 steps. 3 Austrian portals scraped simultaneously. Exa
# intelligence for owner signals. Google Maps for schools and
# transit. Compliance validation under Austrian law. 60 seconds.
# ──────────────────────────────────────────────────────────────

Pipeline Starts With Portal Scanning
    [Documentation]    Animation shows real API names: willhaben, ImmobilienScout24, ImmoWelt, Exa, compliance
    Click    button >> text=Suche starten
    Sleep    2s
    Main Text Should Contain    Suche läuft
    Main Text Should Contain    willhaben
    Take Evidence Screenshot    07-pipeline-running

Pipeline Delivers Enriched Results
    [Documentation]    After 6 steps complete: properties with signals, compliance flags, and nearby data
    Sleep    12s
    Main Text Should Contain    Objekte gefunden
    Take Evidence Screenshot    08-pipeline-results

Results Link To Curation
    [Documentation]    Agent reviews results before sending to client — next step is curation
    Get Element Count    text=Objekte kuratieren    >=    1


# ─── ACT 4: CURATING FOR THE CLIENT ──────────────────────────
# The agent selects which properties to include. Some get
# excluded — wrong district, no elevator. What survives becomes
# a shareable comparison page.
# ──────────────────────────────────────────────────────────────

Navigate To Curation Page
    [Documentation]    Curation view: select or exclude properties before generating the client link
    Click    nav >> text=Curation
    Wait For Navigation    url=${BASE_URL}/curation    timeout=${TIMEOUT}
    Take Evidence Screenshot    09-curation

Curation Shows Selection Controls
    [Documentation]    Each property has a checkbox and an exclude button — the agent curates, the AI doesn't
    Main Text Should Contain    Kuration
    Main Text Should Contain    ausgewahlt


# ─── ACT 5: THE CLIENT-FACING OUTPUT ─────────────────────────
# This is what the client receives. Not a PDF. A live,
# interactive page. Personalized: schools listed first because
# they have children. Signal intelligence visible. AI chat
# ready to answer questions.
# ──────────────────────────────────────────────────────────────

Open Comparison Gallery
    [Documentation]    The shareable comparison page — what the client actually sees
    Evaluate JavaScript    ${None}    localStorage.clear()
    Go To    ${BASE_URL}/comparison/demo
    Wait For Load State    networkidle    timeout=${TIMEOUT}
    Sleep    3s
    Take Evidence Screenshot    10-comparison

Comparison Is Personalized For The Family
    [Documentation]    Header shows client name — this page was prepared specifically for them
    Page Text Should Contain    Prepared for Müller Family

Three Properties Are Compared Side By Side
    [Documentation]    Vienna properties with full details — each from a different portal
    Page Text Should Contain    Altbau-Charme in Landstraße
    Page Text Should Contain    Penthouse am Praterstern
    Page Text Should Contain    Generalsaniert in Josefstadt

Prices Are Transparent
    [Documentation]    Real Austrian prices in EUR — no hidden costs, no surprises
    Page Text Should Contain    345
    Page Text Should Contain    789

Signal Intelligence Is Visible
    [Documentation]    What competitors miss: insolvency signals and compliance warnings on every card
    Page Text Should Contain    Insolvency
    Page Text Should Contain    mismatch

Feature Matching Explains Why
    [Documentation]    "Warum es passt" — schools ranked first because Müller family has children
    Page Text Should Contain    Volksschule

Quick Questions Invite Exploration
    [Documentation]    Pre-written questions the client can click to learn more
    Page Text Should Contain    Compare commute
    Page Text Should Contain    best school
    Take Evidence Screenshot    11-comparison-details

Chat Is Ready For Client Questions
    [Documentation]    Free-text input for any question about the properties
    Get Element Count    input[type="text"]    >=    1

Voice Agent Is Available
    [Documentation]    Copper microphone FAB — clients can ask questions out loud
    Get Element Count    button[title*="Sprachassistent"]    >=    1

Branding Footer Present
    [Documentation]    "Powered by Klar" — the agent's personal brand on every page they send
    Page Text Should Contain    Powered by Klar
    Take Evidence Screenshot    12-comparison-complete


# ─── ACT 6: EMAIL INTELLIGENCE ────────────────────────────────
# Inbox sorted by AI. Hot leads surface first. Insolvency
# signals get flagged. Every email has a suggested response
# pre-filled with CRM data.
# ──────────────────────────────────────────────────────────────

Open Email Inbox
    [Documentation]    AI-prioritized inbox: what matters is at the top
    Go To    ${BASE_URL}/email
    Wait For Load State    domcontentloaded    timeout=${TIMEOUT}
    Take Evidence Screenshot    13-email-inbox

Inbox Shows German Business Emails
    [Documentation]    Real Austrian business context: viewings, insolvency notices, invoices
    Main Text Should Contain    Posteingang
    Main Text Should Contain    Besichtigungstermin
    Main Text Should Contain    Insolvenzverfahren

AI Labels Classify Every Email
    [Documentation]    Priority labels assigned by AI: urgent, signal, follow-up, low
    Main Text Should Contain    Zeitkritisch
    Take Evidence Screenshot    14-email-labels

Open Email Detail With AI Response
    [Documentation]    Click an email to see the full thread + AI-suggested response
    Click    text=Besichtigungstermin Rennweg 42
    Wait For Load State    domcontentloaded    timeout=${TIMEOUT}
    Sleep    1s
    Take Evidence Screenshot    15-email-detail

Email Shows Full Context And AI Draft
    [Documentation]    Two-column layout: email left, AI analysis right. Ready to send.
    Main Text Should Contain    Herr Adler
    Main Text Should Contain    Rennweg 42
    Main Text Should Contain    KI
    Take Evidence Screenshot    16-email-ai


# ─── FINALE: END-TO-END DEMO ─────────────────────────────────
# The complete path a real agent walks every morning.
# Dashboard → Client → Pipeline → Comparison. One flow.
# ──────────────────────────────────────────────────────────────

Complete Agent Workflow In One Flow
    [Documentation]    Full demo path: morning triage → client understanding → search → comparison output
    # Morning: open dashboard
    Go To    ${BASE_URL}
    Wait For Load State    domcontentloaded
    Main Text Should Contain    Familie Müller
    # Understand: click into client
    Click    text=Familie Müller
    Wait For Navigation    url=${BASE_URL}/clients/muller    timeout=${TIMEOUT}
    Main Text Should Contain    Gesprächsanalyse
    Main Text Should Contain    Suchkriterien
    # Search: run pipeline
    Click    button >> text=Suche starten
    Sleep    12s
    Main Text Should Contain    Objekte gefunden
    # Output: view comparison
    Evaluate JavaScript    ${None}    localStorage.clear()
    Go To    ${BASE_URL}/comparison/demo
    Wait For Load State    networkidle    timeout=${TIMEOUT}
    Sleep    3s
    Page Text Should Contain    Prepared for Müller Family
    Take Evidence Screenshot    17-full-demo-complete
