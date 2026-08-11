import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listSubmissions } from "@/lib/queries";
import { createEvaluationAction } from "@/lib/actions/evaluations";

const CRITERIA = [
  { name: "innovacion", label: "Innovación", help: "¿Qué tan original y creativa es la solución?" },
  { name: "tecnica", label: "Calidad técnica", help: "Robustez, arquitectura y correcto funcionamiento." },
  { name: "impacto", label: "Impacto", help: "Relevancia y beneficio para el problema planteado." },
  { name: "presentacion", label: "Presentación", help: "Claridad de la demo y del pitch del equipo." },
];

export default async function NuevaEvaluacionPage({
  searchParams,
}: {
  searchParams: Promise<{ submissionId?: string }>;
}) {
  const user = await getCurrentUser();
  if (user?.role !== "JUEZ") redirect("/evaluaciones");

  const { submissionId } = await searchParams;
  const submissions = listSubmissions();
  const selected = submissions.find((s) => String(s.id) === submissionId);

  return (
    <div className="max-w-lg">
      <p className="prompt font-display text-sm text-muted">evaluaciones</p>
      <h1 className="font-display text-3xl mt-1 mb-8">Nueva evaluación</h1>

      <form action={createEvaluationAction} className="card p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="submissionId">Entrega a evaluar</label>
          <select id="submissionId" name="submissionId" required defaultValue={selected?.id ?? ""} className="px-3 py-2.5">
            <option value="">Selecciona una entrega…</option>
            {submissions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} — {s.teamName} ({s.challengeTitle})
              </option>
            ))}
          </select>
        </div>

        {CRITERIA.map((c) => (
          <div key={c.name} className="flex flex-col gap-1.5">
            <label className="text-sm" htmlFor={c.name}>
              {c.label} <span className="text-muted text-xs">— {c.help}</span>
            </label>
            <input
              id={c.name}
              name={c.name}
              type="number"
              min={1}
              max={10}
              defaultValue={7}
              required
              className="px-3 py-2.5 w-24"
            />
          </div>
        ))}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="comentarios">Comentarios para el equipo</label>
          <textarea id="comentarios" name="comentarios" rows={3} className="px-3 py-2.5" />
        </div>

        <button type="submit" className="btn-primary py-2.5 mt-2">Guardar evaluación</button>
      </form>
    </div>
  );
}
