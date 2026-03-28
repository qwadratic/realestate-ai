"use client";

import { useState, useRef, useEffect } from "react";
import { useAgent } from "@/lib/use-chat";

const TOOL_LABELS: Record<string, string> = {
  list_properties: "Listing properties",
  get_property: "Reading property",
  extract_features: "Extracting features",
  lookup_intel: "Looking up signals",
  search_nearby: "Searching nearby",
  enrich_with_maps: "Maps enrichment",
  compute_commute: "Computing commute",
  validate_compliance: "Validating compliance",
  analyze_property: "Full analysis",
  analyze_all: "Analyzing all properties",
  web_search: "Searching web",
};

export function ChatPanel() {
  const { messages, toolCalls, streaming, error, send } = useAgent();
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
                {msg.role === "user" ? "You" : "Klar"}
              </span>
              <p
                className={`text-[15px] mt-0.5 ${
                  msg.role === "user" ? "text-muted" : "text-text"
                } whitespace-pre-wrap`}
              >
                {msg.content}
              </p>
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
              Thinking...
            </div>
          )}

          {error && (
            <div className="text-[13px] text-signal-red">{error}</div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Klar anything... (e.g. 'analyze all properties', 'which is best for families?')"
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
