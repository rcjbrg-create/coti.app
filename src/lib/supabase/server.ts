import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";

type CookieOptions = {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: "lax" | "strict" | "none" | boolean;
  secure?: boolean;
};

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://facdbydtkqabmxkdcugp.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY2RieWR0a3FhYm14a2RjdWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2Nzg1NjYsImV4cCI6MjA5NDI1NDU2Nn0.CisZJQ3JeYdPwHuvsyKpusrQoSIsexJlUEaYTZSGZBw";
  return { url, anonKey };
}

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });
}

export const createClient = createSupabaseServerClient;
