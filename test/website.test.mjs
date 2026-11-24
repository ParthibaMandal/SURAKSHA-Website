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
