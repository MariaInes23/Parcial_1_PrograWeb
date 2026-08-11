"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import type { Role } from "@/lib/auth";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("No tienes permisos para realizar esta acción.");
  }
  return user;
}

// role: "MENTOR" | "JUEZ" -- reutilizado para ambas entidades (mentores y jueces)
export async function createPersonAction(formData: FormData) {
  await requireAdmin();
  const role = String(formData.get("role")) as Role;
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const especialidad = String(formData.get("especialidad") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!name || !email || !password) {
    throw new Error("Nombre, correo y contraseña son obligatorios.");
  }

  db.prepare(
    "INSERT INTO users (name, email, password, role, especialidad) VALUES (?,?,?,?,?)"
  ).run(name, email, hashPassword(password), role, especialidad || null);

  const path = role === "MENTOR" ? "/mentores" : "/jueces";
  revalidatePath(path);
  redirect(path);
}

export async function updatePersonAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const role = String(formData.get("role")) as Role;
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const especialidad = String(formData.get("especialidad") || "").trim();

  if (!name || !email) throw new Error("Nombre y correo son obligatorios.");

  db.prepare("UPDATE users SET name=?, email=?, especialidad=? WHERE id=?").run(
    name,
    email,
    especialidad || null,
    id
  );

  const path = role === "MENTOR" ? "/mentores" : "/jueces";
  revalidatePath(path);
  redirect(path);
}

export async function deletePersonAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const role = String(formData.get("role")) as Role;
  db.prepare("DELETE FROM users WHERE id=?").run(id);
  const path = role === "MENTOR" ? "/mentores" : "/jueces";
  revalidatePath(path);
  redirect(path);
}
