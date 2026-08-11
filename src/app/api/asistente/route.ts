import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// URL del servidor local de Ollama. Si corres Ollama en otra máquina o puerto,
// cambia esto (puedes moverlo a una variable de entorno OLLAMA_URL si prefieres).
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:3b";

const SYSTEM_PROMPT = `Eres el asistente virtual de HackUni, un sistema de gestión de un
hackathon universitario. Ayudas a organizadores, mentores y jueces a resolver dudas sobre
equipos, desafíos, entregas y evaluaciones. Responde siempre en español, de forma breve y clara.`;

export async function POST(req: NextRequest) {
  // Solo usuarios con sesión iniciada pueden usar el asistente
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const messages = body.messages as { role: "user" | "assistant"; content: string }[];

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
  }

  let ollamaResponse: Response;
  try {
    ollamaResponse = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudo conectar con Ollama. Verifica que esté corriendo en tu máquina (ollama serve) y que el modelo esté descargado.",
      },
      { status: 502 }
    );
  }

  if (!ollamaResponse.ok || !ollamaResponse.body) {
    return NextResponse.json({ error: "Ollama respondió con un error" }, { status: 502 });
  }

  // Ollama devuelve un stream de líneas JSON (una por token/chunk).
  // Las transformamos en un stream de texto plano para el cliente.
  const stream = new ReadableStream({
    async start(controller) {
      const reader = ollamaResponse.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              controller.enqueue(encoder.encode(json.message.content));
            }
          } catch {
            // ignora líneas que no se puedan parsear
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
