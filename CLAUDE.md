@AGENTS.md
# CLAUDE.md — job-fit-resume-builder

This file is automatically read by Claude Code at the start of every session.
It gives Claude persistent context about this project so you never have to re-explain it.

---

## Project Overview

**job-fit-resume-builder** is an AI-powered Next.js application that tailors a user's resume
to match any job description — using only their real, authentic experience.

The core principle: **never fabricate or inflate**. The AI reframes, reprioritizes, and
reshapes the user's actual background to best fit what an employer is looking for.

---

## Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS + PostCSS
- **AI:** Anthropic Claude API (via `src/lib/ai/`)
- **Package manager:** npm (use `npm` for all commands, not yarn or pnpm)

---

## Commands

```bash
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Production build
npm run lint       # Run ESLint
npm run type-check # Run TypeScript compiler check (no emit)
```

Always run `npm run lint` and `npm run type-check` before considering a task complete.

---

## Folder Structure

```
src/
├── app/                        # Next.js App Router pages & API routes
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── onboarding/page.tsx     # User fills in real experience
│   ├── builder/page.tsx        # Paste job description + generate
│   ├── resume/[id]/page.tsx    # View tailored resume
│   └── api/
│       ├── generate/route.ts   # AI tailoring endpoint
│       ├── profile/route.ts    # Save / load user profile
│       └── export/route.ts     # PDF / DOCX export
├── lib/
│   ├── ai/                     # All AI logic lives here
│   │   ├── client.ts           # Anthropic SDK instance
│   │   ├── prompts.ts          # Prompt templates
│   │   ├── tailor.ts           # Core tailoring logic
│   │   ├── extract-jd.ts       # Parse job description requirements
│   │   └── score.ts            # Fit scoring / gap analysis
│   ├── resume-schema.ts        # TypeScript types for resume output
│   ├── profile-schema.ts       # TypeScript types for user's master profile
│   ├── export.ts               # PDF / DOCX renderer
│   ├── storage.ts              # Persistence layer
│   └── utils.ts
├── components/
│   ├── resume/                 # Resume preview components
│   ├── profile/                # Experience & skills input forms
│   ├── builder/                # Job description input + generate button
│   └── ui/                     # Shared primitives (buttons, inputs, cards)
├── store/
│   ├── profile.ts              # User's master experience (Zustand / context)
│   └── resume.ts               # Generated resume state
└── types/
    ├── resume.ts
    ├── profile.ts
    └── api.ts
```

---

## Core Data Models

There are two distinct data models — **never conflate them:**

### `Profile` (permanent, user-owned)
The user's complete, unedited work history, skills, education, and achievements.
This is the source of truth. **Claude must never mutate or overwrite profile data.**

### `Resume` (generated, job-specific)
A tailored snapshot derived from the profile, shaped to fit one specific job description.
This is always disposable and regeneratable.

---

## AI Rules

- All AI calls go through `src/lib/ai/` — never call the Anthropic SDK directly from components or API routes
- Prompts live in `src/lib/ai/prompts.ts` — do not hardcode prompt strings elsewhere
- The tailoring AI must only use content from the user's profile — **no invented experience, skills, or credentials**
- If a required skill is missing from the profile, the gap should be flagged, not fabricated

---

## Code Style

- TypeScript strict mode — no `any`, no `ts-ignore` without a comment explaining why
- Prefer **Server Components** by default; add `"use client"` only when interactivity requires it
- API route handlers should be thin — delegate business logic to `src/lib/`
- Use named exports for components, default exports only for Next.js pages
- Keep AI prompt templates readable — use template literals with clear variable names

---

## What NOT to Touch

- `.env.local` — never read, log, or expose API keys
- `node_modules/` — never edit
- Generated build output (`.next/`) — never edit

---

## Environment Variables

```bash
ANTHROPIC_API_KEY=        # Required — Anthropic Claude API key
```

All env vars must be validated at startup in `src/lib/ai/client.ts`.
Never access `process.env` outside of `src/lib/` or `src/app/api/`.

---

## Session Checklist

Before ending any coding session, confirm:
- [ ] `npm run lint` passes with no errors
- [ ] `npm run type-check` passes
- [ ] No hardcoded API keys or secrets
- [ ] Profile data is never mutated by AI output
- [ ] New prompts are added to `prompts.ts`, not inlined
