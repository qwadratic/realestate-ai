# Email Triage Agent

Pi coding agent extension for personal email intelligence.
Built for OpenClaw Hack (Vienna, March 28-29, 2026).

## What This Is

A TypeScript extension for [Pi](https://shittycodingagent.ai/) (Mario Zechner's coding agent) that adds email triage tools to your coding workflow. The extension registers `email_triage`, `email_backtest`, and `show_invoice_batch` as Pi tools, plus a `/triage` command.

Pi loads the extension at startup via `.pi/extensions/email-triage.ts`. The LLM can then call these tools to fetch, classify, and batch emails. Python scripts (`classify.py`, `gmail_client.py`, `eval_metrics.py`) handle the heavy lifting via `execSync`.

**Not an email client. A prompt optimization engine that operates on email.**

## Architecture

```
Pi runtime (TypeScript, extension API)
├── .pi/extensions/email-triage.ts
│   ├── email_triage tool → fetch → classify → group → report
│   ├── email_backtest tool → eval_metrics.py → MCC/F1 scores
│   ├── show_invoice_batch tool → aggregated payment list
│   └── /triage command → orchestrates full triage flow
│
├── Python classifiers (called via execSync from extension)
│   ├── classify.py → Claude Sonnet, structured JSON, retry logic
│   ├── gmail_client.py → Gmail API (OAuth, readonly)
│   └── eval_metrics.py → sklearn (MCC, cost-weighted F1)
│
├── .pi/skills/email-triage/SKILL.md
│   └── Workflow instructions Pi reads for skill-based triage
│
└── prompts/ (A/B tested, v1→v4 progression)
    └── v4_ivan_profile.txt → personalized prompt (production)
```

## How to Run

```bash
# Primary: Pi with extension
pi -e .pi/extensions/email-triage.ts

# Inside Pi:
# - Use email_triage, email_backtest, show_invoice_batch tools
# - Or type /triage for one-command dashboard

# Alternative: Pi with skill (reads SKILL.md, uses bash tools)
pi  # auto-discovers .pi/skills/email-triage/
```

Demo mode (no Gmail/API keys): extension falls back to `sample_golden.jsonl` and heuristic classification.

## Files

| File | Purpose |
|------|---------|
| `.pi/extensions/email-triage.ts` | **Pi extension** -- registers tools + command into Pi runtime |
| `.pi/skills/email-triage/SKILL.md` | **Pi skill** -- markdown workflow instructions |
| `classify.py` | Claude Sonnet classifier (called by extension via execSync) |
| `gmail_client.py` | Gmail CLI: `fetch-unread`, `fetch-body <id>` |
| `eval_metrics.py` | MCC, cost-weighted F1, per-class metrics |
| `build_golden_set.py` | Pulls 200 real emails from Gmail for golden dataset |
| `prompts/v4_ivan_profile.txt` | Personalized classification prompt (production) |
| `prompts/v1-v3_classify.txt` | Generic prompts for A/B baseline comparison |
| `promptfooconfig.yaml` | promptfoo eval config |
| `sample_golden.jsonl` | 20 sample emails for demo without Gmail |
| `main.py` | Standalone Python demo runner (backup, not primary) |

## Key Decisions

- **Pi extension as primary runtime** -- not a standalone Python CLI. The extension registers tools the LLM calls. Pi orchestrates the full flow.
- **Sonnet for both eval and live** -- same model so eval predicts production behavior
- **MCC + cost-weighted F1** -- F1 alone misleads on imbalanced 6-class data. Cost weights: pay=10x, save_to_minime=5x
- **Pi skill + extension dual approach** -- skill provides markdown instructions for Pi's native agent loop; extension provides typed tools for structured invocation
- **Mini.me / Open Brain MCP** -- connected for knowledge storage (save_to_minime action)
- **Gmail via OAuth** (readonly scope)
- **Prompt injection defense** -- v3+ prompts explicitly defend against email body injection

## What's Working

- Gmail API: connected, 38k+ messages accessible
- Classification: v4_ivan_profile prompt tested on 200 real emails
  - Bills (Austrian + Ukrainian): 100% detected
  - Spam/trash: 100% correctly archived
  - Opportunities: correctly saved to Mini.me
- Mini.me MCP: queried successfully (162 thoughts)
- Pi v0.63.1: extensions, MCP adapter, sub-agents
- Backtesting: MCC 0.912, accuracy 95.4%

## Env Vars

- `ANTHROPIC_API_KEY` -- for Claude Sonnet classifier
- Gmail OAuth -- `token.json` (gitignored)
- Mini.me MCP -- `~/.pi/agent/mcp.json`
