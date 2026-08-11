import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getTeam, listMentorsRaw } from "@/lib/queries";
import { updateTeamAction, deleteTeamAction, addMemberAction, removeMemberAction } from "@/lib/actions/teams";

export default async function EquipoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teamId = Number(id);
  const data = getTeam(teamId);
  if (!data) notFound();
  const { team, members, submissions } = data;
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";
  const mentors = isAdmin ? listMentorsRaw() : [];

  return (
    <div>
      <p className="prompt font-display text-sm text-muted">
        <Link href="/equipos" className="hover:text-accent">equipos</Link> / {team.name}
      </p>
      <h1 className="font-display text-3xl mt-1 mb-8">{team.name}</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="card p-6">
          <h2 className="font-display text-lg mb-4">Datos del equipo</h2>
          {isAdmin ? (
            <form action={updateTeamAction} className="flex flex-col gap-4">
              <input type="hidden" name="id" value={team.id} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted" htmlFor="name">Nombre</label>
                <input id="name" name="name" defaultValue={team.name} required className="px-3 py-2.5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted" htmlFor="description">Descripción</label>
                <textarea id="description" name="description" rows={3} defaultValue={team.description ?? ""} className="px-3 py-2.5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted" htmlFor="mentorId">Mentor asignado</label>
                <select id="mentorId" name="mentorId" defaultValue={team.mentorId ?? ""} className="px-3 py-2.5">
                  <option value="">Sin asignar</option>
                  {mentors.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 mt-2">
                <button type="submit" className="btn-primary px-4 py-2 text-sm">Guardar cambios</button>
              </div>
            </form>
          ) : (
            <div className="text-sm">
              <p className="text-muted">{team.description || "Sin descripción."}</p>
              <p className="mt-3">Mentor: <span className="text-text">{team.mentorName ?? "Sin asignar"}</span></p>
            </div>
          )}

          {isAdmin && (
            <form action={deleteTeamAction} className="mt-6 pt-4 border-t border-border">
              <input type="hidden" name="id" value={team.id} />
              <button type="submit" className="btn-danger px-4 py-2 text-sm">Eliminar equipo</button>
            </form>
          )}
        </section>

        <section className="card p-6">
          <h2 className="font-display text-lg mb-4">Integrantes</h2>
          <ul className="flex flex-col gap-2">
            {members.length === 0 && <li className="text-muted text-sm">Sin integrantes registrados.</li>}
            {members.map((m) => (
              <li key={m.id} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                <div>
                  <p>{m.name} <span className="badge ml-1">{m.rol}</span></p>
                  {m.email && <p className="text-muted text-xs">{m.email}</p>}
                </div>
                {isAdmin && (
                  <form action={removeMemberAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="teamId" value={team.id} />
                    <button type="submit" className="text-danger text-xs hover:underline">Quitar</button>
                  </form>
                )}
              </li>
            ))}
          </ul>

          {isAdmin && (
            <form action={addMemberAction} className="mt-5 pt-4 border-t border-border grid grid-cols-2 gap-3">
              <input type="hidden" name="teamId" value={team.id} />
              <input name="name" placeholder="Nombre" required className="px-3 py-2 col-span-2" />
              <input name="email" placeholder="Correo (opcional)" type="email" className="px-3 py-2" />
              <select name="rol" defaultValue="Integrante" className="px-3 py-2">
                <option>Líder</option>
                <option>Integrante</option>
              </select>
              <button type="submit" className="btn-ghost col-span-2 py-2 text-sm">+ Agregar integrante</button>
            </form>
          )}
        </section>
      </div>

      <section className="mt-6">
        <h2 className="font-display text-lg mb-4">Entregas del equipo</h2>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="py-3 px-4 font-normal">Proyecto</th>
                <th className="py-3 px-4 font-normal">Desafío</th>
                <th className="py-3 px-4 font-normal">Estado</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 && (
                <tr><td colSpan={3} className="py-6 px-4 text-center text-muted">Aún no hay entregas.</td></tr>
              )}
              {submissions.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="py-3 px-4">
                    <Link href={`/entregas/${s.id}`} className="hover:text-accent">{s.title}</Link>
                  </td>
                  <td className="py-3 px-4 text-muted">{s.challengeTitle}</td>
                  <td className="py-3 px-4"><span className="badge">{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
