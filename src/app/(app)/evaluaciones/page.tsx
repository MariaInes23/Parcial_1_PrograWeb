import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { listEvaluations, listSubmissions } from "@/lib/queries";
import { deleteEvaluationAction } from "@/lib/actions/evaluations";

type EvalRow = {
  id: number;
  judgeName: string;
  submissionId: number;
  submissionTitle: string;
  teamName: string;
  challengeTitle: string;
  innovacion: number;
  tecnica: number;
  impacto: number;
  presentacion: number;
  comentarios: string | null;
  judgeId: number;
};

export default async function EvaluacionesPage() {
  const user = await getCurrentUser();
  const evaluations = listEvaluations(user?.role === "JUEZ" ? user.id : undefined) as EvalRow[];

  let pending: ReturnType<typeof listSubmissions> = [];
  if (user?.role === "JUEZ") {
    const evaluatedIds = new Set(evaluations.map((e) => e.submissionId));
    pending = listSubmissions().filter((s) => !evaluatedIds.has(s.id));
  }

  return (
    <div>
      <p className="prompt font-display text-sm text-muted">gestión</p>
      <h1 className="font-display text-3xl mt-1 mb-8">Evaluaciones</h1>

      {user?.role === "JUEZ" && (
        <section className="mb-10">
          <h2 className="font-display text-lg mb-4">Entregas pendientes por evaluar</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="py-3 px-4 font-normal">Proyecto</th>
                  <th className="py-3 px-4 font-normal">Equipo</th>
                  <th className="py-3 px-4 font-normal">Desafío</th>
                  <th className="py-3 px-4 font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {pending.length === 0 && (
                  <tr><td colSpan={4} className="py-6 px-4 text-center text-muted">No tienes entregas pendientes. ¡Buen trabajo!</td></tr>
                )}
                {pending.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4">{s.title}</td>
                    <td className="py-3 px-4 text-muted">{s.teamName}</td>
                    <td className="py-3 px-4 text-muted">{s.challengeTitle}</td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/evaluaciones/nueva?submissionId=${s.id}`} className="btn-primary px-3 py-1.5 text-xs inline-block">
                        Evaluar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-lg mb-4">
          {user?.role === "JUEZ" ? "Mis evaluaciones registradas" : "Todas las evaluaciones"}
        </h2>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="py-3 px-4 font-normal">Proyecto</th>
                <th className="py-3 px-4 font-normal">Equipo</th>
                {user?.role !== "JUEZ" && <th className="py-3 px-4 font-normal">Juez</th>}
                <th className="py-3 px-4 font-normal">Puntaje total</th>
                <th className="py-3 px-4 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {evaluations.length === 0 && (
                <tr><td colSpan={5} className="py-8 px-4 text-center text-muted">Aún no hay evaluaciones registradas.</td></tr>
              )}
              {evaluations.map((e) => {
                const total = e.innovacion + e.tecnica + e.impacto + e.presentacion;
                const canEdit = user?.role === "ADMIN" || user?.id === e.judgeId;
                return (
                  <tr key={e.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4">
                      <Link href={`/entregas/${e.submissionId}`} className="hover:text-accent">{e.submissionTitle}</Link>
                    </td>
                    <td className="py-3 px-4 text-muted">{e.teamName}</td>
                    {user?.role !== "JUEZ" && <td className="py-3 px-4 text-muted">{e.judgeName}</td>}
                    <td className="py-3 px-4"><span className="badge text-accent border-accent/30">{total} / 40</span></td>
                    <td className="py-3 px-4 text-right">
                      {canEdit && (
                        <div className="flex gap-3 justify-end">
                          <Link href={`/evaluaciones/${e.id}/editar`} className="text-xs text-accent hover:underline">Editar</Link>
                          <form action={deleteEvaluationAction}>
                            <input type="hidden" name="id" value={e.id} />
                            <button type="submit" className="text-danger text-xs hover:underline">Eliminar</button>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
