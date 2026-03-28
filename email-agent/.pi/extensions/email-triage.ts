/**
 * Email Triage Extension for Pi
 * 
 * Personal email AI agent with backtesting pipeline.
 * Built for OpenClaw Hack (Vienna, March 28-29, 2026).
 * 
 * Features:
 * - Email classification with action suggestions
 * - Invoice batching for weekly payment sessions
 * - Knowledge extraction to Mini.me
 * - Backtesting with promptfoo integration
 */

import type { ExtensionAPI, ExtensionContext, ToolOutput } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

// Email classification result
interface ClassificationResult {
  action: 'archive' | 'reply' | 'pay' | 'read' | 'delegate' | 'save_to_minime';
  suggestion: string;
  confidence: number;
  reasoning?: string;
}

// Email data structure
interface Email {
  id: string;
  subject: string;
  sender: string;
  date: string;
  snippet: string;
  body?: string;
}

// Invoice for batching
interface Invoice {
  vendor: string;
  amount: string;
  currency: string;
  dueDate: string;
  emailId: string;
}

export default function emailTriageExtension(pi: ExtensionAPI) {
  const projectRoot = path.resolve(__dirname, "../..");
  
  // State
  let classificationCache = new Map<string, ClassificationResult>();
  let invoiceBatch: Invoice[] = [];
  
  // Register the main triage tool
  pi.registerTool({
    name: "email_triage",
    label: "Email Triage",
    description: "Triage unread emails with AI classification and action suggestions",
    promptSnippet: "Triage my unread emails using the email_triage tool",
    parameters: Type.Object({
      limit: Type.Optional(Type.Number({ 
        description: "Number of emails to fetch (default: 10)",
        default: 10 
      })),
      demo: Type.Optional(Type.Boolean({
        description: "Use demo data instead of live Gmail",
        default: false
      }))
    }),
    async execute(_toolCallId, params): Promise<ToolOutput> {
      try {
        const limit = params.limit || 10;
        const useDemo = params.demo || false;
        
        // Fetch emails
        const emails = await fetchEmails(limit, useDemo);
        
        // Classify each email
        const classifications = await Promise.all(
          emails.map(email => classifyEmail(email))
        );
        
        // Group by action
        const grouped = groupByAction(emails, classifications);
        
        // Extract invoices
        const invoices = extractInvoices(emails, classifications);
        invoiceBatch.push(...invoices);
        
        // Format results
        const report = formatTriageReport(grouped, invoices);
        
        return {
          content: [{
            type: "text",
            text: report
          }],
          details: {
            emailCount: emails.length,
            invoiceCount: invoices.length,
            classifications: Object.fromEntries(
              emails.map((e, i) => [e.id, classifications[i]])
            )
          }
        };
      } catch (error: any) {
        return {
          content: [{
            type: "text", 
            text: `Error during email triage: ${error.message}`
          }]
        };
      }
    }
  });
  
  // Register backtesting tool
  pi.registerTool({
    name: "email_backtest",
    label: "Email Backtest",
    description: "Run backtesting evaluation on golden dataset",
    promptSnippet: "Run email classification backtesting",
    parameters: Type.Object({
      quick: Type.Optional(Type.Boolean({
        description: "Quick test with 20 emails instead of full 200",
        default: true
      }))
    }),
    async execute(_toolCallId, params): Promise<ToolOutput> {
      try {
        const dataset = params.quick ? "sample_golden.jsonl" : "golden.jsonl";
        const dataPath = path.join(projectRoot, dataset);
        
        if (!fs.existsSync(dataPath)) {
          throw new Error(`Dataset not found: ${dataset}`);
        }
        
        // Run evaluation
        const result = execSync(
          `cd "${projectRoot}" && python3 eval_metrics.py --golden "${dataset}"`,
          { encoding: 'utf8' }
        );
        
        return {
          content: [{
            type: "text",
            text: "📊 Backtesting Results:\n\n" + result
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: "text",
            text: `Backtest error: ${error.message}`
          }]
        };
      }
    }
  });
  
  // Register invoice batch tool
  pi.registerTool({
    name: "show_invoice_batch", 
    label: "Show Invoice Batch",
    description: "Display all invoices detected for batch payment",
    promptSnippet: "Show the invoice batch for payment",
    parameters: Type.Object({}),
    async execute(): Promise<ToolOutput> {
      if (invoiceBatch.length === 0) {
        return {
          content: [{
            type: "text",
            text: "No invoices in batch. Run email_triage first."
          }]
        };
      }
      
      const total = calculateInvoiceTotal(invoiceBatch);
      const report = formatInvoiceBatch(invoiceBatch, total);
      
      return {
        content: [{
          type: "text",
          text: report
        }]
      };
    }
  });
  
  // Register command for interactive triage
  pi.registerCommand("triage", {
    description: "Open email triage dashboard",
    handler: async (_args, ctx) => {
      ctx.ui.notify("🚀 Starting email triage...", "info");
      
      // Run triage
      const result = await pi.executeTool("email_triage", { limit: 10, demo: false });
      
      // Show results
      if (result.content && result.content[0].type === "text") {
        // For now, just show in a notification
        // TODO: Build proper TUI dashboard
        ctx.ui.notify("Email triage complete! Check the output.", "success");
      }
    }
  });
  
  // Helper functions
  async function fetchEmails(limit: number, useDemo: boolean): Promise<Email[]> {
    if (useDemo) {
      // Use sample data
      const demoData = fs.readFileSync(
        path.join(projectRoot, "sample_golden.jsonl"), 
        'utf8'
      );
      return demoData.split('\n')
        .filter(line => line.trim())
        .slice(0, limit)
        .map(line => {
          const data = JSON.parse(line);
          return {
            id: data.id,
            subject: data.subject,
            sender: data.sender,
            date: data.date || new Date().toISOString(),
            snippet: data.body?.substring(0, 100) || ""
          };
        });
    }
    
    // Fetch from Gmail
    const result = execSync(
      `cd "${projectRoot}" && python3 gmail_client.py fetch-unread --limit ${limit}`,
      { encoding: 'utf8' }
    );
    
    return JSON.parse(result);
  }
  
  async function classifyEmail(email: Email): Promise<ClassificationResult> {
    // Check cache
    if (classificationCache.has(email.id)) {
      return classificationCache.get(email.id)!;
    }
    
    try {
      // Call classifier
      const result = execSync(
        `cd "${projectRoot}" && python3 classify.py --subject "${email.subject}" --sender "${email.sender}" --snippet "${email.snippet}"`,
        { encoding: 'utf8' }
      );
      
      const classification = JSON.parse(result);
      classificationCache.set(email.id, classification);
      return classification;
    } catch {
      // Fallback classification
      const fallback = generateFallbackClassification(email);
      classificationCache.set(email.id, fallback);
      return fallback;
    }
  }
  
  function generateFallbackClassification(email: Email): ClassificationResult {
    // Simple heuristics for demo
    const subject = email.subject.toLowerCase();
    const sender = email.sender.toLowerCase();
    
    if (subject.includes('invoice') || subject.includes('bill') || subject.includes('payment')) {
      return {
        action: 'pay',
        suggestion: `Pay invoice from ${email.sender}`,
        confidence: 0.8
      };
    }
    
    if (sender.includes('noreply') || sender.includes('notification')) {
      return {
        action: 'archive',
        suggestion: 'Archive automated notification',
        confidence: 0.9
      };
    }
    
    if (subject.includes('meeting') || subject.includes('appointment')) {
      return {
        action: 'reply',
        suggestion: 'Confirm meeting time',
        confidence: 0.7
      };
    }
    
    return {
      action: 'read',
      suggestion: 'Read and decide',
      confidence: 0.5
    };
  }
  
  function groupByAction(emails: Email[], classifications: ClassificationResult[]) {
    const grouped: Record<string, Array<{email: Email, classification: ClassificationResult}>> = {};
    
    emails.forEach((email, i) => {
      const action = classifications[i].action;
      if (!grouped[action]) {
        grouped[action] = [];
      }
      grouped[action].push({ email, classification: classifications[i] });
    });
    
    return grouped;
  }
  
  function extractInvoices(emails: Email[], classifications: ClassificationResult[]): Invoice[] {
    const invoices: Invoice[] = [];
    
    emails.forEach((email, i) => {
      if (classifications[i].action === 'pay') {
        // Extract invoice details (simplified for demo)
        const amountMatch = email.snippet.match(/\$([0-9,]+\.?\d*)|€([0-9,]+\.?\d*)|£([0-9,]+\.?\d*)/);
        const amount = amountMatch ? amountMatch[0] : "Unknown";
        const currency = amount.startsWith('$') ? 'USD' : amount.startsWith('€') ? 'EUR' : 'GBP';
        
        invoices.push({
          vendor: email.sender.replace(/<.*>/, '').trim(),
          amount: amount.replace(/[^0-9.]/g, ''),
          currency,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          emailId: email.id
        });
      }
    });
    
    return invoices;
  }
  
  function calculateInvoiceTotal(invoices: Invoice[]): Record<string, number> {
    const totals: Record<string, number> = {};
    
    invoices.forEach(inv => {
      if (!totals[inv.currency]) {
        totals[inv.currency] = 0;
      }
      totals[inv.currency] += parseFloat(inv.amount) || 0;
    });
    
    return totals;
  }
  
  function formatTriageReport(grouped: any, invoices: Invoice[]): string {
    let report = "📧 EMAIL TRIAGE REPORT\n";
    report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    
    // Action summary
    const actionEmojis: Record<string, string> = {
      archive: '📦',
      reply: '💬', 
      pay: '💰',
      read: '📖',
      delegate: '👥',
      save_to_minime: '🧠'
    };
    
    Object.entries(grouped).forEach(([action, items]: [string, any]) => {
      const emoji = actionEmojis[action] || '📌';
      report += `${emoji} ${action.toUpperCase()} (${items.length})\n`;
      
      items.slice(0, 3).forEach((item: any) => {
        report += `  • ${item.email.subject.substring(0, 50)}...\n`;
        report += `    → ${item.classification.suggestion}\n`;
      });
      
      if (items.length > 3) {
        report += `  ... and ${items.length - 3} more\n`;
      }
      report += '\n';
    });
    
    // Invoice summary
    if (invoices.length > 0) {
      report += "💳 INVOICE BATCH\n";
      report += `${invoices.length} invoices ready for batch payment\n`;
      report += "Run 'show_invoice_batch' for details\n\n";
    }
    
    // Stats
    const totalEmails = Object.values(grouped).reduce((sum: number, items: any) => sum + items.length, 0);
    const avgConfidence = Object.values(grouped).reduce((sum: number, items: any) => {
      return sum + items.reduce((s: number, i: any) => s + i.classification.confidence, 0);
    }, 0) / totalEmails;
    
    report += "📊 STATISTICS\n";
    report += `Total emails: ${totalEmails}\n`;
    report += `Avg confidence: ${(avgConfidence * 100).toFixed(1)}%\n`;
    report += `Invoices detected: ${invoices.length}\n`;
    
    return report;
  }
  
  function formatInvoiceBatch(invoices: Invoice[], totals: Record<string, number>): string {
    let report = "💳 INVOICE PAYMENT BATCH\n";
    report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    
    invoices.forEach(inv => {
      report += `📄 ${inv.vendor}\n`;
      report += `   Amount: ${inv.currency} ${inv.amount}\n`;
      report += `   Due: ${inv.dueDate}\n\n`;
    });
    
    report += "TOTALS:\n";
    Object.entries(totals).forEach(([currency, total]) => {
      report += `  ${currency}: ${total.toFixed(2)}\n`;
    });
    
    report += "\n💡 Pay all invoices in one session!";
    
    return report;
  }
}