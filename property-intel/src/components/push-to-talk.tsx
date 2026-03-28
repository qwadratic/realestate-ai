"use client";

import { useState, useCallback } from "react";
import {
  ConversationProvider,
  useConversationControls,
  useConversationStatus,
  useConversationMode,
  useConversationInput,
} from "@elevenlabs/react";

function PTTButton({ agentId }: { agentId: string }) {
  const { startSession, endSession } = useConversationControls();
  const { status } = useConversationStatus();
  const { isSpeaking } = useConversationMode();
  const { isMuted, setMuted } = useConversationInput();
  const [holding, setHolding] = useState(false);

  const connected = status === "connected";
  const connecting = status === "connecting";

  const handleConnect = useCallback(async () => {
    if (connected) {
      await endSession();
      return;
    }
    await navigator.mediaDevices.getUserMedia({ audio: true });
    await startSession({ agentId });
    // Start muted — user must hold to speak
    setMuted(true);
  }, [connected, agentId, startSession, endSession, setMuted]);

  // Hold to speak
  const handlePointerDown = useCallback(() => {
    if (!connected) return;
    setHolding(true);
    setMuted(false); // Unmute while holding
  }, [connected, setMuted]);

  const handlePointerUp = useCallback(() => {
    if (!connected) return;
    setHolding(false);
    setMuted(true); // Mute when released — signals end of phrase
  }, [connected, setMuted]);

  if (!connected) {
    return (
      <button
        onClick={handleConnect}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all z-50 ${
          connecting ? "bg-copper/70 animate-pulse" : "bg-copper hover:bg-copper-dark"
        }`}
        title="Maya starten"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Status indicator */}
      <div className="bg-card rounded-[4px] px-3 py-1.5 shadow-lg text-[13px]">
        {isSpeaking ? (
          <span className="text-signal-green font-medium">Maya spricht...</span>
        ) : holding ? (
          <span className="text-signal-red font-medium animate-pulse">Höre zu...</span>
        ) : (
          <span className="text-muted">Halten zum Sprechen</span>
        )}
      </div>

      <div className="flex gap-2">
        {/* End call button */}
        <button
          onClick={handleConnect}
          className="w-10 h-10 rounded-full bg-signal-red/10 flex items-center justify-center hover:bg-signal-red/20 transition-colors"
          title="Beenden"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D94F4F" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Push-to-talk button */}
        <button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all select-none touch-none ${
            holding
              ? "bg-signal-red scale-110 shadow-xl"
              : isSpeaking
              ? "bg-signal-green"
              : "bg-copper hover:bg-copper-dark"
          }`}
          title="Halten zum Sprechen"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function PushToTalk({ agentId }: { agentId: string }) {
  return (
    <ConversationProvider>
      <PTTButton agentId={agentId} />
    </ConversationProvider>
  );
}
