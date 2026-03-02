# PeerPull - CLAUDE.md

## Project Overview

PeerPull is a peer-to-peer feedback exchange platform for indie builders, founders, and makers. Users give video reviews to earn credits (PeerPoints), then spend credits to receive feedback on their own products. Built during a hackathon week (March 2026).

**Core mechanic:** Credit-based exchange — give a video review → earn points → spend points to request feedback.

## Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components, Server Actions) + React 19
- **Language:** TypeScript 5.7 (strict mode)
- **Styling:** TailwindCSS 3.4 + shadcn/ui (Radix UI primitives)
- **Database/Auth/Storage:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Icons:** Lucide React
- **Charts:** ApexCharts via react-apexcharts
- **Fonts:** Inter (body), Montserrat (headings)

## Commands

```bash
npm run dev      # Start dev server (uses .next-dev dir)
npm run build    # Production build (uses .next dir)
npm run start    # Start production server
```

No test framework is configured.

## Project Structure

```
app/
├── (auth-pages)/          # Public auth routes (signin, signup, forgot-password)
├── (protected)/           # Authenticated routes (gated by middleware)
│   └── dashboard/         # Main app: request-feedback, submit-feedback, peerpoints, profile, admin, etc.
├── (public)/              # Landing page
├── actions.ts             # ALL server actions (~400 lines)
├── globals.css            # Global styles & custom animations
└── layout.tsx             # Root layout (fonts, SidebarProvider, dark theme)

components/
├── ui/                    # shadcn/ui base components (button, card, badge, input, etc.)
├── protected/dashboard/   # Dashboard-specific components
├── public/                # Landing page components (Hero, Navbar)
├── auth/                  # SignUpForm, SignInForm
├── feedback/              # Screen recorder components
├── form/                  # Form elements (inputs, dropzone, etc.)
├── dashboard-layout/      # AppHeader, AppSidebar, DashboardShell
└── charts/                # ApexCharts wrappers

context/                   # React contexts (SidebarContext, ThemeContext)
hooks/                     # Custom hooks (useScreenRecorder, useModal)
lib/utils.ts               # cn() utility (clsx + tailwind-merge)
utils/supabase/            # Supabase client helpers (server.ts, client.ts, middleware.ts)
supabase/migrations/       # Timestamped SQL migration files
docs/                      # PRD, design docs, economic simulation docs
```

## Key Patterns & Conventions

### Data Flow
- **Server Components by default** — data fetching in layouts and pages
- **Server Actions for all mutations** — all form submissions go through `app/actions.ts`
- **FormData → Supabase operation → encodedRedirect()** is the standard action pattern

### Database & Security
- **RLS on all tables** — users can only access their own data
- **SECURITY DEFINER RPCs** for sensitive economy operations (point transfers, queue assignment)
- **Cookie-based sessions** via `@supabase/ssr` — no client-side JWT storage
- **FIFO queue** with `SKIP LOCKED` for fair review assignment
- **System settings** stored in `system_settings` table (key/value) for runtime config

### Styling
- **Dark mode by default** — `dark-bg`, `dark-card`, `dark-surface`, `dark-text`, `dark-border` color tokens
- **Gold accent on public pages** — `blue-primary` (#d4a853), `teal-accent` (#e8c778)
- Use `cn()` from `lib/utils` for conditional class merging
- Mobile-first responsive design with Tailwind utilities

### Components
- shadcn/ui components live in `components/ui/`
- Use existing shadcn/ui components before creating custom ones
- Dashboard layout: AppHeader + AppSidebar + DashboardShell + DashboardContent

### Imports
- Path alias: `@/*` maps to project root (e.g., `@/components/ui/button`)

### Naming
- Files: kebab-case for utilities, PascalCase for React components
- Database: snake_case for tables and columns
- TypeScript: camelCase for variables/functions, PascalCase for types/interfaces

## Key Files

| File | Purpose |
|------|---------|
| `app/actions.ts` | All server actions (auth, feedback, reviews, points) |
| `utils/supabase/server.ts` | Server-side Supabase client creation |
| `utils/supabase/client.ts` | Browser-side Supabase client creation |
| `utils/supabase/middleware.ts` | Session refresh + route protection logic |
| `middleware.ts` | Next.js middleware entry point |
| `hooks/useScreenRecorder.ts` | Video recording logic (MediaRecorder API) |
| `context/SidebarContext.tsx` | Sidebar state management |
| `utils/supabase/settings.ts` | System settings helpers (getSettings, getSetting) |
| `.claude/PRD.md` | Full product requirements document |

## Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (name, avatar, expertise, peer_points_balance, referral_code) |
| `feedback_requests` | Submitted products requesting feedback (title, url, status) |
| `reviews` | Video reviews (video_url, duration, rating, status) |
| `peer_point_transactions` | Point ledger (earned_review, spent_submission, etc.) |
| `system_settings` | Runtime config (signup_bonus, review_reward, min_video_duration, etc.) |
| `referrals` | Referral tracking and bonuses |

## Important Notes

- **No tests configured** — hackathon project, no vitest/jest setup
- **TS errors ignored on build** — `ignoreBuildErrors: true` in next.config.ts
- **Windows dev workaround** — dev uses `.next-dev`, prod uses `.next` to avoid lock conflicts
- **Terminology migration** — "Pull Request" is being renamed to "Feedback Request" across the codebase
- **OAuth buttons are placeholders** — Google/GitHub login not functional yet
- **Video duration** — configurable via system_settings (60-300 seconds range)
