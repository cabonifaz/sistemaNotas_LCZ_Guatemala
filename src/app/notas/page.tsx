"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  obtenerEstadisticasDashboard,
  obtenerPermisosUsuario,
} from "@/app/actions";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    docentes: 0,
    estudiantes: 0,
    materias: 0,
  });
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const cargarDatos = async () => {
      const datosReales = await obtenerEstadisticasDashboard();
      setStats(datosReales);

      const datosUsuario = await obtenerPermisosUsuario();
      setUsuario(datosUsuario);

      setCargando(false);
    };
    cargarDatos();
  }, []);

  const getIniciales = (nombre: string) => {
    if (!nombre) return "U";
    const partes = nombre.split(" ");
    if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
    return nombre.substring(0, 2).toUpperCase();
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Logo Institucional" className="w-16 h-16 object-contain" />
          <div className="text-left">
            <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight leading-none">
              LICEO CRISTIANO <span className="text-[#E60000]">ZACAPANECO</span>
            </h1>
            <p className="text-[11px] text-gray-400 font-bold flex items-center mt-2 uppercase tracking-wider">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
              Zacapa, Guatemala
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-gray-50 p-2 pr-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-[#E60000] rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-red-100">
              {usuario ? getIniciales(usuario.nombre) : "..."}
            </div>
            <div className="text-left">
              <p className="text-[11px] font-black text-gray-800 uppercase leading-none">
                {usuario ? usuario.nombre : "Cargando..."}
              </p>
              <p className="text-[9px] font-bold text-[#E60000] uppercase tracking-tighter mt-0.5">
                {usuario ? (usuario.rol === "Super usuario" ? "Súper Usuario" : usuario.rol === "Admin" ? "Administrador" : "Docente") : ""}
              </p>
            </div>
          </div>

          <button onClick={handleCerrarSesion} title="Cerrar Sesión" className="w-10 h-10 bg-white border-2 border-red-100 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>

      <div className="bg-[#E60000] rounded-3xl p-10 flex flex-col md:flex-row justify-between items-center mb-10 shadow-xl shadow-red-200 relative overflow-hidden">
        <img src="/logo.png" className="absolute -right-10 -bottom-10 w-80 h-80 opacity-10 pointer-events-none grayscale invert rotate-12" alt="watermark" />

        <div className="relative z-10 text-left">
          <h2 className="text-white text-4xl font-black tracking-tight leading-none mb-1">Liceo Cristiano</h2>
          <h2 className="text-[#FFD700] text-5xl font-black tracking-tight leading-none mb-6">Zacapaneco</h2>
          <div className="flex items-center">
            <div className="w-1 h-8 bg-[#FFD700] mr-3 rounded-full"></div>
            <p className="text-white text-sm font-medium italic max-w-md">"Instruye al niño en su camino, y aun cuando fuere viejo no se apartará de él."</p>
          </div>
        </div>

        <div className="flex flex-col space-y-4 mt-8 md:mt-0 md:ml-8 relative z-10">
          {/* 💡 ADMINS Y SUPER USUARIOS PUEDEN INSCRIBIR */}
          {(usuario?.rol === "Admin" || usuario?.rol === "Super usuario") && (
            <Link href="/notas/estudiantes" className="px-10 py-4 bg-[#FFD700] hover:bg-yellow-400 text-yellow-900 text-xs font-black rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 text-center">
              INSCRIBIR ALUMNO
            </Link>
          )}
          
          {/* 💡 SOLO SUPER USUARIOS PUEDEN VER GESTIÓN DE USUARIOS */}
          {usuario?.rol === "Super usuario" && (
            <Link href="/notas/docentes" className="px-10 py-4 bg-[#B30000] hover:bg-red-900 text-white border border-red-500/30 text-xs font-black rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 text-center flex items-center justify-center">
              GESTIÓN DE USUARIOS
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between h-48 hover:border-red-100 transition-colors group">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
          </div>
          <div className="text-left">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estudiantes Activos</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-gray-800 tracking-tighter">{cargando ? "..." : stats.estudiantes}</span>
              <span className="text-[9px] font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full uppercase">Ciclo 2026</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between h-48 hover:border-red-100 transition-colors group">
          <div className="w-12 h-12 bg-red-50 text-[#E60000] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <div className="text-left">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cuerpo Docente</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-gray-800 tracking-tighter">{cargando ? "..." : stats.docentes}</span>
              <span className="text-[9px] font-bold text-[#E60000] bg-red-50 px-2 py-0.5 rounded-full uppercase">Nómina</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between h-48 hover:border-red-100 transition-colors group">
          <div className="w-12 h-12 bg-red-50 text-[#E60000] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <div className="text-left">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Materias</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-gray-800 tracking-tighter">{cargando ? "..." : stats.materias}</span>
              <span className="text-[9px] font-bold text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full uppercase">CNB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}