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
    New Context    viewport={"width": 1440, "height": 900}
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

# ═══════════════════════════════════════════
# SCREEN 1: Dashboard — Client List
# ═══════════════════════════════════════════

Dashboard Shows Klar Navigation
    [Documentation]    The nav bar shows "Klar" logo and 4 tabs
    Get Text    nav >> text=Klar    ==    Klar
    Get Element Count    nav >> a    >=    4
    Take Evidence Screenshot    01-dashboard-nav

Dashboard Shows Three Clients
    [Documentation]    Dashboard lists 3 clients: Müller, Schmidt, Weber
    Main Text Should Contain    Familie Müller
    Main Text Should Contain    Herr Schmidt
    Main Text Should Contain    Frau Weber
    Take Evidence Screenshot    02-dashboard-clients

Dashboard Shows Client Statuses
    [Documentation]    Each client has a status label
    Main Text Should Contain    Suche aktiv
    Main Text Should Contain    Besichtigung geplant
    Main Text Should Contain    Neue Anfrage

Dashboard Shows Recent Activity
    [Documentation]    Activity feed below client list
    Main Text Should Contain    Letzte Aktivitäten
    Main Text Should Contain    Insolvenzverfahren
    Take Evidence Screenshot    03-dashboard-activity

# ═══════════════════════════════════════════
# SCREEN 2: Client Detail — Familie Müller
# ═══════════════════════════════════════════

Navigate To Müller Client Detail
    [Documentation]    Click on Müller card to open client detail
    Click    text=Familie Müller
    Wait For Navigation    url=${BASE_URL}/clients/muller    timeout=${TIMEOUT}
    Take Evidence Screenshot    04-client-detail

Client Detail Shows Call Transcript
    [Documentation]    German phone call transcript visible
    Main Text Should Contain    Gesprächsprotokoll
    Main Text Should Contain    Guten Morgen, Frau Müller
    Main Text Should Contain    Mindestens drei Zimmer
    Take Evidence Screenshot    05-transcript

Client Detail Shows Distilled Profile
    [Documentation]    AI-extracted client profile with key fields
    Main Text Should Contain    Klientenprofil
    Main Text Should Contain    Leopoldstadt
    Main Text Should Contain    Josefstadt
    Main Text Should Contain    2 Erwachsene, 2 Kinder

Client Detail Shows Agent Edits
    [Documentation]    Edited fields marked with indicator
    Main Text Should Contain    Bearbeitet

Client Detail Shows Priorities
    [Documentation]    Ranked priority list from client conversation
    Main Text Should Contain    Volksschule
    Main Text Should Contain    U-Bahn

Client Detail Shows Search Criteria
    [Documentation]    Derived search criteria as chips
    Main Text Should Contain    Suchkriterien
    Main Text Should Contain    3+ Zimmer
    Main Text Should Contain    Lift
    Main Text Should Contain    Balkon
    Take Evidence Screenshot    06-search-criteria

Client Detail Has Search Button
    [Documentation]    "Suche starten" button present
    Get Element Count    button >> text=Suche starten    ==    1

Pipeline Animation Runs
    [Documentation]    Clicking search triggers 6-step animated pipeline
    Click    button >> text=Suche starten
    Sleep    2s
    Main Text Should Contain    Suche läuft
    Main Text Should Contain    willhaben
    Take Evidence Screenshot    07-pipeline-running

Pipeline Shows Results
    [Documentation]    After animation, property results appear
    Sleep    12s
    Main Text Should Contain    Objekte gefunden
    Get Element Count    text=Vergleichsgalerie erstellen    >=    1
    Take Evidence Screenshot    08-pipeline-results

# ═══════════════════════════════════════════
# SCREEN 3: Curation
# ═══════════════════════════════════════════

Navigate To Curation
    [Documentation]    Open curation page via nav
    Click    nav >> text=Curation
    Wait For Navigation    url=${BASE_URL}/curation    timeout=${TIMEOUT}
    Take Evidence Screenshot    09-curation

Curation Shows Properties
    [Documentation]    Property list with action buttons
    Main Text Should Contain    Kuration
    Get Element Count    button >> text=Shortlist    >=    1

# ═══════════════════════════════════════════
# SCREEN 4: Comparison Gallery
# ═══════════════════════════════════════════

Navigate To Comparison
    [Documentation]    Navigate to comparison gallery
    Evaluate JavaScript    ${None}    localStorage.clear()
    Go To    ${BASE_URL}/comparison/demo
    Wait For Load State    networkidle    timeout=${TIMEOUT}
    Sleep    3s
    Take Evidence Screenshot    10-comparison

Comparison Shows Header
    [Documentation]    Client-facing header with family name
    Page Text Should Contain    Prepared for Müller Family

Comparison Shows Properties
    [Documentation]    Three property cards with details
    Page Text Should Contain    Altbau-Charme in Landstraße
    Page Text Should Contain    Penthouse am Praterstern
    Page Text Should Contain    Generalsaniert in Josefstadt

Comparison Shows Prices
    [Documentation]    Property prices visible
    Page Text Should Contain    345
    Page Text Should Contain    789

Comparison Shows Signal Intelligence
    [Documentation]    Signal badges on cards
    Page Text Should Contain    Insolvency
    Page Text Should Contain    mismatch

Comparison Shows Feature Matching
    [Documentation]    "Why this matches" sections
    Page Text Should Contain    Why this matches
    Page Text Should Contain    Volksschule

Comparison Shows Quick Questions
    [Documentation]    Quick question pill buttons
    Page Text Should Contain    Compare commute
    Page Text Should Contain    best school
    Take Evidence Screenshot    11-comparison-details

Comparison Has Chat Input
    [Documentation]    Chat input for property questions
    Get Element Count    input[type="text"]    >=    1

Comparison Has Voice FAB
    [Documentation]    Copper microphone button
    Get Element Count    button[title="Sprachassistent"]    ==    1

Comparison Shows Footer
    [Documentation]    Branding footer
    Page Text Should Contain    Powered by Klar
    Take Evidence Screenshot    12-comparison-complete

# ═══════════════════════════════════════════
# SCREEN 5: Email Inbox
# ═══════════════════════════════════════════

Navigate To Email
    [Documentation]    Open email inbox
    Go To    ${BASE_URL}/email
    Wait For Load State    domcontentloaded    timeout=${TIMEOUT}
    Take Evidence Screenshot    13-email-inbox

Email Shows Inbox
    [Documentation]    Inbox header and email list
    Main Text Should Contain    Posteingang

Email Shows German Emails
    [Documentation]    German email subjects visible
    Main Text Should Contain    Besichtigungstermin
    Main Text Should Contain    Insolvenzverfahren

Email Shows AI Labels
    [Documentation]    AI-assigned priority labels
    Main Text Should Contain    Zeitkritisch
    Take Evidence Screenshot    14-email-labels

# ═══════════════════════════════════════════
# SCREEN 6: Email Detail
# ═══════════════════════════════════════════

Navigate To Email Detail
    [Documentation]    Click email to open detail
    Click    text=Besichtigungstermin Rennweg 42
    Wait For Load State    domcontentloaded    timeout=${TIMEOUT}
    Sleep    1s
    Take Evidence Screenshot    15-email-detail

Email Detail Shows Content
    [Documentation]    Full email body displayed
    Main Text Should Contain    Herr Adler
    Main Text Should Contain    Rennweg 42

Email Detail Shows AI Section
    [Documentation]    AI analysis or suggested response
    Main Text Should Contain    KI
    Take Evidence Screenshot    16-email-ai

# ═══════════════════════════════════════════
# END-TO-END DEMO FLOW
# ═══════════════════════════════════════════

Full Demo Path Works
    [Documentation]    Complete demo: Dashboard → Client → Pipeline → Comparison
    # Start at dashboard
    Go To    ${BASE_URL}
    Wait For Load State    domcontentloaded
    Main Text Should Contain    Familie Müller
    # Navigate to client
    Click    text=Familie Müller
    Wait For Navigation    url=${BASE_URL}/clients/muller    timeout=${TIMEOUT}
    Main Text Should Contain    Gesprächsprotokoll
    Main Text Should Contain    Suchkriterien
    # Run pipeline
    Click    button >> text=Suche starten
    Sleep    12s
    Main Text Should Contain    Objekte gefunden
    # Go to comparison (clear stale localStorage first)
    Evaluate JavaScript    ${None}    localStorage.clear()
    Go To    ${BASE_URL}/comparison/demo
    Wait For Load State    networkidle    timeout=${TIMEOUT}
    Sleep    3s
    Page Text Should Contain    Prepared for Müller Family
    Take Evidence Screenshot    17-full-demo-complete
