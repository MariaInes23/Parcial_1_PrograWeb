"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function requireAdminOrMentor() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "MENTOR")) {
    throw new Error("No tienes permisos para realizar esta acción.");
  }
  return user;
}

export async function createSubmissionAction(formData: FormData) {
  await requireAdminOrMentor();
  const teamId = Number(formData.get("teamId"));
  const challengeId = Number(formData.get("challengeId"));
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const repoUrl = String(formData.get("repoUrl") || "").trim();
  const demoUrl = String(formData.get("demoUrl") || "").trim();

  if (!teamId || !challengeId || !title) {
    throw new Error("Equipo, desafío y título son obligatorios.");
  }

  db.prepare(
    `INSERT INTO submissions (teamId, challengeId, title, description, repoUrl, demoUrl, status)
     VALUES (?,?,?,?,?,?, 'ENVIADA')`
  ).run(teamId, challengeId, title, description || null, repoUrl || null, demoUrl || null);

  revalidatePath("/entregas");
  redirect("/entregas");
}

export async function updateSubmissionAction(formData: FormData) {
  await requireAdminOrMentor();
  const id = Number(formData.get("id"));
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const repoUrl = String(formData.get("repoUrl") || "").trim();
  const demoUrl = String(formData.get("demoUrl") || "").trim();
  const status = String(formData.get("status") || "ENVIADA").trim();

  if (!title) throw new Error("El título es obligatorio.");

  db.prepare(
    "UPDATE submissions SET title=?, description=?, repoUrl=?, demoUrl=?, status=? WHERE id=?"
  ).run(title, description || null, repoUrl || null, demoUrl || null, status, id);

  revalidatePath("/entregas");
  revalidatePath(`/entregas/${id}`);
  redirect(`/entregas/${id}`);
}

export async function deleteSubmissionAction(formData: FormData) {
  await requireAdminOrMentor();
  const id = Number(formData.get("id"));
  db.prepare("DELETE FROM submissions WHERE id=?").run(id);
  revalidatePath("/entregas");
  redirect("/entregas");
}
