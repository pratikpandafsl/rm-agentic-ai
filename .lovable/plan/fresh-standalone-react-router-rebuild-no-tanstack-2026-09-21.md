# Fresh standalone React Router rebuild (no TanStack)

## Why this is needed
The live Lovable preview is pinned to the `tanstack_start_ts_current` template — every page is written against TanStack Router/Start. You need a **non-TanStack** app to integrate with the older .NET stack. This plan rebuilds a clean, standalone React Router + Vite + TypeScript SPA from scratch, using the **current preview as the source of truth**, then packages it as a downloadable ZIP. The Lovable preview itself stays untouched.

## What gets built
A brand-new project under `/tmp/rmapp-rebuild` (pure React Router, zero TanStack), then zipped to `/mnt/documents/rm-agentic-ai-react-router-rebuild.zip`.

### Stack (no TanStack anywhere)
- Vite + React 19 + TypeScript
- `react-router-dom` v7 (BrowserRouter + `<Routes>`/`<Route>`)
- Tailwind CSS v4 (`@tailwindcss/vite`) with the same oklch design tokens / sidebar / status colors copied verbatim from `src/styles.css`
- Zustand (persisted user store), `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`
- `@vitejs/plugin-react`, `vite-tsconfig-paths` for the `@/*` alias

### Entry & layout
- `index.html` (root) → `src/main.tsx` mounting `<AppProvider><TourProvider><BrowserRouter><AppRoutes/></BrowserRouter></TourProvider></AppProvider>`
- `src/App.tsx` defines all `<Route>` elements (mirrors the 16 current routes + a `*` 404)
- `src/components/AppLayout.tsx` ported 1:1, swapping TanStack `Link`/`useNavigate` for `react-router-dom` equivalents (`navigate(to)` instead of `navigate({ to })`)

### Ported verbatim (logic unchanged, only imports swapped)
- `src/data/tenants.ts`, `src/data/roles.ts`, `src/data/tour.ts` — copied as-is
- `src/lib/app-context.tsx`, `src/stores/use-user-store.ts`, `src/lib/auth.ts` — copied as-is (no TanStack imports)
- `src/lib/tour-context.tsx` — `useNavigate`/`navigate` swapped to react-router-dom
- `src/lib/use-protected-page.ts` — guard logic preserved; `navigate({ to: "/login" })` → `navigate("/login")`
- `src/components/TourOverlay.tsx`, `src/components/ui/button.tsx`, `src/lib/utils.ts` — copied as-is

### Page routes (16) → one file each under `src/pages/`
Overview, ProjectSetup, Rules, DataSources, MappingQuality, AgentConfiguration, WorkflowDesigner, PocRuns, AccountResults, NewPatterns, OutputFile, Hitl, Validation, AuditVersions, Simulate, Login. Each page body is the current component JSX, unchanged. The TanStack `head()` meta becomes a small `useDocumentHead({ title, description })` hook per page (sets `document.title` + meta/og tags) so SEO metadata is preserved without a dependency.

### Routing & auth behavior preserved
- Dummy Microsoft SSO → writes session + Zustand store → redirect to `/`
- Protected routes redirect to `/login` when no session
- Role-based menu: Role 4 sees only Overview, Validation Queue (HITL), Account Results, Validation History (Validation); Simulate limited to Role 1 (Super Admin)
- Tenant switcher (Mayo POC / FSL) swaps all screen data; tenant-dependent local state resets on switch
- Guided tour: 10 lifecycle steps, Prev/Next/Stop, blocks the screen until stopped, skips steps the role can't access, highlights the active sidebar item

### Config files
- `package.json`, `tsconfig.json`, `vite.config.ts`, `components.json`, `.gitignore`, `postcss` not needed (Tailwind v4 vite plugin)
- `README.md` with run instructions + IIS/ASP.NET SPA hosting note (web.config URL rewrite for BrowserRouter deep links)

## Verification
1. `bun install` then `bun run build` in `/tmp/rmapp-rebuild` — must succeed with zero TanStack in the dep tree (grep to confirm)
2. Serve the built `dist/` and drive Playwright through: SSO sign-in → Overview, tenant switch to FSL, Role 4 limited menu, blocked `/simulate`, CSV export on Output File, guided tour Prev/Next/Stop
3. ZIP `dist` + source (excluding `node_modules`), inspect entries, copy to `/mnt/documents/rm-agentic-ai-react-router-rebuild.zip`

## Not included
- No changes to the Lovable preview project itself
- No backend/API wiring (data stays in `tenants.ts`, ready for you to swap for real API calls later)
