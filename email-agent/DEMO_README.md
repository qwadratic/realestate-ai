# Email Triage Agent -- Demo Guide

**OpenClaw Hack (Vienna, March 28-29, 2026)**

## Demo (30 seconds, appendix to main presentation)

### Setup

```bash
cd email-agent
pi -e .pi/extensions/email-triage.ts
```

### Demo Script

> "We also built a personal email agent. Same AI approach, but instead of property data, it operates on your inbox.
>
> It's a Pi coding agent extension. Pi is Mario Zechner's open-source coding agent. Our extension adds email intelligence tools directly into the coding workflow.
>
> It learned Ivan's real triage patterns from 200 emails. MCC score: 0.91. Bills detected: 100%. Spam archived: 100%.
>
> It batches invoices for weekly payment, routes interesting contacts to your digital brain via Open Brain MCP, and lives inside your coding agent so it reminds you to check email while you work.
>
> Not an email client. A prompt optimization engine that operates on email."

### In Pi, run:

1. `email_backtest` -- shows 95%+ accuracy on real emails
2. `email_triage` -- classifies emails with action suggestions
3. `show_invoice_batch` -- displays invoices for batch payment

### If Pi doesn't work

Fallback to standalone Python:

```bash
python3 main.py
```

Uses cached results and sample data automatically.

## Key Numbers

- **38,000+** emails in test inbox
- **95.4%** classification accuracy
- **0.912** MCC score (>0.6 is excellent)
- **200** real emails in golden dataset
- **6** action categories
- **4** prompt variants A/B tested

## Talking Points

1. **"My inbox is chaos -- 38,000 emails"** -- everyone relates
2. **"Mathematically correct backtesting"** -- MCC > F1 for imbalanced classes
3. **"Not labels, but action suggestions"** -- "Reply to confirm Thursday meeting", "Pay invoice EUR 847"
4. **"Invoice intelligence"** -- batches all bills for weekly payment
5. **"Pi extension, not an app"** -- lives in the coding agent, proactive reminders
6. **"Open Brain integration"** -- routes knowledge to personal digital brain via MCP

## If Something Breaks

1. Pi won't start → `python3 main.py` (standalone fallback)
2. No API keys → demo uses sample data + mock results automatically
3. Gmail fails → uses `sample_golden.jsonl` (20 pre-loaded emails)
4. Extension error → Pi skill still works: `pi` then ask it to triage
