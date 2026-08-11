import Link from "next/link";
import { listChallenges } from "@/lib/queries";
import { deleteChallengeAction } from "@/lib/actions/challenges";

export default function DesafiosPage() {
  const challenges = listChallenges();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="prompt font-display text-sm text-muted">gestión</p>
          <h1 className="font-display text-3xl mt-1">Desafíos</h1>
        </div>
        <Link href="/desafios/nuevo" className="btn-primary px-4 py-2 text-sm">+ Nuevo desafío</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-8">
        {challenges.length === 0 && <p className="text-muted">Aún no hay desafíos publicados.</p>}
        {challenges.map((c) => (
          <div key={c.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg">{c.title}</h3>
              <span className="badge shrink-0">{c.difficulty}</span>
            </div>
            {c.category && <span className="badge mt-2 text-teal border-teal/30">{c.category}</span>}
            <p className="text-muted text-sm mt-3 leading-relaxed">{c.description}</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <span className="text-xs text-muted">{c.submissionCount} entregas recibidas</span>
              <div className="flex gap-3">
                <Link href={`/desafios/${c.id}/editar`} className="text-xs text-accent hover:underline">Editar</Link>
                <form action={deleteChallengeAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="text-danger text-xs hover:underline">Eliminar</button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
