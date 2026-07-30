# Susi Air Dashboard

Pilot operations dashboard built with Nuxt 3 — mobile-first, offline-capable, with flight scheduling, hours tracking, and document management.

## Setup & Commands

```bash
# Install dependencies
npm install

# Start dev server (default: http://localhost:3000)
npm run dev

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

## Project Structure

```
pages/          — Route pages (index, schedule, logbook, more, login)
components/     — Reusable UI (PageHeader, PlaceholderContent, SectionHeader,
                  HoursToLimit, DocumentsList, LineChart)
composables/    — Shared logic (useDateFormat)
layouts/        — App shell with fixed bottom nav
stores/         — Pinia store (flight) consuming JSON mock data
data/           — Mock JSON datasets (schedules, flight hours, documents)
assets/scss/    — Global styles, variables via nuxt.config SCSS additionalData
public/         — Static assets (images)
```

## What I'd Do Differently

1. **Split the Pinia store** into domain-specific stores (`useScheduleStore`, `useFlightHoursStore`, `useAuthStore`, `useDocumentStore`) as the app grows. A single store works for this scope but doesn't scale.

2. **Replace mock JSON with API calls** — use `useFetch` / `$fetch` with proper loading, error, and retry states. The skeleton loaders are ready for it.

3. **Add E2E tests** (Playwright or Cypress) for critical flows: login → dashboard → schedule drill-down → hours chart toggle. Currently no tests exist.

4. **Lazy-load the chart** — `vue-chartjs` is already large (61KB gzip). Beyond this scale, dynamic import it only when the Hours to Limit section enters the viewport.

5. **Proper PWA** — add `@vite-pwa/nuxt` for offline support, install prompt, and push notifications for flight schedule changes.

6. **Accessibility audit** — add `aria-live` regions for dynamic content, keyboard navigation for the calendar grid, and focus management in the bottom nav.

7. **Animation system** — replace ad-hoc CSS transitions with a consistent `useSpring` or GSAP-based motion system for route transitions and list enter/leave animations.
