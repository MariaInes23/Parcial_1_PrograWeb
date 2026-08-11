import { getCurrentUser } from "@/lib/auth";
import { dashboardStats, leaderboard } from "@/lib/queries";
import Link from "next/link";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "organizador",
  MENTOR: "mentor",
  JUEZ: "juez",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const stats = dashboardStats();
  const top = leaderboard().slice(0, 5);

  const cards = [
    { label: "Equipos", value: stats.teams, href: "/equipos" },
    { label: "Mentores", value: stats.mentors, href: "/mentores" },
    { label: "Jueces", value: stats.judges, href: "/jueces" },
    { label: "Desafíos", value: stats.challenges, href: "/desafios" },
    { label: "Entregas", value: stats.submissions, href: "/entregas" },
    { label: "Evaluaciones", value: stats.evaluations, href: "/evaluaciones" },
  ].filter((c) => user?.role === "ADMIN" || !["Mentores", "Jueces"].includes(c.label));

  return (
    <div>
      <p className="prompt font-display text-sm text-muted">panel general</p>
      <h1 className="font-display text-3xl mt-1">
        Hola, {user?.name.split(" ")[0]} <span className="text-muted text-lg">— {ROLE_LABEL[user?.role ?? "ADMIN"]}</span>
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card p-5 hover:border-accent/50 transition-colors">
            <p className="text-3xl font-display text-accent">{c.value}</p>
            <p className="text-sm text-muted mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg mb-4">Tabla de posiciones (top 5)</h2>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="py-3 px-4 font-normal">#</th>
                <th className="py-3 px-4 font-normal">Entrega</th>
                <th className="py-3 px-4 font-normal">Equipo</th>
                <th className="py-3 px-4 font-normal">Desafío</th>
                <th className="py-3 px-4 font-normal">Evaluaciones</th>
                <th className="py-3 px-4 font-normal">Puntaje prom.</th>
              </tr>
            </thead>
            <tbody>
              {top.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-muted text-center">
                    Aún no hay entregas evaluadas.
                  </td>
                </tr>
              )}
              {top.map((row, i) => (
                <tr key={row.submissionId} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-display text-accent">{i + 1}</td>
                  <td className="py-3 px-4">
                    <Link href={`/entregas/${row.submissionId}`} className="hover:text-accent">
                      {row.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-muted">{row.teamName}</td>
                  <td className="py-3 px-4 text-muted">{row.challengeTitle}</td>
                  <td className="py-3 px-4 text-muted">{row.evalCount}</td>
                  <td className="py-3 px-4">
                    {row.avgScore ? row.avgScore.toFixed(1) : <span className="text-muted">—</span>} / 40
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
