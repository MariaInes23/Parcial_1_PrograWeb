import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr]">
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
          backgroundImage: "linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        <div className="relative">
          <span className="font-display text-accent text-sm">hackuni --system</span>
          <h1 className="font-display text-5xl mt-6 leading-tight">
            Evento de<br />Innovación<br />Tecnológica
          </h1>
          <p className="text-muted mt-6 max-w-sm leading-relaxed">
            Un solo panel para coordinar equipos, mentores, desafíos, entregas
            y evaluaciones del hackathon universitario, del kickoff al demo day.
          </p>
        </div>
        <div className="relative flex gap-8 font-display text-xs text-muted">
          <span className="badge">EQUIPOS</span>
          <span className="badge">MENTORES</span>
          <span className="badge">DESAFÍOS</span>
          <span className="badge">ENTREGAS</span>
          <span className="badge">EVALUACIONES</span>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <p className="prompt font-display text-sm text-muted mb-1">acceso al panel</p>
          <h2 className="font-display text-2xl mb-8">Iniciar sesión</h2>

          <LoginForm />

          <div className="mt-8 card p-4 text-xs text-muted leading-relaxed">
            <p className="text-text font-display mb-2">Credenciales de prueba</p>
            <p>Admin: admin@universidad.edu / admin123</p>
            <p>Mentor: ana.torres@universidad.edu / mentor123</p>
            <p>Juez: paola.sanchez@universidad.edu / juez123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
