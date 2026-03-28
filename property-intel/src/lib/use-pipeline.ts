"use client";

import { useState, useCallback } from "react";
import type { PropertyValidated } from "@/types";
import type { PipelineStage } from "./pipeline";

interface PipelineState {
  stage: PipelineStage | null;
  detail: string;
  properties: PropertyValidated[];
  error: string | null;
  running: boolean;
}

export function usePipeline() {
  const [state, setState] = useState<PipelineState>({
    stage: null,
    detail: "",
    properties: [],
    error: null,
    running: false,
  });

  const run = useCallback(async (query?: string) => {
    setState((s) => ({ ...s, running: true, error: null, stage: null, properties: [] }));

    try {
      const res = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = JSON.parse(line.slice(6));

          if (data.type === "stage") {
            setState((s) => ({ ...s, stage: data.stage, detail: data.detail || "" }));
          } else if (data.type === "result") {
            setState((s) => ({ ...s, properties: data.properties, running: false, stage: "complete" }));
          } else if (data.type === "error") {
            setState((s) => ({ ...s, error: data.message, running: false }));
          }
        }
      }
    } catch (err) {
      setState((s) => ({ ...s, error: String(err), running: false }));
    }
  }, []);

  return { ...state, run };
}
