"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { obtenerPermisosUsuario } from "@/app/actions";

export default function NotasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActivo = (ruta: string) => pathname === ruta;

  const [usuario, setUsuario] = useState<any>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const cargarUsuario = async () => {
      const data = await obtenerPermisosUsuario();
      setUsuario(data);
    };
    cargarUsuario();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FDFDFD] font-sans text-slate-800">
      {/* CABECERA PARA CELULARES */}
      <div className="md:hidden bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <div>
            <h2 className="text-sm font-black text-gray-800 leading-none tracking-tighter uppercase">
              {usuario?.rol === "Super usuario"
                ? "Súper Usuario"
                : usuario?.rol === "Admin"
                  ? "Administrador"
                  : "Profesor"}
            </h2>
            <p className="text-[9px] font-bold text-[#E60000] uppercase tracking-widest mt-0.5">
              Liceo Cristiano
            </p>
          </div>
        </div>
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="p-2 bg-red-50 text-red-600 rounded-lg focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                menuAbierto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            ></path>
          </svg>
        </button>
      </div>

      {/* MENÚ LATERAL */}
      <aside
        className={`w-64 bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40 fixed md:sticky top-0 h-screen transition-transform transform ${menuAbierto ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col`}
      >
        <div className="p-8 pb-6 text-center border-b border-gray-50 hidden md:block">
          <h2 className="text-xl font-black text-gray-800 leading-none tracking-tighter uppercase">
            {usuario?.rol === "Super usuario"
              ? "Súper User"
              : usuario?.rol === "Admin"
                ? "Admin"
                : "Profesor"}
          </h2>
          <p className="text-[11px] font-bold text-[#E60000] uppercase tracking-widest mt-1">
            Liceo Cristiano
          </p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">
            Menú Principal
          </p>
          <nav className="space-y-2">
            <Link
              onClick={() => setMenuAbierto(false)}
              href="/notas"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${isActivo("/notas") ? "bg-[#E60000] text-white shadow-lg shadow-red-200" : "text-gray-500 hover:bg-red-50 hover:text-red-600"}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                ></path>
              </svg>
              <span>Dashboard</span>
            </Link>

            <Link
              onClick={() => setMenuAbierto(false)}
              href="/notas/calificaciones"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${isActivo("/notas/calificaciones") ? "bg-[#E60000] text-white shadow-lg shadow-red-200" : "text-gray-500 hover:bg-red-50 hover:text-red-600"}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
              <span>Calificaciones</span>
            </Link>

            {/* 💡 ADMINS Y SUPER USUARIOS PUEDEN VER ESTUDIANTES */}
            {(usuario?.rol === "Admin" || usuario?.rol === "Super usuario") && (
              <Link
                onClick={() => setMenuAbierto(false)}
                href="/notas/estudiantes"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${isActivo("/notas/estudiantes") ? "bg-[#E60000] text-white shadow-lg shadow-red-200" : "text-gray-500 hover:bg-red-50 hover:text-red-600"}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
                <span>Estudiantes</span>
              </Link>
            )}

            {/* 💡 SÓLO SUPER USUARIOS VEN DOCENTES Y CONFIGURACIÓN */}
            {/* 💡 SÓLO SUPER USUARIOS VEN DOCENTES Y CONFIGURACIÓN */}
            {usuario?.rol === "Super usuario" && (
              <>
                <Link
                  onClick={() => setMenuAbierto(false)}
                  href="/notas/docentes"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${isActivo("/notas/docentes") ? "bg-[#E60000] text-white shadow-lg shadow-red-200" : "text-gray-500 hover:bg-red-50 hover:text-red-600"}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>Usuarios</span>
                </Link>

                <Link
                  onClick={() => setMenuAbierto(false)}
                  href="/notas/configuracion"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${isActivo("/notas/configuracion") ? "bg-[#E60000] text-white shadow-lg shadow-red-200" : "text-gray-500 hover:bg-red-50 hover:text-red-600"}`}
                >
                  {/* 💡 NUEVO ÍCONO DE ENGRANAJE SVG */}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <span>Bimestres</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </aside>

      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setMenuAbierto(false)}
        ></div>
      )}

      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
