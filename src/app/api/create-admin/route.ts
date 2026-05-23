import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured" }, { status: 500 });
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
