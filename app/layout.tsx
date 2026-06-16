import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hogar Misional",
  description: "Agenda de comidas para las misioneras de nuestro barrio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // 🔥 INTERRUPTOR DE MANTENIMIENTO
  // Cambia a 'true' para bloquear toda la página y mostrar la pantalla de actualización
  const isMaintenance = true; 

  // PANTALLA DE MANTENIMIENTO
  if (isMaintenance) {
    return (
      <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <body className="min-h-full flex items-center justify-center bg-[#f8fafc] p-6 font-sans">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-10 max-w-md text-center shadow-xl shadow-iglesia-blue/5 border border-white">
            <h1 className="text-2xl font-extrabold text-iglesia-blue mb-2">Página en Mantenimiento</h1>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              Estamos actualizando el sistema para mejorar tu experiencia. Por favor, regresa en unos minutos.
            </p>
            <div className="w-8 h-8 border-4 border-slate-200 border-t-misional-gold rounded-full animate-spin mx-auto"></div>
          </div>
        </body>
      </html>
    );
  }

  // PANTALLA NORMAL (La página funcionando)
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}