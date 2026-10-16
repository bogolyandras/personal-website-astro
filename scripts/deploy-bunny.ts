// Syncs a local directory (default: dist/) to a Bunny Storage zone, then purges the Bunny CDN pull zone.
//
// Changed and new files are uploaded first and stale remote files are deleted afterwards,
// so the site never has missing files mid-deploy. Unchanged files (same SHA-256) are skipped.
//
// Usage: bun scripts/deploy-bunny.ts [dir]
// Env:   BUNNY_STORAGE_ZONE, BUNNY_STORAGE_PASSWORD, BUNNY_API_KEY, BUNNY_PULL_ZONE_ID,
//        BUNNY_STORAGE_ENDPOINT (optional, defaults to storage.bunnycdn.com — Falkenstein)
//
// API reference: https://docs.bunny.net/reference/storage-api

import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

function env(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

const localDir = process.argv[2] ?? 'dist';
const zone = env('BUNNY_STORAGE_ZONE');
const storagePassword = env('BUNNY_STORAGE_PASSWORD');
const endpoint = env('BUNNY_STORAGE_ENDPOINT', 'storage.bunnycdn.com');
const apiKey = env('BUNNY_API_KEY');
const pullZoneId = env('BUNNY_PULL_ZONE_ID');

const storageUrl = (path: string) =>
  `https://${endpoint}/${encodeURIComponent(zone)}/${path.split('/').map(encodeURIComponent).join('/')}`;

async function request(method: string, url: string, accessKey: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, { ...init, method, headers: { AccessKey: accessKey, ...init.headers } });
  if (!response.ok) throw new Error(`${method} ${url} failed: ${response.status} ${await response.text()}`);
  return response;
}

const sha256 = (data: Uint8Array) => createHash('sha256').update(data).digest('hex').toUpperCase();

type StorageObject = { ObjectName: string; IsDirectory: boolean; Checksum: string | null };

/** Lists every remote file as path -> checksum, plus the remote directories. */
async function listRemote(prefix = '', files = new Map<string, string | null>(), dirs: string[] = []) {
  const response = await request('GET', storageUrl(prefix), storagePassword, { headers: { Accept: 'application/json' } });
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
  await request('PUT', storageUrl(path), storagePassword, {
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
  await request('DELETE', storageUrl(path), storagePassword);
  console.log(`deleted ${path}`);
}

console.log(`${uploaded} uploaded, ${localFiles.length - uploaded} unchanged, ${stale.length} deleted`);

if (uploaded > 0 || stale.length > 0) {
  // Give the storage zone a moment to replicate before the edge re-fetches from it.
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await request('POST', `https://api.bunny.net/pullzone/${pullZoneId}/purgeCache`, apiKey);
  console.log('purged pull zone cache');
}
