# AtlasRoute — React Context Travel Explorer

AtlasRoute is a responsive country-exploration SPA built with **React 19**, **Vite 7**, **React Router 7**, and **React Context**. The project demonstrates application-wide state management without prop drilling while preserving a full travel-explorer experience with country search, dynamic routes, live country data, photography, maps, saved destinations, theme preferences, and unit preferences.

## Homework Focus

This project was created for **Hillel React Homework 07 — React Context**.

The homework requirements are covered with:

- a Vite + React project;
- `src/context/AppContext.jsx` created with `createContext`;
- meaningful default Context values;
- an `AppProvider` wrapping the application router;
- Context data consumed through multiple levels of the component tree with `useContext` via `useAppContext()`;
- application-wide state shared without prop drilling;
- Context and UI components separated into dedicated files;
- targeted `React.memo`, `useMemo`, and `useCallback` optimization;
- automated tests for Context transitions, persistence, and unit conversion;
- deployment-ready SPA configuration for Vercel and GitHub Pages.

## React Context Architecture

Context is intentionally limited to state that is genuinely shared across distant parts of the application:

```text
AppProvider
├── theme: light | dark
├── unitSystem: metric | imperial
└── savedCountryCodes: string[]
     │
     ├── Header
     │   ├── ThemeToggle
     │   ├── UnitToggle
     │   └── SavedCountriesLink
     │
     ├── CountriesPage
     │   └── CountryCard
     │       └── SaveCountryButton
     │
     ├── CountryDetailsPage
     │   ├── AreaValue
     │   └── SaveCountryButton
     │
     └── SavedCountriesPage
         └── SavedCountriesGrid
```

The provider exposes:

- `toggleTheme()`
- `setUnitSystem()`
- `toggleSavedCountry()`
- `isCountrySaved()`
- `clearSavedCountries()`
- `savedCount`

Local concerns such as search input, pagination, form state, mobile-menu visibility, and route loading remain local or router-managed instead of being placed in Context.

## Context Features

### Light / Dark Theme

The theme is global, persists across reloads, and styles the full application rather than only the Home page. The responsive Header exposes a keyboard-accessible theme control.

### Metric / Imperial Units

Area units are stored in Context and rendered through deep `AreaValue` consumers. Changing `km²` / `mi²` updates multiple Country Details values without passing the preference through intermediate components.

The control uses native radio inputs, providing standard keyboard behavior and semantics.

### Saved Countries — My Atlas

Countries can be saved or removed from both catalogue cards and Country Details. Saved ISO country codes are stored globally and persist between sessions.

The `/saved` route provides:

- a responsive saved-country grid;
- a persistent Header counter;
- per-country remove actions;
- `Clear all`;
- an empty state with a link back to country discovery.

## State Persistence

Preferences are stored in `localStorage` under a versioned key:

```text
atlasroute:preferences:v1
```

Persisted state includes:

```text
theme
unitSystem
savedCountryCodes
```

Stored values are validated and normalized before being restored. Malformed storage falls back safely to default preferences.

## Optimization

The Context performance pass is deliberately targeted:

- Context actions use `useCallback` for stable references;
- Provider values and derived saved-country data use `useMemo`;
- no-op state transitions preserve object identity where possible;
- reusable leaf components use `React.memo` when stable props make memoization useful;
- pure Context transitions are separated from rendering logic in `src/context/appContextState.js`.

## Automated Tests

The project uses the built-in Node.js test runner without adding another test framework.

Tests cover:

- meaningful Context defaults;
- Light/Dark transitions;
- Metric/Imperial transitions;
- saved-country add/remove/clear behavior;
- country-code normalization and duplicate prevention;
- persistence loading, validation, malformed JSON fallback, and saving;
- square-kilometre to square-mile conversion and formatting.

Run the suite with:

```bash
npm test
```

## Main Application Features

- **Home** — branded travel landing page with curated destinations and regional discovery.
- **Countries** — searchable and filterable catalogue with pagination and URL-based state.
- **Country Details** — dynamic `/countries/:code` pages with facts, media, Route Focus map, and bordering-country navigation.
- **My Atlas** — persistent saved-country collection on `/saved`.
- **About** — project overview with Lottie animations.
- **Contact** — dedicated route with interactive form and local success state.
- **Global Search** — suggestion-based country navigation from the Header.
- **Route feedback** — navigation progress indicator and route-level error handling.
- **Responsive design** — dedicated desktop, tablet, and mobile layouts.
- **Accessibility** — semantic controls, keyboard interaction, visible focus states, ARIA state where appropriate, and reduced-motion handling.

## Route Focus Map

Route Focus uses locally bundled Natural Earth low-resolution geometry. It provides:

- continent-level geographic context;
- selected-country highlighting when geometry is available;
- destination flag markers and route locators;
- a Local View for small territories;
- wrap-aware positioning around the ±180° International Date Line so Pacific territories remain on the correct side of the map;
- a coordinate locator fallback when the low-resolution Natural Earth dataset does not include a usable polygon for a micro-territory.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/countries` | Country catalogue |
| `/countries/:code` | Dynamic country details |
| `/saved` | My Atlas saved-country collection |
| `/about` | About AtlasRoute |
| `/contact` | Contact page |
| `*` | Custom 404 page |

Examples:

```text
/countries/JPN
/countries/USA
/countries?region=europe
/countries?q=land&page=2
/saved
```

## Data and Media

### Country data

AtlasRoute uses **countries.dev** for country information, search suggestions, and individual country details.

### Country photography

Featured destinations use curated local imagery. Other Country Details pages can load travel photography from **Pixabay**.

The Pixabay API key is read from:

```text
.env.local
```

The real key is excluded from Git. `.env.example` documents the required variable:

```text
VITE_PIXABAY_API_KEY=PASTE_YOUR_PIXABAY_API_KEY_HERE
```

### Map data

Country geometry is bundled locally from the **Natural Earth low-resolution public-domain dataset**.

## Technologies

- React 19
- React Context
- React Router 7
- Vite 7
- JavaScript / JSX
- CSS
- Lottie React
- countries.dev API
- Pixabay API
- Natural Earth map data
- Node.js built-in test runner

## Installation and Local Run

Clone the repository:

```bash
git clone <REPOSITORY_URL>
cd react-homework-07-react-context-atlasroute
```

Install dependencies:

```bash
npm install
```

For Pixabay photography, copy `.env.example` to `.env.local` and add your own API key. Do not commit `.env.local`.

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite in the terminal.

## Available Scripts

```bash
npm run dev
npm run lint
npm test
npm run build
npm run preview
```

- `npm run dev` — starts the Vite development server.
- `npm run lint` — runs ESLint and source validation.
- `npm test` — runs Context, persistence, and unit-conversion tests.
- `npm run build` — creates the production build and validates generated HTML/CSS.
- `npm run preview` — serves the production build locally.

## Validation

Before submission the project is checked with:

```bash
npm run lint
npm test
npm run build
```

Additional validation includes:

- HTML validation;
- CSS validation;
- responsive manual QA;
- keyboard/focus testing;
- direct navigation and reload checks for SPA routes;
- browser console and network checks.

## Deployment

The project is configured for both **GitHub Pages** and **Vercel**.

GitHub Pages deployment is handled by `.github/workflows/deploy-pages.yml`, which runs install, lint, tests, and build before deployment. The workflow uses the HW07 repository base path.

`vercel.json` contains the SPA rewrite required for direct navigation and reloads on nested routes.

For production Pixabay photography, configure `VITE_PIXABAY_API_KEY` in the deployment environment before building.

## Project Links

- **Repository:** https://github.com/andrii-dolzhenko/react-homework-07-react-context-atlasroute
- **GitHub Pages:** _add after deployment_
- **Vercel:** _add after deployment_

## Project Structure

```text
.github/
└── workflows/
    └── deploy-pages.yml
src/
├── api/
├── assets/
├── components/
├── config/
├── context/
│   ├── AppContext.jsx
│   └── appContextState.js
├── data/
├── hooks/
├── pages/
├── utils/
│   ├── preferencesStorage.js
│   ├── publicAsset.js
│   ├── units.js
│   └── mapProjection.js
├── App.jsx
├── main.jsx
├── router.jsx
└── styles.css
test/
├── app-context-state.test.js
├── preferences-storage.test.js
├── units.test.js
└── map-projection.test.js
```

---

© 2026 Andrii Dolzhenko. All Rights Reserved.
