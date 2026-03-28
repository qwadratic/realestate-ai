import { NextRequest, NextResponse } from "next/server";

// Trigger outbound call via ElevenLabs API
export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Ungültige Anfrage", code: "INVALID_JSON" },
      { status: 400 }
    );
  }

  const { phone_number } = body;

  if (!phone_number) {
    return NextResponse.json(
      { error: "Bitte Telefonnummer eingeben", code: "NO_PHONE" },
      { status: 400 }
    );
  }

  // Normalize: remove spaces/dashes
  const clean = phone_number.replace(/[\s\-()]/g, "");

  if (!clean.startsWith("+43")) {
    return NextResponse.json(
      { error: "Nur österreichische Nummern (+43)", code: "NOT_AUSTRIAN" },
      { status: 400 }
    );
  }

  const digits = clean.slice(3);
  if (digits.length < 4 || digits.length > 12 || !/^\d+$/.test(digits)) {
    return NextResponse.json(
      { error: "Ungültige österreichische Nummer", code: "INVALID_NUMBER" },
      { status: 400 }
    );
  }

  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!agentId) {
    return NextResponse.json(
      { error: "Voice Agent nicht konfiguriert (Agent ID fehlt)", code: "NO_AGENT_ID" },
      { status: 500 }
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "Voice Agent nicht konfiguriert (API Key fehlt)", code: "NO_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      "https://api.elevenlabs.io/v1/convai/twilio/outbound-call",
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          agent_phone_number_id: "phnum_9701kmjfqs4teg2berdpaf6gpp5g",
          to_number: clean,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Unknown error" }));
      const status = res.status;
      const detail =
        typeof err.detail === "string"
          ? err.detail
          : typeof err.message === "string"
          ? err.message
          : JSON.stringify(err);

      console.error(`ElevenLabs ${status}:`, detail);

      // Map ElevenLabs errors to user-friendly messages
      if (status === 401 || status === 403) {
        return NextResponse.json(
          { error: "ElevenLabs API-Schlüssel ungültig", code: "AUTH_FAILED", detail },
          { status: 500 }
        );
      }
      if (status === 402) {
        return NextResponse.json(
          { error: "ElevenLabs Guthaben aufgebraucht", code: "NO_CREDITS", detail },
          { status: 500 }
        );
      }
      if (status === 422) {
        return NextResponse.json(
          { error: `Ungültige Anfrage an ElevenLabs: ${detail}`, code: "VALIDATION", detail },
          { status: 400 }
        );
      }
      if (status === 429) {
        return NextResponse.json(
          { error: "Zu viele Anrufe. Bitte warten.", code: "RATE_LIMITED", detail },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: `ElevenLabs Fehler (${status}): ${detail}`, code: "ELEVENLABS_ERROR", detail },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      call_id: data.call_id || data.conversation_id,
      message: "Maya ruft Sie gleich an",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unbekannter Fehler";
    console.error("Call error:", message);
    return NextResponse.json(
      { error: `Verbindungsfehler: ${message}`, code: "NETWORK_ERROR" },
      { status: 500 }
    );
  }
}
