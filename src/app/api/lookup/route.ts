/**
 * POST /api/lookup
 *
 * Accepts { name: string } and searches the competition schedule for matching
 * competitors. Returns up to 10 results, each enriched with event metadata
 * (rubric URLs, BizYBear practice links, competitor counts).
 *
 * Name matching supports:
 *   - Exact key lookup ("last, first" format)
 *   - Partial / substring matching
 *   - "First Last" → "Last, First" auto-conversion
 */
import { NextRequest, NextResponse } from "next/server";
import scheduleData from "@/data/competition-schedule.json";
import { getEventMetadata, isRealEvent } from "@/data/event-metadata";

interface RawEvent {
  competition: string;
  type: string;
  date: string;
  checkInTime: string;
  startTime: string;
  endTime: string;
  category: string;
}

interface RawPerson {
  name: string;
  school: string;
  events: RawEvent[];
}

const schedule: Record<string, RawPerson> = scheduleData;

/** Check whether an event type string indicates a team event. */
function isTeamEvent(type: string): boolean {
  return /team/i.test(type);
}

/**
 * Count how many other competitors/teams are in the same event.
 *
 * Matches on both competition name AND category to correctly separate events
 * that share a name but differ in type (e.g. "Business Ethics" Objective Test
 * vs "Business Ethics" Performance).
 *
 * For individual events, counts other people.
 * For team events, counts other teams identified by unique (school + startTime)
 * pairs, since a school may enter multiple teams in the same event
 * distinguished by different time slots.
 */
function countCompetitors(
  eventName: string,
  eventCategory: string,
  personName: string,
  personSchool: string,
  teamEvent: boolean,
  personStartTime?: string,
): number {
  if (teamEvent) {
    // Count distinct teams (school + startTime pairs) in this event,
    // excluding the current person's own team.
    const teams = new Set<string>();
    for (const person of Object.values(schedule)) {
      for (const e of person.events) {
        if (e.competition === eventName && e.category === eventCategory) {
          const teamKey = `${person.school}|${e.startTime}`;
          // Skip the queried person's own team
          if (person.school === personSchool && e.startTime === personStartTime) continue;
          teams.add(teamKey);
        }
      }
    }
    return teams.size;
  }

  // Individual event — count other people.
  let count = 0;
  for (const person of Object.values(schedule)) {
    if (person.name === personName) continue;
    for (const e of person.events) {
      if (e.competition === eventName && e.category === eventCategory) {
        count++;
        break;
      }
    }
  }
  return count;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter a valid name (at least 2 characters)." },
        { status: 400 }
      );
    }

    const searchQuery = name.trim().toLowerCase();

    // Collect matching people
    const matches: Array<{
      name: string;
      school: string;
      events: Array<{
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
      }>;
    }> = [];

    // 1. Try exact key match
    if (schedule[searchQuery]) {
      const p = schedule[searchQuery];
      matches.push(enrichPerson(p));
    }

    // 2. Partial / substring match
    if (matches.length === 0) {
      for (const [key, p] of Object.entries(schedule)) {
        if (
          key.includes(searchQuery) ||
          p.name.toLowerCase().includes(searchQuery)
        ) {
          matches.push(enrichPerson(p));
        }
      }
    }

    // 3. Try "First Last" → "Last, First" conversion
    if (matches.length === 0) {
      const parts = searchQuery.split(/\s+/);
      if (parts.length >= 2) {
        const reversed = `${parts[parts.length - 1]}, ${parts.slice(0, -1).join(" ")}`;
        for (const [key, p] of Object.entries(schedule)) {
          if (
            key.includes(reversed) ||
            p.name.toLowerCase().includes(reversed)
          ) {
            if (!matches.find((m) => m.name === p.name && m.school === p.school)) {
              matches.push(enrichPerson(p));
            }
          }
        }
      }
    }

    if (matches.length === 0) {
      return NextResponse.json(
        {
          error: `No schedule found for "${name}". Names are in "Last, First" format. Make sure you are registered for SLC 2026.`,
          results: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      results: matches.slice(0, 10),
      totalMatches: matches.length,
    });
  } catch (error) {
    console.error("Lookup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

/** Enrich a person's raw schedule data with metadata and competitor counts. */
function enrichPerson(person: RawPerson) {
  return {
    name: person.name,
    school: person.school,
    events: person.events
      .filter((e) => isRealEvent(e.competition))
      .map((e) => {
        const meta = getEventMetadata(e.competition);
        const team = isTeamEvent(e.type);
        return {
          ...e,
          rubricUrl: meta?.rubricUrl ?? "",
          bizybearUrl: meta?.bizybearUrl ?? null,
          isObjectiveTest: e.category === "Objective Test",
          isTeamEvent: team,
          competitorCount: countCompetitors(e.competition, e.category, person.name, person.school, team, e.startTime),
        };
      }),
  };
}
