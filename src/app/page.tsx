/**
 * Home page — Ohio FBLA SLC 2026 Event Info Tool.
 *
 * Displays a hero section with a search bar, fetches the competitor's schedule
 * from the /api/lookup endpoint, and renders a grid of EventCards. Users can
 * also email their full schedule via an EmailModal.
 */
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Mail, Loader2 } from "lucide-react";
import SearchForm from "@/components/SearchForm";
import EventCard, { type EventInfo } from "@/components/EventCard";
import EmailModal from "@/components/EmailModal";

interface PersonResult {
  name: string;
  school: string;
  events: EventInfo[];
}

interface LookupData {
  results: PersonResult[];
  totalMatches: number;
}

export default function Home() {
  const [data, setData] = useState<LookupData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailPerson, setEmailPerson] = useState<PersonResult | null>(null);
  // Track vertical scroll position to drive the parallax effect in the hero.
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /** Callback from SearchForm — stores the API response as typed data. */
  const handleResults = (raw: unknown) => {
    setData(raw as LookupData | null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* ── Header ── */}
      <header className="bg-navy/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-center gap-4">
          <Image
            src="/fbla-logo.png"
            alt="FBLA Logo"
            width={180}
            height={60}
            className="h-10 w-auto brightness-0 invert"
            priority
          />
        </div>
      </header>

      {/* ── Hero with Parallax ── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-[72px]"
      >
        {/* Parallax background layers */}
        <div
          className="absolute inset-0 bg-navy"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            transform: `translateY(${scrollY * 0.15}px)`,
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(242,169,0,0.2) 0%, transparent 40%)",
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div
          className="relative z-10 text-white py-20 px-4"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        >
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-lg sm:text-2xl md:text-4xl tracking-[0.06em] uppercase text-gold font-black mb-4">
              Vote Samarth Khandelwal for Webmaster
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Ohio FBLA SLC
            </h1>
            <div className="w-12 h-[2px] bg-gold mx-auto mb-5" />
            <p className="text-base sm:text-lg text-white/60 font-medium max-w-lg mx-auto leading-relaxed">
              Look up your competition schedule, events, rubrics &amp; practice
              resources.
            </p>
          </div>

          {/* Search */}
          <SearchForm
            onResults={handleResults}
            onError={setError}
            onLoading={setLoading}
          />
        </div>
      </section>

      {/* ── Content ── */}
      <main className="max-w-6xl mx-auto px-4 py-10 relative z-10">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-navy animate-spin" />
            <span className="ml-3 text-gray-400 font-medium text-sm tracking-wide">
              Searching...
            </span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-5 text-center max-w-xl mx-auto">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        {data &&
          !loading &&
          data.results.map((person, idx) => (
            <div key={idx} className="mb-14">
              {/* Person header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-navy tracking-tight">
                    {person.name}
                  </h2>
                  <p className="text-gray text-xs mt-1 tracking-wide uppercase">
                    {person.school} &mdash; {person.events.length} event
                    {person.events.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => setEmailPerson(person)}
                  className="inline-flex items-center gap-2 bg-navy hover:bg-cobalt text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Email My Schedule
                </button>
              </div>

              {/* Event grid */}
              <div className="grid gap-5 sm:grid-cols-2">
                {person.events.map((ev, i) => (
                  <EventCard key={i} event={ev} />
                ))}
              </div>

              {person.events.length === 0 && (
                <p className="text-gray-400 text-center py-8 text-sm">
                  No valid events found for this competitor.
                </p>
              )}
            </div>
          ))}

        {/* Empty state */}
        {!data && !loading && !error && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-base font-medium tracking-tight">
              Enter your name above to get started.
            </p>
            <p className="text-sm mt-2 text-gray-300">
              You&apos;ll see your full competition breakdown with times, rubric
              links, practice resources, and competitor counts.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200/70 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-sm font-medium text-navy/70 tracking-wide">
            Built by Samarth Khandelwal
          </p>
        </div>
      </footer>

      {/* ── Email Modal ── */}
      {emailPerson && (
        <EmailModal
          person={emailPerson}
          onClose={() => setEmailPerson(null)}
        />
      )}
    </div>
  );
}
