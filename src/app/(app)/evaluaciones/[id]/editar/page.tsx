import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateEvaluationAction } from "@/lib/actions/evaluations";

const CRITERIA = [
  { name: "innovacion", label: "Innovación" },
  { name: "tecnica", label: "Calidad técnica" },
  { name: "impacto", label: "Impacto" },
  { name: "presentacion", label: "Presentación" },
] as const;

export default async function EditarEvaluacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const evaluation = db
    .prepare(
      `SELECT e.*, s.title as submissionTitle FROM evaluations e JOIN submissions s ON s.id = e.submissionId WHERE e.id = ?`
    )
    .get(Number(id)) as
    | {
        id: number;
        submissionId: number;
        submissionTitle: string;
        judgeId: number;
        innovacion: number;
        tecnica: number;
        impacto: number;
        presentacion: number;
        comentarios: string | null;
      }
    | undefined;

  if (!evaluation) notFound();
  if (user.role !== "ADMIN" && user.id !== evaluation.judgeId) redirect("/evaluaciones");

  return (
    <div className="max-w-lg">
      <p className="prompt font-display text-sm text-muted">evaluaciones</p>
      <h1 className="font-display text-3xl mt-1 mb-1">Editar evaluación</h1>
      <p className="text-muted text-sm mb-8">{evaluation.submissionTitle}</p>

      <form action={updateEvaluationAction} className="card p-6 flex flex-col gap-5">
        <input type="hidden" name="id" value={evaluation.id} />
        <input type="hidden" name="submissionId" value={evaluation.submissionId} />

        {CRITERIA.map((c) => (
          <div key={c.name} className="flex flex-col gap-1.5">
            <label className="text-sm" htmlFor={c.name}>{c.label}</label>
            <input
              id={c.name}
              name={c.name}
              type="number"
              min={1}
              max={10}
              defaultValue={evaluation[c.name]}
              required
              className="px-3 py-2.5 w-24"
            />
          </div>
        ))}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="comentarios">Comentarios para el equipo</label>
          <textarea id="comentarios" name="comentarios" rows={3} defaultValue={evaluation.comentarios ?? ""} className="px-3 py-2.5" />
        </div>

        <button type="submit" className="btn-primary py-2.5 mt-2">Guardar cambios</button>
      </form>
    </div>
  );
}
