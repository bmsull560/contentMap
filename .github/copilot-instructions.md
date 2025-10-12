# Copilot Instructions for contentMap

## Project Overview
- **contentMap** is a React + TypeScript web application, using Vite for build tooling and Tailwind CSS for styling.
- The `src/` directory contains all application code, with `components/` for UI and feature modules, and `lib/` for utility and integration logic.
- Supabase is used for backend/database integration, with types and client setup in `src/lib/supabase.ts` and `src/lib/database.types.ts`.
- Database schema migrations are tracked in `supabase/migrations/` as SQL files.

## Key Patterns & Architecture
- **Component Structure:** Each major feature is a React component in `src/components/`. Example: `ContentAudit.tsx`, `AuditReport.tsx`.
- **Data Flow:** Data is fetched and managed via Supabase client in `lib/`, then passed to components as props or via hooks.
- **Styling:** Tailwind CSS is configured in `tailwind.config.js` and used via utility classes in `.tsx` and `.css` files.
- **Type Safety:** TypeScript is enforced throughout. Shared types for database entities are in `lib/database.types.ts`.

## Developer Workflows
- **Install dependencies:** `npm install`
- **Start dev server:** `npm run dev`
- **Build for production:** `npm run build`
- **No explicit test setup** detected; add tests in `src/` if needed.
- **Supabase migrations:** Add SQL files to `supabase/migrations/` and apply via Supabase CLI or dashboard.

## Conventions & Integration
- **Component Naming:** Use PascalCase for React components.
- **File Organization:** Group by feature in `components/`, keep integrations in `lib/`.
- **External Services:** All backend/database access is via Supabase; do not access databases directly from UI components.
- **Configuration:**
  - Vite: `vite.config.ts`
  - TypeScript: `tsconfig*.json`
  - Tailwind: `tailwind.config.js`, `postcss.config.js`

## Examples
- To add a new feature, create a new component in `src/components/` and connect to Supabase via `lib/supabase.ts`.
- To update the schema, add a migration SQL file in `supabase/migrations/` and update types in `lib/database.types.ts`.

---

For questions about project structure or conventions, see this file or `README.md`.