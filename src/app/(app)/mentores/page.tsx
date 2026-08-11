import Link from "next/link";
import { listPeople } from "@/lib/queries";
import { deletePersonAction } from "@/lib/actions/users";

export default function MentoresPage() {
  const mentors = listPeople("MENTOR");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="prompt font-display text-sm text-muted">gestión</p>
          <h1 className="font-display text-3xl mt-1">Mentores</h1>
        </div>
        <Link href="/mentores/nuevo" className="btn-primary px-4 py-2 text-sm">+ Nuevo mentor</Link>
      </div>

      <div className="card overflow-hidden mt-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="py-3 px-4 font-normal">Nombre</th>
              <th className="py-3 px-4 font-normal">Correo</th>
              <th className="py-3 px-4 font-normal">Especialidad</th>
              <th className="py-3 px-4 font-normal">Equipos a cargo</th>
              <th className="py-3 px-4 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {mentors.length === 0 && (
              <tr><td colSpan={5} className="py-8 px-4 text-center text-muted">Aún no hay mentores registrados.</td></tr>
            )}
            {mentors.map((m) => (
              <tr key={m.id} className="border-b border-border last:border-0">
                <td className="py-3 px-4">{m.name}</td>
                <td className="py-3 px-4 text-muted">{m.email}</td>
                <td className="py-3 px-4 text-muted">{m.especialidad ?? "—"}</td>
                <td className="py-3 px-4 text-muted">{m.teamCount}</td>
                <td className="py-3 px-4 text-right">
                  <form action={deletePersonAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="role" value="MENTOR" />
                    <button type="submit" className="text-danger text-xs hover:underline">Eliminar</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
