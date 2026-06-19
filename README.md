# Lantern

Lantern is a private journaling app built with Next.js and Supabase. It includes magic-link login, entry writing, calendar browsing, and account settings in a warm dark interface.

## Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Create `.env.local` with your Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Deploy

Deploy on Vercel and add the same Supabase environment variables in the project settings.
