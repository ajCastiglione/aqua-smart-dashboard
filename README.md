# AquaSmart Customer Dashboard

Read-only React + TypeScript SPA for the AquaSmart REST API: customer list with live telemetry columns and a per-customer detail view (temperature chart, PSI/GPM, pump schedules).

## Prerequisites

- **Node.js 24** (recommended). The repo includes [`.nvmrc`](.nvmrc) with `24` — run `nvm use` (or `fnm use`) before installing. Vite 8 expects a current Node LTS.

## Setup

```bash
cd aquasmart-dashboard
nvm use   # reads .nvmrc → Node 24
npm install
cp .env.example .env
```

If `vite build` fails with **Cannot find native binding** / `@rolldown/binding-*` (npm optional-dependency issue), remove `node_modules` and the lockfile, ensure Node **24** (`node -v`), then run `npm install` again.

Set `VITE_API_BASE_URL` in `.env` to your API root including `/api`, for example:

`VITE_API_BASE_URL=http://67.227.250.127:8080/api`

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — typecheck and production build
- `npm run preview` — serve the production build locally
- `npm run lint` — ESLint
- `npm run test` — Vitest (watch mode)
- `npm run test:run` — Vitest single run (CI)
- `npm run test:run -- --coverage` — coverage report (V8)

## API reference

OpenAPI 3.0 document (copy of the Swagger export) lives at [`docs/openapi.json`](docs/openapi.json). Live docs: `http://67.227.250.127:8080/docs` (when the server is reachable).

## Data flow (summary)

- **Customer list (`/`)** — `useCustomerProfiles` → paginated `GET /customer-profiles`. For each row on the current page, `useQueries` runs `fetchCustomerRowMetrics`, which in parallel calls `GET` **customer-alerts**, **customer-pressure-data**, **customer-flow-rate-data**, and **customer-temp-data** for that customer (latest readings + open alert count drive columns and status).
- **Customer detail (`/customers/:customerNumber`)** — `useCustomerProfile` plus telemetry hooks (pressure, flow, temp), `useCustomerPumpCyclesByCustomer` (pump schedule list), and optional `useVendorProfile` / `useSerialNumber` when the profile includes vendor and serial. **Alerts are not fetched on the detail page** (only via list row metrics).

**Performance note:** The list is **O(rows × 4)** HTTP calls per page (no batch API). TanStack Query caches row metrics for 5 minutes, but opening a customer detail still refetches pressure/flow/temp under **different** query keys than the aggregated row metric — expected tradeoff for this prototype. Routes are **lazy-loaded** to keep the initial bundle smaller (Recharts loads with the detail chunk).

## Stack

- Vite 8, React, TypeScript (strict)
- React Router v6
- TanStack Query v5, Axios
- Tailwind CSS v3, SCSS modules for global background helpers (`src/styles/global.scss`)

## Project layout

- `src/api/` — Axios instance, typed endpoints, `src/api/types/`
- `src/hooks/queries/` — `use*` hooks per GET resource
- Unit tests — colocated `*.test.ts` / `*.test.tsx`; API, hooks, `src/utils/` (e.g. status derivation), UI under `src/components/`
- `src/pages/` — route-level pages
- `src/components/` — layout, UI primitives, feature blocks

## Quality bar (prototype)

- TypeScript **strict**, no `any` for API data
- Server state via **TanStack Query** only (no duplicate loading/error `useState` for fetches)
- **Vitest** + Testing Library: API contracts, hooks, UI components, key utils, and route-level page smoke tests (`src/pages/*.test.tsx`)
- Loading / error / empty states on data surfaces; **Retry** uses query `refetch`

## CI

On GitHub, **push** and **pull_request** to `main` / `master` run [`.github/workflows/ci.yml`](.github/workflows/ci.yml): `npm ci`, `npm run lint`, `npm run test:run`, `npm run build` (Node version from [`.nvmrc`](.nvmrc)).

## Deploy to GitHub Pages

Workflow: [`.github/workflows/deploy-github-pages.yml`](.github/workflows/deploy-github-pages.yml). It runs on **push** to `main` / `master` and on **workflow_dispatch** (manual run).

1. In the repository: **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
2. After the first successful run, the site is available at **`https://<owner>.github.io/<repository-name>/`** (project site). The build sets `VITE_BASE_PATH=/<repository-name>/` so asset URLs and React Router match that path.
3. **API URL in production:** add a repository secret **`VITE_API_BASE_URL`** (same value you use locally, e.g. `https://your-host:8080/api`) under **Settings → Secrets and variables → Actions**. The deploy workflow passes it into `npm run build`. Without it, the app still builds but API calls will fail until the secret is set.

**User/org site (`username.github.io` repo):** Pages lives at the domain root, so the app must be built with `VITE_BASE_PATH=/`. Adjust the workflow env for that repo (or use a dedicated variable) instead of `/<repository-name>/`.

The workflow copies `dist/index.html` to `dist/404.html` so **direct loads** of client-side routes (e.g. `/customers/123`) work on GitHub Pages.
