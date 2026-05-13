import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createClient();
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true);

    const { data: stations, error: staError } = await supabase
      .from("stations")
      .select("*")
      .eq("is_active", true);

    return NextResponse.json({
      categories: { data: categories, error: catError },
      stations: { data: stations, error: staError },
      env: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
