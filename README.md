# Lantern

Lantern is a private journaling app for quiet thoughts, memories, and daily reflection. It's built as a warm, distraction-free space to write, with a calendar view to browse past entries and a writing prompt feature for days when you don't know where to start.

## Features

- **Magic-link authentication** — no passwords, just a secure sign-in link sent to your email via Supabase Auth.
- **Journal entries** — write entries with a lightweight markdown-style editor (bold, italics, headings, lists), attach images, and tag entries for easy filtering.
- **Random writing prompts** — stuck on what to write? A rotating writing cue on the new entry page offers a fresh prompt with one click, and you can drop it straight into your entry.
- **Dashboard** — browse, search, and revisit all your entries at a glance, auto-tagged by theme (gratitude, memories, career, life).
- **Calendar view** — see which days you journaled and jump straight to that day's entries.
- **Responsive layout** — a sidebar on desktop that becomes a bottom tab bar on mobile, so it's just as usable on your phone as your laptop.
- **Account settings** — manage your account and log out.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) for styling
- [Supabase](https://supabase.com/) for authentication and the entries database
- [react-calendar](https://github.com/wojtekmaj/react-calendar) for the calendar view

## Run Locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Create `.env.local` in the project root with your Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in your Supabase project under **Project Settings → API**.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # build for production
npm run start    # run the production build
npm run lint     # lint the codebase
```

## Deploy

Deploy on [Vercel](https://vercel.com/) and add the same Supabase environment variables in the project settings.
