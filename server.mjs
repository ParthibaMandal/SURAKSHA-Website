import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
try {
  const envFile = await readFile(path.join(root, '.env'), 'utf8');
  for (const rawLine of envFile.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim();
    if (!/^[A-Za-z_]\w*$/.test(key) || Object.hasOwn(process.env, key)) continue;
    const rawVal = line.slice(eqIdx + 1).trim();
    const value = rawVal.replace(/^(['"])(.*)\1$/, '$2');
    process.env[key] = value;
  }
} catch {
  // A local .env file is optional; process environment variables take precedence.
}
const port = Number(process.env.PORT || 3000);
const host = (process.env.HOST || '127.0.0.1').trim();
const backendOrigin = (process.env.SURAKSHA_BACKEND_URL || '').trim().replace(/\/$/, '');
const operatorApiKey = (process.env.SURAKSHA_OPERATOR_API_KEY || '').trim();
const isLoopbackHost = ['127.0.0.1', 'localhost', '::1'].includes(host);
const allowedLocalOrigins = new Set(['127.0.0.1', 'localhost', '[::1]'].map(name => `http://${name}:${port}`));
const demoBridgeEnabled = process.env.SURAKSHA_DEMO_ENABLED === 'true'
  && process.env.NODE_ENV !== 'production'
  && isLoopbackHost;
const backendTimeoutMs = 10_000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

const json = (response, status, body) => {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  response.end(JSON.stringify(body));
};

function checkScenarioRunRoute(pathname, searchParams, method, requestHeaders) {
  const match = pathname.match(/^\/api\/flood\/demo\/scenarios\/([A-Za-z0-9_-]{1,100})\/run$/);
  if (!match) return null;
  if (method !== 'POST') return { errorStatus: 405, errorDetail: 'Method not allowed.' };
  if (!demoBridgeEnabled) {
    return { errorStatus: 403, errorDetail: 'Backend scenario execution is available only in explicit local demo mode.' };
  }
  if (!allowedLocalOrigins.has(requestHeaders?.origin || '')) {
    return { errorStatus: 403, errorDetail: 'The local demo route accepts requests only from the website origin.' };
  }
  if (operatorApiKey.length < 32) {
    return { errorStatus: 503, errorDetail: 'Configure the backend operator credential on the local website server to enable scenario execution.' };
  }
  const mode = searchParams.get('mode') || 'supervised';
  if (!['supervised', 'static'].includes(mode)) {
    return { errorStatus: 400, errorDetail: 'Unsupported execution mode.' };
  }
  return {
    backendPath: `/api/v1/flood/demo/scenarios/${encodeURIComponent(match[1])}/run?mode=${mode}`,
    method: 'POST',
    headers: { authorization: `Bearer ${operatorApiKey}` },
  };
}

function checkStationDetailRoute(pathname, method) {
  const match = pathname.match(/^\/api\/flood\/stations\/([A-Za-z0-9_-]{1,80})$/);
  if (!match) return null;
  if (method !== 'GET') return { errorStatus: 405, errorDetail: 'Method not allowed.' };
  return { backendPath: `/api/v1/flood/stations/${encodeURIComponent(match[1])}`, method: 'GET' };
}

function resolveBackendTarget(request, pathname, searchParams) {
  if (pathname === '/api/flood/health') {
    if (request.method !== 'GET') return { errorStatus: 405, errorDetail: 'Method not allowed.' };
    return { backendPath: '/api/v1/flood/health', method: 'GET' };
  }

  if (pathname === '/api/flood/stations') {
    if (request.method !== 'GET') return { errorStatus: 405, errorDetail: 'Method not allowed.' };
    const allowed = new URLSearchParams();
    for (const key of ['basin', 'state']) {
      const val = searchParams.get(key);
      if (val) allowed.set(key, val.slice(0, 80));
    }
    const q = allowed.toString();
    return { backendPath: q ? `/api/v1/flood/stations?${q}` : '/api/v1/flood/stations', method: 'GET' };
  }

  if (pathname === '/api/flood/demo/scenarios') {
    if (request.method !== 'GET') return { errorStatus: 405, errorDetail: 'Method not allowed.' };
    return { backendPath: '/api/v1/flood/demo/scenarios', method: 'GET' };
  }

  const scenarioRun = checkScenarioRunRoute(pathname, searchParams, request.method, request.headers);
  if (scenarioRun) return scenarioRun;

  const stationDetail = checkStationDetailRoute(pathname, request.method);
  if (stationDetail) return stationDetail;

  return { errorStatus: 404, errorDetail: 'This backend path is not available through the website bridge.' };
}

async function fetchAndStreamUpstream(response, target) {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), backendTimeoutMs);
  const headers = { accept: 'application/json', ...(target.headers || {}) };

  try {
    const upstream = await fetch(`${backendOrigin}${target.backendPath}`, {
      method: target.method || 'GET',
      headers,
      signal: abort.signal,
      redirect: 'error',
    });
    const contentType = upstream.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      json(response, 502, { detail: 'The SURAKSHA backend returned an unexpected response.' });
      return;
    }
    const body = await upstream.text();
    response.writeHead(upstream.status, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    });
    response.end(body);
  } catch (error) {
    const timedOut = error?.name === 'AbortError';
    json(response, 502, {
      detail: timedOut ? 'The SURAKSHA backend did not respond in time.' : 'The SURAKSHA backend could not be reached.',
      backend_configured: true,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function proxyBackendAllowlist(request, response, pathname, searchParams) {
  if (!backendOrigin) {
    json(response, 503, { detail: 'SURAKSHA_BACKEND_URL is not configured.', backend_configured: false });
    return;
  }

  const target = resolveBackendTarget(request, pathname, searchParams);
  if (target.errorStatus) {
    json(response, target.errorStatus, { detail: target.errorDetail });
    return;
  }

  await fetchAndStreamUpstream(response, target);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  if (url.pathname === '/api/site/health') {
    json(response, 200, {
      status: 'ok',
      backend_configured: Boolean(backendOrigin),
      local_demo_enabled: demoBridgeEnabled && operatorApiKey.length >= 32,
      mode: 'read-only website bridge',
    });
    return;
  }
  if (url.pathname.startsWith('/api/')) {
    await proxyBackendAllowlist(request, response, url.pathname, url.searchParams);
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    json(response, 405, { detail: 'Method not allowed.' });
    return;
  }

  let requestedPath = url.pathname;
  if (requestedPath === '/' || requestedPath === '') {
    requestedPath = '/index.html';
  }

  const normalizedSafePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(root, normalizedSafePath);

  // Security guard against path traversal outside the root directory
  if (!filePath.startsWith(root)) {
    response.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }

  try {
    const fileStat = await stat(filePath).catch(() => null);
    if (!fileStat?.isFile()) {
      // If an extension-less route or client route is requested, fallback to index.html
      if (!path.extname(filePath)) {
        filePath = path.join(root, 'index.html');
      } else {
        response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const content = await readFile(filePath);

    response.writeHead(200, {
      'content-type': contentType,
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin',
      'x-frame-options': 'SAMEORIGIN',
      'cache-control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('The SURAKSHA website asset could not be loaded.');
  }
});

server.listen(port, host, () => {
  console.log(`SURAKSHA website listening on http://${host}:${port}`);
  console.log(`Read-only backend bridge: ${backendOrigin ? 'configured' : 'not configured'}`);
  console.log(`Local synthetic backend runs: ${demoBridgeEnabled && operatorApiKey.length >= 32 ? 'enabled' : 'disabled'}`);
});
