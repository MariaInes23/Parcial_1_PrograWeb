import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateChallengeAction } from "@/lib/actions/challenges";

export default async function EditarDesafioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const challenge = db.prepare("SELECT * FROM challenges WHERE id = ?").get(Number(id)) as
    | { id: number; title: string; description: string | null; category: string | null; difficulty: string }
    | undefined;
  if (!challenge) notFound();

  return (
    <div className="max-w-lg">
      <p className="prompt font-display text-sm text-muted">gestión / desafíos</p>
      <h1 className="font-display text-3xl mt-1 mb-8">Editar desafío</h1>

      <form action={updateChallengeAction} className="card p-6 flex flex-col gap-4">
        <input type="hidden" name="id" value={challenge.id} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="title">Título</label>
          <input id="title" name="title" defaultValue={challenge.title} required className="px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted" htmlFor="description">Descripción del reto</label>
          <textarea id="description" name="description" rows={4} defaultValue={challenge.description ?? ""} className="px-3 py-2.5" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted" htmlFor="category">Categoría</label>
            <input id="category" name="category" defaultValue={challenge.category ?? ""} className="px-3 py-2.5" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted" htmlFor="difficulty">Dificultad</label>
            <select id="difficulty" name="difficulty" defaultValue={challenge.difficulty} className="px-3 py-2.5">
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn-primary py-2.5 mt-2">Guardar cambios</button>
      </form>
    </div>
  );
}
