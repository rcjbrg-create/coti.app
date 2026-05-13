import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseAnon);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: "admin@coti.app",
    password: "Coti2026!",
  });

  if (error) {
    return NextResponse.json({ login_error: error.message, error_status: error.status });
  }

  // Check profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  return NextResponse.json({
    login: "SUCCESS",
    user_id: data.user.id,
    email: data.user.email,
    profile,
    profile_error: profileError?.message,
  });
}
