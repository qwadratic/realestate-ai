import Link from "next/link";

const tools = [
  { name: "list_properties", desc: "Browse all properties in the system", status: "live" },
  { name: "extract_features", desc: "AI extraction from German descriptions", status: "live" },
  { name: "lookup_intel", desc: "Owner & insolvency signals via Exa", status: "live" },
  { name: "search_nearby", desc: "Schools, transit, supermarkets via Google Maps", status: "live" },
  { name: "enrich_with_maps", desc: "Answer geo questions from enriched data (schools, transit, commute)", status: "live" },
  { name: "compute_commute", desc: "Public transit time to any destination", status: "live" },
  { name: "validate_compliance", desc: "Austrian law compliance (MaklerG, ABGB)", status: "live" },
  { name: "analyze_property", desc: "Full pipeline: extract + enrich + validate", status: "live" },
  { name: "analyze_all", desc: "Batch analysis across all properties", status: "live" },
  { name: "web_search", desc: "Exa semantic search for context", status: "live" },
];

const voiceTools = [
  { name: "lookup_client", desc: "Identify caller as existing client or new lead", status: "live" },
  { name: "get_property_details", desc: "Retrieve property info by name or address", status: "live" },
  { name: "search_properties", desc: "Filter properties by district and budget", status: "live" },
  { name: "schedule_viewing", desc: "Book viewing appointment for client", status: "planned" },
  { name: "send_comparison_link", desc: "Email shareable comparison page to client", status: "planned" },
  { name: "log_lead", desc: "Save qualified lead to CRM database", status: "planned" },
];

const stack = [
  { category: "Frontend", items: "Next.js 16, React 19, Tailwind CSS 4, Space Grotesk" },
  { category: "AI Agent", items: "Claude Sonnet 4 via OpenRouter, 10-tool agentic loop" },
  { category: "Intelligence", items: "Exa semantic search, Google Maps Platform" },
  { category: "Compliance", items: "Austrian law validation (MaklerG, ABGB)" },
  { category: "Voice", items: "ElevenLabs Conversational AI" },
  { category: "Testing", items: "Robot Framework + Playwright (33 tests)" },
  { category: "Deploy", items: "Vercel" },
];

const pipeline = [
  { step: "1", name: "Scrape", desc: "willhaben, ImmobilienScout24, ImmoWelt", color: "bg-copper/10 text-copper" },
  { step: "2", name: "Extract", desc: "AI feature extraction from German descriptions", color: "bg-signal-amber/10 text-signal-amber" },
  { step: "3", name: "Enrich", desc: "Maps, Exa intelligence, owner/insolvency signals", color: "bg-signal-green/10 text-signal-green" },
  { step: "4", name: "Validate", desc: "Compliance check against Austrian real estate law", color: "bg-signal-red/10 text-signal-red" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero */}
      <header className="max-w-[960px] mx-auto px-8 pt-16 pb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-copper rounded-[4px] flex items-center justify-center">
            <span className="text-white text-4xl font-bold">K</span>
          </div>
          <div>
            <h1 className="text-[48px] font-bold text-text leading-tight">Klar</h1>
            <p className="text-[18px] text-muted">Property Intelligence for Austrian Real Estate</p>
          </div>
        </div>

        <blockquote className="text-[24px] text-muted italic my-8 pl-5 border-l-3 border-copper">
          &ldquo;When I&apos;m at a viewing and someone calls ... customer lost.&rdquo;
        </blockquote>

        <p className="text-[20px] text-text leading-relaxed max-w-[700px]">
          26 discovery calls. 148 prospects. Three patterns: lost leads, 5-hour manual searches, email overload.
          One root cause: <strong>the agent is the bottleneck.</strong>
        </p>
        <p className="text-[18px] text-muted leading-relaxed max-w-[700px] mt-3">
          3-in-1 AI assistant: Voice Agent + Property Search + Email Triage.
          So the agent can focus on relationships, viewings, and negotiations.
        </p>

        <div className="flex gap-4 mt-8">
          <Link
            href="/feed"
            className="px-6 py-3 bg-copper text-white text-[16px] font-medium rounded-[4px] hover:bg-copper-dark transition-colors"
          >
            Open App
          </Link>
          <a
            href="https://github.com/qwadratic/realestate-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-ghost-border text-text text-[16px] font-medium rounded-[4px] hover:bg-surface transition-colors"
          >
            GitHub
          </a>
        </div>

        {/* Traction */}
        <div className="flex gap-8 mt-10 pt-8 border-t border-ghost-border">
          <div>
            <p className="text-[32px] font-bold text-copper">1</p>
            <p className="text-[14px] text-muted">Closed deal from discovery</p>
          </div>
          <div>
            <p className="text-[32px] font-bold text-copper">43%</p>
            <p className="text-[14px] text-muted">Pipeline rate</p>
          </div>
          <div>
            <p className="text-[32px] font-bold text-copper">26</p>
            <p className="text-[14px] text-muted">Discovery calls</p>
          </div>
          <div>
            <p className="text-[32px] font-bold text-copper">148</p>
            <p className="text-[14px] text-muted">Prospects</p>
          </div>
        </div>
      </header>

      {/* Differentiator */}
      <section className="bg-surface">
        <div className="max-w-[960px] mx-auto px-8 py-10">
          <p className="text-[20px] text-text font-medium text-center">
            Propelos is AI for browsing. <span className="text-copper">Klar is AI for advising.</span>
          </p>
        </div>
      </section>

      {/* Architecture */}
      <section className="max-w-[960px] mx-auto px-8 py-14">
        <h2 className="text-[28px] font-semibold text-text mb-2">Architecture</h2>
        <p className="text-[16px] text-muted mb-8">4-stage pipeline with 10-tool Claude agent</p>

        {/* Pipeline Diagram */}
        <div className="bg-card rounded-[4px] p-8" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <pre className="text-[14px] text-text font-mono leading-relaxed whitespace-pre overflow-x-auto">{`
  Client Call          Search Pipeline          Intelligence           Output
  ━━━━━━━━━━          ━━━━━━━━━━━━━━          ━━━━━━━━━━━━           ━━━━━━

  Transcript    ──▸   willhaben.at      ──▸   Exa Semantic     ──▸   Comparison
  Profile              ImmobilienScout         Owner Intel            Page
  Criteria             ImmoWelt                Insolvency Check       Shareable Link
                                               Google Maps            AI Chat
                ──▸   Claude Extract    ──▸   Compliance Check  ──▸   Voice Agent
                      (German NLP)            (MaklerG, ABGB)
`}</pre>
        </div>

        {/* Pipeline Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {pipeline.map((p) => (
            <div key={p.step} className="bg-card rounded-[4px] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[13px] font-bold ${p.color}`}>
                  {p.step}
                </span>
                <span className="text-[16px] font-medium text-text">{p.name}</span>
              </div>
              <p className="text-[14px] text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Agent Tools */}
      <section className="bg-surface">
        <div className="max-w-[960px] mx-auto px-8 py-14">
          <h2 className="text-[28px] font-semibold text-text mb-2">10-Tool Property Agent</h2>
          <p className="text-[16px] text-muted mb-8">
            Claude Sonnet 4 with agentic tool loop. Each tool is a real API call.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tools.map((t) => (
              <div
                key={t.name}
                className="bg-card rounded-[4px] px-5 py-3.5 flex items-start gap-3"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
              >
                <code className="text-[13px] text-copper font-mono bg-copper/5 px-2 py-0.5 rounded shrink-0">
                  {t.name}
                </code>
                <span className="text-[14px] text-muted flex-1">{t.desc}</span>
                <span className="text-[11px] font-medium text-signal-green bg-signal-green/10 px-1.5 py-0.5 rounded shrink-0">
                  Live
                </span>
              </div>
            ))}
          </div>

          <h3 className="text-[22px] font-semibold text-text mt-12 mb-2">Voice Agent Tools (Maya)</h3>
          <p className="text-[16px] text-muted mb-6">
            ElevenLabs agent with server webhook tools. Phone: +43 670 301 5333
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {voiceTools.map((t) => (
              <div
                key={t.name}
                className={`bg-card rounded-[4px] px-5 py-3.5 flex items-start gap-3 ${t.status === "planned" ? "opacity-60" : ""}`}
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
              >
                <code className="text-[13px] text-copper font-mono bg-copper/5 px-2 py-0.5 rounded shrink-0">
                  {t.name}
                </code>
                <span className="text-[14px] text-muted flex-1">{t.desc}</span>
                <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded shrink-0 ${
                  t.status === "live"
                    ? "text-signal-green bg-signal-green/10"
                    : "text-signal-amber bg-signal-amber/10"
                }`}>
                  {t.status === "live" ? "Live" : "Planned"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screens */}
      <section className="max-w-[960px] mx-auto px-8 py-14">
        <h2 className="text-[28px] font-semibold text-text mb-2">6 Screens</h2>
        <p className="text-[16px] text-muted mb-8">Complete agent workflow from client call to shareable comparison</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Feed", desc: "Morning triage. Clients sorted by urgency.", href: "/feed", label: "Triage" },
            { name: "Client Detail", desc: "Transcript, profile, criteria, pipeline.", href: "/clients/muller", label: "Understanding" },
            { name: "Curation", desc: "Select properties, generate shareable links.", href: "/curation", label: "Selection" },
            { name: "Comparison", desc: "Client-facing cards with signals + chat.", href: "/comparison/demo", label: "Output" },
            { name: "Email", desc: "AI-prioritized inbox with suggested responses.", href: "/email", label: "Communication" },
            { name: "Voice", desc: "Ask about properties out loud.", href: "/comparison/demo", label: "Interaction" },
          ].map((s) => (
            <Link
              key={s.name}
              href={s.href}
              className="bg-card rounded-[4px] p-5 hover:bg-surface transition-colors group"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              <span className="inline-block px-2 py-0.5 text-[12px] font-medium text-copper bg-copper/10 rounded mb-2">
                {s.label}
              </span>
              <h3 className="text-[17px] font-medium text-text group-hover:text-copper transition-colors">
                {s.name}
              </h3>
              <p className="text-[14px] text-muted mt-1">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-surface">
        <div className="max-w-[960px] mx-auto px-8 py-14">
          <h2 className="text-[28px] font-semibold text-text mb-8">Tech Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stack.map((s) => (
              <div key={s.category} className="flex gap-3">
                <span className="text-[14px] font-medium text-copper w-28 shrink-0">{s.category}</span>
                <span className="text-[15px] text-text">{s.items}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signals */}
      <section className="max-w-[960px] mx-auto px-8 py-14">
        <h2 className="text-[28px] font-semibold text-text mb-2">Intelligence Signals</h2>
        <p className="text-[16px] text-muted mb-8">What competitors miss. What Klar catches.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-[4px] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <span className="inline-block px-2.5 py-1 text-[13px] font-medium text-signal-red bg-signal-red/10 rounded mb-3">
              Insolvency
            </span>
            <p className="text-[15px] text-text">
              Detects active insolvency proceedings against property owners. Signals negotiation leverage.
            </p>
          </div>
          <div className="bg-card rounded-[4px] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <span className="inline-block px-2.5 py-1 text-[13px] font-medium text-signal-amber bg-signal-amber/10 rounded mb-3">
              Compliance
            </span>
            <p className="text-[15px] text-text">
              Catches sqm mismatches between listing and description. References specific Austrian law sections.
            </p>
          </div>
          <div className="bg-card rounded-[4px] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <span className="inline-block px-2.5 py-1 text-[13px] font-medium text-signal-green bg-signal-green/10 rounded mb-3">
              Location
            </span>
            <p className="text-[15px] text-text">
              Schools, transit, supermarkets within 1km. Commute times by public transit. Personalized by family profile.
            </p>
          </div>
        </div>
      </section>

      {/* Testing */}
      <section className="bg-surface">
        <div className="max-w-[960px] mx-auto px-8 py-14">
          <h2 className="text-[28px] font-semibold text-text mb-2">33 Robot Framework Tests</h2>
          <p className="text-[16px] text-muted mb-6">
            Human-readable BDD test suite with Playwright backend. Video recording enabled.
          </p>
          <div className="bg-card rounded-[4px] p-6 font-mono text-[13px] text-text" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <pre className="whitespace-pre overflow-x-auto">{`*** Test Cases ***
Dashboard Shows Three Clients
    Open Dashboard
    Page Should Contain    Familie Muller
    Page Should Contain    Herr Schmidt
    Page Should Contain    Frau Weber

Client Detail Shows AI-Extracted Profile
    Navigate To Client    muller
    Page Should Contain    Klientenprofil
    Page Should Contain    Volksschule in der Nahe

Comparison Page Shows Signal Badges
    Navigate To Comparison    demo
    Page Should Contain    Owner Insolvency
    Page Should Contain    sqm mismatch`}</pre>
          </div>
        </div>
      </section>

      {/* Project Status — honest */}
      <section className="max-w-[960px] mx-auto px-8 py-14">
        <h2 className="text-[28px] font-semibold text-text mb-2">Project Status</h2>
        <p className="text-[16px] text-muted mb-8">Honest state of each component. Hackathon prototype, not production.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { feature: "6-Screen Web App", status: "live", detail: "Feed, client detail, curation, comparison, email inbox + detail. All interactive." },
            { feature: "10-Tool Property Agent", status: "live", detail: "Claude Sonnet 4 via OpenRouter. Feature extraction, Maps, Exa, compliance. Agentic tool loop." },
            { feature: "Voice Agent (Maya)", status: "live", detail: "ElevenLabs + custom LLM. 3 server tools (client lookup, property search, property detail). Phone: +43 670 301 5333." },
            { feature: "Shareable Comparison Links", status: "live", detail: "Curation page generates URL-encoded links. Comparison page reads IDs from URL." },
            { feature: "Grounded Transcript Summary", status: "live", detail: "AI-extracted insights with quote tooltips linking to actual client statements." },
            { feature: "33 Robot Framework Tests", status: "live", detail: "Playwright backend, video recording, human-readable BDD format." },
            { feature: "Real Property Data", status: "partial", detail: "8 real Vienna properties scraped via Apify. App uses fixture data for demo stability." },
            { feature: "Live API Integration", status: "partial", detail: "Agent tools are wired but require API keys (OpenRouter, Exa, Google Maps). Chat works with keys set." },
            { feature: "Email Triage Agent", status: "separate", detail: "Built as a Pi coding agent extension in a parallel session. 95.4% accuracy, MCC=0.912. Separate codebase." },
            { feature: "CRM Database Integration", status: "planned", detail: "Client data in JSON fixtures. Supabase integration designed but not yet wired." },
            { feature: "Portal Monitoring", status: "planned", detail: "Continuous property scanning. Architecture designed, not yet implemented." },
            { feature: "Multi-tenant Deployment", status: "planned", detail: "Currently single-agent demo. Multi-tenant architecture not started." },
          ].map((item) => (
            <div key={item.feature} className={`bg-card rounded-[4px] p-5 ${item.status === "planned" ? "opacity-60" : ""}`} style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                  item.status === "live" ? "text-signal-green bg-signal-green/10" :
                  item.status === "partial" ? "text-signal-amber bg-signal-amber/10" :
                  item.status === "separate" ? "text-copper bg-copper/10" :
                  "text-faint bg-surface"
                }`}>
                  {item.status === "live" ? "Live" : item.status === "partial" ? "Partial" : item.status === "separate" ? "Separate" : "Planned"}
                </span>
                <span className="text-[15px] font-medium text-text">{item.feature}</span>
              </div>
              <p className="text-[13px] text-muted">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-surface">
        <div className="max-w-[960px] mx-auto px-8 py-14">
        <h2 className="text-[28px] font-semibold text-text mb-6">Team</h2>
        <div className="flex gap-6">
          <div className="bg-card rounded-[4px] p-6 flex-1" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <p className="text-[18px] font-medium text-text">KaiserTech</p>
            <p className="text-[15px] text-muted mt-1">Vienna, Austria</p>
            <p className="text-[14px] text-muted mt-3">
              10+ years IT security. Building AI tools for Austrian real estate professionals.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-ghost-border">
        <div className="max-w-[960px] mx-auto px-8 py-8 text-center">
          <p className="text-[15px] text-muted">
            Built at OpenClaw Hackathon Vienna, March 2026
          </p>
          <p className="text-[13px] text-faint mt-2">
            Klar &middot; Property Intelligence &middot; KaiserTech
          </p>
        </div>
      </footer>
    </div>
  );
}
