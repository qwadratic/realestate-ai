"use client";

import { useState, useCallback } from "react";
import type { ChatMessage, PropertyValidated, ClientProfile } from "@/types";

interface ToolCall {
  name: string;
  input: Record<string, string>;
  result?: string;
}

interface ChatState {
  messages: ChatMessage[];
  toolCalls: ToolCall[];
  streaming: boolean;
  error: string | null;
}

interface AgentContext {
  properties?: PropertyValidated[];
  clientProfile?: ClientProfile;
}

export function useAgent(context?: AgentContext) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    toolCalls: [],
    streaming: false,
    error: null,
  });

  const send = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = { role: "user", content: text };
      const newMessages = [...state.messages, userMsg];

      setState((s) => ({
        ...s,
        messages: newMessages,
        toolCalls: [],
        streaming: true,
        error: null,
      }));

      try {
        const endpoint = context?.properties ? "/api/chat" : "/api/agent";
        const body: Record<string, unknown> = { messages: newMessages };
        if (context?.properties) body.properties = context.properties;
        if (context?.clientProfile) body.clientProfile = context.clientProfile;

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream");

        const decoder = new TextDecoder();
        let buffer = "";
        let assistantText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = JSON.parse(line.slice(6));

            if (data.type === "text") {
              assistantText += data.content;
              setState((s) => ({
                ...s,
                messages: [
                  ...newMessages,
                  { role: "assistant", content: assistantText },
                ],
              }));
            } else if (data.type === "tool_call") {
              setState((s) => ({
                ...s,
                toolCalls: [...s.toolCalls, { name: data.name, input: data.input }],
              }));
            } else if (data.type === "tool_result") {
              setState((s) => {
                const calls = [...s.toolCalls];
                const last = calls.findLast((c) => c.name === data.name);
                if (last) last.result = data.result;
                return { ...s, toolCalls: calls };
              });
            } else if (data.type === "done") {
              setState((s) => ({ ...s, streaming: false }));
            } else if (data.type === "error") {
              setState((s) => ({ ...s, error: data.message, streaming: false }));
            }
          }
        }
      } catch (err) {
        setState((s) => ({ ...s, error: String(err), streaming: false }));
      }
    },
    [state.messages, context]
  );

  return { ...state, send };
}
