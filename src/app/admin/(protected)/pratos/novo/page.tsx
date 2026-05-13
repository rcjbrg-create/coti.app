import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/layout/section-header";
import { DishForm } from "@/components/admin/dish-form";

export default async function NovoPratoPage() {
  await requireAdmin();
  const supabase = await createClient();
  const [{ data: categories }, { data: stations }] = await Promise.all([
    supabase.from("categories").select("id, name").eq("is_active", true).order("display_order"),
    supabase.from("stations").select("id, name").eq("is_active", true).order("display_order"),
  ]);

  return (
    <div>
      <SectionHeader title="Novo Prato" />
      <div className="px-4">
        <DishForm categories={categories || []} stations={stations || []} />
      </div>
    </div>
  );
}
