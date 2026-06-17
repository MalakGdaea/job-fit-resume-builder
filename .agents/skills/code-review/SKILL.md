---
name: code-review
description: Review this Next.js resume-builder project for bugs, regressions, missing validation, unsafe data flow, and production-readiness risks. Use when the user asks for a code review, asks to review a diff/commit/PR, or wants a risk-focused pass before committing, pushing, or launching.
---

# Code Review

Review as a senior engineer. Prioritize concrete defects over style preferences.

## Workflow

1. Inspect `git status --short` and the relevant diff before reading broad context.
2. Read the files touched by the diff and nearby call sites that could break.
3. Check project rules in `AGENTS.md` and follow the App Router, Tailwind v4, strict TypeScript, and AI-layer boundaries.
4. Run targeted searches for old imports, duplicate code paths, unchecked inputs, and direct AI/API calls outside `src/lib/ai`.
5. Run `npm run lint` and `npm run type-check` when code changed or when the review depends on TypeScript behavior.

## Review Focus

- Runtime bugs, broken imports, stale routes, invalid async/data flow, or unreachable states.
- API route behavior: input validation, status codes, persistence, error handling, and whether failures are actionable.
- AI safety: prompts in `src/lib/ai/prompts.ts`, SDK calls only through `src/lib/ai`, no fabricated resume data, and validated model output before saving.
- Data contracts: `src/types/profile.ts`, `src/types/resume.ts`, Prisma-backed storage mapping, and export assumptions.
- MVP risks: anything that prevents onboarding, generation, resume view, or export from working end to end.
- Tests or checks that are missing for risky changes.

## Output

Lead with findings, ordered by severity. For each finding include:

- file path and line number when possible
- why it is a real bug or risk
- what user-visible behavior could break
- the smallest practical fix

If there are no findings, say that clearly and mention any residual test gaps. Keep summaries brief and secondary.
