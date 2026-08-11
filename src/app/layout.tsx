import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HackUni — Gestión del Hackathon",
  description: "Panel de administración del Evento de Innovación Tecnológica universitario.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
