# Zoosh Movies

Zoosh Movies is a Vite + React application for exploring The Movie Database (TMDB) content.
It provides fast search, detailed movie pages with Wikipedia summaries, and a built-in flow for browsing similar titles.

## Highlights
- GraphQL-powered search with Apollo Client and persistent cache.
- Detail panel that fetches Wikipedia summaries with smart fallbacks.
- Switching between search results and related movies.
- Material UI theming with a reusable color palette and subtle glow accents.
- Full i18n pipeline through `react-i18next` ready for additional locales.
- Comprehensive Vitest coverage for components, services, and GraphQL queries.

## Tech Stack
- React 18 with TypeScript
- Vite 5 for development and builds
- Apollo Client for GraphQL
- Material UI (MUI) theming and components
- `react-i18next` for translations
- Vitest + Testing Library for unit and integration tests

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` (or `.env.local`) file containing the API target you want to hit. Optionally add your Smartlook key to enable session replay analytics.
   ```bash
   VITE_API_TARGET=...
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Visit the app at `http://localhost:5173` or the hosted demo at [https://zoosh-movies.vercel.app/](https://zoosh-movies.vercel.app/).

## Available Scripts
- `npm run dev` – start the Vite dev server.
- `npm run build` – create an optimised production build in `dist/`.
- `npm run preview` – preview the production build locally.
- `npm run test` – run the Vitest suite once.
- `npm run test:coverage` – run tests and generate coverage reports (text + HTML in `coverage/`).

## Testing & Coverage
Vitest is configured with Testing Library, JSDOM, and custom mocks for Apollo Client and i18n. 
Tests cover the UI flow from search to related movies, theme configuration, GraphQL query documents, and the Wikipedia service.

Latest coverage report (`npm run test:coverage`):

| Metric     | Percentage |
|------------|------------|
| Statements | 94.99%     |
| Branches   | 82.94%     |
| Functions  | 100%       |
| Lines      | 94.99%     |

The HTML report is emitted to `coverage/index.html`. Open it in a browser for file-by-file detail.

## Internationalisation
Translations live in `src/i18n/translations.ts`. New keys can be added there and consumed through the `useTranslation` hook exported by `src/i18n/i18n.ts`. The default language is English, and the system is ready for extension with additional locales.

## Analytics
 Session replay is powered by [Smartlook](https://www.smartlook.com/). 