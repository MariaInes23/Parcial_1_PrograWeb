import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSubmission } from "@/lib/queries";
import { deleteSubmissionAction } from "@/lib/actions/submissions";

export default async function EntregaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getSubmission(Number(id));
  if (!data) notFound();
  const { submission, evaluations } = data;
  const user = await getCurrentUser();
  const canManage = user?.role === "ADMIN" || user?.role === "MENTOR";
  const alreadyEvaluated = user?.role === "JUEZ" && evaluations.some((e) => e.judgeId === user.id);

  return (
    <div>
      <p className="prompt font-display text-sm text-muted">
        <Link href="/entregas" className="hover:text-accent">entregas</Link> / {submission.title}
      </p>
      <div className="flex items-start justify-between mt-1 mb-8">
        <h1 className="font-display text-3xl">{submission.title}</h1>
        <span className="badge">{submission.status}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="card p-6">
          <h2 className="font-display text-lg mb-4">Detalle del proyecto</h2>
          <dl className="text-sm flex flex-col gap-3">
            <div>
              <dt className="text-muted">Equipo</dt>
              <dd><Link href={`/equipos/${submission.teamId}`} className="hover:text-accent">{submission.teamName}</Link></dd>
            </div>
            <div>
              <dt className="text-muted">Desafío</dt>
              <dd>{submission.challengeTitle}</dd>
            </div>
            <div>
              <dt className="text-muted">Descripción</dt>
              <dd className="text-muted">{submission.description || "—"}</dd>
            </div>
            {submission.repoUrl && (
              <div>
                <dt className="text-muted">Repositorio</dt>
                <dd><a href={submission.repoUrl} target="_blank" className="text-teal hover:underline">{submission.repoUrl}</a></dd>
              </div>
            )}
            {submission.demoUrl && (
              <div>
                <dt className="text-muted">Demo</dt>
                <dd><a href={submission.demoUrl} target="_blank" className="text-teal hover:underline">{submission.demoUrl}</a></dd>
              </div>
            )}
          </dl>

          {canManage && (
            <div className="flex gap-3 mt-6 pt-4 border-t border-border">
              <Link href={`/entregas/${submission.id}/editar`} className="btn-ghost px-4 py-2 text-sm">Editar</Link>
              <form action={deleteSubmissionAction}>
                <input type="hidden" name="id" value={submission.id} />
                <button type="submit" className="btn-danger px-4 py-2 text-sm">Eliminar</button>
              </form>
            </div>
          )}

          {user?.role === "JUEZ" && (
            <div className="mt-6 pt-4 border-t border-border">
              {alreadyEvaluated ? (
                <p className="text-sm text-muted">Ya registraste tu evaluación para esta entrega.</p>
              ) : (
                <Link href={`/evaluaciones/nueva?submissionId=${submission.id}`} className="btn-primary px-4 py-2 text-sm inline-block">
                  Evaluar esta entrega
                </Link>
              )}
            </div>
          )}
        </section>

        <section className="card p-6">
          <h2 className="font-display text-lg mb-4">Evaluaciones ({evaluations.length})</h2>
          <ul className="flex flex-col gap-4">
            {evaluations.length === 0 && <li className="text-muted text-sm">Sin evaluaciones registradas todavía.</li>}
            {evaluations.map((e) => {
              const total = e.innovacion + e.tecnica + e.impacto + e.presentacion;
              return (
                <li key={e.id} className="border-b border-border pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">{e.judgeName}</p>
                    <span className="badge text-accent border-accent/30">{total} / 40</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2 text-xs text-muted">
                    <span>Innovación: {e.innovacion}</span>
                    <span>Técnica: {e.tecnica}</span>
                    <span>Impacto: {e.impacto}</span>
                    <span>Presentación: {e.presentacion}</span>
                  </div>
                  {e.comentarios && <p className="text-sm text-muted mt-2">{e.comentarios}</p>}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
