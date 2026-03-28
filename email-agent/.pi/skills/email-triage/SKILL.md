---
name: email-triage
description: |
  Email triage agent for Ivan's inbox. Fetches unread emails, classifies them
  using Ivan's personal triage rules, summarizes archive candidates, and presents
  a grouped report. Use when Ivan says "triage", "check email", "inbox", or
  "what's new in my email".
allowed-tools:
  - Bash(python3 gmail_client.py *)
  - Bash(summarize *)
  - Bash(python3 eval_metrics.py)
---

# Email Triage

## Workflow
1. Run `python3 gmail_client.py fetch-unread --limit 20`
2. Classify each email using your knowledge of Ivan's triage rules (see below)
3. For ARCHIVE candidates, get full body and summarize: `python3 gmail_client.py fetch-body <id> | summarize -`
4. Present grouped report:
   - 💰 PAY: bills with amounts/due dates
   - ↩️ REPLY: who needs a response and what about
   - 🧠 SAVE: worth saving to Mini.me (use MCP `capture_thought` if available)
   - 📖 READ: informational, one-line each
   - 👥 DELEGATE: who should handle it
   - 🗑 ARCHIVE: summarized list for spot-checking

## Classification Rules

### ARCHIVE (delete/trash):
- Signup confirmations, email verifications, "welcome" emails
- Google security alerts about OAuth app access
- Ride receipts (Bolt, Uber) — auto-charged, not real bills
- LinkedIn message notifications ("X just messaged you")
- LinkedIn job suggestions
- Newsletters not actively read (Substack digest, Ringly, CryptoJobsList, ChatGPT marketing)
- Job platform auto-confirmations (Jobgether, Upwork notifications)
- Order confirmations (zooplus, Temu shipping)
- Service login alerts (xAI, Dropbox "new login")
- GitHub security advisories for organizations
- Foodora/delivery receipts
- Russian spam (Петр Осипов, Алексей Дементьев, marketing workshops)

### PAY (real bills):
- Ukrainian utilities: Komunalka, Naftogaz, CKS (Kyiv apartment)
- Austrian bills: A1 Rechnung, spusu, Montana energy, ORF Beitrag
- Keywords: "Rechnung", "Ihre Rechnung", "рахунок", "оплата", "fällig"
- Payment reminders (Zahlungserinnerung) — HIGH PRIORITY
- Bitfury RSU invoices

### REPLY:
- Direct professional emails expecting a response
- Fabio/KaiserTech business (co-founder)
- MietPilot/Polsia agent instructions
- Active support tickets (Payoneer, Deel)

### SAVE (to knowledge base):
- Business opportunities, partnership offers
- Event invitations (PropTech, AI, crypto, Vienna startup)
- Interesting job postings (n8n, DevRel roles)
- EWOR fellowship, accelerator communications

### DELEGATE:
- Client operational work Fabio should handle

### READ:
- Product updates from tools (Claude, ElevenLabs, Firecrawl)
- Polsia/MietPilot daily build updates
- Hackathon updates
- GitHub notifications about own repos
