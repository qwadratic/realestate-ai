#!/bin/bash
# Email Triage Agent — runs Pi with the triage system prompt
# Usage: ./triage.sh [--limit N]

set -euo pipefail
cd "$(dirname "$0")"

LIMIT="${1:---limit}"
LIMIT_N="${2:-20}"

# Source env for API keys
source ~/.zshrc 2>/dev/null || true

exec pi \
  --provider openrouter \
  --model "anthropic/claude-sonnet-4" \
  --api-key "$OPENROUTER_API_KEY" \
  --system-prompt "$(cat prompts/triage_system.txt)" \
  --tools read,bash \
  -p "Triage my inbox now. Fetch unread emails and classify them."
