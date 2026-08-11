import Link from "next/link";
import { listPeople } from "@/lib/queries";
import { deletePersonAction } from "@/lib/actions/users";

export default function JuecesPage() {
  const judges = listPeople("JUEZ");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="prompt font-display text-sm text-muted">gestión</p>
          <h1 className="font-display text-3xl mt-1">Jueces</h1>
        </div>
        <Link href="/jueces/nuevo" className="btn-primary px-4 py-2 text-sm">+ Nuevo juez</Link>
      </div>

      <div className="card overflow-hidden mt-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="py-3 px-4 font-normal">Nombre</th>
              <th className="py-3 px-4 font-normal">Correo</th>
              <th className="py-3 px-4 font-normal">Especialidad</th>
              <th className="py-3 px-4 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {judges.length === 0 && (
              <tr><td colSpan={4} className="py-8 px-4 text-center text-muted">Aún no hay jueces registrados.</td></tr>
            )}
            {judges.map((j) => (
              <tr key={j.id} className="border-b border-border last:border-0">
                <td className="py-3 px-4">{j.name}</td>
                <td className="py-3 px-4 text-muted">{j.email}</td>
                <td className="py-3 px-4 text-muted">{j.especialidad ?? "—"}</td>
                <td className="py-3 px-4 text-right">
                  <form action={deletePersonAction}>
                    <input type="hidden" name="id" value={j.id} />
                    <input type="hidden" name="role" value="JUEZ" />
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
