import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');

async function routeExists(route) {
  const segments = route.split('/').filter(Boolean);
  let cursor = path.join(root, 'app');
  for (const segment of segments) {
    const direct = path.join(cursor, segment);
    try {
      await access(direct);
      cursor = direct;
    } catch {
      const dynamic = (await import('node:fs/promises')).readdir(cursor, { withFileTypes: true });
      const match = (await dynamic).find((entry) => entry.isDirectory() && /^\[.+\]$/.test(entry.name));
      if (!match) return false;
      cursor = path.join(cursor, match.name);
    }
  }
  try {
    await access(path.join(cursor, 'page.tsx'));
    return true;
  } catch {
    return false;
  }
}

test('Next.js application entry points exist', async () => {
  for (const file of ['app/layout.tsx', 'app/page.tsx', 'app/globals.css', 'components/theme/ThemeProvider.tsx']) {
    await access(path.join(root, file));
  }
});

test('all workspace sidebar links resolve to an app route', async () => {
  const source = await read('components/navigation/AppSidebar.tsx');
  const routes = [...source.matchAll(/href:\s*"(\/[^"]+)"/g)].map((match) => match[1]);
  assert.ok(routes.length >= 15, 'expected the admin and citizen workspace routes to be represented');
  for (const route of routes) assert.ok(await routeExists(route), `${route} must resolve to a page`);
});

test('public Platform menu destinations resolve', async () => {
  const source = await read('components/navigation/PublicNavbar.tsx');
  for (const route of ['/platform', '/study-area', '/demo-lab']) {
    assert.ok(source.includes(`href="${route}"`), `${route} should remain in the Platform menu`);
    assert.ok(await routeExists(route), `${route} must resolve to a page`);
  }
});

test('theme preference is bootstrapped and theme controls expose state', async () => {
  const layout = await read('app/layout.tsx');
  const toggle = await read('components/theme/ThemeToggle.tsx');
  const css = await read('app/globals.css');
  assert.match(layout, /localStorage\.getItem\('suraksha-theme'\)/);
  assert.match(toggle, /aria-pressed=\{theme === "dark"\}/);
  assert.match(css, /html\.light main/);
  assert.match(css, /html\.light \.workspace-shell/);
  assert.match(css, /hydrograph-chart/);
});

test('Patna preview uses a single coherent station fixture', async () => {
  const data = await read('lib/mock-data.ts');
  const fixture = data.slice(data.indexOf('export const PATNA_GANDHI_GHAT'), data.indexOf('export const STATIONS'));
  assert.match(fixture, /currentStage:\s*46\.85/);
  assert.match(fixture, /warningLevel:\s*47\.6/);
  assert.match(fixture, /dangerLevel:\s*48\.6/);
  for (const file of ['app/citizen/page.tsx', 'app/admin/page.tsx', 'components/three/DigitalTwinScene.tsx', 'components/shared/HydrologicalChart.tsx']) {
    assert.match(await read(file), /PATNA_GANDHI_GHAT/);
  }
});

test('Platform menu supports explicit open, escape, and outside close without hover-toggle conflict', async () => {
  const source = await read('components/navigation/PublicNavbar.tsx');
  assert.match(source, /onClick=\{\(\) => setPlatformDropdownOpen\(!platformDropdownOpen\)\}/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /closeOnOutsidePointer/);
  assert.doesNotMatch(source, /onMouseEnter=\{\(\) => setPlatformDropdownOpen/);
});

test('unavailable engine services never report healthy status or fabricated actuator records', async () => {
  const health = await read('app/api/flood/health/route.ts');
  const stations = await read('app/api/flood/stations/route.ts');
  const gates = await read('app/api/flood/gates/route.ts');
  assert.match(health, /status: "UNAVAILABLE"/);
  assert.doesNotMatch(health, /status: "HEALTHY"/);
  assert.doesNotMatch(stations, /from "@\/lib\/mock-data"/);
  assert.match(gates, /status: 501/);
  assert.doesNotMatch(gates, /last_actuated_at|current_opening_pct/);
});

test('prototype gate and alert approval screens do not claim actions were executed', async () => {
  const gates = await read('app/admin/gates/page.tsx');
  const gateDetail = await read('app/admin/gates/[gateId]/page.tsx');
  const approvals = await read('app/admin/approvals/page.tsx');
  const alerts = await read('app/api/flood/alerts/route.ts');
  assert.match(gates, /No barrage control or actuator endpoint is connected/);
  assert.doesNotMatch(gates, /handleAdjust|setToast\(/);
  assert.match(gateDetail, /Gate execution is unavailable/);
  assert.doesNotMatch(gateDetail, /Execute Gate Verification Check|showToast/);
  assert.match(approvals, /SAMPLE · NOT CONNECTED/);
  assert.doesNotMatch(approvals, /handleApprove|handleReject|Authorize & Publish/);
  assert.match(alerts, /status: 501/);
});

test('dashboard example telemetry is visibly distinguished from observed operations data', async () => {
  const chart = await read('components/shared/HydrologicalChart.tsx');
  const dashboard = await read('app/admin/page.tsx');
  assert.match(chart, /Illustrative sample for Patna/);
  assert.match(chart, /SYNTHETIC SURGE EXAMPLE/);
  assert.doesNotMatch(chart, /Observed Stage/);
  assert.match(dashboard, /Engine status unavailable/);
  assert.match(dashboard, /Synthetic reference · no live incident feed/);
  assert.doesNotMatch(dashboard, /Lalganj tributary surge flagged|NSE Score: 0\.89|HUMAN-IN-THE-LOOP ACTIVE/);
});

test('API explorer documents verified engine routes rather than retired website routes', async () => {
  const explorer = await read('components/docs/renderers/InteractiveApiExplorer.tsx');
  const scenarioProxy = await read('app/api/flood/scenarios/route.ts');
  assert.match(explorer, /\/api\/v1\/flood\/pipeline\/run/);
  assert.match(explorer, /\/api\/v1\/flood\/demo\/scenarios/);
  assert.match(explorer, /\/api\/v1\/flood\/stations/);
  assert.doesNotMatch(explorer, /\/api\/v1\/flood\/(forecast|alerts\/cap|gates\/advisory)/);
  assert.match(scenarioProxy, /\/api\/v1\/flood\/demo\/scenarios/);
});

test('generated API documentation uses the website-owned verified contract override', async () => {
  const [override, published, syncScript, rawDocs, manifestText] = await Promise.all([
    read('content/docs-overrides/09_BACKEND_AND_API/api-reference.md'),
    read('content/docs/09_BACKEND_AND_API/api-reference.md'),
    read('scripts/sync-docs.py'),
    read('lib/docs/docs-data.json'),
    read('lib/docs/docs-manifest.json'),
  ]);
  const docs = JSON.parse(rawDocs);
  const apiDoc = docs.find((doc) => doc.id === '09-backend-and-api--api-reference');
  const manifest = JSON.parse(manifestText);
  assert.equal(published.trim(), override.trim());
  assert.ok(apiDoc, 'the API reference should be published under its stable docs ID');
  assert.match(apiDoc.content, /\/api\/v1\/flood/);
  assert.match(apiDoc.content, /\/demo\/scenarios/);
  assert.match(apiDoc.content, /SURAKSHA_OPERATOR_API_KEY/);
  assert.match(apiDoc.content, /There is no verified website or engine route for gate telemetry/);
  assert.doesNotMatch(apiDoc.content, /\/alert\/generate|\/api\/v1\/flood\/sitrep|\/api\/v1\/flood\/advisory/);
  assert.match(syncScript, /LOCAL_OVERRIDES_DIR/);
  assert.match(syncScript, /primaryGaugeStation": "Gandhi Ghat, Patna \(GANGES_PATNA\)"/);
  assert.match(syncScript, /"warningThresholdMeters": 49\.50/);
  assert.match(apiDoc.githubUrl, /SURAKSHA-Website\/blob\/codex\/fix-ui-theme-routes\/content\/docs-overrides/);
  assert.equal(apiDoc.wordCount, apiDoc.content.trim().split(/\s+/).length);
  assert.equal(apiDoc.readingTime, Math.max(1, Math.ceil(apiDoc.wordCount / 200)));
  assert.equal(apiDoc.lastVerified, '2026-11-24');
  assert.equal(manifest.metadata.operationalContext.primaryGaugeStation, 'Gandhi Ghat, Patna (GANGES_PATNA)');
  assert.equal(manifest.metadata.totalWords, docs.reduce((sum, doc) => sum + doc.wordCount, 0));
});

test('missing or invalid Supabase profiles never become citizen identities', async () => {
  const [auth, navbar, sidebar] = await Promise.all([
    read('lib/supabase/auth-context.tsx'),
    read('components/navigation/PublicNavbar.tsx'),
    read('components/navigation/AppSidebar.tsx'),
  ]);
  assert.match(auth, /Promise<UserProfile \| null>/);
  assert.match(auth, /if \(!allowedRoles\.includes\(data\.role\)\)/);
  assert.doesNotMatch(auth, /fallbackProfile|role:\s*"citizen"/);
  assert.match(auth, /const computedRole = profile\?\.role \|\| "guest"/);
  assert.match(auth, /SURAKSHA profile could not be verified/);
  assert.match(navbar, /ROLE: \{profile\?\.role \|\| "Unavailable"\}/);
  assert.match(navbar, /Account role could not be verified/);
  assert.match(sidebar, /Profile unavailable/);
  assert.doesNotMatch(sidebar, /Duty Hydrologist|Citizen Account|Patna Reach \(Preview\)/);
});
