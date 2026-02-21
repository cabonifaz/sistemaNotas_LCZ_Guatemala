'use client'; 

import { loginAction } from './actions';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [recordarme, setRecordarme] = useState(false);
  const [errorLogin, setErrorLogin] = useState(''); // 💡 Estado para el error

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuarioLiceoRecordado');
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
      setRecordarme(true);
    }

    // 💡 Detectamos si hay error en la URL al cargar la página
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'credenciales') {
      setErrorLogin('⚠️ Usuario o contraseña incorrectos. Verifica tus datos.');
    } else if (params.get('error') === 'servidor') {
      setErrorLogin('⚠️ Error de conexión con el servidor. Intenta de nuevo.');
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    if (recordarme) {
      localStorage.setItem('usuarioLiceoRecordado', usuario);
    } else {
      localStorage.removeItem('usuarioLiceoRecordado');
    }
    await loginAction(formData);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full border-t-8 border-red-600 shadow-2xl rounded-[2rem] p-10 bg-white">
        <div className="text-center mb-8">
          <div className="bg-red-50 inline-block p-4 rounded-full mb-4">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-red-700 font-black text-2xl tracking-tight uppercase leading-none">
            Liceo Cristiano Zacapaneco
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-2">
            Portal Docente y Administrativo
          </p>
        </div>

        {/* 💡 ALERTA DE ERROR VISUAL */}
        {errorLogin && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-black text-center animate-pulse">
            {errorLogin}
          </div>
        )}
        
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black tracking-widest text-gray-500 uppercase mb-2 ml-1">
              Usuario
            </label>
            <input 
              name="username"
              type="text"
              required
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="block w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-100 transition-all"
              placeholder="Ej. admin o juan1"
            />
          </div>
          
          <div>
            <label className="block text-xs font-black tracking-widest text-gray-500 uppercase mb-2 ml-1">
              Contraseña
            </label>
            <input 
              name="password"
              type="password" 
              required
              className="block w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-100 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between mt-2 px-1">
            <div className="flex items-center">
              <input
                id="recordarme"
                type="checkbox"
                checked={recordarme}
                onChange={(e) => setRecordarme(e.target.checked)}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded cursor-pointer accent-red-600"
              />
              <label htmlFor="recordarme" className="ml-2 text-[10px] font-black tracking-wider text-gray-500 uppercase cursor-pointer select-none">
                Recordar usuario
              </label>
            </div>
            <Link 
              href="/recuperar" 
              className="text-[10px] font-black tracking-wider text-red-600 uppercase hover:text-red-800 transition-colors"
            >
              ¿Olvidaste tu clave?
            </Link>
          </div>

          <button 
            type="submit"
            className="w-full py-4 mt-4 rounded-2xl font-black text-xs tracking-widest uppercase text-white bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-600/30 active:scale-95 transition-all"
          >
            Entrar al Sistema
          </button>
        </form>
      </div>
    </main>
  );
}