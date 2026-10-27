// Blue-green deploy of a local directory (default: dist/) to one of two Bunny Storage zones (A and B).
//
// The pull zone's linked storage zone is the live one, so it is the only deploy state: the script
// syncs to the other (idle) zone, points the pull zone at it, then purges the CDN cache.
// A failed sync never touches live traffic, and rolling back is pointing the pull zone at the other zone.
//
// The sync uploads changed and new files first and deletes stale remote files afterwards.
// Unchanged files (same SHA-256) are skipped; the idle zone holds the build from two deploys ago.
//
// Usage: node scripts/deploy-bunny.ts [dir]  (Node 22.18+, which runs .ts files natively)
// Env:   BUNNY_API_KEY, BUNNY_PULL_ZONE_ID, BUNNY_STORAGE_ZONE_A, BUNNY_STORAGE_ZONE_B,
//        BUNNY_STORAGE_ENDPOINT (optional, defaults to storage.bunnycdn.com — Falkenstein)
//
// API reference: https://docs.bunny.net/reference/storage-api, https://docs.bunny.net/reference/bunnynet-api-overview

import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

function env(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

const localDir = process.argv[2] ?? 'dist';
const apiKey = env('BUNNY_API_KEY');
const pullZoneId = env('BUNNY_PULL_ZONE_ID');
const zoneIds = [Number(env('BUNNY_STORAGE_ZONE_A')), Number(env('BUNNY_STORAGE_ZONE_B'))];
const endpoint = env('BUNNY_STORAGE_ENDPOINT', 'storage.bunnycdn.com');

async function request(method: string, url: string, accessKey: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, { ...init, method, headers: { AccessKey: accessKey, ...init.headers } });
  if (!response.ok) throw new Error(`${method} ${url} failed: ${response.status} ${await response.text()}`);
  return response;
}

const api = async (method: string, path: string, body?: unknown) =>
  request(method, `https://api.bunny.net${path}`, apiKey, {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

type PullZone = { StorageZoneId: number };
type StorageZone = { Id: number; Name: string; Password: string };

// Pick the zone the pull zone is not serving from.
const pullZone = (await (await api('GET', `/pullzone/${pullZoneId}`)).json()) as PullZone;
if (!zoneIds.includes(pullZone.StorageZoneId)) {
  throw new Error(
    `Pull zone ${pullZoneId} serves storage zone ${pullZone.StorageZoneId}, which is neither A nor B (${zoneIds.join(', ')})`,
  );
}
const targetId = zoneIds.find((id) => id !== pullZone.StorageZoneId)!;
const target = (await (await api('GET', `/storagezone/${targetId}`)).json()) as StorageZone;
console.log(`live: storage zone ${pullZone.StorageZoneId}, deploying to: ${target.Name} (${target.Id})`);

const storageUrl = (path: string) =>
  `https://${endpoint}/${encodeURIComponent(target.Name)}/${path.split('/').map(encodeURIComponent).join('/')}`;

const sha256 = (data: Uint8Array) => createHash('sha256').update(data).digest('hex').toUpperCase();

type StorageObject = { ObjectName: string; IsDirectory: boolean; Checksum: string | null };

/** Lists every remote file as path -> checksum, plus the remote directories. */
async function listRemote(prefix = '', files = new Map<string, string | null>(), dirs: string[] = []) {
  const response = await request('GET', storageUrl(prefix), target.Password, { headers: { Accept: 'application/json' } });
  for (const object of (await response.json()) as StorageObject[]) {
    const path = prefix + object.ObjectName;
    if (object.IsDirectory) {
      dirs.push(path + '/');
      await listRemote(path + '/', files, dirs);
    } else {
      files.set(path, object.Checksum);
    }
  }
  return { files, dirs };
}

// Local files as forward-slash paths relative to localDir.
const localFiles = (await readdir(localDir, { recursive: true, withFileTypes: true }))
  .filter((entry) => entry.isFile())
  .map((entry) => relative(localDir, join(entry.parentPath, entry.name)).split(sep).join('/'));

const remote = await listRemote();
let uploaded = 0;

for (const path of localFiles) {
  const data = await readFile(join(localDir, path));
  const checksum = sha256(data);
  if (remote.files.get(path) === checksum) continue;
  await request('PUT', storageUrl(path), target.Password, {
    body: data,
    headers: { 'Content-Type': 'application/octet-stream', Checksum: checksum },
  });
  console.log(`uploaded ${path}`);
  uploaded++;
}

// Delete stale files, and stale directories as a whole (Bunny deletes directories recursively).
const localSet = new Set(localFiles);
const staleDirs = remote.dirs.filter((dir) => !localFiles.some((file) => file.startsWith(dir)));
const isInStaleDir = (path: string) => staleDirs.some((dir) => path.startsWith(dir) && path !== dir);
const stale = [
  ...staleDirs.filter((dir) => !isInStaleDir(dir)),
  ...[...remote.files.keys()].filter((path) => !localSet.has(path) && !isInStaleDir(path)),
];

for (const path of stale) {
  await request('DELETE', storageUrl(path), target.Password);
  console.log(`deleted ${path}`);
}

console.log(`${uploaded} uploaded, ${localFiles.length - uploaded} unchanged, ${stale.length} deleted`);

// Give the storage zone a moment to replicate before the edge starts fetching from it.
if (uploaded > 0 || stale.length > 0) await new Promise((resolve) => setTimeout(resolve, 5000));

await api('POST', `/pullzone/${pullZoneId}`, { StorageZoneId: target.Id });
console.log(`switched pull zone ${pullZoneId} to ${target.Name}`);

await api('POST', `/pullzone/${pullZoneId}/purgeCache`);
console.log('purged pull zone cache');
