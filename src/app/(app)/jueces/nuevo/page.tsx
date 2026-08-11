import { createPersonAction } from "@/lib/actions/users";

export default function NuevoJuezPage() {
  return (
    <div className="max-w-lg">
      <p className="prompt font-display text-sm text-muted">gestión / jueces</p>
      <h1 className="font-display text-3xl mt-1 mb-8">Nuevo juez</h1>

      <form action={createPersonAction} className="card p-6 flex flex-col gap-4">
        <input type="hidden" name="role" value="JUEZ" />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="name">Nombre completo</label>
          <input id="name" name="name" required className="px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="email">Correo institucional</label>
          <input id="email" name="email" type="email" required className="px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="especialidad">Área de evaluación</label>
          <input id="especialidad" name="especialidad" placeholder="Ej. Innovación, Arquitectura de software…" className="px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="password">Contraseña de acceso</label>
          <input id="password" name="password" type="password" required className="px-3 py-2.5" />
        </div>
        <button type="submit" className="btn-primary py-2.5 mt-2">Crear juez</button>
      </form>
    </div>
  );
}
