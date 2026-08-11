import { db } from "@/lib/db";

export type Team = {
  id: number;
  name: string;
  description: string | null;
  mentorId: number | null;
  mentorName: string | null;
  memberCount: number;
  submissionCount: number;
  createdAt: string;
};

export function listTeams(): Team[] {
  return db
    .prepare(
      `SELECT t.id, t.name, t.description, t.mentorId, u.name as mentorName, t.createdAt,
              (SELECT COUNT(*) FROM team_members m WHERE m.teamId = t.id) as memberCount,
              (SELECT COUNT(*) FROM submissions s WHERE s.teamId = t.id) as submissionCount
       FROM teams t
       LEFT JOIN users u ON u.id = t.mentorId
       ORDER BY t.createdAt DESC`
    )
    .all() as Team[];
}

export function getTeam(id: number) {
  const team = db
    .prepare(
      `SELECT t.id, t.name, t.description, t.mentorId, u.name as mentorName, t.createdAt
       FROM teams t LEFT JOIN users u ON u.id = t.mentorId WHERE t.id = ?`
    )
    .get(id) as (Team & { mentorId: number | null }) | undefined;
  if (!team) return null;

  const members = db
    .prepare("SELECT * FROM team_members WHERE teamId = ? ORDER BY id ASC")
    .all(id) as { id: number; name: string; email: string | null; rol: string }[];

  const submissions = db
    .prepare(
      `SELECT s.*, c.title as challengeTitle FROM submissions s
       JOIN challenges c ON c.id = s.challengeId WHERE s.teamId = ? ORDER BY s.submittedAt DESC`
    )
    .all(id) as { id: number; title: string; challengeTitle: string; status: string }[];

  return { team, members, submissions };
}

export function listPeople(role: "MENTOR" | "JUEZ") {
  return db
    .prepare(
      `SELECT id, name, email, especialidad, createdAt,
              (SELECT COUNT(*) FROM teams t WHERE t.mentorId = users.id) as teamCount
       FROM users WHERE role = ? ORDER BY createdAt DESC`
    )
    .all(role) as {
    id: number;
    name: string;
    email: string;
    especialidad: string | null;
    createdAt: string;
    teamCount: number;
  }[];
}

export function listMentorsRaw() {
  return db.prepare("SELECT id, name FROM users WHERE role = 'MENTOR' ORDER BY name").all() as {
    id: number;
    name: string;
  }[];
}

export function listChallenges() {
  return db
    .prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM submissions s WHERE s.challengeId = c.id) as submissionCount
       FROM challenges c ORDER BY c.createdAt DESC`
    )
    .all() as {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    difficulty: string;
    createdAt: string;
    submissionCount: number;
  }[];
}

export function listTeamsRaw() {
  return db.prepare("SELECT id, name FROM teams ORDER BY name").all() as { id: number; name: string }[];
}

export function listChallengesRaw() {
  return db.prepare("SELECT id, title FROM challenges ORDER BY title").all() as {
    id: number;
    title: string;
  }[];
}

export type SubmissionRow = {
  id: number;
  title: string;
  description: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  status: string;
  submittedAt: string;
  teamId: number;
  teamName: string;
  challengeId: number;
  challengeTitle: string;
  evalCount: number;
  avgScore: number | null;
};

export function listSubmissions(): SubmissionRow[] {
  return db
    .prepare(
      `SELECT s.*, t.name as teamName, c.title as challengeTitle,
              (SELECT COUNT(*) FROM evaluations e WHERE e.submissionId = s.id) as evalCount,
              (SELECT AVG(e.innovacion + e.tecnica + e.impacto + e.presentacion) FROM evaluations e WHERE e.submissionId = s.id) as avgScore
       FROM submissions s
       JOIN teams t ON t.id = s.teamId
       JOIN challenges c ON c.id = s.challengeId
       ORDER BY s.submittedAt DESC`
    )
    .all() as SubmissionRow[];
}

export function getSubmission(id: number) {
  const submission = db
    .prepare(
      `SELECT s.*, t.name as teamName, c.title as challengeTitle
       FROM submissions s JOIN teams t ON t.id = s.teamId JOIN challenges c ON c.id = s.challengeId
       WHERE s.id = ?`
    )
    .get(id) as (SubmissionRow & { teamId: number }) | undefined;
  if (!submission) return null;

  const evaluations = db
    .prepare(
      `SELECT e.*, u.name as judgeName FROM evaluations e JOIN users u ON u.id = e.judgeId
       WHERE e.submissionId = ? ORDER BY e.createdAt DESC`
    )
    .all(id) as {
    id: number;
    submissionId: number;
    judgeId: number;
    judgeName: string;
    innovacion: number;
    tecnica: number;
    impacto: number;
    presentacion: number;
    comentarios: string | null;
    createdAt: string;
  }[];

  return { submission, evaluations };
}

export function listEvaluations(judgeId?: number) {
  const base = `SELECT e.*, u.name as judgeName, s.title as submissionTitle, t.name as teamName, c.title as challengeTitle
     FROM evaluations e
     JOIN users u ON u.id = e.judgeId
     JOIN submissions s ON s.id = e.submissionId
     JOIN teams t ON t.id = s.teamId
     JOIN challenges c ON c.id = s.challengeId`;

  if (judgeId) {
    return db.prepare(`${base} WHERE e.judgeId = ? ORDER BY e.createdAt DESC`).all(judgeId);
  }
  return db.prepare(`${base} ORDER BY e.createdAt DESC`).all();
}

export function dashboardStats() {
  const teams = (db.prepare("SELECT COUNT(*) as c FROM teams").get() as { c: number }).c;
  const mentors = (db.prepare("SELECT COUNT(*) as c FROM users WHERE role='MENTOR'").get() as { c: number }).c;
  const judges = (db.prepare("SELECT COUNT(*) as c FROM users WHERE role='JUEZ'").get() as { c: number }).c;
  const challenges = (db.prepare("SELECT COUNT(*) as c FROM challenges").get() as { c: number }).c;
  const submissions = (db.prepare("SELECT COUNT(*) as c FROM submissions").get() as { c: number }).c;
  const evaluations = (db.prepare("SELECT COUNT(*) as c FROM evaluations").get() as { c: number }).c;
  return { teams, mentors, judges, challenges, submissions, evaluations };
}

export function leaderboard() {
  return db
    .prepare(
      `SELECT s.id as submissionId, s.title, t.name as teamName, c.title as challengeTitle,
              COUNT(e.id) as evalCount,
              AVG(e.innovacion + e.tecnica + e.impacto + e.presentacion) as avgScore
       FROM submissions s
       JOIN teams t ON t.id = s.teamId
       JOIN challenges c ON c.id = s.challengeId
       LEFT JOIN evaluations e ON e.submissionId = s.id
       GROUP BY s.id
       ORDER BY avgScore IS NULL, avgScore DESC`
    )
    .all() as {
    submissionId: number;
    title: string;
    teamName: string;
    challengeTitle: string;
    evalCount: number;
    avgScore: number | null;
  }[];
}
