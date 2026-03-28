# Pi Coding Agent -- Extension Setup

Setup guide for running the email triage extension with Pi.

## Prerequisites

```bash
pi --version  # requires v0.63.1+
```

## Install Pi Extensions

### MCP adapter (for Mini.me / Open Brain)
```bash
pi install npm:pi-mcp-adapter
```

Configure `~/.pi/agent/mcp.json` with your Open Brain MCP endpoint.
This gives Pi access to Mini.me tools: `search_thoughts`, `list_thoughts`, `capture_thought`, `thought_stats`.

### Sub-agents (optional, for parallel task delegation)
```bash
pi install npm:pi-subagents
```

### Exa search (optional, for semantic web search)
```bash
pi install npm:pi-exa-search
```

## Run the Extension

```bash
cd email-agent
pi -e .pi/extensions/email-triage.ts
```

This loads the extension which registers:
- `email_triage` tool -- fetch and classify emails
- `email_backtest` tool -- run evaluation metrics
- `show_invoice_batch` tool -- display payment batch
- `/triage` command -- one-command dashboard

## Alternative: Skill-based triage

Pi auto-discovers `.pi/skills/email-triage/SKILL.md`. Just run:

```bash
cd email-agent
pi
# Then ask: "triage my inbox"
```

Pi reads the skill instructions and uses bash to call the Python classifiers directly.

## Environment Variables

- `ANTHROPIC_API_KEY` -- for Claude Sonnet classifier
- Gmail OAuth token -- `token.json` in project root (gitignored)

## How Extension vs Skill Work

**Extension** (`.pi/extensions/email-triage.ts`):
- TypeScript code that runs in Pi's process
- Registers typed tools via `pi.registerTool()`
- Tools are callable by the LLM like built-in tools
- Has caching, invoice batching, fallback classification
- Primary demo path

**Skill** (`.pi/skills/email-triage/SKILL.md`):
- Markdown instructions Pi reads and follows
- Uses bash to call Python scripts
- More flexible (Pi can improvise)
- Fallback if extension has issues
