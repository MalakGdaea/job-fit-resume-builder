---
name: mvp-audit
description: Audit this resume-builder app for MVP readiness across onboarding, profile persistence, AI/mock generation, resume viewing, export, configuration, and deployment blockers. Use when the user asks what remains before MVP, asks whether the app is usable, or wants a launch/readiness checklist.
---

# MVP Audit

Audit whether a real user can complete the core product loop without developer help.

## MVP Loop

The minimum viable loop is:

1. User creates a profile in `/onboarding`.
2. Profile persists through the database.
3. User pastes a job description in `/builder`.
4. `/api/generate` creates a resume through `AI_PROVIDER=mock` or `AI_PROVIDER=anthropic`.
5. Resume persists and opens at `/resume/[id]`.
6. User can review the tailored resume.
7. User can export PDF or DOCX.

## Workflow

1. Read `AGENTS.md`, `.env.example`, `package.json`, Prisma schema, and the app/API routes involved in the MVP loop.
2. Inspect the core flow files before optional polish: onboarding page, builder page, generate/profile/resume/export API routes, storage, AI providers, resume page, and export utilities.
3. Identify blockers first, then high-friction issues, then polish.
4. Prefer concrete verification. Run `npm run lint` and `npm run type-check`; run database or browser checks only when needed and available.
5. Do not treat marketing copy, visual polish, auth, multi-user support, or billing as MVP blockers unless they prevent safe basic use.

## Audit Categories

- Core flow: can the user complete onboarding -> generate -> view -> export?
- Configuration: required env vars, mock mode, database setup, and helpful failure messages.
- Data integrity: profile/resume shape, persistence mapping, and no fabricated AI content.
- Error states: empty profile, invalid job description, AI validation failure, missing resume, export failure.
- Cost control: mock provider default, no accidental paid API calls, and clear switch to real AI.
- Deployment risk: build/type/lint status, server-only code boundaries, and secrets not committed.

## Output

Return:

1. MVP status: `ready`, `not ready`, or `unknown`.
2. Blockers: issues that stop the core loop.
3. Next fixes: small ordered tasks to reach MVP.
4. Verification run: commands/checks performed and results.
5. Nice-to-have later: useful improvements that should not block MVP.
