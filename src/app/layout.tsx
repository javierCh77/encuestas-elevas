// src/app/layout.tsx
import "./globals.css";

import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";



export const metadata: Metadata = {
  title: "Encuestas Elevas",
  description: "Formulario de encuestas para colaboradores",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#f9f5f1] text-[#322616]">
        <Toaster position="top-center" />
        <main className="min-h-screen w-full flex flex-col items-center justify-start">
          {children}
        </main>
      </body>
    </html>
  );
}
