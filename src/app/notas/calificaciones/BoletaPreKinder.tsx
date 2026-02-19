import React from "react";

export const BoletaPreKinder = React.forwardRef(({ alumno, unidadActual = 1 }: any, ref: any) => {
  if (!alumno) return null;

  const numerosRomanos = ["I", "II", "III", "IV"];
  const tituloUnidad = `${numerosRomanos[unidadActual - 1]} UNIDAD`;
  const propNota = `u${unidadActual}`;

  return (
    <div ref={ref} className="relative bg-white w-[210mm] h-[297mm] text-slate-800 font-sans print:m-0 overflow-hidden">
      
      {/* 1. FONDO QUE ME DISTE */}
      <img 
        src="/fondo_boleta_prekinder.jpg" 
        className="absolute inset-0 w-full h-full object-fill z-0" 
        alt="Fondo Pre-Kinder Oficial"
      />

      {/* 2. DATOS DEL ALUMNO (Alineados al cuadro superior derecho) */}
      <div className="absolute top-[215px] left-[455px] z-10 w-[350px]">
        <p className="text-[17px] font-bold text-blue-900 uppercase italic mb-[15px]">
          {alumno.nombre}
        </p>
        <p className="text-[17px] font-bold text-red-600 uppercase italic mb-[12px]">
          PRE-KINDER
        </p>
        <p className="text-[17px] font-bold text-blue-900 uppercase italic">
          IZABEL MARIN
        </p>
      </div>

      {/* 3. TÍTULO DE UNIDAD (En el espacio del avión/nube) */}
      <div className="absolute top-[375px] left-[60px] z-20">
         <h2 className="text-[32px] font-black text-red-600 leading-none drop-shadow-sm">
           {tituloUnidad}
         </h2>
      </div>

      {/* 4. ÁREAS CURRICULARES (Las 7 filas del centro izquierda) */}
      <div className="absolute top-[485px] left-[55px] w-[330px] z-10">
        <table className="w-full border-separate border-spacing-y-[2px]">
          <tbody>
            {alumno.curriculares.slice(0, 7).map((m: any, idx: number) => (
              <tr key={`curr-${idx}`} style={{ height: '48.5px' }}>
                {/* Nombre de la materia en azul */}
                <td className="w-[210px] text-[10.5px] font-bold text-blue-900 italic leading-tight pr-2 align-middle">
                  {m.materia}
                </td>
                {/* Nota en naranja grande */}
                <td className="w-[120px] text-center text-[28px] font-extrabold text-orange-500 italic align-middle pr-8">
                  {m[propNota] || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. ASPECTOS (Las 8 filas de la derecha) */}
      <div className="absolute top-[508px] left-[455px] w-[345px] z-10">
        <table className="w-full border-separate border-spacing-y-[0px]">
          <tbody>
            {alumno.aspectos.slice(0, 8).map((asp: any, idx: number) => (
              <tr key={`asp-${idx}`} style={{ height: '40.2px' }}>
                {/* Descripción del aspecto */}
                <td className="w-[250px] text-[11px] font-bold text-blue-900 italic leading-tight pr-4 align-middle">
                  {asp.materia}
                </td>
                {/* Nota (F, A, NM) */}
                <td className="w-[95px] text-center text-[24px] font-black text-orange-500 italic align-middle pr-6">
                  {asp[propNota] || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        @media print {
          body { -webkit-print-color-adjust: exact; margin: 0; }
          img { max-width: none !important; }
        }
      `}</style>
    </div>
  );
});

BoletaPreKinder.displayName = "BoletaPreKinder";