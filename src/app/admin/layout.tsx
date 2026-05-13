// Admin layout — route protection is layered:
// 1. Edge middleware (src/middleware.ts) redirects unauthenticated users away
//    from all /admin/* routes (except /admin/login).
// 2. Each admin server page calls requireAdmin() from @/lib/auth/guards
//    to verify the Supabase session and admin role before rendering.
// This layout provides the AdminShell UI shell for all admin routes.

import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
