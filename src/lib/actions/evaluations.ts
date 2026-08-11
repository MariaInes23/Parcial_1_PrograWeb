"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

function clampScore(v: FormDataEntryValue | null) {
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.max(1, Math.min(10, Math.round(n)));
}

export async function createEvaluationAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "JUEZ") {
    throw new Error("Solo un juez puede registrar evaluaciones.");
  }

  const submissionId = Number(formData.get("submissionId"));
  const innovacion = clampScore(formData.get("innovacion"));
  const tecnica = clampScore(formData.get("tecnica"));
  const impacto = clampScore(formData.get("impacto"));
  const presentacion = clampScore(formData.get("presentacion"));
  const comentarios = String(formData.get("comentarios") || "").trim();

  const existing = db
    .prepare("SELECT id FROM evaluations WHERE submissionId=? AND judgeId=?")
    .get(submissionId, user.id);

  if (existing) {
    throw new Error("Ya evaluaste esta entrega. Edítala desde el listado.");
  }

  db.prepare(
    `INSERT INTO evaluations (submissionId, judgeId, innovacion, tecnica, impacto, presentacion, comentarios)
     VALUES (?,?,?,?,?,?,?)`
  ).run(submissionId, user.id, innovacion, tecnica, impacto, presentacion, comentarios || null);

  revalidatePath("/evaluaciones");
  revalidatePath(`/entregas/${submissionId}`);
  redirect("/evaluaciones");
}

export async function updateEvaluationAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("No autenticado.");

  const id = Number(formData.get("id"));
  const submissionId = Number(formData.get("submissionId"));

  const evalRow = db.prepare("SELECT judgeId FROM evaluations WHERE id=?").get(id) as
    | { judgeId: number }
    | undefined;

  if (!evalRow || (user.role !== "ADMIN" && evalRow.judgeId !== user.id)) {
    throw new Error("No tienes permisos para editar esta evaluación.");
  }

  const innovacion = clampScore(formData.get("innovacion"));
  const tecnica = clampScore(formData.get("tecnica"));
  const impacto = clampScore(formData.get("impacto"));
  const presentacion = clampScore(formData.get("presentacion"));
  const comentarios = String(formData.get("comentarios") || "").trim();

  db.prepare(
    `UPDATE evaluations SET innovacion=?, tecnica=?, impacto=?, presentacion=?, comentarios=? WHERE id=?`
  ).run(innovacion, tecnica, impacto, presentacion, comentarios || null, id);

  revalidatePath("/evaluaciones");
  revalidatePath(`/entregas/${submissionId}`);
  redirect("/evaluaciones");
}

export async function deleteEvaluationAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("No autenticado.");

  const id = Number(formData.get("id"));
  const evalRow = db.prepare("SELECT judgeId FROM evaluations WHERE id=?").get(id) as
    | { judgeId: number }
    | undefined;

  if (!evalRow || (user.role !== "ADMIN" && evalRow.judgeId !== user.id)) {
    throw new Error("No tienes permisos para eliminar esta evaluación.");
  }

  db.prepare("DELETE FROM evaluations WHERE id=?").run(id);
  revalidatePath("/evaluaciones");
}
