import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, "hackathon.db");

declare global {
  var __hackathonDb: Database.Database | undefined;
}

function createConnection() {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export const db = global.__hackathonDb ?? createConnection();
if (process.env.NODE_ENV !== "production") global.__hackathonDb = db;

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('ADMIN','MENTOR','JUEZ')),
      especialidad TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      mentorId INTEGER REFERENCES users(id) ON DELETE SET NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teamId INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT,
      rol TEXT NOT NULL DEFAULT 'Integrante'
    );

    CREATE TABLE IF NOT EXISTS challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      difficulty TEXT NOT NULL DEFAULT 'Media',
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teamId INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      challengeId INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      repoUrl TEXT,
      demoUrl TEXT,
      status TEXT NOT NULL DEFAULT 'ENVIADA',
      submittedAt TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(teamId, challengeId)
    );

    CREATE TABLE IF NOT EXISTS evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submissionId INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
      judgeId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      innovacion INTEGER NOT NULL,
      tecnica INTEGER NOT NULL,
      impacto INTEGER NOT NULL,
      presentacion INTEGER NOT NULL,
      comentarios TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(submissionId, judgeId)
    );
  `);

  const userCount = (db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number }).c;
  if (userCount === 0) {
    const hash = (pw: string) => bcrypt.hashSync(pw, 10);
    const insertUser = db.prepare(
      "INSERT INTO users (name, email, password, role, especialidad) VALUES (?,?,?,?,?)"
    );
    insertUser.run("Administrador General", "admin@universidad.edu", hash("admin123"), "ADMIN", null);
    insertUser.run("Ana Torres", "ana.torres@universidad.edu", hash("mentor123"), "MENTOR", "Desarrollo Web");
    insertUser.run("Luis Ramírez", "luis.ramirez@universidad.edu", hash("mentor123"), "MENTOR", "Inteligencia Artificial");
    insertUser.run("Dra. Paola Sánchez", "paola.sanchez@universidad.edu", hash("juez123"), "JUEZ", "Innovación");
    insertUser.run("Ing. Marco Díaz", "marco.diaz@universidad.edu", hash("juez123"), "JUEZ", "Arquitectura de Software");

    const insertChallenge = db.prepare(
      "INSERT INTO challenges (title, description, category, difficulty) VALUES (?,?,?,?)"
    );
    insertChallenge.run(
      "Movilidad Universitaria Inteligente",
      "Diseñar una solución que optimice rutas de transporte interno del campus en tiempo real.",
      "Movilidad",
      "Alta"
    );
    insertChallenge.run(
      "Gestión Sostenible de Residuos",
      "Aplicación para clasificar y reportar puntos de reciclaje dentro de la universidad.",
      "Sostenibilidad",
      "Media"
    );
    insertChallenge.run(
      "Accesibilidad Académica",
      "Herramienta que facilite el acceso a material de estudio para estudiantes con discapacidad visual.",
      "Inclusión",
      "Alta"
    );

    const insertTeam = db.prepare(
      "INSERT INTO teams (name, description, mentorId) VALUES (?,?,?)"
    );
    insertTeam.run("Los Byte Runners", "Equipo de la Facultad de Ingeniería en Sistemas.", 2);
    insertTeam.run("Neural Squad", "Equipo enfocado en soluciones con IA.", 3);

    const insertMember = db.prepare(
      "INSERT INTO team_members (teamId, name, email, rol) VALUES (?,?,?,?)"
    );
    insertMember.run(1, "Carlos Pérez", "carlos.perez@uni.edu", "Líder");
    insertMember.run(1, "María López", "maria.lopez@uni.edu", "Integrante");
    insertMember.run(2, "José Gómez", "jose.gomez@uni.edu", "Líder");
    insertMember.run(2, "Fernanda Ruiz", "fernanda.ruiz@uni.edu", "Integrante");
  }
}

initSchema();
