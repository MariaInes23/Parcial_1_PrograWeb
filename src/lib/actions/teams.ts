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
  return user;
}

export async function createTeamAction(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const mentorId = formData.get("mentorId") ? Number(formData.get("mentorId")) : null;

  if (!name) throw new Error("El nombre del equipo es obligatorio.");

  db.prepare("INSERT INTO teams (name, description, mentorId) VALUES (?,?,?)").run(
    name,
    description || null,
    mentorId
  );

  revalidatePath("/equipos");
  redirect("/equipos");
}

export async function updateTeamAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const mentorId = formData.get("mentorId") ? Number(formData.get("mentorId")) : null;

  if (!name) throw new Error("El nombre del equipo es obligatorio.");

  db.prepare("UPDATE teams SET name=?, description=?, mentorId=? WHERE id=?").run(
    name,
    description || null,
    mentorId,
    id
  );

  revalidatePath("/equipos");
  revalidatePath(`/equipos/${id}`);
  redirect(`/equipos/${id}`);
}

export async function deleteTeamAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  db.prepare("DELETE FROM teams WHERE id=?").run(id);
  revalidatePath("/equipos");
  redirect("/equipos");
}

export async function addMemberAction(formData: FormData) {
  await requireAdmin();
  const teamId = Number(formData.get("teamId"));
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const rol = String(formData.get("rol") || "Integrante").trim();

  if (!name) throw new Error("El nombre del integrante es obligatorio.");

  db.prepare("INSERT INTO team_members (teamId, name, email, rol) VALUES (?,?,?,?)").run(
    teamId,
    name,
    email || null,
    rol
  );

  revalidatePath(`/equipos/${teamId}`);
}

export async function removeMemberAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const teamId = Number(formData.get("teamId"));
  db.prepare("DELETE FROM team_members WHERE id=?").run(id);
  revalidatePath(`/equipos/${teamId}`);
}
