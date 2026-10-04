import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const indexPath = path.resolve("dist/client/index.html");
const html = await readFile(indexPath, "utf8");

// vinext currently emits two entry scripts as `/./_next/...` when Vite uses a
// relative base. That works at a domain root but breaks inside the nested URL
// used for an uploaded Yandex Games archive. All game assets must stay relative;
// `/sdk.js` deliberately remains root-relative because Yandex proxies it.
const fixed = html.replace(/(["'])\/\.\/_next\//g, "$1./_next/");

if (fixed === html && html.includes('/./_next/')) {
  throw new Error("Failed to normalize Yandex Games asset paths");
}

await writeFile(indexPath, fixed);
