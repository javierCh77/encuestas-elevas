"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function GraciasPage() {
  const router = useRouter();

  useEffect(() => {
    // Disparar confeti animado al cargar
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });

    // Repetir un poco más para dar efecto
    const interval = setInterval(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 600);

    // Cortar a los 2.5 segundos
    setTimeout(() => clearInterval(interval), 2500);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5f1] text-[#322616] px-4 w-full">
      <div className="bg-white rounded-lg shadow p-8 max-w-md w-full text-center space-y-6 border border-[#ddd]">
        <h1 className="text-3xl font-bold">🎉 ¡Gracias por tu respuesta!</h1>
        <p className="text-lg">Tu opinión es muy valiosa para nosotros.</p>
        <button
          onClick={() => router.push("/encuestas")}
          className="mt-4 bg-[#6c5435] text-white px-6 py-3 rounded-md hover:bg-[#8c7242] transition font-semibold cursor-pointer"
        >
          Enviar otra respuesta
        </button>
      </div>
    </div>
  );
}
