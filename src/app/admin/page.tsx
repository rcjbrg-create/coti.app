import { requireAdmin } from "@/lib/auth/guards";
import { redirect } from "next/navigation";

export default async function AdminRootPage() {
  await requireAdmin();
  redirect("/admin/protected");
}
