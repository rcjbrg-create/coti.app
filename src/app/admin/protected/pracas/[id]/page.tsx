import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/layout/section-header";
import { StationForm } from "@/components/admin/station-form";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPracaPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();
  const { data: station } = await supabase.from("stations").select("*").eq("id", id).single();
  if (!station) notFound();

  return (
    <div>
      <SectionHeader title="Editar Praca" />
      <div className="px-4"><StationForm station={station} /></div>
    </div>
  );
}
