import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen grid lg:grid-cols-[240px_1fr]">
      <Sidebar user={user} />
      <main className="p-6 lg:p-10 max-w-6xl w-full">{children}</main>
    </div>
  );
}
