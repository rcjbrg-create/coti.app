"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/pwa/offline-cache";

export function SWRegister() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
