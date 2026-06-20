This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Create `.env.local` from `.env.example`. Use `AI_PROVIDER=mock` to generate resumes locally without paid AI calls. Use `AI_PROVIDER=anthropic` with `ANTHROPIC_API_KEY` when you want to call Claude.

## Database Setup

This app persists profiles and resumes with Prisma against Supabase Postgres.

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Set `DATABASE_URL` to the Supabase Postgres connection string.
4. Keep `DATABASE_SSL_REJECT_UNAUTHORIZED=true` unless you are intentionally debugging a local/self-signed connection.
5. Create the database tables:

```bash
npm run db:generate
npm run db:push
```

`npm run db:push` is the current MVP setup path. Before production deployment, prefer adding a Prisma migration and applying it through your deployment workflow.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
