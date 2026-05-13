import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Try env var first, fallback to hardcoded for initial setup
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY2RieWR0a3FhYm14a2RjdWdwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY3ODU2NiwiZXhwIjoyMDk0MjU0NTY2fQ.G6rPY396CESUfO95SYShRmjPNkJGxu5DRmGblMUtvSI";

  if (!supabaseUrl) {
    return NextResponse.json({ error: "SUPABASE_URL not configured" }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Delete existing users first
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    if (existingUsers?.users) {
      for (const user of existingUsers.users) {
        await supabase.auth.admin.deleteUser(user.id);
      }
    }

    // Create new admin user with confirmed email
    const { data, error } = await supabase.auth.admin.createUser({
      email: "admin@coti.app",
      password: "Coti2026!",
      email_confirm: true,
      user_metadata: { full_name: "Admin COTI" },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create profile
    await supabase.from("profiles").upsert({
      id: data.user.id,
      full_name: "Admin COTI",
      role: "admin",
    });

    return NextResponse.json({
      success: true,
      message: "Admin criado com sucesso! Email: admin@coti.app | Senha: Coti2026!",
      user_id: data.user.id,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
