import { createChallengeAction } from "@/lib/actions/challenges";

export default function NuevoDesafioPage() {
  return (
    <div className="max-w-lg">
      <p className="prompt font-display text-sm text-muted">gestión / desafíos</p>
      <h1 className="font-display text-3xl mt-1 mb-8">Nuevo desafío</h1>

      <form action={createChallengeAction} className="card p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="title">Título</label>
          <input id="title" name="title" required className="px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="description">Descripción del reto</label>
          <textarea id="description" name="description" rows={4} className="px-3 py-2.5" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted" htmlFor="category">Categoría</label>
            <input id="category" name="category" placeholder="Sostenibilidad, Salud…" className="px-3 py-2.5" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted" htmlFor="difficulty">Dificultad</label>
            <select id="difficulty" name="difficulty" defaultValue="Media" className="px-3 py-2.5">
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn-primary py-2.5 mt-2">Publicar desafío</button>
      </form>
    </div>
  );
}
