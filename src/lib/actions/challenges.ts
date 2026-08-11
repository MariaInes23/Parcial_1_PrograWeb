"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("No tienes permisos para realizar esta acción.");
  }
}

export async function createChallengeAction(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const difficulty = String(formData.get("difficulty") || "Media").trim();

  if (!title) throw new Error("El título del desafío es obligatorio.");

  db.prepare(
    "INSERT INTO challenges (title, description, category, difficulty) VALUES (?,?,?,?)"
  ).run(title, description || null, category || null, difficulty);

  revalidatePath("/desafios");
  redirect("/desafios");
}

export async function updateChallengeAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const difficulty = String(formData.get("difficulty") || "Media").trim();

  if (!title) throw new Error("El título del desafío es obligatorio.");

  db.prepare(
    "UPDATE challenges SET title=?, description=?, category=?, difficulty=? WHERE id=?"
  ).run(title, description || null, category || null, difficulty, id);

  revalidatePath("/desafios");
  redirect("/desafios");
}

export async function deleteChallengeAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  db.prepare("DELETE FROM challenges WHERE id=?").run(id);
  revalidatePath("/desafios");
  redirect("/desafios");
}
