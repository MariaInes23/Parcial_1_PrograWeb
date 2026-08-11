import ChatClient from "./ChatClient";

export default function AsistentePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl">Asistente IA</h1>
        <p className="text-muted text-sm mt-1">
          Modelo local (Ollama · qwen2.5:3b). Corre en tu computadora, no envía datos a internet.
        </p>
      </div>

      <ChatClient />
    </div>
  );
}
