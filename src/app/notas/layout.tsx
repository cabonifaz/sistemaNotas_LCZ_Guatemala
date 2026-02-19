'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { obtenerPermisosUsuario } from '@/app/actions';

export default function NotasLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActivo = (ruta: string) => pathname === ruta;
  
  // 💡 NUEVO: Guardamos el rol del usuario
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      const data = await obtenerPermisosUsuario();
      setUsuario(data);
    };
    cargarUsuario();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-sans text-slate-800">
      
      {/* 🔴 MENÚ LATERAL (CATÁLOGO) */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 hidden md:flex">
        <div className="p-8 pb-6 text-center border-b border-gray-50">
          <h2 className="text-xl font-black text-gray-800 leading-none tracking-tighter">Admin</h2>
          <p className="text-[11px] font-bold text-[#E60000] uppercase tracking-widest mt-1">Liceo Cristiano</p>
        </div>

        <div className="p-6 flex-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Menú Administrativo</p>
          <nav className="space-y-2">
            
            <Link href="/notas" className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${isActivo('/notas') ? 'bg-[#E60000] text-white shadow-lg shadow-red-200' : 'text-gray-500 hover:bg-red-50 hover:text-red-600'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              <span>Dashboard</span>
            </Link>

            {/* 💡 CONDICIÓN: Este botón de Estudiantes SOLO aparece si el rol es Admin */}
            {usuario?.rol === 'Admin' && (
              <Link href="/notas/estudiantes" className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${isActivo('/notas/estudiantes') ? 'bg-[#E60000] text-white shadow-lg shadow-red-200' : 'text-gray-500 hover:bg-red-50 hover:text-red-600'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                <span>Estudiantes</span>
              </Link>
            )}

            <Link href="/notas/calificaciones" className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${isActivo('/notas/calificaciones') ? 'bg-[#E60000] text-white shadow-lg shadow-red-200' : 'text-gray-500 hover:bg-red-50 hover:text-red-600'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              <span>Calificaciones</span>
            </Link>

          </nav>
        </div>
      </aside>

      {/* ⚪️ CENTRO (Aquí cae el Dashboard) */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}