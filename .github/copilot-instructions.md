# Copilot project instructions for ProUni-Simulador (frontend)

Use this as a quick-start map to work productively in this repo. Keep advice concrete and specific to this codebase.

## Big picture
- Stack: React 18 + Vite + Tailwind CSS + Radix UI primitives (shadcn-style), icons via lucide-react.
- Routing: HashRouter (react-router-dom v6). Hash routing is required for GitHub Pages; never switch to BrowserRouter unless the hosting changes.
- Build/deploy: Vite builds to `docs/` and GitHub Pages serves from there. The repo-wide `vite.config.js` sets `base: "/ProUni-Simulador/"`.
- Data model: No backend. The mock entity `src/entities/Simulacao.jsx` persists to `localStorage` (create/findAll/findById). Treat it as the persistence boundary.
- Domain flow: The simulation page (`src/pages/Simulacao.jsx`) orchestrates a 3-step flow — formulario → processamento (fake progress) → resultado — and encapsulates the eligibility scoring logic.

## Conventions and patterns
- Path alias: Import app code with `@/` (alias to `./src` in `vite.config.js`). Prefer alias imports over relative paths.
- Routing helpers: Use `createPageUrl(name)` from `src/utils/index.jsx` to build route paths (e.g., `createPageUrl("Simulacao")` → "/Simulacao"). Menu links in `src/layout.jsx` rely on this.
- Theming: Tailwind dark mode is toggled via `ThemeToggle` component in `src/components/ui/theme-toggle.jsx`; keep UI additions compatible with dark classes.
- UI primitives: Buttons, inputs, cards, etc., live in `src/components/ui/`. Reuse them instead of adding new one-off components.
- Pages vs components: Top-level screens are under `src/pages/`. Feature-specific building blocks are under `src/components/<feature>/` (e.g., `components/simulacao/*`).
- Data: Historical CSV `pda-prouni-2017.csv/` exists but isn’t wired. Current logic is heuristic scoring inside the page; external data access would happen behind `entities/`.

## Key files to know
- Entry: `src/main.jsx`, `src/App.jsx`, `src/layout.jsx`.
- Simulation flow: `src/pages/Simulacao.jsx`, `src/components/simulacao/{FormularioSimulacao,ProcessamentoSimulacao,ResultadoSimulacao}.jsx`.
- Domain/persistence: `src/entities/Simulacao.jsx` (localStorage CRUD).
- Utilities: `src/utils/index.jsx` (routing), `src/lib/utils.jsx` (Tailwind class merge helper `cn`).
- Config: `vite.config.js` (alias, base, outDir), `tailwind.config.js`, `postcss.config.js`.
- Deploy workflows: `.github/workflows/deploy.yml` (peaceiris) and `.github/workflows/pages-deploy.yml` (GitHub Pages official). They both publish `docs/` on push to `main`.

## Build, run, and deploy
- Install: `npm ci`
- Dev server: `npm run dev`
- Build (outputs to `docs/`): `npm run build`
- Preview: `npm run preview`
- Deploy: Push to `main`. Pages will publish the latest `docs/` via the configured workflows. If the repo name changes, update `base` in `vite.config.js` or remove it.

## How routing works here (important)
- Because we use `HashRouter`, URLs render as `/#/Dashboard`, but inside the app `location.pathname` is "/Dashboard" — that’s why `createPageUrl` returns leading slashes.
- When adding new pages:
  1) Create `src/pages/<Name>.jsx`
  2) Add `<Route path="/Name" element={<Name/>} />` in `src/App.jsx`
  3) Link via `to={createPageUrl("Name")}`

## Eligibility logic snapshot
- `src/pages/Simulacao.jsx` contains `calcularElegibilidade(dados)` with weights for renda per capita, ENEM score, public school, age, and disability, bounded to 100. If you change scoring rules, keep UI explanations in `ResultadoSimulacao.jsx` consistent.
- The processing step is time-based (setTimeout ~3s) and animated progress in `ProcessamentoSimulacao.jsx`.

## Data entry form notes
- `FormularioSimulacao.jsx` validates required fields (idade, sexo, raca, nota_enem, tipo_escola; municipio if estado set). Renda/membros are currently commented out; if reintroduced, also update scoring and result details accordingly.
- Estado → Município is a dependent select; changing estado clears município.

## Adding features safely
- Persist anything user-facing through `entities/` first (even if localStorage), not directly in components. Mirror the `Simulacao` shape if you add new fields.
- Reuse `ui/` components and `cn` utility for styling. Keep dark mode classes in mind.
- Keep routes hash-based and `base` set in Vite to avoid broken Pages navigation.

## Examples
- Link to Simulação: `import { createPageUrl } from "@/utils"; <Link to={createPageUrl("Simulacao")} />`
- Use entity: `import { Simulacao } from "@/entities/Simulacao"; await Simulacao.create(payload);`
- Alias import: `import Button from "@/components/ui/button"`

## Gotchas
- Changing repo name without updating `vite.config.js` base will break asset paths on Pages.
- Switching to `BrowserRouter` will break deep links on GitHub Pages.
- Don’t import from `pda-prouni-2017.csv/` directly in the UI; if you wire it, do it behind a new `entities/` or `services/` layer to keep components thin.
