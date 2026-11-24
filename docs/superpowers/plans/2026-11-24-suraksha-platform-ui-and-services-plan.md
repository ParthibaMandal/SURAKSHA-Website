# SURAKSHA Platform & UI Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the SURAKSHA website into an institutional-grade hydrological intelligence and flood decision support platform with high-end visual design, refined navigation, zero muddy green tint washes, seamless dark mode controls, robust citizen SOS emergency assistance tracking, and a flagship interactive Simulation Lab.

**Architecture:** Next.js 14 (App Router) on Vercel acts as the presentation, session, and authenticated proxy layer; Supabase acts as the persistent identity, RLS database, and real-time state engine; Railway hosts the Python/FastAPI hydrological calculation engine. Client interactions strictly reflect verified telemetry and supervisory gate validations without blending observed, forecast, and synthetic data.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, GSAP, Three.js, Lucide React, Supabase SSR/JS, Node Test Runner.

**Spec:** Grounded in the SURAKSHA Complete Product Blueprint and user recommendations (2026-11-24).

## Global Constraints

- Never blend synthetic scenario data with live observed river telemetry; all telemetry must carry explicit provenance (`OBSERVED`, `FORECAST`, `MODELLED`, `SYNTHETIC`).
- Preserve the existing cinematic video hero on the landing page (`/`).
- Do not add second backends, parallel auth providers, or alternate databases; maintain the Next.js (Vercel) + FastAPI (Railway) + PostgreSQL/RLS (Supabase) architecture.
- Eliminate jarring muddy green background gradients and tints (`#18231E`, `#223029`, `#0D100E`); adopt an institutional OLED dark palette (`#000000`, `#09090B`, `#121214`) with crisp hairline borders (`rgba(255,255,255,0.08)` to `0.12`).
- Eliminate multi-line text wrapping on interactive controls (e.g. "Sign In" button wrapping into two lines).
- Remove the intrusive dark mode icon background; integrate theme controls seamlessly into the navbar.
- Ensure workspace shells (`/admin/*`, `/citizen/*`) have a dedicated focused layout without duplicate stacked navbars or misplaced landing footers.

## Review Focus

1. **Unauthenticated SOS Submission:** A citizen attempting to submit an SOS request when unauthenticated or session expired receives an immediate clear prompt to sign in or use the direct phone fallback (112 / NDRF), without silent submission failure.
2. **Citizen SOS Ticket Tracking:** A citizen who submits an emergency assistance request can view their submitted tickets and live triage status (`OPEN`, `RESOLVED`) on `/citizen/sos` upon refresh.
3. **Dropdown Menu Legibility & Viewport Overflow:** The Platform and User dropdown menus open with generous width, legible high-contrast typography, no multi-line broken phrases, and close cleanly on outside click or Escape.
4. **Theme Toggle Appearance:** Theme toggle in the navbar sits flush with nav items without an isolated clashing square container, providing smooth single-click toggling.
5. **Simulation Lab Responsiveness & Sliders:** Sliders on `/demo-lab` render with precise numeric scales, keyboard accessibility, clear synthetic labels, and display responsive hydrograph outputs without UI overlap.

---

### Task 1: Clean High-End Navigation & Theme Toggle Architecture

**Files:**
- Modify: `components/navigation/PublicNavbar.tsx`
- Modify: `components/theme/ThemeToggle.tsx`
- Modify: `app/globals.css`
- Test: `test/website.test.mjs`

**Interfaces:**
- Consumes: `useAuth()`, `useTheme()`, `usePathname()`
- Produces: Polished floating glass island header with non-wrapping buttons, rich bento-style dropdown, integrated theme toggle, and workspace suppression.

- [ ] **Step 1: Write the failing tests for navbar layout and theme toggle**

In `test/website.test.mjs`, add assertions verifying:
1. `PublicNavbar.tsx` contains `whitespace-nowrap` on auth actions and dropdown links.
2. `PublicNavbar.tsx` uses clean neutral backgrounds (`bg-black` or `bg-zinc-950`) rather than muddy green `#18231E`.
3. `ThemeToggle.tsx` renders without an isolated contrasting background container.
4. `PublicNavbar.tsx` returns null on workspace routes (`/admin`, `/citizen`) to avoid duplicate navbars.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test`
Expected: FAIL on new navbar checks.

- [ ] **Step 3: Refactor `components/theme/ThemeToggle.tsx`**

Make the toggle button a seamless circle/pill with smooth SVG rotation and transparent hover state matching the navbar actions.

- [ ] **Step 4: Refactor `components/navigation/PublicNavbar.tsx`**

1. Add `pathname.startsWith("/admin") || pathname.startsWith("/citizen")` to route suppression so workspaces use their native `CommandTopBar` and `AppSidebar`.
2. Redesign the `Platform` dropdown into a 320px wide bento menu with high-contrast text, clear secondary captions, and smooth opacity/transform motion.
3. Ensure all CTA buttons (`Sign In`, `Workspace`, `Platform`) use `whitespace-nowrap` and concentric padding.
4. Replace `#18231E` / `#2D3C33` with neutral `#09090B` / `border-white/10`.

- [ ] **Step 5: Clean up `app/globals.css` navigation classes**

Remove excessive bouncing `iconGlassFloat` and shine animations from `app/globals.css` that make the navigation look fidgety.

- [ ] **Step 6: Run test to verify it passes**

Run: `node --test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/navigation/PublicNavbar.tsx components/theme/ThemeToggle.tsx app/globals.css test/website.test.mjs
git commit -m "fix(ui): modernize navbar, eliminate clashing theme toggle box, and polish dropdown menus"
```

---

### Task 2: Eliminate Muddy Green Backgrounds & Standardize Visual Tokens

**Files:**
- Modify: `app/globals.css`
- Modify: `design-system/tokens.css`
- Modify: `app/demo-lab/page.tsx`
- Modify: `app/citizen/page.tsx`
- Modify: `app/admin/page.tsx`
- Test: `test/website.test.mjs`

**Interfaces:**
- Consumes: CSS variables `--background`, `--surface`, `--surface-elevated`, `--border`
- Produces: Cohesive agency-grade dark palette (OLED black, deep zinc surfaces, emerald accents reserved strictly for live indicators).

- [ ] **Step 1: Write test verifying elimination of muddy green palette**

In `test/website.test.mjs`, assert that `app/globals.css` and `app/demo-lab/page.tsx` do not declare `#18231E` or heavy green atmospheric washes.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test`
Expected: FAIL.

- [ ] **Step 3: Update CSS variables in `app/globals.css` and `design-system/tokens.css`**

Set `.dark` tokens:
- `--background`: `#000000`
- `--surface`: `#09090B`
- `--surface-elevated`: `#121215`
- `--surface-glass`: `rgba(9, 9, 11, 0.85)`
- `--border`: `rgba(255, 255, 255, 0.08)`
- `--border-hover`: `rgba(255, 255, 255, 0.16)`
- `--muted`: `#18181B`
- `--muted-foreground`: `#A1A1AA`

- [ ] **Step 4: Refactor backgrounds across Demo Lab and Workspaces**

1. In `app/demo-lab/page.tsx`: replace any green gradient mesh with subtle neutral radial gradients.
2. In `app/citizen/page.tsx` and `app/admin/page.tsx`: use double-bezel card structure (`border border-white/8 bg-zinc-950 p-6 rounded-2xl`).

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css design-system/tokens.css app/demo-lab/page.tsx app/citizen/page.tsx app/admin/page.tsx test/website.test.mjs
git commit -m "style(theme): replace muddy green washes with high-end institutional OLED dark tokens"
```

---

### Task 3: Citizen Emergency SOS & Assistance Tracking Overhaul

**Files:**
- Modify: `app/citizen/sos/page.tsx`
- Modify: `app/api/flood/sos/route.ts`
- Modify: `app/admin/sos-queue/page.tsx`
- Test: `test/website.test.mjs`

**Interfaces:**
- Consumes: `/api/flood/sos` (GET for history/queue, POST for creation)
- Produces: Resilient citizen SOS submission with local ticket tracking, call-to-action emergency helplines, and admin triage status updates.

- [ ] **Step 1: Write tests for citizen SOS flow**

In `test/website.test.mjs`, verify:
1. `app/citizen/sos/page.tsx` fetches and lists the citizen's own submitted SOS tickets.
2. Click-to-call links for official helplines (`tel:112`, `tel:1078`) are present.
3. `/api/flood/sos` route filters by `citizen_id` when called by a citizen identity.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test`
Expected: FAIL.

- [ ] **Step 3: Update `/api/flood/sos/route.ts`**

Allow citizens to call `GET /api/flood/sos` to retrieve their own submitted assistance requests (`eq("citizen_id", identity.user.id)`), while admins/operators receive the full operational queue.

- [ ] **Step 4: Enhance `app/citizen/sos/page.tsx`**

1. Add prominent one-tap emergency call buttons for National Emergency (112), NDRF (1078), and Bihar State Disaster Management (1070).
2. Display a "My Submitted Assistance Requests" section showing ticket ID, time, urgency badge, and current triage status (`OPEN`, `RESOLVED`).
3. Add form validation for Indian mobile numbers (`/^[6-9]\d{9}$/` or `+91`) and location description.

- [ ] **Step 5: Polish `app/admin/sos-queue/page.tsx`**

Add status update action buttons (`Mark Dispatched`, `Resolve`) that update Supabase status directly for authorized operators.

- [ ] **Step 6: Run test to verify it passes**

Run: `node --test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add app/citizen/sos/page.tsx app/api/flood/sos/route.ts app/admin/sos-queue/page.tsx test/website.test.mjs
git commit -m "feat(sos): add citizen ticket tracking, emergency dialer links, and queue triage controls"
```

---

### Task 4: Flagship Simulation Lab (Demo Lab) Visual & Interactive Polish

**Files:**
- Modify: `app/demo-lab/page.tsx`
- Modify: `components/shared/HydrologicalChart.tsx`
- Test: `test/website.test.mjs`

**Interfaces:**
- Consumes: `/api/flood/scenarios` (POST)
- Produces: Professional scenario studio with double-bezel cards, interactive parameter sliders, real-time comparison preview, and clear supervisory validation gates.

- [ ] **Step 1: Write test for Simulation Lab UI elements**

In `test/website.test.mjs`, verify that `/demo-lab` renders starting condition multiplier sliders, synthetic data provenance markers, and supervisory gate indicators.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test`
Expected: FAIL.

- [ ] **Step 3: Refactor `app/demo-lab/page.tsx`**

1. Structure into an asymmetrical studio layout: Scenario preset cards on left, parameter controls & live stage projection on right.
2. Add double-bezel styling (`rounded-2xl border border-white/10 bg-zinc-950 p-6`).
3. Provide interactive sliders with min/max bounds and immediate percentage labels.
4. Render the 3 supervisory validation gates (Pre-Run, Mid-Run, Post-Run) visually indicating status.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/demo-lab/page.tsx components/shared/HydrologicalChart.tsx test/website.test.mjs
git commit -m "feat(simulation): polish Simulation Lab with double-bezel controls and supervisory gates"
```

---

### Task 5: End-to-End Verification and Chrome DevTools Validation

**Files:**
- Modify: `test/website.test.mjs`

- [ ] **Step 1: Execute test suite across all modified components**

Run: `node --test`
Expected: PASS (all tests pass).

- [ ] **Step 2: Run TypeScript typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Run Next.js production build**

Run: `npm run build`
Expected: All 39 static and dynamic routes compile successfully.

- [ ] **Step 4: Verify visually using Chrome DevTools MCP**

1. Navigate to `http://localhost:3000/` and capture screenshot.
2. Navigate to `http://localhost:3000/demo-lab` and capture screenshot.
3. Verify that navbar text is unbroken, theme toggle is clean, and green background haze is eliminated.

- [ ] **Step 5: Commit and push**

```bash
git push origin codex/fix-ui-theme-routes
```
