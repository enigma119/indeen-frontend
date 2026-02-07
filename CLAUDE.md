# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Indeen is an Islamic mentoring platform connecting mentors (teachers of Quran, Tajweed, Arabic) with mentees (students). This is the Next.js 16 frontend that communicates with a separate backend API.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router and React Compiler
- **State Management**: Zustand (stores) + TanStack React Query (server state)
- **Styling**: Tailwind CSS 4 with custom color palette (primary navy, accent gold)
- **UI Components**: Radix UI primitives with shadcn/ui
- **Auth**: Supabase Auth (SSR)
- **API Client**: Axios with automatic Supabase token injection
- **Forms**: React Hook Form + Zod validation
- **Video Calls**: Daily.co integration

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, signup, reset-password)
│   ├── (dashboard)/       # Authenticated user pages (profil, sessions, favoris)
│   ├── (marketing)/       # Public landing pages
│   ├── (onboarding)/      # Multi-step onboarding flows for mentors/mentees
│   ├── mentors/           # Mentor search and profile pages
│   └── sessions/          # Session booking and video meeting pages
├── components/
│   ├── ui/                # Reusable shadcn/ui components
│   ├── auth/              # Auth-related components (guards, dialogs)
│   ├── booking/           # Session booking flow components
│   ├── meeting/           # Daily.co video call components
│   ├── mentors/           # Mentor cards, profiles, comparison
│   ├── onboarding/        # Onboarding form steps
│   └── sessions/          # Session management components
├── hooks/                  # Custom React hooks (use-auth, use-sessions, etc.)
├── lib/
│   ├── api/               # API client modules (client.ts is the base axios client)
│   ├── supabase/          # Supabase client (client.ts for browser, server.ts for SSR)
│   ├── validations/       # Zod schemas
│   └── constants/         # App constants (timezones, specialties, etc.)
├── providers/             # React context providers (auth, query)
├── stores/                # Zustand stores (auth, booking, search-filters, etc.)
└── types/                 # TypeScript type definitions
```

### Key Patterns

**API Communication**: All backend calls go through `src/lib/api/client.ts` which auto-injects Supabase auth tokens.

**Auth Flow**: Supabase handles auth, `useAuth` hook syncs with backend to get full user profile, `useAuthStore` provides global state.

**Type Naming**: Backend uses camelCase for API responses. Main types are in `src/types/index.ts`.

**Route Groups**: App Router uses route groups `(auth)`, `(dashboard)`, `(marketing)` for layout separation.

**Component Exports**: Feature folders use `index.ts` barrel files for exports.

### Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_API_URL=         # Backend API URL
NEXT_PUBLIC_SUPABASE_URL=    # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase anon key
```

### User Roles
- `MENTOR` - Teachers offering sessions
- `MENTEE` - Students booking sessions
- `ADMIN` - Platform administrators
- `PARENT` - Parents managing child accounts

### Language
The UI is in French. Keep user-facing strings in French when adding features.
