# Repository Guidelines

This guide keeps contributors aligned with how DSA Quiz Master is organized, built, and reviewed.

## Project Structure & Module Organization
- React + Vite + TypeScript app; entry at `src/main.tsx` mounting `src/App.tsx`.
- Reusable UI lives in `src/components/`; hooks in `src/hooks/`; shared utilities in `src/lib/`; type defs in `src/types/`.
- Styles: Tailwind 4 + local CSS in `src/main.css`, `src/index.css`, and component-level styles in `src/styles/`.
- Data/services: API helpers and quiz data live in `src/services/` and `src/database-enhancements.ts`.
- Static assets belong in `public/`; global docs in `docs/`; build artifacts output to `dist/` (gitignored).

## Build, Test, and Development Commands
- `npm run dev` — start the Vite dev server with fast HMR.
- `npm run build` — type-check via `tsc -b --noCheck`, then create a production build and copy `404.html` to `dist/`.
- `npm run preview` — serve the built app locally to verify the production bundle.
- `npm run lint` — run ESLint (flat config in `eslint.config.js`, permissive ruleset that keeps React hooks checks).
- `npm test` — run the Vitest suite once in jsdom; use `npm run test:watch` while iterating.

## Coding Style & Naming Conventions
- Language: TypeScript with React 19 functional components and hooks; prefer composition over inheritance.
- Formatting: follow ESLint defaults in this repo; use 2-space indentation and single quotes where practical.
- Naming: components in `PascalCase.tsx`, hooks as `useThing.ts`, helpers/utilities in `camelCase.ts`. Keep filenames aligned with exported symbols.
- Styling: favor Tailwind utility classes; keep bespoke styles co-located near components in `src/styles/` when utilities are insufficient.

## Testing Guidelines
- Vitest + React Testing Library are configured in `vite.config.ts` with shared setup at `src/setupTests.ts` (jest-dom + automatic cleanup).
- Place tests next to source files with `.test.ts(x)` naming (e.g., `component.test.tsx`) and mirror directory structure.
- Prefer user-centric assertions (`screen.getByRole`, `toHaveTextContent`) and minimal mocks; add fixtures close to the code they exercise.

## Commit & Pull Request Guidelines
- Commit frequently with small, focused changes; each commit should be reviewable and scoped to a single concern.
- Commit messages: use present-tense summaries (e.g., `Add quiz progress tracker`); reference issues/PRs with `#123` when applicable, mirroring existing history.
- Pull requests should include: concise summary, screenshots/GIFs for UI changes, notes on tests run (`npm run lint`, preview checks), and any known follow-ups.
- Keep PRs scoped to a single feature/fix; mention affected areas (components, services, styles) to ease review.

## Security & Configuration Tips
- Do not commit secrets; environment values should use `.env.local` with Vite `VITE_` prefixes as needed.
- Treat OAuth or API tokens as runtime config, not source code; verify that `public/` contains only non-sensitive assets.
