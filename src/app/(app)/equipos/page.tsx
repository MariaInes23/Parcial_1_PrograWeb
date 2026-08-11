import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { listTeams } from "@/lib/queries";

export default async function EquiposPage() {
  const user = await getCurrentUser();
  const teams = listTeams();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="prompt font-display text-sm text-muted">gestión</p>
          <h1 className="font-display text-3xl mt-1">Equipos</h1>
        </div>
        {user?.role === "ADMIN" && (
          <Link href="/equipos/nuevo" className="btn-primary px-4 py-2 text-sm">
            + Nuevo equipo
          </Link>
        )}
      </div>

      <div className="card overflow-hidden mt-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="py-3 px-4 font-normal">Equipo</th>
              <th className="py-3 px-4 font-normal">Mentor</th>
              <th className="py-3 px-4 font-normal">Integrantes</th>
              <th className="py-3 px-4 font-normal">Entregas</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 px-4 text-center text-muted">
                  Todavía no hay equipos registrados. {user?.role === "ADMIN" && "Crea el primero con el botón de arriba."}
                </td>
              </tr>
            )}
            {teams.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0 hover:bg-elevated/60">
                <td className="py-3 px-4">
                  <Link href={`/equipos/${t.id}`} className="hover:text-accent">
                    {t.name}
                  </Link>
                  {t.description && <p className="text-muted text-xs mt-0.5 line-clamp-1">{t.description}</p>}
                </td>
                <td className="py-3 px-4 text-muted">{t.mentorName ?? "Sin asignar"}</td>
                <td className="py-3 px-4 text-muted">{t.memberCount}</td>
                <td className="py-3 px-4 text-muted">{t.submissionCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
