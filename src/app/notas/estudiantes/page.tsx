"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { inscribirEstudiante, obtenerMatrizNotas } from "../../actions";

export default function EstudiantesPage() {
  // --- ESTADOS DEL FORMULARIO ---
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [seccionSeleccionada, setSeccionSeleccionada] = useState("");
  const [cargando, setCargando] = useState(false);

  // --- ESTADOS DE LOS LISTADOS ---
  const [gradosVisibles, setGradosVisibles] = useState<Record<string, any[]>>(
    {},
  );
  const [abierto, setAbierto] = useState<string | null>(null);
  const [seccionVisualizacion, setSeccionVisualizacion] = useState<string>("");
  const [conteos, setConteos] = useState<Record<string, number | string>>({});

  // 💡 EL DICCIONARIO MAESTRO ACTUALIZADO CON TUS IDs REALES
  const NIVELES = [
    {
      nivel: "Pre-Primaria",
      grados: [
        { id: '11', nombre: 'Nursery I', secciones: [{ id: '1', label: 'Única' }] },
        { id: '12', nombre: 'Nursery II', secciones: [{ id: '1', label: 'Única' }] },
        { id: '13', nombre: 'Nursery III', secciones: [{ id: '1', label: 'Única' }] },
        { id: '4', nombre: 'Pre-Kinder', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '5', nombre: 'Kinder', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '1', nombre: 'Preparatoria', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
      ]
    },
    {
      nivel: "Primaria",
      grados: [
        { id: '6', nombre: '1ro Primaria', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '7', nombre: '2do Primaria', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '2', nombre: '3ro Primaria', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '8', nombre: '4to Primaria', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '9', nombre: '5to Primaria', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '10', nombre: '6to Primaria', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
      ]
    },
    {
      nivel: "Básico",
      grados: [
        { id: '14', nombre: 'Primero Básico', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '15', nombre: 'Segundo Básico', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '16', nombre: 'Tercero Básico', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }, { id: '3', label: 'C' }] },
      ]
    },
    {
      nivel: "Diversificado",
      grados: [
        { id: '17', nombre: 'Cuarto Bachillerato', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '18', nombre: 'Quinto Bachillerato', secciones: [{ id: '1', label: 'Única' }] },
        { id: '19', nombre: 'Cuarto Perito', secciones: [{ id: '1', label: 'Única' }] },
        { id: '20', nombre: 'Quinto Perito', secciones: [{ id: '1', label: 'Única' }] },
        { id: '21', nombre: 'Sexto Perito', secciones: [{ id: '1', label: 'Única' }] },
      ]
    }
  ];

  // Buscamos el grado seleccionado en el diccionario para el formulario
  const gradoSeleccionadoObj = NIVELES.flatMap((n) => n.grados).find(
    (g) => g.id === gradoSeleccionado,
  );

  const obtenerConteoUnico = (data: any[]) => {
    if (!data || !Array.isArray(data)) return 0;
    const nombresUnicos = new Set();
    data.forEach((curr) => {
      const nombreCompleto = curr.NOMBRE || `${curr.NOMBRES} ${curr.APELLIDOS}`;
      nombresUnicos.add(nombreCompleto);
    });
    return nombresUnicos.size;
  };

  // 💡 EFECTO SÚPER OPTIMIZADO (En Cascada)
  // Carga un grado a la vez para no colapsar la red del navegador ni el servidor
  useEffect(() => {
    let montado = true; // Para evitar errores si el usuario cambia de página rápido

    const cargarTodosLosConteos = async () => {
      const todosLosGrados = NIVELES.flatMap((n) => n.grados);

      for (const g of todosLosGrados) {
        if (!montado) break; // Si sale de la página, detenemos las peticiones

        try {
          // Busca las secciones de ESTE grado
          const promesas = g.secciones.map((sec) =>
            obtenerMatrizNotas(Number(g.id), Number(sec.id)),
          );
          const resultados = await Promise.all(promesas);

          let total = 0;
          resultados.forEach((res) => {
            total += obtenerConteoUnico(res);
          });

          // Actualizamos la pantalla con este número y pasamos al siguiente
          setConteos((prev) => ({ ...prev, [g.id]: total }));
        } catch (e) {
          console.error("Error cargando conteo para", g.nombre, e);
          setConteos((prev) => ({ ...prev, [g.id]: 0 }));
        }
      }
    };

    cargarTodosLosConteos();

    return () => {
      montado = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarEstudiantesGrado = async (gradoId: string, secId: string) => {
    try {
      const data = await obtenerMatrizNotas(Number(gradoId), Number(secId));
      const unicos = data.reduce((acc: any[], curr: any) => {
        const nombreCompleto =
          curr.NOMBRE || `${curr.NOMBRES} ${curr.APELLIDOS}`;
        if (!acc.find((a) => a.nombre === nombreCompleto)) {
          acc.push({
            nombre: nombreCompleto,
            codigo: curr.ID_ALUMNO || curr.id_estudiante || "S/C",
          });
        }
        return acc;
      }, []);
      setGradosVisibles((prev) => ({
        ...prev,
        [`${gradoId}-${secId}`]: unicos,
      }));
    } catch (error) {
      console.error("Error cargando alumnos:", error);
    }
  };

  const handleInscribir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombres || !apellidos || !gradoSeleccionado || !seccionSeleccionada) {
      return alert("⚠️ Por favor, completa todos los campos.");
    }
    setCargando(true);

    const res = await inscribirEstudiante(
      nombres,
      apellidos,
      Number(gradoSeleccionado),
      Number(seccionSeleccionada),
    );
    if (res.success) {
      alert("✅ ¡Estudiante inscrito con éxito!");
      setNombres("");
      setApellidos("");
      cargarEstudiantesGrado(gradoSeleccionado, seccionSeleccionada);

      // Sube el número de alumnos del círculo en 1
      setConteos((prev) => ({
        ...prev,
        [gradoSeleccionado]:
          typeof prev[gradoSeleccionado] === "number"
            ? (prev[gradoSeleccionado] as number) + 1
            : 1,
      }));
    }
    setCargando(false);
  };

  const toggleGrado = (g: any) => {
    if (abierto === g.id) {
      setAbierto(null);
    } else {
      setAbierto(g.id);
      // Abre la primera sección disponible por defecto
      const primeraSeccion = g.secciones[0]?.id || "1";
      setSeccionVisualizacion(primeraSeccion);
      cargarEstudiantesGrado(g.id, primeraSeccion);
    }
  };

  const cambiarSeccionVista = (sec: string) => {
    setSeccionVisualizacion(sec);
    if (abierto) {
      cargarEstudiantesGrado(abierto, sec);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="bg-red-700 text-white shadow-lg p-6 mb-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">
            Gestión de Alumnos
          </h1>
          <Link
            href="/notas"
            className="bg-white text-red-700 px-6 py-2 rounded-xl font-black text-xs uppercase shadow-md hover:bg-red-50 transition-colors"
          >
            Volver al Menú
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* FORMULARIO DE INSCRIPCIÓN */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 sticky top-10">
            <h2 className="text-xl font-black text-gray-800 uppercase mb-6 italic">
              Inscribir Alumno
            </h2>
            <form onSubmit={handleInscribir} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
                  Nombres
                </label>
                <input
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  type="text"
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none font-bold text-sm uppercase focus:border-red-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
                  Apellidos
                </label>
                <input
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  type="text"
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none font-bold text-sm uppercase focus:border-red-600 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
                    Grado
                  </label>
                  <select
                    value={gradoSeleccionado}
                    onChange={(e) => {
                      setGradoSeleccionado(e.target.value);
                      const obj = NIVELES.flatMap((n) => n.grados).find(
                        (g) => g.id === e.target.value,
                      );
                      if (obj && obj.secciones.length > 0)
                        setSeccionSeleccionada(obj.secciones[0].id);
                    }}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-[10px] uppercase outline-none focus:border-red-600 transition-colors"
                  >
                    <option value="">-- SELECCIONAR --</option>
                    {NIVELES.map((nivel) => (
                      <optgroup key={nivel.nivel} label={nivel.nivel}>
                        {nivel.grados.map((g: any) => (
                          <option key={g.id} value={g.id}>
                            {g.nombre}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
                    Sección
                  </label>
                  <select
                    value={seccionSeleccionada}
                    onChange={(e) => setSeccionSeleccionada(e.target.value)}
                    disabled={!gradoSeleccionadoObj}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-sm disabled:opacity-30 outline-none focus:border-red-600 transition-colors"
                  >
                    {!gradoSeleccionadoObj && <option value="">--</option>}
                    {gradoSeleccionadoObj?.secciones.map((sec: any) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.label === "Única" ? "Única" : `Sec. ${sec.label}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                disabled={cargando}
                className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 mt-4"
              >
                {cargando ? "Inscribiendo..." : "Finalizar Registro"}
              </button>
            </form>
          </div>
        </div>

        {/* LISTADO DE ALUMNOS (AGRUPADOS POR NIVEL) */}
        <div className="lg:col-span-2 space-y-12">
          {NIVELES.map((nivel) => (
            <div key={nivel.nivel} className="relative">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-black text-red-700 uppercase tracking-tighter mr-4 bg-slate-50 relative z-10 pr-4">
                  {nivel.nivel}
                </h2>
                <div className="h-0.5 bg-red-100 flex-grow relative top-1"></div>
              </div>

              <div className="space-y-4">
                {nivel.grados.map((g: any) => (
                  <div
                    key={g.id}
                    className={`bg-white rounded-[2rem] border transition-all ${abierto === g.id ? "shadow-xl border-red-100" : "shadow-sm border-gray-100"}`}
                  >
                    <button
                      onClick={() => toggleGrado(g)}
                      className="w-full p-6 flex justify-between items-center group"
                    >
                      <div className="flex items-center space-x-5">
                        {/* 💡 AQUÍ MOSTRAMOS EL CONTEO EN EL CÍRCULO */}
                        <div
                          className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${abierto === g.id ? "bg-red-600 text-white shadow-lg" : "bg-gray-100 text-gray-600 group-hover:bg-red-50 group-hover:text-red-600"}`}
                        >
                          {conteos[g.id] !== undefined ? (
                            <>
                              <span className="font-black text-lg leading-none">
                                {conteos[g.id]}
                              </span>
                              <span className="text-[7px] font-bold uppercase tracking-widest opacity-80 mt-0.5">
                                Alumnos
                              </span>
                            </>
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                          )}
                        </div>

                        <div className="text-left">
                          <span className="font-black text-gray-700 uppercase block text-lg leading-none mb-1">
                            {g.nombre}
                          </span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            {g.secciones.length > 1
                              ? `${g.secciones.length} Secciones`
                              : "Sección Única"}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold transition-colors ${abierto === g.id ? "border-red-600 text-red-600 bg-red-50" : "border-gray-200 text-gray-400"}`}
                      >
                        {abierto === g.id ? "−" : "+"}
                      </div>
                    </button>

                    {abierto === g.id && (
                      <div className="px-6 pb-8">
                        <div className="flex space-x-2 mb-6 p-1 bg-gray-100 rounded-xl w-fit">
                          {g.secciones.length > 1 ? (
                            g.secciones.map((sec: any) => (
                              <button
                                key={sec.id}
                                onClick={() => cambiarSeccionVista(sec.id)}
                                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${seccionVisualizacion === sec.id ? "bg-white text-red-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                              >
                                Sección {sec.label}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 bg-white rounded-lg shadow-sm text-[10px] font-black text-slate-400 uppercase">
                              Listado Único
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
                          <table className="w-full text-left">
                            <thead className="bg-white text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100">
                              <tr>
                                <th className="px-8 py-5">Código ID</th>
                                <th className="px-8 py-5">Nombre del Alumno</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {gradosVisibles[`${g.id}-${seccionVisualizacion}`]
                                ?.length > 0 ? (
                                gradosVisibles[
                                  `${g.id}-${seccionVisualizacion}`
                                ].map((est, i) => (
                                  <tr
                                    key={i}
                                    className="hover:bg-white transition-colors"
                                  >
                                    <td className="px-8 py-5">
                                      <span className="bg-white px-3 py-1.5 rounded-lg text-[11px] text-red-600 font-black border border-red-100 shadow-sm">
                                        {est.codigo}
                                      </span>
                                    </td>
                                    <td className="px-8 py-5 font-black text-gray-700 uppercase text-sm">
                                      {est.nombre}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan={2}
                                    className="px-8 py-16 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest"
                                  >
                                    Sin alumnos registrados en esta sección
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
