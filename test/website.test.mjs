import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

test('Core website files exist and are valid', async () => {
  const files = [
    'index.html',
    'server.mjs',
    'favicon.svg',
    'manifest.json',
    'robots.txt',
    'design-system/tokens.css',
    'design-system/tokens.json',
    'design-system/DESIGN_SYSTEM.md',
    'README.md'
  ];

  for (const file of files) {
    const s = await stat(path.join(root, file)).catch(() => null);
    assert.ok(s && s.isFile(), `Required file ${file} must exist`);
  }
});

test('Tokens JSON parses and has required design tokens', async () => {
  const raw = await readFile(path.join(root, 'design-system/tokens.json'), 'utf8');
  const tokens = JSON.parse(raw);
  assert.ok(tokens.color, 'tokens.json must define colors');
  assert.ok(tokens.color.primitive, 'tokens.json must define primitive colors');
  assert.ok(tokens.color.primitive.river, 'tokens.json must define river colors');
  assert.ok(tokens.color.semantic, 'tokens.json must define semantic colors');
});

test('Web App Manifest is valid JSON with required fields', async () => {
  const raw = await readFile(path.join(root, 'manifest.json'), 'utf8');
  const manifest = JSON.parse(raw);
  assert.equal(manifest.short_name, 'SURAKSHA');
  assert.ok(manifest.icons && manifest.icons.length > 0, 'manifest must specify icons');
});

test('HTML file has valid structure, metadata, and script tags', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.ok(html.includes('<!doctype html>'), 'must have doctype');
  assert.ok(html.includes('<title>SURAKSHA — Flood Intelligence Platform</title>'), 'must have title');
  assert.ok(html.includes('favicon.svg'), 'must link to favicon.svg');
  assert.ok(html.includes('manifest.json'), 'must link to manifest.json');
  assert.ok(html.includes('<div id="root"></div>'), 'must have root container');
  assert.ok(html.includes('<div id="toast"'), 'must have toast container');
  assert.ok(html.includes('render()'), 'must call initial render()');
});

