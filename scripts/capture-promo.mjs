import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const debugPort = 9333;
const gameUrl = "http://127.0.0.1:4174/";
const outputPath = new URL("../promo/screenshot-auction.png", import.meta.url);

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--window-size=1600,900",
  `--remote-debugging-port=${debugPort}`,
  "--user-data-dir=/private/tmp/cardealer-promo-profile",
  gameUrl,
]);

async function waitForTarget() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(
        (response) => response.json(),
      );
      const target = targets.find((item) => item.type === "page");
      if (target) return target;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("Chrome DevTools target was not ready");
}

const target = await waitForTarget();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 1;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function send(method, params = {}) {
  const id = nextId++;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

await send("Page.enable");
await send("Runtime.enable");
await new Promise((resolve) => setTimeout(resolve, 1400));
await send("Runtime.evaluate", {
  expression: `
    localStorage.setItem("cardealer-clean-reset-2026-09-19-time-v1", "done");
    localStorage.setItem("autoimport-player-name", "Ivan");
    localStorage.setItem("autoimport-company-name", "North Star Auto");
    localStorage.setItem("cardealer-tutorial-status", "skipped");
    localStorage.setItem("cardealer-save-v2", JSON.stringify({
      screen: "auction",
      balance: 28750,
      day: 1,
      reputation: 8,
      xp: 420,
      completedDeals: 3,
      dealStreak: 2,
      closedLotIds: [],
      favoriteLotIds: [],
      clientLeads: [],
      acceptedContracts: []
    }));
    location.reload();
  `,
});
await new Promise((resolve) => setTimeout(resolve, 2600));
const screenshot = await send("Page.captureScreenshot", {
  format: "png",
  fromSurface: true,
  captureBeyondViewport: false,
});
await writeFile(outputPath, Buffer.from(screenshot.data, "base64"));

socket.close();
chrome.kill("SIGTERM");

