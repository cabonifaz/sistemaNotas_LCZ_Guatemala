'use client'; 

import Link from 'next/link';
import { useState } from 'react';

export default function RecuperarPage() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica real para enviar el correo desde tu backend.
    // Por ahora, solo mostraremos el mensaje de éxito.
    setEnviado(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full border-t-8 border-red-600 shadow-2xl rounded-[2rem] p-10 bg-white">
        
        <div className="text-center mb-8">
          <div className="bg-red-50 inline-block p-4 rounded-full mb-4">
            {/* Ícono de candado para la recuperación */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-red-700 font-black text-2xl tracking-tight uppercase leading-none">
            Recuperar Clave
          </h1>
          <p className="text-gray-400 text-xs font-bold mt-3">
            Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
          </p>
        </div>
        
        {!enviado ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black tracking-widest text-gray-500 uppercase mb-2 ml-1">
                Correo Electrónico
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-100 transition-all"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 mt-2 rounded-2xl font-black text-xs tracking-widest uppercase text-white bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-600/30 active:scale-95 transition-all"
            >
              Enviar Instrucciones
            </button>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-6 text-center mb-6">
            <p className="font-bold text-sm">
              ¡Listo! Si el correo <strong>{email}</strong> está registrado, recibirás un enlace para recuperar tu cuenta.
            </p>
          </div>
        )}

        {/* Botón para regresar al Login */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-xs font-black tracking-wider text-gray-400 uppercase hover:text-red-600 transition-colors inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio de sesión
          </Link>
        </div>

      </div>
    </main>
  );
}