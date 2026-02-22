# Ohio FBLA Event Info Tool

A web application for Ohio FBLA State Leadership Conference (SLC) 2026 competitors to look up their competition schedules, view event details, and access study resources.

## Features

- **Name Search** — look up any registered competitor by name (supports partial matching and "First Last" input)
- **Event Cards** — displays schedule details, check-in / start times, and competitor counts for each event
- **Rubric Links** — direct links to the official 2025–26 FBLA High School and Middle School guidelines PDFs
- **Practice Questions** — links to BizYBear practice quizzes for every event
- **Email Schedule** — send a formatted HTML summary of your schedule to any email address

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) 16 (App Router, React 19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) v4
- **Icons:** [Lucide React](https://lucide.dev)
- **Email:** [Resend](https://resend.com)
- **Hosting:** [Vercel](https://vercel.com)

## Getting Started

```bash
# Install dependencies
npm install

# Copy the example env file and add your Resend API key
cp .env.local.example .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── email/route.ts    # POST /api/email — sends schedule via Resend
│   │   └── lookup/route.ts   # POST /api/lookup — searches the schedule data
│   ├── globals.css            # Tailwind config & global styles
│   ├── layout.tsx             # Root layout (Montserrat font, metadata)
│   └── page.tsx               # Home page (hero, search, results grid)
├── components/
│   ├── EmailModal.tsx         # Email-your-schedule dialog
│   ├── EventCard.tsx          # Individual event display card
│   └── SearchForm.tsx         # Name search input & submit
└── data/
    ├── competition-schedule.json  # Parsed competitor schedule data
    └── event-metadata.ts          # Event → rubric / BizYBear / type mapping
```

## Environment Variables

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | API key from [Resend](https://resend.com) for sending emails |
