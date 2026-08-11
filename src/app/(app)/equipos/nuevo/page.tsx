import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listMentorsRaw } from "@/lib/queries";
import { createTeamAction } from "@/lib/actions/teams";

export default async function NuevoEquipoPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") redirect("/equipos");
  const mentors = listMentorsRaw();

  return (
    <div className="max-w-lg">
      <p className="prompt font-display text-sm text-muted">gestión / equipos</p>
      <h1 className="font-display text-3xl mt-1 mb-8">Nuevo equipo</h1>

      <form action={createTeamAction} className="card p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="name">Nombre del equipo</label>
          <input id="name" name="name" required placeholder="Los Byte Runners" className="px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="description">Descripción</label>
          <textarea id="description" name="description" rows={3} placeholder="Facultad, carrera, enfoque del equipo…" className="px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="mentorId">Mentor asignado</label>
          <select id="mentorId" name="mentorId" className="px-3 py-2.5">
            <option value="">Sin asignar</option>
            {mentors.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary py-2.5 mt-2">Crear equipo</button>
      </form>
    </div>
  );
}
