import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import type { SessionUser } from "@/lib/auth";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Organizador",
  MENTOR: "Mentor",
  JUEZ: "Juez",
};

const LINKS: { href: string; label: string; roles: string[] }[] = [
  { href: "/dashboard", label: "Panel general", roles: ["ADMIN", "MENTOR", "JUEZ"] },
  { href: "/equipos", label: "Equipos", roles: ["ADMIN", "MENTOR", "JUEZ"] },
  { href: "/mentores", label: "Mentores", roles: ["ADMIN"] },
  { href: "/jueces", label: "Jueces", roles: ["ADMIN"] },
  { href: "/desafios", label: "Desafíos", roles: ["ADMIN", "MENTOR", "JUEZ"] },
  { href: "/entregas", label: "Entregas", roles: ["ADMIN", "MENTOR", "JUEZ"] },
  { href: "/evaluaciones", label: "Evaluaciones", roles: ["ADMIN", "MENTOR", "JUEZ"] },
  { href: "/asistente", label: "Asistente IA", roles: ["ADMIN", "MENTOR", "JUEZ"] },
];

export default function Sidebar({ user }: { user: SessionUser }) {
  const links = LINKS.filter((l) => l.roles.includes(user.role));

  return (
    <aside className="border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between p-6">
      <div>
        <Link href="/dashboard" className="font-display text-lg tracking-tight">
          hack<span className="text-accent">uni</span>
        </Link>

        <nav className="mt-8 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-md text-sm text-muted hover:text-text hover:bg-elevated transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-10 pt-4 border-t border-border">
        <p className="text-sm text-text truncate">{user.name}</p>
        <span className="badge mt-1 text-accent border-accent/30">{ROLE_LABEL[user.role]}</span>
        <form action={logoutAction} className="mt-4">
          <button type="submit" className="btn-ghost text-sm px-3 py-1.5 w-full">
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
