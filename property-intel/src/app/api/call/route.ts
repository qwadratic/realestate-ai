import { NextRequest, NextResponse } from "next/server";

// Trigger outbound call via ElevenLabs API
export async function POST(req: NextRequest) {
  const { phone_number } = await req.json();

  if (!phone_number || !phone_number.startsWith("+43")) {
    return NextResponse.json(
      { error: "Nur österreichische Nummern (+43)" },
      { status: 400 }
    );
  }

  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!agentId || !apiKey) {
    return NextResponse.json(
      { error: "Voice agent not configured" },
      { status: 500 }
    );
  }

  const agentPhoneNumber = "+436703015333";

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/twilio/outbound-call`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          agent_phone_number_id: "phnum_9701kmjfqs4teg2berdpaf6gpp5g",
          to_number: phone_number,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("ElevenLabs call error:", err);
      return NextResponse.json(
        { error: "Anruf konnte nicht gestartet werden" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, call_id: data.call_id });
  } catch (e) {
    console.error("Call error:", e);
    return NextResponse.json(
      { error: "Verbindungsfehler" },
      { status: 500 }
    );
  }
}
