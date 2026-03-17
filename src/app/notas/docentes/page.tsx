"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  obtenerDocentes,
  crearNuevoDocente,
  obtenerAsignacionesDocente,
  agregarAsignacion,
  eliminarAsignacion,
  eliminarDocente,
  obtenerGradosList,
  obtenerMateriasList,
  asignarMaestroTitularAction, 
  obtenerMaestroTitular, 
} from "../../actions";

const MATERIAS_POR_GRADO: Record<string, number[]> = {
  "11": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 
  "12": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 
  "13": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 
  "4": [1, 2, 11, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47], 
  "5": [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63], 
  "1": [64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79], 

  "6": [
    104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118,
    119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133,
  ],
  "7": [
    104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118,
    119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133,
  ],
  "2": [
    104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118,
    119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133,
  ],
  "8": [
    104, 105, 106, 200, 246, 109, 110, 111, 250, 112, 113, 114, 115, 116, 117, 118,
    119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133,
  ],
  "9": [
    104, 105, 106, 200, 246, 109, 110, 111, 250, 112, 113, 114, 115, 116, 117, 118,
    119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133,
  ],
  "10": [
    104, 105, 106, 200, 246, 109, 110, 111, 250, 112, 113, 114, 115, 116, 117, 118,
    119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133,
  ],

// BÁSICO (1ro, 2do, 3ro)
  "14": [
    218, 248, 210, 201, 246, 200, 243, 227, 249, 300, 250, 220, 244, 245, 247, 251, 233,
    252, 253, 254, 255, 256, 257, 258, 259, 260, 261,
  ],
  "15": [
    218, 248, 210, 201, 246, 200, 243, 227, 249, 300, 250, 220, 244, 245, 247, 251, 233,
    252, 253, 254, 255, 256, 257, 258, 259, 260, 261,
  ],
  "16": [
    218, 248, 210, 201, 246, 200, 243, 227, 249, 300, 250, 220, 244, 245, 247, 251, 233,
    252, 253, 254, 255, 256, 257, 258, 259, 260, 261,
  ],

  "17": [
    262, 263, 264, 265, 266, 267, 228, 245, 205, 234, 203, 242, 247, 251, 233,
    252, 253, 254, 255, 256, 257, 258, 259, 260, 261,
  ],
  "18": [
    268, 269, 270, 271, 272, 219, 217, 273, 229, 207, 242, 247, 251, 233, 252,
    253, 254, 255, 256, 257, 258, 259, 260, 261,
  ],
  "19": [
    202, 237, 211, 274, 275, 222, 276, 277, 278, 279, 238, 266, 280, 251, 233,
    252, 253, 254, 255, 256, 257, 258, 259, 260, 261,
  ],
  "20": [
    223, 281, 282, 283, 284, 285, 225, 204, 286, 287, 238, 288, 289, 251, 233,
    252, 253, 254, 255, 256, 257, 258, 259, 260, 261,
  ],
  "21": [
    209, 290, 291, 292, 293, 294, 208, 295, 296, 297, 298, 238, 299, 251, 233,
    252, 253, 254, 255, 256, 257, 258, 259, 260, 261,
  ],
};

const ORDEN_GRADOS = [
  "11", "12", "13", "4", "5", "1",
  "6", "7", "2", "8", "9", "10",
  "14", "15", "16",
  "17", "18", "19", "20", "21",
];

const GRADOS_SECCION_UNICA = ["11", "12", "13", "18", "19", "20", "21"];

export default function GestorDocentesPage() {
  const [docentes, setDocentes] = useState<any[]>([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState<any>(null);
  const [asignaciones, setAsignaciones] = useState<any[]>([]);
  const [grados, setGrados] = useState<any[]>([]);
  const [materias, setMaterias] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoNombre, setNewNombre] = useState("");
  const [nuevoCorreo, setNewCorreo] = useState("");
  const [nuevaClave, setNewClave] = useState("123456");
  const [nuevoRol, setNewRol] = useState("Maestro");

  const [formGrado, setFormGrado] = useState("");
  const [formSeccion, setFormSeccion] = useState("1");
  const [formMateria, setFormMateria] = useState("999");

  const [modalTitularAbierto, setModalTitularAbierto] = useState(false);
  const [titularGrado, setTitularGrado] = useState("");
  const [titularSeccion, setTitularSeccion] = useState("1");
  const [titularDocente, setTitularDocente] = useState("");
  const [titularActual, setTitularActual] = useState("-");

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    if (modalTitularAbierto && titularGrado && titularSeccion) {
      setTitularActual("Buscando...");
      obtenerMaestroTitular(Number(titularGrado), Number(titularSeccion)).then(
        (nombre) => setTitularActual(nombre)
      );
    } else {
      setTitularActual("-");
    }
  }, [modalTitularAbierto, titularGrado, titularSeccion]);

  const cargarDatosIniciales = async () => {
    setCargando(true);
    const [docs, grad, mat] = await Promise.all([
      obtenerDocentes(),
      obtenerGradosList(),
      obtenerMateriasList(),
    ]);
    setDocentes(docs);

    const gradosOrdenados = [...grad].sort((a, b) => {
      const idxA = ORDEN_GRADOS.indexOf(a.id_grado.toString());
      const idxB = ORDEN_GRADOS.indexOf(b.id_grado.toString());
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });

    setGrados(gradosOrdenados);
    setMaterias(mat);
    setCargando(false);
  };

  const seleccionarDocente = async (docente: any) => {
    setDocenteSeleccionado(docente);
    const asig = await obtenerAsignacionesDocente(docente.id_usuario);
    setAsignaciones(asig);
  };

  const handleCrearDocente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoCorreo || !nuevaClave)
      return alert("Llena todos los campos");

    await crearNuevoDocente(nuevoNombre, nuevoCorreo, nuevaClave, nuevoRol);

    setModalAbierto(false);
    setNewNombre("");
    setNewCorreo("");
    setNewRol("Maestro");
    cargarDatosIniciales();
    alert("✅ Usuario creado con éxito");
  };

  const handleAgregarAsignacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docenteSeleccionado || !formGrado) return alert("Selecciona un grado");

    await agregarAsignacion(
      docenteSeleccionado.id_usuario,
      Number(formGrado),
      Number(formSeccion),
      Number(formMateria),
    );

    const asig = await obtenerAsignacionesDocente(
      docenteSeleccionado.id_usuario,
    );
    setAsignaciones(asig);
  };

  const handleAsignarTitular = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titularGrado || !titularDocente) return alert("Faltan campos por seleccionar.");

    const res = await asignarMaestroTitularAction(
      Number(titularDocente),
      Number(titularGrado),
      Number(titularSeccion)
    );

    if (res.success) {
      alert("👑 Maestro titular asignado y actualizado correctamente.");
      setModalTitularAbierto(false);
      setTitularGrado("");
      setTitularDocente("");
      if (docenteSeleccionado) {
        seleccionarDocente(docenteSeleccionado);
      }
    } else {
      alert("❌ Ocurrió un error al asignar.");
    }
  };

  const handleBorrarAsignacion = async (idAsignacion: number) => {
    if (!confirm("¿Quitar esta clase del profesor?")) return;
    await eliminarAsignacion(idAsignacion);
    const asig = await obtenerAsignacionesDocente(
      docenteSeleccionado.id_usuario,
    );
    setAsignaciones(asig);
  };

  const handleBorrarDocenteCompleto = async () => {
    const confirmacion = window.confirm(
      `⚠️ ATENCIÓN ⚠️\n\n¿Estás completamente seguro de que deseas eliminar a ${docenteSeleccionado.nombre_completo} del sistema?\n\nEsta acción borrará también todas sus asignaciones de clase y no se puede deshacer.`,
    );

    if (confirmacion) {
      await eliminarDocente(docenteSeleccionado.id_usuario);
      alert("🗑️ Usuario eliminado correctamente.");
      setDocenteSeleccionado(null);
      cargarDatosIniciales();
    }
  };

  const traducirSeccion = (sec: number) => {
    if (sec === 1) return "A / Única";
    if (sec === 2) return "B";
    if (sec === 3) return "C";
    return sec;
  };

  // 💡 LÓGICA BLINDADA PARA FILTRAR MATERIAS
  const idsPermitidos = formGrado ? MATERIAS_POR_GRADO[formGrado] || [] : [];
  
  const materiasA_Mostrar = materias
    .filter((m) => {
      // Forzamos el ID a número (por si MySQL lo manda como "250")
      const idReal = Number(m.id_materia || m.ID_MATERIA);
      return idsPermitidos.includes(idReal);
    })
    .map((m) => ({
      id_materia: Number(m.id_materia || m.ID_MATERIA),
      // Atrapamos el nombre sin importar cómo se llame la columna en BD
      nombre_real: String(m.materia || m.nombre_materia || m.NOMBRE_MATERIA || "Sin nombre")
    }))
    .sort((a, b) => a.nombre_real.localeCompare(b.nombre_real));

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Gestión de Personal
          </h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
            Administra perfiles y asigna clases
          </p>
        </div>
        <Link
          href="/notas"
          className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-black text-xs uppercase shadow-sm hover:bg-gray-50 transition-all"
        >
          Volver al Dashboard
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* COLUMNA IZQUIERDA: LISTA DE USUARIOS */}
        <div className="w-full lg:w-1/3 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col gap-2 mb-6">
            <button
              onClick={() => setModalAbierto(true)}
              className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="text-lg">+</span> Añadir Personal
            </button>
            
            <button
              onClick={() => setModalTitularAbierto(true)}
              className="w-full py-4 bg-[#17365D] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="text-lg">👑</span> Asignar Maestro Titular
            </button>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {cargando ? (
              <p className="text-center text-gray-400 font-bold text-xs">
                Cargando personal...
              </p>
            ) : (
              docentes.map((doc) => (
                <div
                  key={doc.id_usuario}
                  onClick={() => seleccionarDocente(doc)}
                  className={`p-4 rounded-2xl cursor-pointer border-2 transition-all flex justify-between items-center ${docenteSeleccionado?.id_usuario === doc.id_usuario ? "border-red-600 bg-red-50" : "border-gray-50 bg-gray-50 hover:border-red-200"}`}
                >
                  <div>
                    <h3 className="font-black text-sm text-gray-800 uppercase">
                      {doc.nombre_completo}
                    </h3>
                    <p className="text-xs font-bold text-gray-400">
                      {doc.username}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-1 rounded-md font-black uppercase ${doc.rol === "Admin" || doc.rol === "Super usuario" ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-600"}`}
                  >
                    {doc.rol === "Maestro" ? "Profesor" : doc.rol}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: ASIGNACIONES DEL PROFESOR */}
        <div className="w-full lg:w-2/3 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          {!docenteSeleccionado ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center opacity-50">
              <span className="text-6xl mb-4">👥</span>
              <h2 className="text-xl font-black text-gray-400 uppercase tracking-widest">
                Selecciona un usuario
              </h2>
              <p className="text-sm font-bold text-gray-400">
                Para ver y editar sus asignaciones
              </p>
            </div>
          ) : (
            <>
              <div className="border-b border-gray-100 pb-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#17365D] uppercase tracking-tight">
                    {docenteSeleccionado.nombre_completo}
                  </h2>
                  <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-lg tracking-widest">
                    {docenteSeleccionado.rol === "Maestro"
                      ? "Profesor"
                      : docenteSeleccionado.rol}{" "}
                    Activo
                  </span>
                </div>

                {docenteSeleccionado.id_usuario !== 1 && (
                  <button
                    onClick={handleBorrarDocenteCompleto}
                    className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm"
                  >
                    🗑️ Eliminar Usuario
                  </button>
                )}
              </div>

              {/* FORMULARIO PARA ASIGNAR NUEVA CLASE */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-gray-200 mb-8">
                <h3 className="font-black text-xs text-gray-500 uppercase tracking-widest mb-4">
                  Añadir nueva asignación a este usuario
                </h3>
                <form
                  onSubmit={handleAgregarAsignacion}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                >
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 mb-2">
                      Grado
                    </label>
                    <select
                      required
                      value={formGrado}
                      onChange={(e) => {
                        const nuevoGrado = e.target.value;
                        setFormGrado(nuevoGrado);

                        if (GRADOS_SECCION_UNICA.includes(nuevoGrado)) {
                          setFormSeccion("1"); 
                        } else if (nuevoGrado !== "16" && formSeccion === "3") {
                          setFormSeccion("1"); 
                        }
                      }}
                      className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-xs outline-none focus:border-red-600 text-gray-700"
                    >
                      <option value="">Seleccionar...</option>
                      <optgroup label="Nivel Pre-Primaria">
                        {grados
                          .filter((g) => ["11", "12", "13", "4", "5", "1"].includes(g.id_grado.toString()))
                          .map((g) => <option key={g.id_grado} value={g.id_grado}>{g.nombre_grado}</option>)}
                      </optgroup>
                      <optgroup label="Nivel Primaria">
                        {grados
                          .filter((g) => ["6", "7", "2", "8", "9", "10"].includes(g.id_grado.toString()))
                          .map((g) => <option key={g.id_grado} value={g.id_grado}>{g.nombre_grado}</option>)}
                      </optgroup>
                      <optgroup label="Nivel Básico">
                        {grados
                          .filter((g) => ["14", "15", "16"].includes(g.id_grado.toString()))
                          .map((g) => <option key={g.id_grado} value={g.id_grado}>{g.nombre_grado}</option>)}
                      </optgroup>
                      <optgroup label="Nivel Diversificado">
                        {grados
                          .filter((g) => ["17", "18", "19", "20", "21"].includes(g.id_grado.toString()))
                          .map((g) => <option key={g.id_grado} value={g.id_grado}>{g.nombre_grado}</option>)}
                      </optgroup>
                    </select>
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 mb-2">
                      Sección
                    </label>
                    <select
                      value={formSeccion}
                      onChange={(e) => setFormSeccion(e.target.value)}
                      disabled={GRADOS_SECCION_UNICA.includes(formGrado)}
                      className={`w-full p-3 border-2 border-gray-200 rounded-xl font-bold text-xs outline-none transition-all ${GRADOS_SECCION_UNICA.includes(formGrado) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white focus:border-red-600 text-gray-700"}`}
                    >
                      <option value="1">A / Única</option>
                      {!GRADOS_SECCION_UNICA.includes(formGrado) && <option value="2">B</option>}
                      {formGrado === "16" && <option value="3">C</option>}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 mb-2">
                      Materia
                    </label>
                    <select
                      value={formMateria}
                      onChange={(e) => setFormMateria(e.target.value)}
                      disabled={!formGrado}
                      className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-xs outline-none focus:border-red-600 text-gray-700 disabled:opacity-50 disabled:bg-gray-100"
                    >
                      {!formGrado && (
                        <option value="">Primero selecciona un grado...</option>
                      )}

                      {formGrado && (
                        <>
                          <option
                            value="999"
                            className="font-black text-[#17365D]"
                          >
                            TUTOR/A DE AULA (Menos Prioridad)
                          </option>
                          {/* 💡 AQUI RENDERIZAMOS CON EL NOMBRE REAL */}
                          {materiasA_Mostrar.map((m) => (
                            <option key={m.id_materia} value={m.id_materia}>
                              {m.nombre_real}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>

                  <div className="md:col-span-4 mt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all"
                    >
                      Guardar Asignación
                    </button>
                  </div>
                </form>
              </div>

              {/* TABLA DE ASIGNACIONES ACTUALES */}
              <h3 className="font-black text-xs text-gray-500 uppercase tracking-widest mb-4">
                Clases que imparte actualmente
              </h3>
              <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                    <tr>
                      <th className="p-4">Grado</th>
                      <th className="p-4">Sección</th>
                      <th className="p-4">Materia</th>
                      <th className="p-4 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {asignaciones.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-8 text-center text-gray-400 font-bold text-xs"
                        >
                          No tiene asignaciones
                        </td>
                      </tr>
                    )}
                    {asignaciones.map((a) => (
                      <tr
                        key={a.id_asignacion}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 font-bold text-xs text-gray-800 uppercase">
                          {a.nombre_grado}
                        </td>
                        <td className="p-4 font-bold text-xs text-gray-600">
                          Sección {traducirSeccion(a.seccion)}
                        </td>
                        <td
                          className={`p-4 font-black text-xs uppercase ${a.nombre_materia.includes("TITULAR") ? "text-red-600" : "text-[#17365D]"}`}
                        >
                          {a.nombre_materia}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() =>
                              handleBorrarAsignacion(a.id_asignacion)
                            }
                            className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors"
                            title="Borrar Asignación"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 💡 NUEVO MODAL: ASIGNAR MAESTRO TITULAR */}
      {modalTitularAbierto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md border-t-8 border-[#17365D]">
            <h2 className="text-xl font-black text-[#17365D] uppercase tracking-tight mb-2 flex items-center gap-2">
              <span>👑</span> Maestro Titular
            </h2>
            <p className="text-xs font-bold text-gray-400 mb-6">
              Selecciona quién será el Profesor Líder de esta sección. Si ya había alguien, el sistema lo reemplazará.
            </p>
            
            <form onSubmit={handleAsignarTitular} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 mb-2">Grado</label>
                <select
                  required
                  value={titularGrado}
                  onChange={(e) => {
                    const g = e.target.value;
                    setTitularGrado(g);
                    if (GRADOS_SECCION_UNICA.includes(g)) setTitularSeccion("1");
                    else if (g !== "16" && titularSeccion === "3") setTitularSeccion("1");
                  }}
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-sm outline-none focus:bg-white focus:border-[#17365D] text-gray-700"
                >
                  <option value="">Seleccionar Grado...</option>
                  {grados.map((g) => (
                    <option key={g.id_grado} value={g.id_grado}>{g.nombre_grado}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 mb-2">Sección</label>
                <select
                  value={titularSeccion}
                  onChange={(e) => setTitularSeccion(e.target.value)}
                  disabled={GRADOS_SECCION_UNICA.includes(titularGrado)}
                  className={`w-full p-4 border-2 border-gray-100 rounded-xl font-bold text-sm outline-none transition-all ${GRADOS_SECCION_UNICA.includes(titularGrado) ? "bg-gray-100 text-gray-400" : "bg-gray-50 focus:bg-white focus:border-[#17365D] text-gray-700"}`}
                >
                  <option value="1">A / Única</option>
                  {!GRADOS_SECCION_UNICA.includes(titularGrado) && <option value="2">B</option>}
                  {titularGrado === "16" && <option value="3">C</option>}
                </select>
              </div>

              {titularGrado && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Titular Actual:</span>
                  <span className={`text-sm font-black uppercase ${titularActual === "Docente no asignado" ? "text-gray-400" : "text-[#17365D]"}`}>
                    {titularActual}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 mb-2">Profesor Líder</label>
                <select
                  required
                  value={titularDocente}
                  onChange={(e) => setTitularDocente(e.target.value)}
                  className="w-full p-4 bg-red-50 border-2 border-red-100 rounded-xl font-bold text-sm outline-none focus:bg-white focus:border-red-600 text-red-900"
                >
                  <option value="">Seleccionar Docente...</option>
                  {docentes.map((doc) => (
                    <option key={doc.id_usuario} value={doc.id_usuario}>{doc.nombre_completo}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 mt-8 pt-4">
                <button
                  type="button"
                  onClick={() => setModalTitularAbierto(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 font-black text-xs uppercase rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-[#17365D] text-white font-black text-xs uppercase rounded-xl shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
                >
                  Asignar Titular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR USUARIO NORMAL */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-6">
              Nuevo Usuario
            </h2>
            <form onSubmit={handleCrearDocente} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 mb-2">Nombre Completo</label>
                <input required type="text" value={nuevoNombre} onChange={(e) => setNewNombre(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-sm outline-none focus:bg-white focus:border-red-600" placeholder="Ej. Juan Pérez" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 mb-2">Correo (Usuario para ingresar)</label>
                <input required type="text" value={nuevoCorreo} onChange={(e) => setNewCorreo(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-sm outline-none focus:bg-white focus:border-red-600" placeholder="juan@liceo.com" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 mb-2">Rol en el Sistema</label>
                <select value={nuevoRol} onChange={(e) => setNewRol(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-sm outline-none focus:bg-white focus:border-red-600 text-gray-800">
                  <option value="Maestro">Profesor</option>
                  <option value="Admin">Admin</option>
                  <option value="Super usuario">Super usuario</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 mb-2">Contraseña por defecto</label>
                <input required type="text" value={nuevaClave} onChange={(e) => setNewClave(e.target.value)} className="w-full p-4 bg-gray-100 border-2 border-gray-200 rounded-xl font-black text-sm text-gray-500 outline-none" />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setModalAbierto(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-black text-xs uppercase rounded-xl hover:bg-gray-200 transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-red-600 text-white font-black text-xs uppercase rounded-xl shadow-lg hover:bg-red-700 active:scale-95 transition-all">Crear Cuenta</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}