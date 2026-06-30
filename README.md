# Job Fit Resume Builder

Job Fit Resume Builder is a Next.js app for creating tailored resumes from a saved master profile. Users enter their real experience once, paste a job description, and generate a role-specific resume with a fit score and PDF/DOCX export options.

The app is designed to avoid fabricated experience. AI tailoring is routed through the server-side AI layer and should only reshape, prioritize, and summarize data that exists in the user's profile.

## Features

- Multi-step profile onboarding for personal info, work experience, education, skills, projects, and certifications
- Saved profiles and generated resumes backed by PostgreSQL through Prisma
- Resume tailoring from a job title, optional company name, and full job description
- Mock AI provider for local development without paid API calls
- Anthropic Claude provider for real AI generation
- Fit score with skills, experience, and education breakdowns
- Resume preview page with PDF and DOCX downloads

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS v4
- Prisma with PostgreSQL, intended for Supabase Postgres
- Anthropic Claude API
- `pdfkit` and `docx` for exports

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Use mock AI while developing locally:

```env
AI_PROVIDER=mock
```

Use Anthropic when you want real AI generation:

```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Setup

This app persists profiles and resumes in PostgreSQL. Supabase Postgres is the expected hosted database.

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Set `DATABASE_URL` to your Supabase Postgres connection string.
4. Keep `DATABASE_SSL_REJECT_UNAUTHORIZED=true` unless you are intentionally debugging a local or self-signed database connection.
5. Generate the Prisma client and push the schema:

```bash
npm run db:generate
npm run db:push
```

`npm run db:push` is the current MVP setup path. Before production deployment, prefer a migration-based workflow.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `AI_PROVIDER` | Yes | `mock` for local deterministic generation, or `anthropic` for Claude. Defaults to `mock` in code if omitted. |
| `ANTHROPIC_API_KEY` | Only with `AI_PROVIDER=anthropic` | API key used by the Anthropic SDK. |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |
| `DATABASE_SSL_REJECT_UNAUTHORIZED` | Recommended | Controls SSL certificate validation for PostgreSQL connections. |

## App Flow

1. Visit `/onboarding` and build a master profile from real background data.
2. Go to `/builder`, select a saved profile, enter the job title, optional company, and paste the job description.
3. Generate a tailored resume.
4. Review the resume at `/resume/[id]`.
5. Download the resume as PDF or DOCX.

## Scripts

```bash
npm run dev          # start the local Next.js dev server
npm run build        # create a production build
npm run start        # run the production build
npm run lint         # run ESLint
npm run type-check   # run TypeScript without emitting files
npm run db:generate  # generate Prisma client
npm run db:push      # push Prisma schema to the database
npm run db:studio    # open Prisma Studio
```

## Project Structure

```text
src/app/              App Router pages and API routes
src/app/api/          Server routes for profiles, generation, resumes, and export
src/components/       UI components, including onboarding steps
src/hooks/            Client-side form state hooks
src/lib/ai/           AI provider orchestration, prompts, validation, and clients
src/lib/data/         Prisma-backed storage layer
src/lib/resume/       Resume export and formatting helpers
src/types/            Shared TypeScript types
prisma/schema.prisma  Database schema
```

## Development Checks

Before committing changes, run:

```bash
npm run lint
npm run type-check
```
