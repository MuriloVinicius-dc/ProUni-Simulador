# Copilot project instructions for ProUni-Simulador (frontend)

Use this as a quick-start map to work productively in this repo. Keep advice concrete and specific to this codebase.

## Big picture
- Stack: React 18 + Vite + Tailwind CSS + Radix UI primitives (shadcn-style flavor), icons via lucide-react.
- Routing: HashRouter (react-router-dom v6). Hash routing is required for GitHub Pages; never switch to BrowserRouter unless hosting changes.
- Build/deploy: Vite outputs to `docs/` and GitHub Pages publishes that folder. `vite.config.js` sets `base: "/ProUni-Simulador/"`.
- Data & persistence boundary: `src/entities/Simulacao.jsx` now supports Supabase persistence (table `simulacoes`) when env keys exist, otherwise falls back to localStorage DEMO MODE. Supabase config lives in `src/lib/supabase.js` (detects missing `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`).
- Optional external API (FastAPI): A separate Python API (directory `Banco + API/` plus duplicated `db/`) is consumed via lightweight service wrappers `src/services/{authService, simulacaoService}.js` using a generic HTTP client in `src/lib/api.js` when `VITE_USE_REAL_API === 'true'` (AuthContext toggles between Supabase and this API).
- Domain flow: The simulation page (`src/pages/Simulacao/index.jsx`) runs a 3-step wizard — formulario → processamento (animated ~3s timeout) → resultado — then persists the simulation via the entity.

## Conventions and patterns
- Path alias: Use `@/` (configured in `vite.config.js`). Prefer alias imports over deep relative paths.
- Routing helpers: `createPageUrl(name)` from `src/utils/index.jsx` (e.g. `createPageUrl("Simulacao")` → "/Simulacao"). Used in `src/layout.jsx` navigation.
- Theming: Dark mode toggle via `src/components/ui/theme-toggle.jsx`. Any new component should support `dark:` classes gracefully.
- UI primitives: Centralized in `src/components/ui/` — reuse before adding bespoke variants. Follow existing prop patterns.
- Feature structure: Pages in `src/pages/`; flow-specific subcomponents in `src/components/<feature>/`; persistence/domain logic in `src/entities/`; remote/server access in `src/services/`.
- Data: Historical CSV `pda-prouni-2017.csv/` remains unused; if integrated, wrap parsing behind a new entity/service layer (do not import into UI directly).

## Key files to know
- Entry: `src/main.jsx`, `src/App.jsx`, `src/layout.jsx`.
- Auth: `src/contexts/AuthContext.jsx` (switches Supabase vs FastAPI mode), `src/lib/supabase.js` (demo detection), `src/services/authService.js` (FastAPI endpoints).
- Simulation flow UI: `src/pages/Simulacao/index.jsx`, `src/components/simulacao/{FormularioSimulacao,ProcessamentoSimulacao,ResultadoSimulacao}/index.jsx`.
- Domain/persistence: `src/entities/Simulacao.jsx` (Supabase or localStorage fallback).
- Services layer: `src/services/simulacaoService.js` (FastAPI integration examples), generic HTTP in `src/lib/api.js`.
- Utilities: `src/utils/index.jsx` (routing helper), `src/lib/utils.jsx` (`cn` Tailwind merge).
- Styling & config: `tailwind.config.js`, `postcss.config.js`, `vite.config.js` (alias, base, outDir), `index.css`.
- Deployment workflows: `.github/workflows/deploy.yml` and `.github/workflows/pages-deploy.yml` both publish `docs/` on push to `main`.

## Build, run, and deploy
- Install deps: `npm ci`
- Run dev: `npm run dev`
- Build (writes to `docs/`): `npm run build`
- Preview production build: `npm run preview`
- Deploy: Push changes to `main` (workflows auto-publish). If repo name changes, adjust `base` in `vite.config.js` to avoid broken asset paths.
- Environment variables (optional features):
  - `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` → enable real Supabase; absence triggers DEMO MODE (localStorage + console warning).
  - `VITE_USE_REAL_API=true` → AuthContext uses FastAPI services (`src/lib/api.js` base URL via `VITE_API_URL`, default `http://localhost:8000`).
  - `VITE_API_URL` → overrides FastAPI base; if unset, local dev expects backend on `http://localhost:8000`.

### Running the FastAPI backend (optional)
- Windows (PowerShell): use `./start-api.ps1` from repo root. It sets up venv, installs `Banco + API/requirements.txt`, and runs the server on `http://localhost:8000`.
- Manual run: create a venv; install `-r "Banco + API/requirements.txt"`; run `uvicorn "Banco + API.main":app --reload --port 8000`.
- Frontend toggle: set `VITE_USE_REAL_API=true` and (optionally) `VITE_API_URL=http://localhost:8000`.

## How routing works (important)
- HashRouter retains deep links on GitHub Pages by putting routes after a hash segment. Inside the app location.pathname excludes that hash portion.
- Always include a leading slash in each Route path and in links produced by createPageUrl.
- Adding a page:
  1. Create `src/pages/<Name>/index.jsx` (follow existing page pattern).
  2. Optionally add to `src/pages/index.js` barrel.
  3. Add `<Route path="/Name" element={<Name/>} />` inside `App.jsx` routes.
  4. Link via `<Link to={createPageUrl("Name")}>`.

## Simulation logic snapshot
- Current `calcularResultado(dados)` (inside `src/pages/Simulacao/index.jsx`) computes the simple average of five ENEM area scores (LC, MT, CH, CT, redação) and compares to `dados.nota_minima` to mark `selecionado`. (Note: the form does NOT yet collect `nota_minima`; see Gotchas.)
- A mock number of `vagas` (10) and a pseudo-rank `posicao` are generated (randomized within or beyond vacancy range).
- Result object adds hardcoded fields (`ingresso`, `link_instituicao`) before persisting.
- Processing step: artificial delay (~3000ms via `setTimeout`) with animated progress handled in `ProcessamentoSimulacao`.

## Data entry form notes
- `FormularioSimulacao` now focuses on per-area ENEM scores (`nota_ct`, `nota_ch`, `nota_lc`, `nota_mt`, `nota_redacao`) plus course metadata (instituição, curso, grau, turno, modalidade). Previous socio-economic fields (idade, renda, escola pública etc.) were removed.
- Estado/município selection exists but municipality is cleared when state changes; municipality is currently optional (validation only flags missing scores & course metadata).
- All scores must be 0–1000; validation enforces bounds.

## Adding features safely
- Persist new simulation-related data through the entity layer (`src/entities/Simulacao.jsx`). Extend the record schema consistently (add new columns in Supabase or adapt localStorage shape). Provide graceful degradation when Supabase unavailable.
- Remote integrations: Add new FastAPI endpoints through dedicated service modules under `src/services/` (follow existing `authService` / `simulacaoService` patterns). Keep UI components ignorant of fetch details.
- Auth: Respect dual-mode. In FastAPI mode store lightweight user object in `localStorage` (as done). In Supabase mode rely on `supabase.auth` session. Feature code should branch only inside AuthContext or service layer, not deep inside components.
- Reuse `ui/` primitives and `cn` helper for consistent styling; keep dark mode classes.
- Maintain hash-based routing & Vite `base` configuration.
- If integrating historical CSV data, do it behind a new `entities/HistoricoProuni.js` or `services/historicoService.js` loader to avoid blocking rendering.

## Examples
- Link to Simulação: `import { createPageUrl } from "@/utils"; <Link to={createPageUrl("Simulacao")} />`
- Persist simulation: `import { Simulacao } from "@/entities/Simulacao"; await Simulacao.create(data);`
- Call FastAPI (auth): `import { authService } from "@/services/authService"; await authService.login(email, senha);`
- Generic API GET: `import { api } from "@/lib/api"; const cursos = await api.get('/cursos');`
- Alias import: `import { Button } from "@/components/ui/button"`

## Gotchas
- Repo rename requires updating `vite.config.js` `base` or assets 404 on GitHub Pages.
- Switching to `BrowserRouter` will break deep links on GitHub Pages.
- Supabase DEMO MODE: Absence of Supabase env vars yields mock client; attempts to sign in will throw explicit demo errors. Guard flows accordingly.
- FastAPI mode (`VITE_USE_REAL_API=true`): AuthContext stores user in `localStorage`; ensure logout clears it.
- Simulation mismatch: `calcularResultado` expects `nota_minima` but the form does not collect it — either add a "nota mínima de corte" input (persist and use) or adjust logic to compute eligibility differently.
- Random ranking: `posicao` is synthetic; don’t present it as authoritative without sourcing real cutoff data.
- Don’t import from `pda-prouni-2017.csv/` directly in UI; wrap parsing logic behind service/entity to keep components lean and allow future caching.
- Keep environment-sensitive code (Supabase vs API) centralized; avoid sprinkling `isDemo` or `USE_REAL_API` checks across many components.
