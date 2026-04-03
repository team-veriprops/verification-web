# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev             # Start dev server (port 3000)
pnpm build           # Production build
pnpm lint            # ESLint check
```

No test framework is configured.

## Architecture

**Veriprops** is a Next.js 16 (App Router) SaaS platform for property verification in Nigeria. It connects to a separate FastAPI backend via a Next.js API rewrite: all `/api/*` requests are proxied to `API_BASE_URL` (configured in `.env.local`).

### Routing

Three top-level route groups in `src/app/`:
- `(website)/` — public/marketing pages and auth flows
- `portal/` — authenticated user dashboard
- `admin/` — admin dashboard (protected)
- `api/` — Next.js API routes that proxy to or augment the backend

### Data Flow Pattern

Every feature follows a strict 4-layer pattern:

```
Component → Query Hook (React Query) → Service → FetchHttpClient
```

- **Service** (`[feature]-service.ts`): class with business logic, calls `this.http.get/post/patch/delete`
- **Store** (`use[Feature]Store.ts`): Zustand store that holds the service instance and persisted UI state
- **Query hook** (`use[Feature]Queries.ts`): returns typed `useQuery`/`useMutation` hooks that pull the service from the store
- **Component**: calls the query hook, renders data

New features should follow this pattern. Each feature's files live together in `src/components/[section]/libs/`.

### State Management

- **Client/UI state**: Zustand stores (`src/components/**/libs/use*Store.ts`). Persistent state uses `partialize` to selectively write to `localStorage`.
- **Server state**: TanStack React Query v5 with `placeholderData: (prev) => prev` for smooth pagination.

### HTTP Client

`src/lib/FetchHttpClient.ts` wraps native `fetch` with:
- Automatic CSRF token injection from cookies
- `X-TIMEZONE` / `X-LOCALE` headers
- 401 → token refresh + retry, then redirect to login
- 403 → `/403`, 419 → login redirect
- `AbortController` timeout (default 10 s, set in `src/lib/config/public.ts`)

### Forms

React Hook Form + Zod 4. Define a Zod schema, infer the type, pass to `useForm<T>({ resolver: zodResolver(schema) })`.

### UI Components

`src/components/3rdparty/` contains shadcn/ui wrappers over Radix UI. Use these before reaching for new dependencies. Tailwind CSS 4 with CSS-variable-based theme tokens (see `tailwind.config.ts`).

### Environment

| Variable | Side | Purpose |
|---|---|---|
| `API_BASE_URL` | server | Backend base URL for Next.js rewrite |
| `NEXT_PUBLIC_APP_NAME` | client | App display name |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | client | Google Maps |
| `NEXT_PUBLIC_MICROSOFT_CLARITY_PROJECT_ID` | client | Analytics |

Server-only config is in `src/lib/config/server.ts` (throws if imported on client).

### Path Aliases

Configured in `tsconfig.json` with `baseUrl: "src"`. Common aliases: `@app`, `@components`, `@lib`, `@stores`, `@hooks`.
