<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-rules -->
# Project: job-fit-resume-builder

## Stack
- Next.js 15+ (App Router only — no Pages Router)
- Tailwind CSS v4 (config is in CSS, not tailwind.config.ts)
- TypeScript strict mode
- Anthropic Claude API for AI features

## Critical rules for AI agents

### Next.js
- Always use App Router conventions (`layout.tsx`, `page.tsx`, `loading.tsx`)
- Never use `getServerSideProps`, `getStaticProps`, or `pages/` — those are Pages Router (old)
- Default to Server Components — only add `"use client"` when truly needed
- API routes go in `src/app/api/[route]/route.ts` and export named functions (GET, POST...)

### Tailwind
- v4 syntax — use `@import "tailwindcss"` in CSS, not `@tailwind base/components/utilities`
- Theme customization goes in CSS via `@theme {}`, not in a config file

### AI layer
- All Anthropic SDK calls go through `src/lib/ai/` only
- Never call the API directly from components or pages
- Prompts live in `src/lib/ai/prompts.ts`
- Never fabricate or invent user experience — only use real profile data

### Code style
- No `any` in TypeScript
- Named exports for components, default exports for pages only
- Run `npm run lint` and `npm run type-check` before finishing any task
<!-- END:project-rules -->