'use client';
import { useState } from 'react';
import Link from 'next/link';
import { inscribirEstudiante, obtenerMatrizNotas } from '../../actions';

export default function EstudiantesPage() {
  // --- ESTADOS DEL FORMULARIO ---
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [grado, setGrado] = useState('');
  const [seccion, setSeccion] = useState('1'); 
  const [cargando, setCargando] = useState(false);

  // --- ESTADOS DE LOS LISTADOS ---
  const [gradosVisibles, setGradosVisibles] = useState<Record<string, any[]>>({});
  const [abierto, setAbierto] = useState<string | null>(null);
  const [seccionVisualizacion, setSeccionVisualizacion] = useState<string>('1');

  // 💡 IDs OFICIALES DE NURSERY (ID 31, 32, 33 como en Calificaciones)
  const ID_NURSERY_I = 31;
  const ID_NURSERY_II = 32;
  const ID_NURSERY_III = 33;

  const listaGrados = [
    { id: '3', nombre: 'Nursery', tieneEtapas: true },
    { id: '4', nombre: 'Pre-Kinder', tieneSecciones: false },
    { id: '5', nombre: 'Kinder', tieneSecciones: true },
    { id: '1', nombre: 'Preparatoria', tieneSecciones: true },
    { id: '6', nombre: '1ro Primaria', tieneSecciones: true },
    { id: '7', nombre: '2do Primaria', tieneSecciones: true },
    { id: '2', nombre: '3ro Primaria', tieneSecciones: true },
    { id: '8', nombre: '4to Primaria', tieneSecciones: true },
    { id: '9', nombre: '5to Primaria', tieneSecciones: true },
    { id: '10', nombre: '6to Primaria', tieneSecciones: true },
  ];

  // Función auxiliar para obtener el ID real de búsqueda
  const obtenerIdReal = (gradoId: string, etapaId: string) => {
    if (gradoId === '3') {
      if (etapaId === '1') return ID_NURSERY_I.toString();
      if (etapaId === '2') return ID_NURSERY_II.toString();
      if (etapaId === '3') return ID_NURSERY_III.toString();
    }
    return gradoId;
  };

  const cargarEstudiantesGrado = async (gradoId: string, secId: string) => {
    const idDeBusqueda = obtenerIdReal(gradoId, secId);
    // Para Nursery la sección en DB es siempre 1, para los demás es la seleccionada
    const seccionDeBusqueda = gradoId === '3' ? '1' : secId;
    
    try {
      const data = await obtenerMatrizNotas(Number(idDeBusqueda), Number(seccionDeBusqueda));
      const unicos = data.reduce((acc: any[], curr: any) => {
        const nombreCompleto = curr.NOMBRE || `${curr.NOMBRES} ${curr.APELLIDOS}`;
        if (!acc.find(a => a.nombre === nombreCompleto)) {
          acc.push({ 
            nombre: nombreCompleto, 
            codigo: curr.ID_ALUMNO || curr.id_estudiante || 'S/C'
          });
        }
        return acc;
      }, []);
      // Guardamos en el estado usando la llave visual (ej: "3-1") para que React lo encuentre
      setGradosVisibles(prev => ({ ...prev, [`${gradoId}-${secId}`]: unicos }));
    } catch (error) {
      console.error("Error cargando alumnos:", error);
    }
  };

  const handleInscribir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombres || !apellidos || !grado) return alert("⚠️ Por favor, completa todos los campos.");
    setCargando(true);

    const gradoFinal = Number(obtenerIdReal(grado, seccion));
    const seccionFinal = grado === '3' ? 1 : Number(seccion);

    const res = await inscribirEstudiante(nombres, apellidos, gradoFinal, seccionFinal);
    if (res.success) {
      alert("✅ ¡Estudiante inscrito con éxito!");
      setNombres(''); setApellidos('');
      cargarEstudiantesGrado(grado, seccion);
    }
    setCargando(false);
  };

  const toggleGrado = (id: string) => {
    if (abierto === id) {
      setAbierto(null);
    } else {
      setAbierto(id);
      setSeccionVisualizacion('1'); 
      cargarEstudiantesGrado(id, '1');
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
          <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Gestión de Alumnos</h1>
          <Link href="/notas" className="bg-white text-red-700 px-6 py-2 rounded-xl font-black text-xs uppercase shadow-md">
            Volver al Menú
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* FORMULARIO */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 sticky top-10">
            <h2 className="text-xl font-black text-gray-800 uppercase mb-6 italic">Inscribir Alumno</h2>
            <form onSubmit={handleInscribir} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Nombres</label>
                <input value={nombres} onChange={e => setNombres(e.target.value)} type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none font-bold text-sm uppercase" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Apellidos</label>
                <input value={apellidos} onChange={e => setApellidos(e.target.value)} type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none font-bold text-sm uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Grado</label>
                  <select value={grado} onChange={e => { setGrado(e.target.value); setSeccion('1'); }} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-sm outline-none">
                    <option value="">--</option>
                    {listaGrados.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">{grado === '3' ? 'Etapa' : 'Sección'}</label>
                  <select value={seccion} onChange={e => setSeccion(e.target.value)} disabled={!grado || grado === '4'} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-sm disabled:opacity-30 outline-none">
                    {grado === '3' ? (
                      <><option value="1">Etapa I</option><option value="2">Etapa II</option><option value="3">Etapa III</option></>
                    ) : (
                      <><option value="1">Sección A</option><option value="2">Sección B</option></>
                    )}
                  </select>
                </div>
              </div>
              <button disabled={cargando} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 mt-4">
                {cargando ? 'Inscribiendo...' : 'Finalizar Registro'}
              </button>
            </form>
          </div>
        </div>

        {/* LISTADO */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter px-2">Registros por Nivel</h2>
          {listaGrados.map((g) => (
            <div key={g.id} className={`bg-white rounded-[2rem] border transition-all ${abierto === g.id ? 'shadow-xl border-red-100' : 'shadow-sm border-gray-100'}`}>
              <button onClick={() => toggleGrado(g.id)} className="w-full p-6 flex justify-between items-center group">
                <div className="flex items-center space-x-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${abierto === g.id ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400 group-hover:bg-red-50'}`}>
                    {g.id}
                  </div>
                  <div className="text-left">
                    <span className="font-black text-gray-700 uppercase block leading-none mb-1">{g.nombre}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      {g.id === '3' ? 'Multietapa' : (g.tieneSecciones ? 'Multisección' : 'Sección Única')}
                    </span>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${abierto === g.id ? 'border-red-600 text-red-600' : 'border-gray-100 text-gray-300'}`}>
                  {abierto === g.id ? '−' : '+'}
                </div>
              </button>

              {abierto === g.id && (
                <div className="px-6 pb-8">
                  <div className="flex space-x-2 mb-6 p-1 bg-gray-100 rounded-xl w-fit">
                    {g.id === '3' ? (
                      ['1', '2', '3'].map(num => (
                        <button key={num} onClick={() => cambiarSeccionVista(num)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${seccionVisualizacion === num ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}>
                          Etapa {num === '1' ? 'I' : num === '2' ? 'II' : 'III'}
                        </button>
                      ))
                    ) : g.tieneSecciones ? (
                      ['1', '2'].map(num => (
                        <button key={num} onClick={() => cambiarSeccionVista(num)} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${seccionVisualizacion === num ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}>
                          Sección {num === '1' ? 'A' : 'B'}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 bg-white rounded-lg shadow-sm text-[10px] font-black text-slate-400 uppercase">Listado Único</div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-white/80 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        <tr><th className="px-8 py-5">ID</th><th className="px-8 py-5">Nombre</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {gradosVisibles[`${g.id}-${seccionVisualizacion}`]?.length > 0 ? (
                          gradosVisibles[`${g.id}-${seccionVisualizacion}`].map((est, i) => (
                            <tr key={i} className="hover:bg-white transition-colors">
                              <td className="px-8 py-5"><span className="bg-white px-3 py-1.5 rounded-lg text-xs text-red-600 font-bold border border-gray-100">{est.codigo}</span></td>
                              <td className="px-8 py-5 font-black text-gray-700 uppercase text-sm">{est.nombre}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={2} className="px-8 py-16 text-center text-[10px] font-black text-gray-300 uppercase italic">Sin alumnos en este nivel</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}