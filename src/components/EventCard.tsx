/**
 * EventCard — displays a single competition event.
 *
 * Shows the event name, type badge, schedule details (or an objective-test
 * notice), competitor count, and action links for the rubric PDF and
 * BizYBear practice questions.
 */
"use client";

import {
  Clock,
  Users,
  FileText,
  ExternalLink,
  Calendar,
} from "lucide-react";

export interface EventInfo {
  competition: string;
  type: string;
  date: string;
  checkInTime: string;
  startTime: string;
  endTime: string;
  category: string;
  rubricUrl: string;
  bizybearUrl: string | null;
  isObjectiveTest: boolean;
  isTeamEvent: boolean;
  competitorCount: number;
}

interface Props {
  event: EventInfo;
}

export default function EventCard({ event }: Props) {
  return (
    <div className="bg-white rounded-lg hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-150">
      {/* 2px top accent border */}
      <div
        className={`h-[2px] ${
          event.isObjectiveTest ? "bg-gold" : "bg-navy"
        }`}
      />

      <div className="p-5">
        {/* Header: title + badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="font-bold text-navy text-[15px] leading-snug">
            {event.competition}
          </h3>
          <span
            className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap uppercase tracking-wide ${
              event.isObjectiveTest
                ? "bg-gold/10 text-amber-700"
                : "bg-navy/5 text-navy/70"
            }`}
          >
            {event.isObjectiveTest ? "Test" : event.type || "Performance"}
          </span>
        </div>

        {/* Body */}
        {event.isObjectiveTest ? (
          <div className="bg-amber-50/70 border border-amber-100 rounded-md px-4 py-3 mb-4">
            <p className="text-sm text-amber-800/80 font-medium leading-snug">
              Objective Test — report to the credentialing station during your
              assigned testing window.
            </p>
            {event.startTime && (
              <p className="text-xs text-amber-600/70 mt-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Window: {event.startTime}
                {event.endTime ? ` - ${event.endTime}` : ""}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            {event.date && (
              <div className="flex items-center gap-2.5 text-sm text-gray-500">
                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{event.date}</span>
              </div>
            )}
            {event.checkInTime && (
              <div className="flex items-center gap-2.5 text-sm text-gray-500">
                <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>
                  Check-in: <strong className="text-gray-700">{event.checkInTime}</strong>
                </span>
              </div>
            )}
            {event.startTime && (
              <div className="flex items-center gap-2.5 text-sm text-gray-500">
                <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>
                  Start: <strong className="text-gray-700">{event.startTime}</strong>
                  {event.endTime ? ` \u2014 End: ${event.endTime}` : ""}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Competitor count */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <Users className="w-3.5 h-3.5" />
          <span>
            {event.competitorCount} other{" "}
            {event.isTeamEvent
              ? event.competitorCount !== 1 ? "teams" : "team"
              : event.competitorCount !== 1 ? "competitors" : "competitor"}
          </span>
        </div>

        {/* Action links */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
          <a
            href={event.rubricUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-navy/70 hover:text-navy bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Rubric / Guidelines
          </a>
          {event.bizybearUrl && (
            <a
              href={event.bizybearUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700/80 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-md transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Practice Questions
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
