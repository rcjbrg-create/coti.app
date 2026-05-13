/**
 * Offline cache strategy for COTI PWA.
 *
 * The actual service worker lives in /public/sw.js.
 * This module exports helpers for registration and cache config constants
 * that can be imported by client components.
 */

export const SW_CACHE_VERSION = "coti-v1";

export const CACHE_NAMES = {
  STATIC: `coti-static-${SW_CACHE_VERSION}`,
  IMAGES: `coti-images-${SW_CACHE_VERSION}`,
  PAGES: `coti-pages-${SW_CACHE_VERSION}`,
} as const;

/**
 * Critical app shell routes pre-cached during SW install.
 */
export const CRITICAL_ROUTES = [
  "/",
  "/categorias",
  "/pracas",
  "/checklist",
  "/manifest.webmanifest",
] as const;

/**
 * Register the service worker. Safe to call on every page load —
 * the browser deduplicates registrations automatically.
 */
export function registerServiceWorker(): void {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        // Check for SW updates every hour
        setInterval(() => {
          registration.update().catch(() => {});
        }, 60 * 60 * 1000);
      })
      .catch(() => {
        // SW registration failed – app still works fully online
      });
  });
}
