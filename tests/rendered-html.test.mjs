import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const exportRoot = path.resolve("dist/client");
const maxUncompressedBytes = 100 * 1024 * 1024;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolutePath)));
    else files.push(absolutePath);
  }

  return files;
}

test("Yandex Games export is ready to upload", async () => {
  const indexPath = path.join(exportRoot, "index.html");
  const html = await readFile(indexPath, "utf8");
  const files = await walk(exportRoot);
  const relativeFiles = files.map((file) => path.relative(exportRoot, file));
  const totalBytes = (
    await Promise.all(files.map(async (file) => (await stat(file)).size))
  ).reduce((sum, size) => sum + size, 0);

  assert.match(html, /CarDealer/i, "export should contain the game shell");
  assert.match(
    html,
    /<script[^>]+src=["']\/sdk\.js["'][^>]*>/i,
    "Yandex Games SDK must be connected in the initial HTML",
  );
  assert.match(
    html,
    /window\.YaGames\.init\(\)/,
    "Yandex Games SDK must be initialized from the initial HTML",
  );
  const rootAbsoluteAssets = [
    ...html.matchAll(/(?:src|href)=["']\/(?!sdk\.js(?:["']))[^"']+/gi),
  ].map((match) => match[0]);
  assert.deepEqual(
    rootAbsoluteAssets,
    [],
    `archive assets must use relative paths: ${rootAbsoluteAssets.join(", ")}`,
  );
  assert.equal(
    relativeFiles.some((file) => /[\s\u0400-\u04ff]/u.test(file)),
    false,
    "asset paths must not contain spaces or Cyrillic characters",
  );
  assert.ok(
    totalBytes <= maxUncompressedBytes,
    `uncompressed export is ${(totalBytes / 1024 / 1024).toFixed(2)} MB`,
  );
});
