"use client";

import { useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    // Placeholder para la respuesta del asistente, se va llenando con el stream
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/asistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al contactar al asistente");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, content: last.content + chunk };
          return updated;
        });

        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {messages.length === 0 && (
          <p className="text-muted text-sm">
            Pregúntale al asistente sobre equipos, desafíos, entregas o evaluaciones.
          </p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
              m.role === "user"
                ? "self-end bg-accent-soft border border-accent/30 text-text"
                : "self-start bg-elevated border border-border text-text"
            }`}
          >
            {m.content || (m.role === "assistant" && loading ? "…" : "")}
          </div>
        ))}

        {error && (
          <div className="self-start rounded-lg px-4 py-2 text-sm border border-danger text-danger">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="border-t border-border p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          className="flex-1 px-3 py-2 text-sm"
          disabled={loading}
        />
        <button type="submit" className="btn-primary px-4 py-2 text-sm" disabled={loading}>
          {loading ? "Enviando…" : "Enviar"}
        </button>
      </form>
    </div>
  );
}
