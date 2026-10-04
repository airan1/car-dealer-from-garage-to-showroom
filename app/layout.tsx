import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarDealer Game",
  description: "A car dealer simulator about auctions, shipping, repairs, and profitable sales.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        {/* Yandex proxies this path for archive-hosted games. Keep it in the
            initial HTML so moderation can verify the SDK before app startup. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- Yandex requires
            the SDK proxy to load before the immediately following init call. */}
        <script src="/sdk.js" />
        {/* Initialize immediately after the synchronous SDK proxy script. This
            does not depend on React hydration, so Yandex moderation sees the
            required init call even while the game bundle is still loading. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  if (!window.YaGames || window.__yandexSdkPromise) return;
  window.__yandexSdkPromise = window.YaGames.init()
    .then(function (ysdk) {
      window.ysdk = ysdk;
      return ysdk;
    })
    .catch(function (error) {
      console.error("[Yandex Games] SDK init failed", error);
      return null;
    });
})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
