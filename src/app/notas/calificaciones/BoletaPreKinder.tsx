import React from "react";

export const BoletaPreKinder = React.forwardRef(
  ({ alumno, unidadActual = 3 }: any, ref: any) => {
    if (!alumno) return null;

    const numerosRomanos = ["I", "II", "III", "IV"];
    const tituloUnidad = `${numerosRomanos[unidadActual - 1]} UNIDAD`;
    const propNota = `u${unidadActual}`;

    let subtituloUnidad = "";
    if (unidadActual === 1) subtituloUnidad = "CONSTRUYENDO NUESTRA CONVIVENCIA";
    if (unidadActual === 2) subtituloUnidad = "CONSTRUYENDO NUESTRA CONVIVENCIA";
    if (unidadActual === 3) subtituloUnidad = "CONSTRUYENDO NUESTRA CONVIVENCIA";
    if (unidadActual === 4) subtituloUnidad = "CONSTRUYENDO NUESTRA CONVIVENCIA";

    return (
      <div
        ref={ref}
        className="relative bg-white w-[210mm] h-[297mm] text-slate-800 font-sans print:m-0 overflow-hidden"
      >
        {/* 1. Fondo de la Boleta */}
        <img
          src="/fondo_boleta_prekinder.jpg"
          className="absolute inset-0 w-full h-full object-fill z-0"
          alt="Fondo Institucional Pre-Kinder"
        />

        {/* 2. DATOS DEL ESTUDIANTE */}
        <div className="absolute top-[211px] left-[440px] text-[16px] font-bold text-blue-900 uppercase italic z-10 w-[320px]">
          <p className="mb-[13px]">{alumno.nombre || "Nombre no asignado"}</p>
          <p className="mb-[10px]">PRE-KINDER</p>
          <p>{alumno.maestro || "María Izabel Marín"}</p>
        </div>

       {/* 3. TÍTULO DE LA UNIDAD - TRANSPARENTE CON SALTO DE LÍNEA */}
<div className="absolute top-[375px] left-[55px] w-[230px] text-center z-20">
  <div className="bg-transparent inline-block">
    <h2 className="text-[25px] font-black text-red-600 leading-none mb-1">
      {tituloUnidad}
    </h2>
    
    {/* Contenedor del subtítulo con ancho controlado para forzar el salto */}
    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter leading-[1.1] max-w-[100px] mx-auto">
      {unidadActual === 3 ? (
        <>
          CONSTRUYENDO <br /> NUESTRA CONVIVENCIA
        </>
      ) : (
        subtituloUnidad
      )}
    </p>
  </div>
</div>

        {/* 4. ÁREAS CURRICULARES - AJUSTE DE PRECISIÓN */}
        <div className="absolute top-[500px] left-[60px] w-[300px] z-10">
          <table className="w-full border-collapse">
            <tbody>
              {(alumno.curriculares || []).map((m: any, idx: number) => (
                <tr key={`curr-${idx}`} style={{ height: "72px" }}> 
                  {/* El height de 53px hace que la nota baje al siguiente renglón del fondo */}
                  <td className="w-[400px]"></td>
                  <td className="w-[350px] text-center text-[26px] font-black text-orange-500 italic align-middle pr-8">
                    {m[propNota] || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. TÍTULO DE COMPORTAMIENTO */}
        <div className="absolute top-[465px] left-[450px] w-[320px] z-10 text-center">
          <h3 className="bg-blue-900 text-white text-[14px] font-black uppercase py-2 rounded-t-2xl tracking-wide border-b-4 border-blue-800 leading-none">
            Comportamiento del Estudiante
          </h3>
        </div>

        {/* 6. ASPECTOS DE COMPORTAMIENTO */}
        <div className="absolute top-[515px] left-[450px] w-[320px] z-10">
          <table className="w-full border-collapse">
            <tbody>
              {(alumno.aspectos || []).map((asp: any, idx: number) => (
                <tr key={`asp-${idx}`} style={{ height: "42px" }}>
                  <td className="w-[250px] text-[12px] font-bold text-blue-900 italic leading-tight pr-4 align-middle">
                    {asp.materia}
                  </td>
                  <td className="w-[70px] text-center text-[24px] font-black text-orange-500 italic align-middle pr-4">
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
  }
);

BoletaPreKinder.displayName = "BoletaPreKinder";