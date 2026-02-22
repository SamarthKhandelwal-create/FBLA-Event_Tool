/**
 * SearchForm — name search input for looking up a competitor's schedule.
 *
 * Validates the input length, sends a POST to /api/lookup, and passes the
 * response (or error) back to the parent via callback props.
 */
"use client";

import { useState, type FormEvent } from "react";
import { Search, Loader2 } from "lucide-react";

interface Props {
  onResults: (data: unknown) => void;
  onError: (msg: string) => void;
  onLoading: (loading: boolean) => void;
}

export default function SearchForm({ onResults, onError, onLoading }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      onError("Please enter at least 2 characters.");
      return;
    }

    onLoading(true);
    onError("");

    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        onError(data.error || "Something went wrong.");
        onResults(null);
      } else {
        onResults(data);
      }
    } catch {
      onError("Network error. Please try again.");
      onResults(null);
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name to look up your schedule"
          className="w-full pl-12 pr-28 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-cobalt focus:outline-none focus:ring-2 focus:ring-cobalt/20 transition-all text-base shadow-sm"
          autoFocus
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-navy hover:bg-cobalt text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          Search
        </button>
      </div>
    </form>
  );
}
