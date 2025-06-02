"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import api from "@/app/lib/api";

export default function EncuestaForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    nombreEmpresa: "",
    respuestas: {
      trabajoValorado: "1",
      claridadObjetivos: "1",
      comodidadFeedback: "1",
      culturaUnaPalabra: "",
      recomendariaEmpresa: "1",
      recursosDisponibles: "1",
      capacitacionesUtiles: "true",
      equilibrioVidaLaboral: "1",
      opinionTenidaEnCuenta: "1",
      oportunidadesDesarrollo: "1",
    },
  });

  const preguntasLikert = [
    ["trabajoValorado", "¿Te sentís valorado/a en tu trabajo?"],
    ["claridadObjetivos", "¿Tenés claridad sobre tus objetivos?"],
    ["comodidadFeedback", "¿Te sentís cómodo/a recibiendo feedback?"],
    ["recomendariaEmpresa", "¿Recomendarías la empresa?"],
    ["recursosDisponibles", "¿Contás con los recursos necesarios?"],
    ["equilibrioVidaLaboral", "¿Sentís equilibrio vida personal/laboral?"],
    ["opinionTenidaEnCuenta", "¿Sentís que tu opinión es tenida en cuenta?"],
    ["oportunidadesDesarrollo", "¿Tenés oportunidades de desarrollo?"],
  ];

  const totalPreguntas = 4 + preguntasLikert.length + 2;

  const respuestasCompletadas = [
    form.nombre,
    form.apellido,
    form.dni,
    form.nombreEmpresa,
    ...preguntasLikert.map(
      ([key]) => form.respuestas[key as keyof typeof form.respuestas]
    ),
    form.respuestas.culturaUnaPalabra,
    form.respuestas.capacitacionesUtiles,
  ].filter((val) => val && val !== "").length;

  const progreso = Math.round((respuestasCompletadas / totalPreguntas) * 100);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name in form.respuestas) {
      setForm({
        ...form,
        respuestas: {
          ...form.respuestas,
          [name]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validarPaso1 = () => {
    const { nombre, apellido, dni, nombreEmpresa } = form;
    return (
      nombre.trim() !== "" &&
      apellido.trim() !== "" &&
      dni.trim() !== "" &&
      nombreEmpresa.trim() !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", form);
    try {
      await api.post("/respuesta-encuesta", form);
      toast.success(" Encuesta enviada correctamente");
      setTimeout(() => router.push("/gracias"), 1500);
    } catch (error) {
      console.error("Error al enviar:", error);
      toast.error("❌ Error al enviar la encuesta dni ya registrado");
    }
  };

  return (
    <div className="w-full bg-[#f9f5f1] py-10 min-h-screen text-[#322616]">
      <div className="max-w-screen-lg mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <Image
            src="/images/elevas.png"
            alt="Logo Elevas"
            width={120}
            height={60}
          />
          <div className="text-sm text-[#6c5435] font-semibold">
            {format(new Date(), "dd/MM/yyyy")}
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          📝 Encuesta de Experiencia Colaborador
        </h2>
        <p className="text-sm mb-6">Paso {step} de 3</p>

        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-[#c4b780] h-4 rounded-full transition-all duration-300"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
          <p className="text-sm text-right mt-1">{progreso}% completado</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div className="space-y-8">
                  <div className="bg-white rounded-xl shadow p-6 border border-[#ddd]">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      👤 Datos del colaborador
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        ["nombre", "Nombre"],
                        ["apellido", "Apellido"],
                        ["dni", "DNI"],
                        ["nombreEmpresa", "Nombre de la empresa"],
                      ].map(([field, label]) => (
                        <div key={field}>
                          <label className="block mb-1 font-medium">
                            {label}
                          </label>
                          <input
                            name={field}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            value={(form as any)[field]}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#8c7242]"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (validarPaso1()) {
                          setStep(2);
                        } else {
                          toast.error(
                            "Por favor completá todos los campos del paso 1"
                          );
                        }
                      }}
                      className="bg-[#6c5435] text-white px-6 py-2 rounded-md hover:bg-[#8c7242] transition cursor-pointer"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div className="bg-white rounded-xl shadow p-6 space-y-6 border border-[#ddd]">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      📊 Preguntas
                    </h3>
                    {preguntasLikert.map(([key, pregunta]) => (
                      <div key={key} className="space-y-2">
                        <p className="font-medium">{pregunta}</p>
                        <div className="flex gap-2 flex-wrap">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <label
                              key={n}
                              className="inline-flex items-center gap-1 text-sm"
                            >
                              <input
                                type="radio"
                                name={key}
                                value={n.toString()}
                                checked={
                                  form.respuestas[
                                    key as keyof typeof form.respuestas
                                  ] === n.toString()
                                }
                                onChange={handleChange}
                                className="accent-[#1F5D89]"
                              />
                              {n}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-[#ebe9d6] text-[#322616] px-6 py-2 rounded-md hover:bg-[#dad3ae] transition cursor-pointer"
                    >
                      Volver
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-[#6c5435] text-white px-8 py-3 rounded-md hover:bg-[#8c7242] text-lg font-semibold transition cursor-pointer"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div className="bg-white rounded-xl shadow p-6 space-y-6 border border-[#ddd]">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      💬 Feedback adicional
                    </h3>
                    <div>
                      <label className="block mb-1 font-medium">
                        Cultura en una palabra:
                      </label>
                      <input
                        type="text"
                        name="culturaUnaPalabra"
                        value={form.respuestas.culturaUnaPalabra}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#1F5D89]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">
                        ¿Las capacitaciones fueron útiles?
                      </label>
                      <select
                        name="capacitacionesUtiles"
                        value={form.respuestas.capacitacionesUtiles}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#1F5D89]"
                      >
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-[#ebe9d6] text-[#322616] px-6 py-2 rounded-md hover:bg-[#dad3ae] transition cursor-pointer"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      className="bg-[#6c5435] text-white px-8 py-3 rounded-md hover:bg-[#8c7242] text-lg font-semibold transition cursor-pointer"
                    >
                      Enviar encuesta
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
