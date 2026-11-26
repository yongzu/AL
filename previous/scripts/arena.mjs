// Are.na v3 API client shared by the arena-* scripts.
//
// - The token is read from .env (ARENA_TOKEN) and never printed.
// - Free tier allows 120 requests a minute; every call waits ~0.6s so a full run stays under it.
// - Writes (PUT/POST) are refused unless the caller passes { write: true } — scripts only
//   write when run with --apply, so a plain run is always a dry run.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://api.are.na/v3';

function loadEnv() {
  const env = {};
  try {
    for (const line of readFileSync(join(ROOT, '.env'), 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2];
    }
  } catch {
    // no .env — reads still work for a public channel, writes will fail
  }
  return env;
}

export const env = loadEnv();
export const CHANNEL = env.ARENA_CHANNEL || '1-aesthetic-literacy-qhm68ahvlpk';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function arena(path, { method = 'GET', body, write = false } = {}) {
  if (method !== 'GET' && !write) throw new Error(`refused ${method} ${path}: dry run (pass --apply to write)`);
  const headers = { Accept: 'application/json' };
  if (env.ARENA_TOKEN) headers.Authorization = `Bearer ${env.ARENA_TOKEN}`;
  if (body) headers['Content-Type'] = 'application/json';
  await sleep(600);
  const res = await fetch(`${API}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (res.status === 429) {
    const wait = Number(res.headers.get('retry-after') || 30);
    console.warn(`  rate limited — waiting ${wait}s`);
    await sleep(wait * 1000);
    return arena(path, { method, body, write });
  }
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

/** Every page of a paginated list endpoint. */
export async function arenaAll(path) {
  const out = [];
  for (let page = 1; ; page++) {
    const sep = path.includes('?') ? '&' : '?';
    const res = await arena(`${path}${sep}per=100&page=${page}`);
    out.push(...res.data);
    if (!res.meta?.has_more_pages) return out;
  }
}
