#!/bin/bash
# Email Triage Agent - Hackathon Demo Script
# OpenClaw Hack (Vienna, March 28-29, 2026)

set -e

echo "🚀 EMAIL TRIAGE AGENT - HACKATHON DEMO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if running in Pi
if [ -z "$PI_SESSION_ID" ]; then
    echo "⚠️  Not running in Pi. Starting Pi with extension..."
    echo ""
    echo "Run: pi -e .pi/extensions/email-triage.ts"
    echo "Then use the tools:"
    echo "  - email_backtest (show accuracy metrics)"
    echo "  - email_triage (classify live emails)"
    echo "  - show_invoice_batch (show payment batch)"
    exit 1
fi

echo "✅ Running in Pi session"
echo ""
echo "DEMO FLOW:"
echo ""
echo "1️⃣  Show the problem:"
echo "    'My inbox is chaos - 38,000 emails'"
echo ""
echo "2️⃣  Show backtesting innovation:"
echo "    Use tool: email_backtest"
echo "    → 95%+ accuracy on 200 real emails"
echo ""
echo "3️⃣  Live email triage:"
echo "    Use tool: email_triage"
echo "    → Classifies with action suggestions"
echo "    → Groups invoices for batch payment"
echo ""
echo "4️⃣  Show invoice intelligence:"
echo "    Use tool: show_invoice_batch"
echo "    → Pay all bills in one session"
echo ""
echo "5️⃣  The insight:"
echo "    'Not an email client. A prompt optimization"
echo "     engine that operates on email.'"
echo ""
echo "Press Enter to continue..."
read

# Quick test to ensure everything works
echo "🔍 Testing components..."
echo ""

# Test Python scripts exist
if [ -f "classify.py" ] && [ -f "gmail_client.py" ] && [ -f "eval_metrics.py" ]; then
    echo "✅ Python modules found"
else
    echo "❌ Missing Python modules"
    exit 1
fi

# Test golden dataset
if [ -f "sample_golden.jsonl" ]; then
    echo "✅ Demo dataset ready"
    echo "   $(wc -l < sample_golden.jsonl) sample emails"
else
    echo "❌ Demo dataset missing"
    exit 1
fi

# Test prompts
if [ -f "prompts/v4_ivan_profile.txt" ]; then
    echo "✅ Classification prompts ready"
else
    echo "❌ Prompts missing"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 READY FOR DEMO!"
echo ""
echo "Available Pi tools:"
echo "  • email_backtest - Show classification accuracy"
echo "  • email_triage - Triage live emails"
echo "  • show_invoice_batch - Display payment batch"
echo ""
echo "Or use command: /triage"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"