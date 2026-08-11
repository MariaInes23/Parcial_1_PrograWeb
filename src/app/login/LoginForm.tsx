"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm text-muted">Correo institucional</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="tu.correo@universidad.edu"
          className="px-3 py-2.5"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm text-muted">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="px-3 py-2.5"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-danger border border-danger/40 bg-danger/10 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={isPending} className="btn-primary py-2.5 mt-1 disabled:opacity-60">
        {isPending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
