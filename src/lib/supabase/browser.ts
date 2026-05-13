import { createBrowserClient } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://facdbydtkqabmxkdcugp.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY2RieWR0a3FhYm14a2RjdWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2Nzg1NjYsImV4cCI6MjA5NDI1NDU2Nn0.CisZJQ3JeYdPwHuvsyKpusrQoSIsexJlUEaYTZSGZBw";
  return { url, anonKey };
}

let browserClient: SupabaseClient | undefined;

export function createSupabaseBrowserClient() {
  if (!browserClient) {
    const { url, anonKey } = getSupabaseEnv();
    browserClient = createBrowserClient(url, anonKey);
  }
  return browserClient;
}

export const createClient = createSupabaseBrowserClient;
