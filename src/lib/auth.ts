import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "./db";

const SECRET = process.env.SESSION_SECRET || "hackathon-uni-dev-secret-change-me";
const COOKIE_NAME = "hackuni_session";

export type Role = "ADMIN" | "MENTOR" | "JUEZ";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export function hashPassword(pw: string) {
  return bcrypt.hashSync(pw, 10);
}

export function verifyPassword(pw: string, hash: string) {
  return bcrypt.compareSync(pw, hash);
}

export async function createSession(user: SessionUser) {
  const token = jwt.sign(user, SECRET, { expiresIn: "8h" });
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, SECRET) as SessionUser;
    return decoded;
  } catch {
    return null;
  }
}

export function findUserByEmail(email: string) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as
    | {
        id: number;
        name: string;
        email: string;
        password: string;
        role: Role;
        especialidad: string | null;
      }
    | undefined;
}
