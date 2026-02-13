# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the development server on localhost:3000
- `npm run build` - Build the application for production
- `npm start` - Start the production server

## Architecture Overview

This is a Next.js 14 application built with the App Router pattern, using Supabase for backend services and TailwindCSS for styling.

### Core Technologies
- **Next.js 14** with App Router (TypeScript)
- **Supabase** for authentication, database, and real-time features
- **TailwindCSS** with custom theme and shadcn/ui components
- **React Context** for state management (SidebarContext)

### Project Structure
- `app/` - Next.js App Router pages and layouts
  - `(auth-pages)/` - Authentication related pages
  - `(protected)/` - Protected routes requiring authentication
  - `(public)/` - Public facing pages
- `components/` - Reusable React components organized by feature
  - `ui/` - shadcn/ui base components
  - `dashboard-layout/` - Dashboard specific layout components
  - `auth/`, `tables/`, `charts/` etc. - Feature-specific components
- `utils/supabase/` - Supabase client configurations for different environments
  - `client.ts` - Client-side Supabase client
  - `server.ts` - Server-side Supabase client
  - `middleware.ts` - Middleware for session management
- `context/` - React Context providers (SidebarContext for UI state)
- `lib/utils.ts` - Utility functions including cn() for className merging

### Authentication Flow
- Uses Supabase Auth with cookie-based sessions
- Middleware (`middleware.ts`) handles session updates across all routes
- Auth utilities in `utils/supabase/` provide different client configurations
- Protected routes use route groups in `app/(protected)/`

### Styling System
- **Dark mode by default** - enforced at the root layout level
- Custom TailwindCSS theme with premium dark colors (blue-teal gradients)
- Typography system with custom font sizes (title-*, theme-*)
- shadcn/ui components configured in `components.json`
- Component path alias: `@/components` maps to `./components`
- Utils path alias: `@/lib/utils` maps to `./lib/utils`

### Key Configuration Notes
- TypeScript build errors are ignored in production (`ignoreBuildErrors: true`)
- SVG files are processed through @svgr/webpack for React components
- Middleware excludes static assets and images from session processing
- Path aliases use `@/*` pattern mapping to root directory

### Environment Setup
Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`