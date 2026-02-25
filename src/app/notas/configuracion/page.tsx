"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  obtenerPermisosUsuario, 
  obtenerConfiguracionActiva, 
  guardarConfiguracionBimestres,
  obtenerConfiguracionPorAnio // 💡 Importamos la nueva función
} from "../../actions";

export default function ConfiguracionBimestresPage() {
  const [permisos, setPermisos] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [anioActual, setAnioActual] = useState(new Date().getFullYear());
  const [unidades, setUnidades] = useState<number[]>([]);
  const [guardando, setGuardando] = useState(false);
  
  // 💡 Esta bandera evita que se busquen años antes de que cargue la pantalla
  const [inicialCargado, setInicialCargado] = useState(false);

  // 1. CARGA INICIAL (Trae el año activo oficial)
  useEffect(() => {
    async function cargar() {
      const p = await obtenerPermisosUsuario();
      setPermisos(p);
      if (p?.rol === "Super usuario") {
        const config = await obtenerConfiguracionActiva();
        setAnioActual(config.anio);
        setUnidades(config.activas);
        setInicialCargado(true);
      }
      setCargando(false);
    }
    cargar();
  }, []);

  // 💡 2. MAGIA: Si el usuario cambia el año en el input, actualiza los candados
  useEffect(() => {
    if (!inicialCargado) return; 

    const buscarConfiguracionDelAnio = async () => {
      // Solo busca si es un año válido (ej. mayor a 2000)
      if (anioActual > 2000) {
        const activasDelAnio = await obtenerConfiguracionPorAnio(anioActual);
        setUnidades(activasDelAnio);
      }
    };

    // Usamos un pequeño retraso de 400ms para no saturar la base de datos mientras teclea
    const timer = setTimeout(() => {
      buscarConfiguracionDelAnio();
    }, 400);

    return () => clearTimeout(timer);
  }, [anioActual, inicialCargado]);

  const toggleUnidad = (num: number) => {
    setUnidades(prev => prev.includes(num) ? prev.filter(u => u !== num) : [...prev, num].sort());
  };

  const guardarCambios = async () => {
    setGuardando(true);
    await guardarConfiguracionBimestres(anioActual, unidades);
    alert(`✅ Configuración guardada. El ciclo ${anioActual} es ahora el año activo oficial.`);
    setGuardando(false);
  };

  if (cargando) return <div className="p-10 text-center font-bold text-gray-400">Cargando configuración...</div>;

  // PROTECCIÓN ESTRICTA: Solo Super Usuarios
  if (permisos?.rol !== "Super usuario") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-10 rounded-3xl shadow-lg text-center border-2 border-red-100">
          <span className="text-5xl mb-4 block">⛔</span>
          <h1 className="text-2xl font-black text-[#E60000] mb-2 uppercase">Acceso Denegado</h1>
          <p className="text-gray-500 mb-6">Solo los Super Usuarios pueden habilitar bimestres.</p>
          <Link href="/notas" className="px-6 py-3 bg-[#17365D] text-white rounded-xl font-black text-xs uppercase hover:bg-slate-800 transition-colors">Volver al Menú</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="bg-[#E60000] text-white shadow-lg p-6 mb-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Gestión de Bimestres</h1>
          <Link href="/notas" className="bg-white text-[#E60000] px-6 py-2 rounded-xl font-black text-xs uppercase shadow-md hover:bg-red-50 transition-colors">Volver al Menú</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-10 md:p-14 text-center relative overflow-hidden">
          
          <img src="/logo.png" className="absolute -left-10 -bottom-10 w-80 h-80 opacity-5 pointer-events-none grayscale" alt="watermark" />

          <div className="relative z-10">
            <h2 className="text-3xl font-black text-[#17365D] uppercase mb-4 tracking-tight">Panel de Súper Usuario</h2>
            <p className="text-gray-500 mb-10 max-w-lg mx-auto text-sm">
              Selecciona el año escolar para ver sus bimestres. Al hacer clic en <strong className="text-gray-700">Guardar Configuración</strong>, ese año se convertirá en el ciclo activo para todos los docentes.
            </p>

            <div className="flex justify-center items-center mb-12">
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-gray-200 shadow-inner flex flex-col items-center">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Año Ciclo Escolar</label>
                <input 
                  type="number" 
                  value={anioActual} 
                  onChange={(e) => setAnioActual(Number(e.target.value))}
                  className="text-center text-4xl font-black text-[#E60000] w-48 bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {[1, 2, 3, 4].map(num => {
                const activa = unidades.includes(num);
                return (
                  <div 
                    key={num} 
                    onClick={() => toggleUnidad(num)}
                    className={`cursor-pointer w-36 h-44 flex flex-col items-center justify-center rounded-[2rem] border-2 transition-all duration-300 transform hover:-translate-y-1 ${activa ? 'bg-red-50 border-[#E60000] shadow-lg shadow-red-100/50' : 'bg-white border-gray-100 shadow-sm hover:border-gray-300'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${activa ? 'bg-[#E60000] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                      {activa ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2v6a2 2 0 002 2z"></path></svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      )}
                    </div>
                    
                    <span className={`text-4xl font-black mb-1 leading-none tracking-tighter ${activa ? 'text-[#E60000]' : 'text-gray-400'}`}>U{num}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest mt-2 ${activa ? 'text-red-800' : 'text-gray-400'}`}>{activa ? 'Abierta' : 'Bloqueada'}</span>
                  </div>
                );
              })}
            </div>

            <button onClick={guardarCambios} disabled={guardando} className="w-full md:w-auto px-16 h-[60px] bg-[#17365D] text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 active:scale-95 transition-all uppercase text-sm">
              {guardando ? "Guardando cambios..." : "Guardar Configuración Oficial"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}