import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { listSubmissions } from "@/lib/queries";

const STATUS_COLOR: Record<string, string> = {
  ENVIADA: "text-teal border-teal/30",
  EN_REVISION: "text-accent border-accent/30",
  EVALUADA: "text-accent border-accent/30",
  DESCALIFICADA: "text-danger border-danger/30",
};

export default async function EntregasPage() {
  const user = await getCurrentUser();
  const submissions = listSubmissions();
  const canCreate = user?.role === "ADMIN" || user?.role === "MENTOR";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="prompt font-display text-sm text-muted">gestión</p>
          <h1 className="font-display text-3xl mt-1">Entregas</h1>
        </div>
        {canCreate && (
          <Link href="/entregas/nuevo" className="btn-primary px-4 py-2 text-sm">+ Registrar entrega</Link>
        )}
      </div>

      <div className="card overflow-hidden mt-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="py-3 px-4 font-normal">Proyecto</th>
              <th className="py-3 px-4 font-normal">Equipo</th>
              <th className="py-3 px-4 font-normal">Desafío</th>
              <th className="py-3 px-4 font-normal">Estado</th>
              <th className="py-3 px-4 font-normal">Evaluaciones</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 && (
              <tr><td colSpan={5} className="py-8 px-4 text-center text-muted">Aún no se ha registrado ninguna entrega.</td></tr>
            )}
            {submissions.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-elevated/60">
                <td className="py-3 px-4">
                  <Link href={`/entregas/${s.id}`} className="hover:text-accent">{s.title}</Link>
                </td>
                <td className="py-3 px-4 text-muted">{s.teamName}</td>
                <td className="py-3 px-4 text-muted">{s.challengeTitle}</td>
                <td className="py-3 px-4">
                  <span className={`badge ${STATUS_COLOR[s.status] ?? ""}`}>{s.status}</span>
                </td>
                <td className="py-3 px-4 text-muted">
                  {s.evalCount} {s.avgScore ? `· ${s.avgScore.toFixed(1)}/40` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
