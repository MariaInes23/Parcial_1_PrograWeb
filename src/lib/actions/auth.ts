"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, findUserByEmail, verifyPassword } from "@/lib/auth";

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Ingresa tu correo y contraseña." };
  }

  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.password)) {
    return { error: "Credenciales inválidas. Verifica tu correo y contraseña." };
  }

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
