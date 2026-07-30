# Susi Air Dashboard

Pilot operations dashboard built with Nuxt 3 — mobile-first, offline-capable, with flight scheduling, hours tracking, and document management.

## Setup & Commands

```bash
# Install dependencies
npm install

# Start dev server (default: http://localhost:3000)
npm run dev

# Run unit tests with coverage
npm run test

# Build for production
npm run build

# Preview production build
npm run build && npm run preview
```

## Libraries & Why

| Library | Reason |
|---|---|
| **Nuxt 3** | File-based routing, auto-imports, SSR/SSG flexibility, strong Vue ecosystem integration |
| **Pinia** | Official Vue 3 state management; simpler than Vuex, first-class TypeScript support |
| **Chart.js + vue-chartjs** | Lightweight (60KB gzip), well-documented, sufficient for line charts with gradients and tooltips |
| **Sass** | SCSS variables for design tokens, nested selectors, consistent theming |
| **@nuxtjs/google-fonts** | Zero-config Inter font loading with `display: swap` for performance |
| **Vitest + @vue/test-utils** | Unit testing with 100% statement/branch/function/line coverage across stores, composables, and components |

## Project Structure

```
pages/          — Route pages (index, schedule, logbook, more, login)
components/     — Reusable UI (PageHeader, PlaceholderContent, SectionHeader,
                  HoursToLimit, DocumentsList, LineChart)
composables/    — Shared logic (useDateFormat)
layouts/        — App shell with fixed bottom nav (responsive container)
stores/         — Pinia store (flight) consuming JSON mock data
data/           — Mock JSON datasets (schedules, flight hours, documents)
assets/scss/    — Global styles, variables via nuxt.config SCSS additionalData
public/         — Static assets (images)
tests/          — Unit tests organized by domain (stores, composables, components)
```

## Routes

| Path | Page |
|---|---|
| `/` | Dashboard — upcoming flight, news, hours chart, documents |
| `/schedule` | Monthly calendar with duty badges |
| `/logbook` | Placeholder (coming soon) |
| `/more` | Placeholder (coming soon) |
| `/login` | Standalone login form with validation |

## Testing

58 unit tests across 8 files, achieving **100% coverage** on all tracked source files (stores, composables, components):

```
Test Files  8 passed (8)
     Tests  58 passed (58)

 % Stmts | % Branch | % Funcs | % Lines
-------|--------|-------|------
   100 |     100 |    100 |    100
```

Coverage includes:
- **Stores** — getters, actions, edge cases (missing entries, warning thresholds)
- **Components** — rendering, props, loading states, user interaction, Chart.js callbacks
- **Composables** — date formatting helpers

Pages and layouts require a full Nuxt/Playwright E2E setup and are excluded from unit coverage.

## What I'd Do Differently

1. **Split the Pinia store** into domain-specific stores (`useScheduleStore`, `useFlightHoursStore`, `useAuthStore`, `useDocumentStore`) as the app grows. A single store works for this scope but doesn't scale.

2. **Replace mock JSON with API calls** — use `useFetch` / `$fetch` with proper loading, error, and retry states. The skeleton loaders are ready for it.

3. **Add E2E tests** (Playwright) for critical flows: login → dashboard → schedule drill-down → hours chart toggle across viewports (390, 768, 1024, 1280, 1440, 1920px).

4. **Lazy-load the chart** — `vue-chartjs` is already large (61KB gzip). Beyond this scale, dynamic import it only when the Hours to Limit section enters the viewport.

5. **Proper PWA** — add `@vite-pwa/nuxt` for offline support, install prompt, and push notifications for flight schedule changes.

6. **Accessibility audit** — add `aria-live` regions for dynamic content, keyboard navigation for the calendar grid, and focus management in the bottom nav.

7. **Animation system** — replace ad-hoc CSS transitions with a consistent `useSpring` or GSAP-based motion system for route transitions and list enter/leave animations.
