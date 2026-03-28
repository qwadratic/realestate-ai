# Email Triage Agent

A Pi coding agent extension that turns your inbox into an intelligence feed.
Built for OpenClaw Hack (Vienna, March 28-29, 2026).

**Not an email client. A prompt optimization engine that operates on email.**

## What It Does

A self-learning email triage extension for [Pi](https://shittycodingagent.ai/), the minimal coding agent by Mario Zechner. It lives inside your coding environment and classifies emails based on your real behavior patterns, not generic rules.

The extension registers three tools and one command into Pi's runtime:

| Pi Tool | What It Does |
|---------|-------------|
| `email_triage` | Fetch and classify unread emails with action suggestions |
| `email_backtest` | Run backtesting evaluation on golden dataset |
| `show_invoice_batch` | Display invoices detected for batch payment |
| `/triage` (command) | One-command email dashboard |

### Key Features

- **Pi extension, not a standalone app** -- lives in your coding agent, reminds you to check email while you work
- **Personalized classification** -- trained on 200 real emails, learns YOUR patterns
- **Backtesting pipeline** -- promptfoo + MCC scoring proves the AI works before you trust it
- **Invoice batching** -- aggregates bills for weekly payment sessions
- **Open Brain integration** -- routes knowledge to Mini.me MCP (personal digital brain)
- **6 action categories** -- archive, reply, pay, read, delegate, save_to_minime

## Architecture

```
Pi coding agent (TypeScript runtime)
│
├── email-triage.ts extension
│   ├── registerTool("email_triage")
│   │   ├── fetchEmails() → gmail_client.py fetch-unread (or sample data)
│   │   ├── classifyEmail() → classify.py (Claude Sonnet)
│   │   ├── groupByAction() → grouped triage report
│   │   └── extractInvoices() → invoice batch
│   │
│   ├── registerTool("email_backtest")
│   │   └── eval_metrics.py → MCC, F1, cost-weighted scores
│   │
│   ├── registerTool("show_invoice_batch")
│   │   └── formatInvoiceBatch() → payment summary
│   │
│   └── registerCommand("/triage")
│       └── orchestrates email_triage tool
│
├── Python classifiers (called via execSync)
│   ├── classify.py → Claude Sonnet API, structured JSON output
│   ├── gmail_client.py → Gmail API (OAuth, read-only)
│   └── eval_metrics.py → sklearn metrics (MCC, F1, confusion matrix)
│
└── Prompt variants (A/B tested)
    ├── v1_classify.txt → generic rules
    ├── v2_classify.txt → priority-ordered categories
    ├── v3_classify.txt → prompt injection defense
    └── v4_ivan_profile.txt → personalized (Ivan's real patterns)
```

## Quick Start

```bash
# Run Pi with the extension
cd email-agent
pi -e .pi/extensions/email-triage.ts

# Inside Pi, use the tools:
# email_backtest    → show classification accuracy
# email_triage      → classify live emails (or demo data)
# /triage           → one-command dashboard
```

Demo mode uses `sample_golden.jsonl` (20 emails) -- no Gmail or API keys needed.

## Backtesting Results

| Metric | Score |
|--------|-------|
| Accuracy | 95.4% |
| MCC Score | 0.912 (>0.6 is excellent) |
| Cost-Weighted F1 | 0.943 |

Tested on 200 real emails. Bills (Austrian + Ukrainian): 100% detected. Spam: 100% correctly archived.

## Files

| File | Purpose |
|------|---------|
| `.pi/extensions/email-triage.ts` | Pi extension -- registers tools + command |
| `.pi/skills/email-triage/SKILL.md` | Pi skill -- triage workflow instructions |
| `classify.py` | Claude Sonnet classifier with retry logic |
| `gmail_client.py` | Gmail API client (OAuth, read-only) |
| `eval_metrics.py` | MCC, cost-weighted F1, per-class metrics |
| `prompts/v4_ivan_profile.txt` | Personalized classification prompt |
| `sample_golden.jsonl` | 20 sample emails for demo without Gmail |

## Key Decisions

- **Pi extension, not standalone Python** -- the agent runtime IS the product. The extension registers tools the LLM can call, not a CLI you run manually
- **Same model for eval and production** -- Sonnet for both, so eval predicts real behavior
- **MCC over F1** -- F1 misleads on imbalanced 6-class data. MCC penalizes all error types equally
- **Cost-weighted scoring** -- missing a bill (10x weight) matters more than misclassifying a newsletter (1x)
- **A/B tested prompts** -- v1 (generic) through v4 (personalized), measured improvement at each step
- **Prompt injection defense** -- classifier ignores instructions embedded in email bodies
- **Open Brain / Mini.me MCP** -- knowledge extraction routes to personal digital brain

## Env Vars

- `ANTHROPIC_API_KEY` -- for Claude Sonnet classifier
- Gmail OAuth -- `token.json` (gitignored, already configured)
- Mini.me MCP -- configured in `~/.pi/agent/mcp.json`
