# Copilot Instructions — Ohio FBLA Event Info Tool

## Architecture Overview

**Tech Stack:** Next.js 16 (App Router) + React 19 + TypeScript 5 + Tailwind CSS v4 + Resend (email) + Lucide React (icons)

### Core Data Flow
1. **Home page** (`src/app/page.tsx`) — "use client" component with hero section & SearchForm
2. **Search** (`SearchForm.tsx`) — POSTs competitor name to `/api/lookup`
3. **Lookup API** (`src/app/api/lookup/route.ts`) — searches `competition-schedule.json` (keyed by "last, first"), returns up to 10 matches, each enriched with:
   - Event metadata (rubric URLs, BizYBear links, type classification)
   - Competitor count (handles team vs. individual event logic)
4. **Results grid** — renders EventCard components per person, with email fallback via EmailModal
5. **Email** (`src/app/api/email/route.ts`) — Resend API sends formatted HTML schedule

### Data Structure
- **Competition schedule** (`src/data/competition-schedule.json`) — Record<"last, first" key, { name, school, events[] }>
- **Event metadata** (`src/data/event-metadata.ts`) — Maps event name → rubric URL (S3), BizYBear URL slug, isObjectiveTest boolean, event type

## Critical Patterns

### Client Components & State Management
- All major components use `"use client"` (client-side rendering only)
- State passed via **callback props**: `onResults`, `onError`, `onLoading` (not Redux/Context)
- Parent (Home) manages `data`, `error`, `loading` state; children notify via functions
- TypeScript interfaces define all data shapes: `PersonResult`, `EventInfo`, `LookupData`

### Search & Name Matching
Search logic supports three formats:
1. **Exact key lookup** — searches `schedule["last, first"]` directly
2. **Partial matching** — substring search across all keys
3. **Auto-convert** — detects "First Last" input, converts to "Last, First" before searching

### Event Metadata Enrichment
- **BizYBear URL slugs** — `Record<string, string>` in `event-metadata.ts`; slugs use inconsistent formatting (hyphens, plus signs, %26 for &)
- **Rubric URLs** — S3 URLs; separate HS vs. MS PDFs (`HS_RUBRIC_URL`, `MS_RUBRIC_URL`)
- **Event type classification** — `isObjectiveTest` boolean drives UI rendering (gold accent vs. navy, special notice text)

### Team vs. Individual Events
In `lookup/route.ts`:
- **Team events** — count unique `(school, startTime)` pairs (not per-person)
- **Individual events** — count unique people competing in that event
- Detection: `/team/i.test(event.type)`

### Styling Conventions
- **Colors:** Navy (`#1a1a2e`), Gold (`#f2a900`), off-white (`#f5f5f0`) — defined as custom Tailwind vars
- **Components:** Custom badges, cards with hover shadow, spinner (Loader2 icon)
- **Parallax effect** — Home page uses `scrollY` state + `transform: translateY(...)` on hero layers
- **Responsive:** Utility-first Tailwind; no CSS modules

## Developer Workflows

### Setup & Running
```bash
npm install
cp .env.local.example .env.local  # Add RESEND_API_KEY
npm run dev                        # Starts on http://localhost:3000
```

### Build & Lint
```bash
npm run build    # Next.js production build
npm run start    # Prod server
npm run lint     # ESLint (eslint-config-next)
```

### Key Environment Variables
- `RESEND_API_KEY` — Required for email API; get from resend.com

## File Organization

| Path | Purpose |
|------|---------|
| `src/app/page.tsx` | Home page — hero, search, results grid, email modal state |
| `src/app/api/lookup/route.ts` | Search endpoint — competitor lookup & metadata enrichment |
| `src/app/api/email/route.ts` | Email sending — formats schedule, calls Resend API |
| `src/components/SearchForm.tsx` | Input & submission → `/api/lookup` call |
| `src/components/EventCard.tsx` | Card UI — event details, rubric/BizYBear links, competitor count |
| `src/components/EmailModal.tsx` | Modal dialog — email form, Resend integration |
| `src/data/competition-schedule.json` | Raw schedule data — 22K+ lines, keyed by "last, first" |
| `src/data/event-metadata.ts` | Event → { rubric, bizybear, type } mapping (356 lines) |

## Integration Points

### External APIs
- **Resend** — email sending; imported in `email/route.ts`, called with HTML template + recipient
- **BizYBear** — practice quiz links; slugs must match their URL format exactly (not verified by tool)
- **FBLA S3** — rubric PDFs; static URLs, unsigned/public

### Cross-Component Communication
- **Home → SearchForm** — `onResults`, `onError`, `onLoading` callbacks
- **Home → EventCard** — enriched `EventInfo` (with URLs, counts, type flags)
- **Home → EmailModal** — `PersonResult` data (name, school, events), `onClose` callback
- **API → Components** — JSON response structure must match `LookupData` interface

## Code Style Notes

- **Comments:** Each file/function has JSDoc header explaining purpose
- **Naming:** camelCase; event names match JSON keys exactly (e.g., "Financial Planning", "Computer Applications")
- **Error handling:** try/catch in components; API routes return `{ error: string }` with HTTP status
- **Validation:** Email regex in EmailModal; search input min-length check in SearchForm
- **No external state management** — callbacks + props only

## Common Edits

**Adding a new event feature?**  
1. Update `event-metadata.ts` mapping (add event name, rubric URL, BizYBear slug, isObjectiveTest flag)
2. Verify event type string in `schedule.json` for team detection (`/team/i.test(...)`)

**Changing the UI appearance?**  
1. Modify Tailwind classes (no CSS files except `globals.css`)
2. Parallax effect in Home page uses `scrollY` state + inline `style={{ transform: ... }}`

**Adding external links or resources?**  
1. Link targets in EventCard come from `event-metadata.ts`
2. Email template in `email/route.ts` — update HTML as needed
