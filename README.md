# ESUN – Egyptian Students Union (Nişantaşı University)

Full-stack web app for the Egyptian Students Union at Nişantaşı University: landing, service hub, member portal, and admin panel.

## Tech stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS, Framer Motion  
- **Backend:** Supabase (Auth, Database, Storage)

## Brand

- **Background:** `#010101` (Obsidian)  
- **Text:** `#ffffff`  
- **Buttons/Actions:** `#a81123` (Inferno)  
- **Accents/Borders:** `#8c7656` (Desert Ash)  
- **Typography:** Helvetica (Bold headers, Regular body)

## Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Supabase**
   - Create a project at [supabase.com](https://supabase.com).
   - In the SQL Editor, run the contents of `supabase/schema.sql`.
   - In Authentication → URL Configuration, set Site URL and add redirect URL:  
     `http://localhost:3000/auth/callback`  
   - Optional: enable Email auth and confirm email (or disable for dev).

3. **Environment**
   - Copy `.env.example` to `.env.local`.
   - Set:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (for admin actions)
     - `ADMIN_EMAILS` – comma-separated list of admin emails (e.g. union heads).

4. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Features

- **Landing:** Hero with 3D pyramid, “Join the Union” scroll to registration, Our Story, Student Service Hub, Community (Instagram link), Contact.
- **Student Service Hub:** Academic Support, Cultural Activities, Religious/Social Guidance – each card opens an “Apply Now” modal (Name, Student ID 11 digits, Issue/Request). Submissions require login.
- **Auth:** Sign up / Log in with `@std.nisantasi.edu.tr` university email validation; signup stores name and student number in `profiles`.
- **Member portal (`/dashboard`):** Profile, Digital Union Card, Status Tracker (timeline of service requests: Pending, In Progress, Resolved).
- **Admin (`/admin`):** Protected by `ADMIN_EMAILS`. Manage applications (update status), view events. Events can be managed in Supabase or extended in the app.
- **Contact:** “Send Message” stores messages in `contact_messages`; optional mailer (e.g. Resend) can be added later.

## Project structure

- `src/app/` – Routes (home, login, signup, dashboard, admin, auth callback).
- `src/components/` – Layout (Nav), home sections, dashboard, admin UI, shared `TapButton`.
- `src/lib/` – Supabase client/server/admin, types.
- `supabase/schema.sql` – Tables and RLS (profiles, applications, events, contact_messages).

## Notes

- Middleware refreshes Supabase auth session; Next.js may show a deprecation notice for “middleware” in favor of “proxy” – you can migrate when ready.
- Instagram feed: currently a link to `@esu.nisantasi`; embed or API can be added later.
- Email confirmation: enable in Supabase if you want users to verify email before logging in.
