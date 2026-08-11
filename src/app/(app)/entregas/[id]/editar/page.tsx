import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSubmission } from "@/lib/queries";
import { updateSubmissionAction } from "@/lib/actions/submissions";

export default async function EditarEntregaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN" && user?.role !== "MENTOR") redirect("/entregas");

  const data = getSubmission(Number(id));
  if (!data) notFound();
  const { submission } = data;

  return (
    <div className="max-w-lg">
      <p className="prompt font-display text-sm text-muted">gestión / entregas</p>
      <h1 className="font-display text-3xl mt-1 mb-8">Editar entrega</h1>

      <form action={updateSubmissionAction} className="card p-6 flex flex-col gap-4">
        <input type="hidden" name="id" value={submission.id} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="title">Título del proyecto</label>
          <input id="title" name="title" defaultValue={submission.title} required className="px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="description">Descripción</label>
          <textarea id="description" name="description" rows={3} defaultValue={submission.description ?? ""} className="px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="repoUrl">Repositorio (URL)</label>
          <input id="repoUrl" name="repoUrl" type="url" defaultValue={submission.repoUrl ?? ""} className="px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="demoUrl">Demo (URL)</label>
          <input id="demoUrl" name="demoUrl" type="url" defaultValue={submission.demoUrl ?? ""} className="px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="status">Estado</label>
          <select id="status" name="status" defaultValue={submission.status} className="px-3 py-2.5">
            <option value="ENVIADA">Enviada</option>
            <option value="EN_REVISION">En revisión</option>
            <option value="EVALUADA">Evaluada</option>
            <option value="DESCALIFICADA">Descalificada</option>
          </select>
        </div>
        <button type="submit" className="btn-primary py-2.5 mt-2">Guardar cambios</button>
      </form>
    </div>
  );
}
