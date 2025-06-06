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
    areaTrabajo: "",
    areaTrabajoOtro: "",
    respuestas: {
      climaComodidadEquipo: "1",
      climaAmbienteSaludable: "1",
      climaEquilibrioVida: "1",
      liderazgoInformacionClara: "1",
      liderazgoConfianzaDireccion: "1",
      liderazgoOpinionesEscuchadas: "1",
      recursosSatisfaccionSalario: "1",
      recursosCompensacionJusta: "1",
      desarrolloOportunidades: "1",
      desarrolloMotivacion: "1",
      desarrolloAporteSignificativo: "1",
      desarrolloContinuarEmpresa: "1",
      reconocimientoValorado: "1",
      reconocimientoDisfruteTrabajo: "1",
      culturaUnaPalabra: "",
      capacitacionesUtiles: "true",
    },
  });

  const AREAS_TRABAJO = [
    "Dirección / Gerencia General",
    "Administración / Finanzas / Contabilidad",
    "Recursos Humanos",
    "Comercial / Ventas / Atención al cliente",
    "Marketing / Comunicación",
    "Producción / Operaciones",
    "Logística / Abastecimiento / Compras",
    "Tecnología / Sistemas / IT / Soporte técnico",
    "Investigación y Desarrollo (I+D)",
    "Calidad / Seguridad e Higiene / Medio Ambiente",
    "Mantenimiento / Servicios Generales",
    "Legal / Asuntos Regulatorios",
    "Recepción / Front Desk / Atención presencial",
    "Limpieza / Housekeeping / Camareras",
    "Cocina / Producción de alimentos",
    "Atención médica / Enfermería / Servicios profesionales (clínicas, seguros, mutuales)",
    "Reservas / Coordinación de servicios (rent a car, inmobiliarias, hotelería)",
    "Servicios al cliente post venta / Garantías / Atención técnica (autos, motos, electrónica)",
    "Ropería / Lavandería / Logística interna (hoteles, sanatorios, supermercados)",
    "Salón / Mozos / Encargado de salón (restaurantes, bares, cafeterías)",
    "Barra / Cafetería / Bebidas",
    "Delivery / Reparto / Take away",
    "Caja / Facturación en punto de venta",
    "Otros (especificar)",
  ];

  const preguntasPorCategoria = [
    {
      titulo: "1. Clima Laboral",
      preguntas: [
        [
          "climaComodidadEquipo",
          "¿Te sentís cómodo/a y acompañado/a por tu equipo y tu supervisor?",
        ],
        [
          "climaAmbienteSaludable",
          "¿La empresa promueve un ambiente de trabajo saludable y seguro?",
        ],
        [
          "climaEquilibrioVida",
          "¿Percibís un buen equilibrio entre el trabajo y tu vida personal?",
        ],
      ],
    },
    {
      titulo: "2. Liderazgo y Comunicación",
      preguntas: [
        [
          "liderazgoInformacionClara",
          "¿Recibís información clara sobre cambios y decisiones importantes en la empresa?",
        ],
        [
          "liderazgoConfianzaDireccion",
          "¿Confiás en la dirección y el liderazgo de la organización?",
        ],
        [
          "liderazgoOpinionesEscuchadas",
          "¿Sentís que tus opiniones y sugerencias son escuchadas y consideradas?",
        ],
      ],
    },
    {
      titulo: "3. Recursos y Beneficios",
      preguntas: [
        [
          "recursosSatisfaccionSalario",
          "¿Estás satisfecho/a con tu salario y los beneficios que recibís?",
        ],
        [
          "recursosCompensacionJusta",
          "¿Considerás que tu compensación es justa en relación con tus tareas y responsabilidades?",
        ],
      ],
    },
    {
      titulo: "4. Desarrollo y Motivación",
      preguntas: [
        [
          "desarrolloOportunidades",
          "¿Sentís que tenés oportunidades de crecimiento y desarrollo profesional en la empresa?",
        ],
        [
          "desarrolloMotivacion",
          "¿Te sentís motivado/a para asistir a tu trabajo cada día?",
        ],
        [
          "desarrolloAporteSignificativo",
          "¿Percibís que tu trabajo genera un aporte significativo a la organización?",
        ],
        [
          "desarrolloContinuarEmpresa",
          "¿Te gustaría continuar trabajando en esta empresa a largo plazo?",
        ],
      ],
    },
    {
      titulo: "5. Reconocimiento y Satisfacción General",
      preguntas: [
        [
          "reconocimientoValorado",
          "¿Te sentís valorado/a y reconocido/a por tu trabajo?",
        ],
        [
          "reconocimientoDisfruteTrabajo",
          "¿Disfrutás del trabajo que realizás?",
        ],
      ],
    },
  ];

  const totalPreguntas =
    5 + (form.areaTrabajo === "Otros (especificar)" ? 1 : 0) + preguntasPorCategoria.reduce((acc, cat) => acc + cat.preguntas.length, 0) + 2; 

  const respuestasCompletadas = [
    form.nombre,
    form.apellido,
    form.dni,
    form.nombreEmpresa,
    form.areaTrabajo,
    ...(form.areaTrabajo === "Otros (especificar)"
      ? [form.areaTrabajoOtro]
      : []),
    ...preguntasPorCategoria.flatMap((cat) =>
      cat.preguntas.map(
        ([key]) => form.respuestas[key as keyof typeof form.respuestas]
      )
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

  const { nombre, apellido, dni, nombreEmpresa, areaTrabajo, areaTrabajoOtro } = form;

  const validarPaso1 = () => {
    return (
      nombre.trim() !== "" &&
      apellido.trim() !== "" &&
      dni.trim() !== "" &&
      nombreEmpresa.trim() !== "" &&
      areaTrabajo.trim() !== "" &&
      (areaTrabajo !== "Otros (especificar)" || areaTrabajoOtro.trim() !== "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault();

  const areaFinal =
    form.areaTrabajo === "Otros (especificar)"
      ? form.areaTrabajoOtro
      : form.areaTrabajo;

  const respuestasParseadas = {
      ...form.respuestas,
      capacitacionesUtiles: String(form.respuestas.capacitacionesUtiles),
  };

  const rawPayload = {
      ...form,
      areaTrabajo: areaFinal,
      respuestas: respuestasParseadas,
  };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { areaTrabajoOtro, ...payload } = rawPayload;
  try {
      await api.post("/respuesta-encuesta", payload);
      toast.success("Encuesta enviada correctamente");
      setTimeout(() => router.push("/gracias"), 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
      console.error("Error al enviar:", error.response?.data || error);
      toast.error(
        "❌ Error al enviar la encuesta. Verificá los datos ingresados"
      );
    }
  };

  return (
    <div className="w-full bg-[#f9f5f1] py-10 min-h-screen text-[#322616]">
      <div className="max-w-screen-lg mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <Image src="/images/elevas.png"  alt="Logo Elevas" width={120} height={60}/>
          <div className="text-sm text-[#6c5435] font-semibold">
            {format(new Date(), "dd/MM/yyyy")}
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">📝 Encuesta de Experiencia Colaborador</h2>
        <p className="text-sm mb-6">Paso {step} de 3</p>
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-[#c4b780] h-4 rounded-full transition-all duration-300" style={{ width: `${progreso}%` }}></div>
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
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">👤 Datos del colaborador</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[ ["nombre", "Nombre"], ["apellido", "Apellido"], ["dni", "DNI"],["nombreEmpresa", "Nombre de la empresa"],].map(([field, label]) => (
                        <div key={field}>
                          <label className="block mb-1 font-medium"> {label}</label>
                          <input name={field}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            value={(form as any)[field]}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#8c7242]"
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 mb-6">
                      <label className="block mb-1 font-medium"> Área en la que trabaja </label>
                      <select
                        name="areaTrabajo"
                        value={form.areaTrabajo}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#8c7242]"
                        required
                      >
                        <option value="">Seleccioná un área</option>
                        {AREAS_TRABAJO.map((area) => (
                          <option key={area} value={area}>{area} </option>
                        ))}
                      </select>
                    </div>

                    {form.areaTrabajo === "Otros (especificar)" && (
                      <div>
                        <label className="block mb-1 font-medium">Especificá el área en la que trabaja</label>
                        <input
                          name="areaTrabajoOtro"
                          value={form.areaTrabajoOtro}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#8c7242]"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button type="button" onClick={() => {
                        if (validarPaso1()) {
                          setStep(2);
                        } else {
                          toast.error("Por favor completá todos los campos del paso 1");
                        }
                      }}
                      className="bg-[#6c5435] text-white px-6 py-2 rounded-md hover:bg-[#8c7242] transition cursor-pointer"> Siguiente </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div className="bg-[#f1efe5] border border-[#ddd] rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-2 text-[#322616]"> 🧭 ¿Cómo responder? </h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-sm text-center">
                      <div className="p-2 rounded bg-[#fff7f0] border">1<br />
                        <span className="text-xs text-[#6c5435]">Muy en desacuerdo</span>
                      </div>
                      <div className="p-2 rounded bg-[#fff7f0] border">2<br />
                        <span className="text-xs text-[#6c5435]">En desacuerdo</span>
                      </div>
                      <div className="p-2 rounded bg-[#fff7f0] border">3<br />
                      <span className="text-xs text-[#6c5435]">Neutral</span>
                      </div>
                      <div className="p-2 rounded bg-[#fff7f0] border"> 4<br />
                        <span className="text-xs text-[#6c5435]">De acuerdo </span>
                      </div>
                      <div className="p-2 rounded bg-[#fff7f0] border">5<br />
                        <span className="text-xs text-[#6c5435]"> Muy de acuerdo</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6 space-y-6 border border-[#ddd]">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"> 📊 Preguntas </h3>
                    {preguntasPorCategoria.map((categoria) => (
                      <div key={categoria.titulo}>
                        <h4 className="font-semibold text-lg mt-4 mb-2">
                          {categoria.titulo}
                        </h4>
                        {categoria.preguntas.map(([key, pregunta]) => (
                          <div key={key} className="space-y-2 mb-4">
                            <p className="font-medium">{pregunta}</p>
                            <div className="flex gap-2 flex-wrap">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <label key={n} className="inline-flex items-center gap-1 text-sm" >
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
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <button type="button" onClick={() => setStep(1)} className="bg-[#ebe9d6] text-[#322616] px-6 py-2 rounded-md hover:bg-[#dad3ae] transition cursor-pointer"> Volver</button>
                    <button type="button" onClick={() => setStep(3)} className="bg-[#6c5435] text-white px-8 py-3 rounded-md hover:bg-[#8c7242] text-lg font-semibold transition cursor-pointer"> Siguiente</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div className="bg-white rounded-xl shadow p-6 space-y-6 border border-[#ddd]">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"> 💬 Feedback adicional </h3>
                    <div>
                      <label className="block mb-1 font-medium"> Define a la empresa que trabajas en una palabra</label>
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
                      <label className="block mb-1 font-medium"> ¿Las capacitaciones fueron útiles? </label>
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
                    <button type="button" onClick={() => setStep(2)} className="bg-[#ebe9d6] text-[#322616] px-6 py-2 rounded-md hover:bg-[#dad3ae] transition cursor-pointer" >  Volver </button>
                    <button type="submit" className="bg-[#6c5435] text-white px-8 py-3 rounded-md hover:bg-[#8c7242] text-lg font-semibold transition cursor-pointer" > Enviar encuesta </button>
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
