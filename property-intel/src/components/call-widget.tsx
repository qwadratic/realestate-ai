"use client";

import { useState } from "react";

export function CallWidget() {
  const [phone, setPhone] = useState("+43 ");
  const [calling, setCalling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function validateAustrianNumber(num: string): string | null {
    // Remove spaces, dashes
    const clean = num.replace(/[\s\-()]/g, "");
    // Must start with +43
    if (!clean.startsWith("+43")) return "Nummer muss mit +43 beginnen";
    // Austrian mobile/landline: +43 followed by 9-12 digits
    const digits = clean.slice(3);
    if (digits.length < 4 || digits.length > 12) return "Ungültige österreichische Nummer";
    if (!/^\d+$/.test(digits)) return "Nur Ziffern erlaubt";
    return null;
  }

  async function handleCall() {
    const err = validateAustrianNumber(phone);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setCalling(true);

    const clean = phone.replace(/[\s\-()]/g, "");

    try {
      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: clean }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Anruf fehlgeschlagen");
      }
    } catch {
      setError("Verbindungsfehler");
    } finally {
      setCalling(false);
    }
  }

  return (
    <div className="bg-card rounded-[4px] p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 bg-copper rounded-full flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>
        <div>
          <p className="text-[16px] font-medium text-text">Maya anrufen lassen</p>
          <p className="text-[13px] text-muted">KI-Assistentin ruft Sie zurück</p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setError("");
          }}
          placeholder="+43 660 1234567"
          className="flex-1 bg-surface px-4 py-3 text-[16px] rounded-[4px] outline-none focus:ring-1 focus:ring-copper placeholder:text-faint tabular-nums"
        />
        <button
          onClick={handleCall}
          disabled={calling || success}
          className={`px-5 py-3 text-[15px] font-medium rounded-[4px] transition-colors shrink-0 ${
            success
              ? "bg-signal-green text-white"
              : calling
              ? "bg-copper/70 text-white animate-pulse"
              : "bg-copper text-white hover:bg-copper-dark"
          }`}
        >
          {success ? "Maya ruft an!" : calling ? "Wird verbunden..." : "Anrufen"}
        </button>
      </div>

      {error && (
        <p className="text-[13px] text-signal-red mt-2">{error}</p>
      )}
      {success && (
        <p className="text-[13px] text-signal-green mt-2">
          Maya ruft Sie gleich an der Nummer {phone} an.
        </p>
      )}

      <p className="text-[12px] text-faint mt-3">
        Nur österreichische Nummern (+43). Maya spricht Deutsch und Englisch.
      </p>
    </div>
  );
}
