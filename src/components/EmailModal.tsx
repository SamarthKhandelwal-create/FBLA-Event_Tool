/**
 * EmailModal — overlay dialog for emailing a competitor's schedule.
 *
 * Collects an email address, sends the person's schedule to /api/email,
 * and displays a success confirmation or error message.
 */
"use client";

import { useState, type FormEvent } from "react";
import { Mail, X, Loader2, CheckCircle } from "lucide-react";

interface PersonData {
  name: string;
  school: string;
  events: unknown[];
}

interface Props {
  person: PersonData;
  onClose: () => void;
}

export default function EmailModal({ person, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, person }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to send email.");
      } else {
        setStatus("sent");
        setMessage(data.message || `Sent to ${email}!`);
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-navy px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gold" />
            <h2 className="text-white font-bold text-lg">
              Email Your Schedule
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {status === "sent" ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-semibold text-gray-800 text-lg">{message}</p>
              <p className="text-gray-500 text-sm mt-2">
                Check your inbox (and spam folder) for the email.
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-navy hover:bg-cobalt text-white px-6 py-2.5 rounded-lg font-semibold transition-colors text-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-sm mb-1">
                Sending schedule for{" "}
                <strong className="text-navy">{person.name}</strong>
              </p>
              <p className="text-gray-400 text-xs mb-5">
                {person.events.length} event
                {person.events.length !== 1 ? "s" : ""} • {person.school}
              </p>

              <form onSubmit={handleSend} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-cobalt focus:outline-none focus:ring-2 focus:ring-cobalt/20 transition-all text-sm"
                    autoFocus
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-xs">{message}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-navy hover:bg-cobalt disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Schedule
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
