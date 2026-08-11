import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listTeamsRaw, listChallengesRaw } from "@/lib/queries";
import { createSubmissionAction } from "@/lib/actions/submissions";

export default async function NuevaEntregaPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN" && user?.role !== "MENTOR") redirect("/entregas");
  const teams = listTeamsRaw();
  const challenges = listChallengesRaw();

  return (
    <div className="max-w-lg">
      <p className="prompt font-display text-sm text-muted">gestión / entregas</p>
      <h1 className="font-display text-3xl mt-1 mb-8">Registrar entrega</h1>

      <form action={createSubmissionAction} className="card p-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted" htmlFor="teamId">Equipo</label>
            <select id="teamId" name="teamId" required className="px-3 py-2.5">
              <option value="">Selecciona…</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted" htmlFor="challengeId">Desafío</label>
            <select id="challengeId" name="challengeId" required className="px-3 py-2.5">
              <option value="">Selecciona…</option>
              {challenges.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="title">Título del proyecto</label>
          <input id="title" name="title" required className="px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="description">Descripción</label>
          <textarea id="description" name="description" rows={3} className="px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="repoUrl">Repositorio (URL)</label>
          <input id="repoUrl" name="repoUrl" type="url" placeholder="https://github.com/…" className="px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="demoUrl">Demo (URL)</label>
          <input id="demoUrl" name="demoUrl" type="url" placeholder="https://…" className="px-3 py-2.5" />
        </div>
        <button type="submit" className="btn-primary py-2.5 mt-2">Registrar entrega</button>
      </form>
    </div>
  );
}
