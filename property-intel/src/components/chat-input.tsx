"use client";

import { useState, useRef, useEffect } from "react";
import { useAgent } from "@/lib/use-chat";
import type { PropertyValidated, ClientProfile } from "@/types";

// Simple markdown to HTML for chat responses
function renderMarkdown(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 bg-surface rounded text-[13px]">$1</code>')
    // Headers (h3, h2, h1)
    .replace(/^### (.+)$/gm, '<p class="text-[16px] font-semibold text-text mt-3 mb-1">$1</p>')
    .replace(/^## (.+)$/gm, '<p class="text-[17px] font-semibold text-text mt-3 mb-1">$1</p>')
    .replace(/^# (.+)$/gm, '<p class="text-[18px] font-bold text-text mt-3 mb-1">$1</p>')
    // Bullet lists
    .replace(/^- (.+)$/gm, '<div class="flex gap-2 ml-2"><span class="text-copper">•</span><span>$1</span></div>')
    // Numbered lists
    .replace(/^(\d+)\. (.+)$/gm, '<div class="flex gap-2 ml-2"><span class="text-copper font-medium">$1.</span><span>$2</span></div>')
    // Line breaks
    .replace(/\n\n/g, '<div class="h-2"></div>')
    .replace(/\n/g, "<br/>");
}

const TOOL_LABELS: Record<string, string> = {
  list_properties: "Listing properties",
  get_property: "Reading property",
  extract_features: "Extracting features",
  lookup_intel: "Looking up signals",
  search_nearby: "Searching nearby",
  search_nearby_places: "Searching nearby",
  enrich_with_maps: "Maps enrichment",
  compute_commute: "Computing commute",
  validate_compliance: "Validating compliance",
  analyze_property: "Full analysis",
  analyze_all: "Analyzing all properties",
  web_search: "Searching web",
};

interface ChatPanelProps {
  properties?: PropertyValidated[];
  clientProfile?: ClientProfile;
  suggestedQuestions?: string[];
}

export function ChatPanel({ properties, clientProfile, suggestedQuestions }: ChatPanelProps) {
  const { messages, toolCalls, streaming, error, send } = useAgent(
    properties ? { properties, clientProfile } : undefined
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, toolCalls]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || streaming) return;
    send(input.trim());
    setInput("");
  };

  const handleSuggestedClick = (question: string) => {
    if (streaming) return;
    send(question);
  };

  return (
    <div className="mt-6">
      <p className="text-[13px] text-faint mb-1.5">
        Klar Agent · Verified against source data · § 1299 ABGB
      </p>

      {(messages.length > 0 || toolCalls.length > 0) && (
        <div
          className="bg-card rounded-[4px] p-5 mb-3 max-h-[400px] overflow-y-auto space-y-4"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === "user" ? "text-right" : ""}>
              <span className="text-[11px] font-medium text-faint uppercase tracking-wider">
                {msg.role === "user" ? "Sie" : "Klar"}
              </span>
              {msg.role === "user" ? (
                <p className="text-[15px] mt-0.5 text-muted">{msg.content}</p>
              ) : (
                <div
                  className="text-[15px] mt-0.5 text-text leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
              )}
            </div>
          ))}

          {/* Tool activity feed */}
          {streaming && toolCalls.length > 0 && (
            <div className="space-y-1.5 border-l-2 border-copper pl-3">
              {toolCalls.map((tc, i) => (
                <div key={i} className="text-[13px]">
                  <span className="text-copper font-medium">
                    {TOOL_LABELS[tc.name] || tc.name}
                  </span>
                  {tc.result ? (
                    <span className="text-faint ml-1">✓</span>
                  ) : (
                    <span className="text-faint ml-1 animate-pulse">...</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {streaming && toolCalls.length === 0 && (
            <div className="text-[13px] text-copper animate-pulse">
              Denke nach...
            </div>
          )}

          {error && (
            <div className="text-[13px] text-signal-red">{error}</div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Suggested questions — show when no conversation yet */}
      {suggestedQuestions && suggestedQuestions.length > 0 && messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSuggestedClick(q)}
              disabled={streaming}
              className="px-4 py-2 bg-surface text-[15px] text-text rounded-[4px] hover:bg-copper hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Fragen Sie Klar... (z.B. 'welche Wohnung passt am besten?')"
          disabled={streaming}
          className="flex-1 bg-surface px-5 py-3.5 text-base rounded-[4px] outline-none focus:ring-1 focus:ring-copper placeholder:text-faint disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="px-5 py-3.5 bg-copper text-white rounded-[4px] text-[15px] font-medium hover:bg-copper-dark transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
