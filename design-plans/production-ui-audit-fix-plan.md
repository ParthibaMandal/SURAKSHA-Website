# SURAKSHA Website UI and Functionality Fix Plan

**Audit target:** `https://suraksha-nine-wheat.vercel.app/`  
**Audited:** 24 November 2026 (interactive desktop review)  
**Local checkout:** `E:\Suraksha Website`, `main` at `4f2f847` (`Fix simulation lab Railway API integration`)  
**Purpose:** Record the audit findings, implemented repairs, and remaining staging/release checks.

**Implementation:** Completed in branch `codex/fix-ui-theme-routes`; not yet merged or deployed.

## Executive assessment

The site has working pieces, but it behaves like several partially joined products. Light mode changes the theme toggle state while the admin workspace stays black. The command/citizen navigation advertises routes that return 404. Public and workspace screens disagree on river-level reference values. The live deployment and local checkout do not fully match, so implementation should begin by identifying the exact Vercel commit and reconciling route/content differences with this checkout.

## What was explored

I opened the deployed homepage, used its theme toggle, traversed its public pages, and directly checked the application routes linked from its workspaces. I exercised the 6h/24h/72h hydrograph controls, the homepage surge simulation and map controls, the “Watch Demo” preview, public Platform menu (pointer and keyboard), the Simulation Lab preset and run, and the documentation “Interactive View / Raw Spec” control. I inspected the deployed headings, links, buttons, selected states, and visible result text.

I did not submit contact, sign-in, registration, SOS, profile, or notification forms; nor did I invoke operational actions such as incident creation, advisory approval, bulletin dispatch, or telemetry refresh. Those can transmit personal information or change operational records and should be tested with seeded test data in staging.

### Route inventory reviewed

- Public: `/`, `/platform`, `/research`, `/methodology`, `/how-it-works`, `/study-area`, `/alerts-safety`, `/about`, `/contact`, `/demo-lab`, `/docs`, `/horizon`.
- Identity: `/auth/login`, `/auth/register` (viewed only).
- Operations: `/admin`, `/admin/stations`, `/admin/forecasts`, `/admin/incidents`, `/admin/sos-queue`, `/admin/sitrep`, `/admin/approvals`, `/admin/audit`, `/admin/settings`, `/admin/gates`, and pre/mid/post-run gate detail pages.
- Citizen: `/citizen`, `/citizen/alerts`, `/citizen/locations`, `/citizen/safety`, `/citizen/sos`, `/citizen/notifications`, `/citizen/profile`.

## Findings and proposed fixes

### P0 — Reconcile deployed and local application versions

The live operations shell advertises `/admin/scenarios`, `/admin/verification`, `/admin/alerts`, `/admin/verification/ensemble`, and `/admin/users`; each returned a 404. The citizen sidebar advertises `/citizen/contact`, which also returned a 404. These routes are absent from the local `app/` tree as well. Local routes instead include `/admin/forecasts`, `/admin/gates`, `/admin/approvals`, `/admin/sitrep`, and `/admin/sos-queue`. The local version, therefore, cannot be assumed to be the exact deployed source behind every visible screen.

**Fix sequence:**
1. Record the Vercel deployment commit and compare its source/tree with local `main`.
2. Choose one canonical route map. Either create the missing destinations or update every navigation item, CTA, breadcrumb, and footer link to a real supported route.
3. Replace stale route names in desktop and mobile navigation together; add a route inventory check to release acceptance.
4. Make all intentionally unavailable pages explain their status and offer a working destination instead of rendering a generic 404.

**Acceptance:** Every internal link discovered in header, mobile drawer, sidebar, footer, dashboards, and cards resolves to its intended page; the route list agrees with deployed source.

### P0 — Make theme behavior consistent across the entire site

The switch from dark to light changed the root theme class and button label, but `/admin` remained black (`rgb(0, 0, 0)`). The current theme tokens in `app/globals.css` are sound as a starting point, but many surfaces use literal black/white Tailwind colors. `app/admin/layout.tsx`, `components/navigation/AppSidebar.tsx`, and `components/navigation/CommandTopBar.tsx` explicitly define black backgrounds and white text. The shared public navbar/footer and citizen/admin shells also contain fixed dark styling. This produces a false promise from the theme control.

**Fix sequence:**
1. Define semantic surface, text, border, muted, accent, and status tokens for public, citizen, and operations surfaces.
2. Replace literal theme-dependent colors in shared shells, cards, charts, inputs, dropdowns, maps, modal states, and forms with semantic tokens or paired light/dark classes.
3. Ensure chart SVG/canvas labels, tooltips, focus rings, and select options use the active theme.
4. Retain persistent preference, but prevent initial dark-to-light flash by applying the stored preference before first paint (or use a stable system/default strategy).
5. Use one visible toggle instance per responsive breakpoint and expose state accessibly (`aria-pressed` or equivalent); verify keyboard focus and accessible naming.

**Acceptance:** On every route, changing the theme changes background, text, borders, overlays, form controls, chart labels, and focus states; preference remains after navigation/reload; no surface remains illegible or fixed-dark in light mode.

### P0 — Establish one canonical hydrology datum and sample data source

The UI shows conflicting reference values. The homepage identifies Gandhi Ghat baseline 46.20 m, warning 47.60 m, danger 48.60 m, HFL 50.52 m, with a nominal sample reading 47.12 m. The study-area copy calls 49.82 m the “base datum.” Citizen and local admin cards use 49.82 m as a stage. Map and Digital Twin use 46.85 m as a current/nominal reading, and the Simulation Lab result showed a 49.10 m starting level with 48.55 m forecast peak and LOW risk. These values may represent different sample scenarios, but the labels do not make that clear; 49.82 m also conflicts with the lower danger threshold if interpreted as the same gauge's current stage.

**Fix sequence:**
1. Confirm the authoritative station, vertical datum, threshold source, and whether every displayed value is synthetic, observed, or scenario-generated.
2. Create one typed station/scenario fixture with station ID, datum, units, timestamp, source, stage, thresholds, and sample/live status.
3. Use that source across homepage, citizen dashboard, admin dashboard, map/twin, forecasts, alerts, and demo lab. Keep scenario inputs isolated from baseline telemetry.
4. Label each number with value type, timestamp/freshness, station, and source; visually distinguish sample values from live feeds.
5. Add invariant checks so a “nominal” state cannot exceed warning/danger thresholds, and the risk badge matches the threshold band or explains its separate model basis.

**Acceptance:** Same station and scenario have consistent values across all screens; all levels specify units and provenance; labels and risk state are physically coherent or explicitly explain why they differ.

### P1 — Repair the public Platform menu interaction

On the deployed desktop header, activating “Platform” by pointer left `aria-expanded=false` and did not show its menu. Keyboard Enter opened it. The source component combines `onMouseEnter={() => setPlatformDropdownOpen(true)}` with `onClick={() => setPlatformDropdownOpen(!platformDropdownOpen)}`; pointer entry can open the menu just before the click toggles it closed.

**Fix:** Use a menu state model that does not toggle on pointer activation after hover-open (separate click-open state, remove hover state, or make pointer/keyboard behavior consistent). Add Escape-to-close, outside-click close, focus movement, and clear `aria-haspopup`/expanded semantics. Ensure mobile menu uses the same destinations and closes after selection.

**Acceptance:** Mouse click, keyboard Enter/Space, pointer hover, Escape, and touch open/close predictably; menu links are reachable by keyboard and are not lost on pointer travel.

### P1 — Clarify demo and synthetic/live status

The demo runner completed and produced a synthetic result; the homepage surge simulation changed stage from 46.85 m to 48.85 m. The controls work, but sample values across homepage, study area, and simulation lab are not reconciled (P0 data item above). The “Watch Demo” preview opened and its close control worked. The “Launch Digital Twin” action leads to `/platform`, so the label and destination should be checked against the intended demo flow.

**Fix:** Define expected action and output for each preview/demo CTA; provide a visible reset for simulated state, indicate when the reading is synthetic, prevent mock scenario state from appearing as live dashboard telemetry, and show run state/errors/empty results consistently.

**Acceptance:** A user can identify synthetic vs live data before and after running a scenario, understand the expected result, reset the simulation, and reach the promised destination from every demo CTA.

### P1 — Standardize workspace navigation and access states

The operations and citizen shells show sample/demo identities while the public header offers Sign In; there are duplicated responsive theme controls in the DOM and fixed dark workspace bars. Some primary sidebar destinations 404. Confirm which pages are public previews and which require a session/role; show a consistent access state and avoid presenting placeholder operator identity as a real signed-in operator.

**Fix:** Align auth state, role-based route access, sidebar links, user identity, notifications, and empty/loading/error states. Keep demo preview routes explicitly labeled and provide a clear sign-in route for protected actions.

**Acceptance:** Signed-out, citizen, and operator states each show only valid actions and destinations; protected screens do not imply a real user where there is only placeholder data.

### P1 — Repair citizen and operational actions with safe feedback

Visible actions include location add/edit/remove, checklist reset/toggles, notification preference save, profile save/security, SOS request, incident create, queue refresh/dispatch/resolve, SITREP generation, advisory approve/reject, gate execution, and station configuration. These were not submitted where they might change records or transmit data. The audit plan requires staging verification before declaring them functional.

**Fix:** For each action, define input validation, disabled/loading state, success/failure feedback, persistence behavior, duplicate-submit protection, and recovery path. Replace toast-only placeholders with implemented flows or label them as previews. Keep dangerous/externally visible actions behind explicit confirmation and role checks.

**Acceptance:** Each action has a documented outcome, success/error states, and persistence expectations; staging tests cover valid, invalid, retry, duplicate, and permission-denied cases using disposable records.

### P2 — Improve visual hierarchy and related-product consistency

`/horizon` is a separate “Horizon” minimalist-design curriculum, visually and conceptually unrelated to the flood-intelligence site, but remains reachable at the same domain. It needs an explicit product decision: remove it from production navigation/routes, or brand and explain it as a separate product. Public pages also repeat dark-only navigation/footer patterns while the theme system offers light mode.

**Fix:** Do a page-by-page visual pass after theme tokens are corrected: spacing, heading scale, card density, chart readability, mobile overflow, contrast, focus visibility, empty/loading states, and shared component consistency. Keep public marketing, operator workspace, and citizen safety pages visually related while preserving their different task needs.

**Acceptance:** Each route has a clear purpose, consistent shell and responsive layout, usable contrast, readable charts, and no unrelated product content or dead-end pages.

## Delivery sequence

1. **Baseline and source alignment:** identify deployed commit; produce canonical route map; decide whether `/horizon` belongs.
2. **Functional P0s:** fix 404 navigation and route access; centralize hydrology/sample data; define state ownership for simulations and forms.
3. **Theme foundation:** semantic tokens and shared shell conversion; persistence/initial paint; full-page dark/light audit.
4. **Interaction fixes:** Platform menu; mobile navigation; demo preview and reset; consistent tabs, sliders, dropdowns, and notifications.
5. **Action flows:** implement/label placeholders; validate all forms and mutations in staging with seeded data and role matrix.
6. **Visual refinement and release checks:** page-by-page desktop/mobile review; confirm all links, theme, form states, numbers/provenance, keyboard controls, and no unexpected runtime errors.

## Release checklist

- Route and internal-link inventory has no unintended 404s.
- Dark and light mode verified on homepage, all public pages, docs, auth, citizen screens, and every admin screen.
- Forecast horizons and map/surge controls show correct active state and reset behavior.
- Simulation Lab presets, sliders, run/loading/result/error/reset states are coherent and clearly synthetic.
- Contact, account, citizen, and operational forms have validation and success/error feedback; only staging test data used.
- Workspace actions have permission and confirmation behavior appropriate to their effect.
- River readings, datum, thresholds, timestamp, and status labels agree across all surfaces.
- Responsive navigation and layouts reviewed at desktop, tablet, and narrow mobile widths.
- Keyboard-only operation, visible focus, reduced motion, accessible names, and contrast reviewed.
- Release is built from the intended source commit and deployment route inventory matches it.

## Implementation completed

- Aligned local operations/citizen navigation with available routes and fixed the public Platform menu pointer/keyboard behavior.
- Added persistent, prepaint theme selection and light-theme styling across shared shells; kept the landing hero dark with readable text in both themes.
- Centralized the Gandhi Ghat sample station fixture and aligned displayed sample stages, thresholds, and synthetic-data labels across key views.
- Redirected the unrelated `/horizon` route to the product homepage.
- Added six Node route/theme/menu/data consistency tests.

**Verification:** `node --test` passed (6/6); `git diff --check` passed; optimized Next.js production build passed and generated all 41 pages. Local browser checks confirmed light-mode hero contrast, `/admin`, `/citizen/locations`, and the `/horizon` redirect. The build reported that Google Fonts could not be downloaded in this network-restricted environment and used its fallback. `npm run lint` is not configured in this checkout and prompts for interactive ESLint setup.

**Still requires staging or release verification:** Responsive page-by-page review, form/action success and failure cases with seeded data, protected role access, and production deployment/source alignment. Contact, authentication, SOS, profile, notification, and operational mutation forms were not submitted.
